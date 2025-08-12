// Deno Edge Function: bootstrap-admin
// Creates or finds an admin user and a default organization, then assigns the admin role.
// Expects JSON body: { email: string, password: string, org_name?: string }

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "*",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password, org_name } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing email or password" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Missing server configuration" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const targetOrgName = org_name || "Webstate (Agence)";

    // 1) Create the user (or find existing)
    let userId: string | null = null;

    const createRes = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createRes.error) {
      // If user already exists, find it via the admin list
      const alreadyExists = /already registered/i.test(createRes.error.message || "");
      if (!alreadyExists) throw createRes.error;

      // Fallback: list users and find by email
      let page = 1;
      let found = null as null | { id: string; email?: string | null };
      while (!found) {
        const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) throw error;
        const users = data?.users || [];
        found = users.find((u) => (u.email || "").toLowerCase() === email.toLowerCase()) || null;
        if (users.length < 1000) break; // last page
        page += 1;
      }
      if (!found) throw new Error("User exists but could not be retrieved.");
      userId = found.id;
    } else {
      userId = createRes.data.user?.id || null;
    }

    if (!userId) throw new Error("Unable to resolve user id.");

    // 2) Ensure admin role
    const roleInsert = await adminClient
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" as any })
      .select()
      .single();

    // Ignore duplicate errors (unique constraint) if any
    if (roleInsert.error && roleInsert.error.code !== "23505") {
      // 23505: unique_violation
      // If it's some other error, throw
      throw roleInsert.error;
    }

    // 3) Ensure organization exists (same owner_id + name)
    const existingOrg = await adminClient
      .from("organizations")
      .select("id")
      .eq("owner_id", userId)
      .eq("name", targetOrgName)
      .maybeSingle();

    let orgId: string | null = existingOrg.data?.id || null;

    if (!orgId) {
      const orgInsert = await adminClient
        .from("organizations")
        .insert({ owner_id: userId, name: targetOrgName })
        .select("id")
        .single();

      if (orgInsert.error) throw orgInsert.error;
      orgId = orgInsert.data.id;
    }

    return new Response(
      JSON.stringify({ ok: true, user_id: userId, org_id: orgId, email, org_name: targetOrgName }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (err) {
    console.error("bootstrap-admin error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
