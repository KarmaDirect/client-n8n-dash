import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "*",
};

const log = (step: string, details?: any) => {
  console.log(`[EXECUTE-WEBHOOK] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ ok: false, error: "Missing Authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_ANON = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    if (!SUPABASE_URL || !SUPABASE_ANON) {
      return new Response(JSON.stringify({ ok: false, error: "Server not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // User-context client with RLS enforced
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userData, error: userErr } = await userClient.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ ok: false, error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    const user = userData.user;

    const body = await req.json().catch(() => ({}));
    const workflowId: string | undefined = body.workflow_id || body.workflowId;
    const payload: Record<string, any> | undefined = body.payload;

    if (!workflowId) {
      return new Response(JSON.stringify({ ok: false, error: "Missing workflow_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 1) Get workflow under RLS (ensures membership)
    const { data: workflow, error: wfErr } = await userClient
      .from("workflows")
      .select("id, org_id, webhook_id, is_active")
      .eq("id", workflowId)
      .single();

    if (wfErr || !workflow) {
      log("workflow fetch error", { wfErr });
      // Hide existence details
      return new Response(JSON.stringify({ ok: false, error: "Access denied or workflow not found" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!workflow.is_active) {
      return new Response(JSON.stringify({ ok: false, error: "Workflow inactive" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!workflow.webhook_id) {
      return new Response(JSON.stringify({ ok: false, error: "Workflow not linked to a webhook" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 2) Get webhook under RLS (same org)
    const { data: webhook, error: whErr } = await userClient
      .from("webhooks")
      .select("id, webhook_url, execution_method")
      .eq("id", workflow.webhook_id)
      .single();

    if (whErr || !webhook) {
      log("webhook fetch error", { whErr });
      return new Response(JSON.stringify({ ok: false, error: "Webhook introuvable" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 3) Check usage limits on server
    const { data: canExecute, error: limitErr } = await userClient.rpc(
      "check_workflow_usage_limit",
      { _workflow_id: workflowId, _user_id: user.id },
    );

    if (limitErr) {
      log("limit rpc error", { limitErr });
      return new Response(JSON.stringify({ ok: false, error: "Erreur de vérification des limites" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!canExecute) {
      return new Response(JSON.stringify({ ok: false, error: "Limite d'utilisation atteinte" }), {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 4) Execute remote webhook
    const method = (webhook.execution_method || "GET").toUpperCase();
    const defaultPayload = {
      source: "webstate_dashboard",
      user_id: user.id,
      org_id: workflow.org_id,
      workflow_id: workflowId,
      timestamp: new Date().toISOString(),
    };

    const requestInit: RequestInit = { method };
    if (["POST", "PUT", "PATCH"].includes(method)) {
      requestInit.headers = { "Content-Type": "application/json" };
      requestInit.body = JSON.stringify(payload ?? defaultPayload);
    }

    log("Calling webhook", { method, url: webhook.webhook_url });
    const resp = await fetch(webhook.webhook_url, requestInit);
    const text = await resp.text();

    let responseData: any = { status: resp.status, data: text };
    try {
      responseData = { status: resp.status, data: JSON.parse(text) };
    } catch { /* keep text */ }

    // 5) Log execution and update timestamp (under RLS)
    const { error: insErr } = await userClient.from("workflow_executions").insert({
      workflow_id: workflowId,
      org_id: workflow.org_id,
      user_id: user.id,
      status: resp.ok ? "success" : "error",
      response_data: responseData,
    });
    if (insErr) log("execution insert error", { insErr });

    const { error: updErr } = await userClient
      .from("workflows")
      .update({ last_executed_at: new Date().toISOString() })
      .eq("id", workflowId);
    if (updErr) log("workflow update error", { updErr });

    const result = { ok: resp.ok, response: responseData };
    return new Response(JSON.stringify(result), {
      status: resp.ok ? 200 : 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    log("UNCAUGHT", { error: String(err) });
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
