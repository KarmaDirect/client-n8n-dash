import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get request body
    const { 
      workflow_id,
      n8n_execution_id,
      status, // 'success', 'failed', 'running'
      started_at,
      finished_at,
      duration_seconds,
      input_data = {},
      output_data = {},
      error_message = null,
      metrics = {} // { sms_sent: 5, leads_generated: 2, tokens_used: 1500, etc. }
    } = await req.json()

    console.log(`[track-workflow-execution] Tracking execution for workflow ${workflow_id}`)

    // Validate inputs
    if (!workflow_id || !n8n_execution_id || !status) {
      throw new Error('workflow_id, n8n_execution_id, and status are required')
    }

    // 1. Récupérer le workflow et son template
    const { data: workflow, error: workflowError } = await supabaseClient
      .from('workflows')
      .select('*, workflow_templates(*)')
      .eq('id', workflow_id)
      .single()

    if (workflowError) throw workflowError
    if (!workflow) throw new Error('Workflow not found')

    console.log(`[track-workflow-execution] Found workflow: ${workflow.name}`)

    // 2. Créer le log d'exécution détaillé
    const { data: executionLog, error: logError } = await supabaseClient
      .from('workflow_execution_logs')
      .insert({
        workflow_id: workflow_id,
        n8n_execution_id: n8n_execution_id,
        status: status,
        started_at: started_at || new Date().toISOString(),
        finished_at: finished_at,
        duration_seconds: duration_seconds,
        input_data: input_data,
        output_data: output_data,
        error_message: error_message,
        metrics: metrics
      })
      .select()
      .single()

    if (logError) throw logError

    console.log(`[track-workflow-execution] Execution log created: ${executionLog.id}`)

    // 3. Mettre à jour le compteur d'exécutions du workflow
    const { error: workflowUpdateError } = await supabaseClient
      .from('workflows')
      .update({
        last_execution_at: finished_at || new Date().toISOString(),
        total_executions: workflow.total_executions + 1
      })
      .eq('id', workflow_id)

    if (workflowUpdateError) throw workflowUpdateError

    // 4. Si l'exécution est terminée (success ou failed), mettre à jour les métriques agrégées
    if (status === 'success' || status === 'failed') {
      console.log(`[track-workflow-execution] Updating daily metrics`)

      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

      // Récupérer ou créer l'entrée de métriques du jour
      const { data: existingMetric } = await supabaseClient
        .from('workflow_metrics')
        .select('*')
        .eq('workflow_id', workflow_id)
        .eq('date', today)
        .single()

      // Calculer les nouvelles métriques
      const template = workflow.workflow_templates
      const estimatedCost = template?.estimated_cost_per_exec || 0
      const estimatedTimeSaved = template?.estimated_time_saved_minutes || 0

      // Extraire les métriques custom du template
      const customMetrics: Record<string, number> = {}
      if (template?.metrics_tracked && Array.isArray(template.metrics_tracked)) {
        template.metrics_tracked.forEach((metricKey: string) => {
          if (metrics[metricKey] !== undefined) {
            customMetrics[metricKey] = (existingMetric?.custom_metrics?.[metricKey] || 0) + metrics[metricKey]
          }
        })
      }

      if (existingMetric) {
        // Mettre à jour les métriques existantes
        const { error: metricsError } = await supabaseClient
          .from('workflow_metrics')
          .update({
            executions_count: existingMetric.executions_count + 1,
            success_count: status === 'success' ? existingMetric.success_count + 1 : existingMetric.success_count,
            failed_count: status === 'failed' ? existingMetric.failed_count + 1 : existingMetric.failed_count,
            tokens_used: existingMetric.tokens_used + (metrics.tokens_used || 0),
            api_calls_made: existingMetric.api_calls_made + (metrics.api_calls_made || 1),
            cost_incurred: existingMetric.cost_incurred + estimatedCost,
            time_saved_minutes: status === 'success' ? existingMetric.time_saved_minutes + estimatedTimeSaved : existingMetric.time_saved_minutes,
            money_saved: status === 'success' ? existingMetric.money_saved + (metrics.money_saved || 0) : existingMetric.money_saved,
            custom_metrics: customMetrics
          })
          .eq('id', existingMetric.id)

        if (metricsError) throw metricsError

      } else {
        // Créer une nouvelle entrée de métriques
        const { error: metricsError } = await supabaseClient
          .from('workflow_metrics')
          .insert({
            workflow_id: workflow_id,
            org_id: workflow.org_id,
            date: today,
            executions_count: 1,
            success_count: status === 'success' ? 1 : 0,
            failed_count: status === 'failed' ? 1 : 0,
            tokens_used: metrics.tokens_used || 0,
            api_calls_made: metrics.api_calls_made || 1,
            cost_incurred: estimatedCost,
            time_saved_minutes: status === 'success' ? estimatedTimeSaved : 0,
            money_saved: status === 'success' ? (metrics.money_saved || 0) : 0,
            custom_metrics: customMetrics
          })

        if (metricsError) throw metricsError
      }

      console.log(`[track-workflow-execution] Daily metrics updated`)
    }

    // 5. Retourner le résultat
    return new Response(
      JSON.stringify({
        success: true,
        execution_log_id: executionLog.id,
        workflow_id: workflow_id,
        status: status,
        message: 'Execution tracked successfully'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('[track-workflow-execution] Error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})

