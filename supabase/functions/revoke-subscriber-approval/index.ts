import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[REVOKE-APPROVAL] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Use service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    // Verify the requesting user is an admin
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if user is admin
    const { data: isAdmin, error: roleError } = await supabaseClient
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });
    
    if (roleError || !isAdmin) {
      throw new Error("Only admins can revoke subscriber approval");
    }

    logStep("Admin verification passed");

    const { email, approval_notes } = await req.json();
    if (!email) throw new Error("Email is required");

    logStep("Revoking subscriber approval", { email, approval_notes });

    // Update the subscriber to remove manual approval
    const { data, error } = await supabaseClient
      .from('subscribers')
      .update({
        manually_approved: false,
        approved_by: null,
        approved_at: null,
        approval_notes: approval_notes || `Approval revoked by admin ${user.email}`
      })
      .eq('email', email)
      .select()
      .single();

    if (error) throw new Error(`Database error: ${error.message}`);
    if (!data) throw new Error("Subscriber not found");

    logStep("Subscriber approval revoked successfully", { email });

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Manual approval for ${email} has been revoked`,
      data 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in revoke-subscriber-approval", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});