import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Vérifier l'API key (depuis header X-API-Key)
    const apiKey = req.headers.get('X-API-Key') || req.headers.get('x-api-key');
    const expectedKeys = [
      Deno.env.get('N8N_METRICS_API_KEY'),
      Deno.env.get('N8N_API_KEY')
    ].filter((value): value is string => Boolean(value));

    if (expectedKeys.length === 0 || !apiKey || !expectedKeys.includes(apiKey)) {
      console.warn(`[receive-n8n-metrics] Invalid API key. Received: ${apiKey?.substring(0, 10)}...`);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Récupérer le payload depuis n8n
    const payload = await req.json();
    console.log(`[receive-n8n-metrics] Received metrics:`, JSON.stringify(payload));

    // Extraire les données
    const {
      orgId,
      workflowKey, // Peut être le nom du workflow ou un identifiant
      status, // "ok" | "error"
      itemsProcessed = 0,
      durationMs = 0,
      errorMessage = null,
      n8nExecutionId,
      ts
    } = payload;

    if (!orgId || !workflowKey || !n8nExecutionId) {
      throw new Error('orgId, workflowKey, and n8nExecutionId are required');
    }

    // Trouver le workflow dans Supabase
    // On cherche par org_id + name (qui contient workflowKey) ou par un identifiant
    const { data: workflows, error: workflowError } = await supabaseClient
      .from('workflows')
      .select('id, name, org_id')
      .eq('org_id', orgId)
      .ilike('name', `%${workflowKey}%`); // Recherche flexible par nom

    if (workflowError) throw workflowError;

    if (!workflows || workflows.length === 0) {
      console.warn(`[receive-n8n-metrics] No workflow found for orgId=${orgId}, workflowKey=${workflowKey}`);
      // Retourner OK quand même pour ne pas bloquer n8n, mais log
      return new Response(
        JSON.stringify({ 
          ok: true, 
          warning: 'Workflow not found in Supabase. Metrics logged but not persisted.',
          received: payload
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Utiliser le premier workflow trouvé (ou tu peux améliorer la logique de matching)
    const workflow = workflows[0];
    const workflowId = workflow.id;

    console.log(`[receive-n8n-metrics] Found workflow: ${workflow.name} (${workflowId})`);

    // Appeler track-workflow-execution avec les données formatées
    const trackPayload = {
      workflow_id: workflowId,
      n8n_execution_id: n8nExecutionId,
      status: status === 'ok' ? 'success' : 'error',
      started_at: ts ? new Date(ts).toISOString() : new Date().toISOString(),
      finished_at: ts ? new Date(ts).toISOString() : new Date().toISOString(),
      duration_seconds: Math.floor(durationMs / 1000),
      input_data: payload, // Garder le payload original
      output_data: { itemsProcessed },
      error_message: errorMessage,
      metrics: {
        itemsProcessed,
        durationMs
      }
    };

    // Appeler l'Edge Function track-workflow-execution
    const { data: trackResult, error: trackError } = await supabaseClient.functions.invoke('track-workflow-execution', {
      body: trackPayload
    });

    if (trackError) {
      console.error(`[receive-n8n-metrics] Failed to track execution:`, trackError);
      throw new Error(`Failed to track execution: ${trackError.message || trackError}`);
    }

    console.log(`[receive-n8n-metrics] Execution tracked: ${trackResult?.execution_log_id}`);

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Metrics received and tracked successfully',
        execution_log_id: trackResult.execution_log_id,
        workflow_id: workflowId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[receive-n8n-metrics] Error:', error);
    return new Response(
      JSON.stringify({ 
        ok: false,
        error: error.message 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});




