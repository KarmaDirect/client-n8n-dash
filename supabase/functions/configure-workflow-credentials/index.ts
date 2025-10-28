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
      credentials = {},
      config_params = {},
      auto_activate = true
    } = await req.json()

    console.log(`[configure-workflow-credentials] Configuring workflow ${workflow_id}`)

    // Validate inputs
    if (!workflow_id) {
      throw new Error('workflow_id is required')
    }

    // 1. Récupérer le workflow et son template
    const { data: workflow, error: workflowError } = await supabaseClient
      .from('workflows')
      .select('*, workflow_templates(*)')
      .eq('id', workflow_id)
      .single()

    if (workflowError) throw workflowError
    if (!workflow) throw new Error('Workflow not found')

    console.log(`[configure-workflow-credentials] Found workflow: ${workflow.name}`)

    // 2. Récupérer le workflow dans n8n
    const n8nResponse = await fetch(
      `${Deno.env.get('N8N_API_URL')}/workflows/${workflow.n8n_workflow_id}`,
      {
        headers: {
          'X-N8N-API-KEY': Deno.env.get('N8N_API_KEY') ?? '',
        }
      }
    )

    if (!n8nResponse.ok) {
      throw new Error(`Failed to fetch workflow from n8n: ${await n8nResponse.text()}`)
    }

    const n8nWorkflow = await n8nResponse.json()
    console.log(`[configure-workflow-credentials] Fetched n8n workflow with ${n8nWorkflow.nodes?.length || 0} nodes`)

    // 3. Injecter les credentials et config dans les nodes n8n
    let updatedNodes = n8nWorkflow.nodes || []
    const credentialsUpdated: Record<string, boolean> = {}

    // Pour chaque credential fourni
    for (const [credType, credValue] of Object.entries(credentials)) {
      console.log(`[configure-workflow-credentials] Injecting credential: ${credType}`)

      // Trouver les nodes qui utilisent ce credential
      updatedNodes = updatedNodes.map((node: any) => {
        // Vérifier si le node utilise ce type de credential
        if (node.credentials && node.credentials[credType]) {
          // Créer/mettre à jour le credential dans n8n (simplifié - en production, utiliser l'API credentials)
          node.credentials[credType] = {
            id: `${credType}-${workflow.org_id}`, // ID unique par org
            name: `${credType}-${workflow.org_id}`
          }
          credentialsUpdated[credType] = true
        }

        // Injecter les paramètres configurables dans le node
        if (config_params && Object.keys(config_params).length > 0) {
          if (node.parameters) {
            // Remplacer les variables dans les paramètres
            node.parameters = JSON.parse(
              JSON.stringify(node.parameters).replace(
                /\{\{(\w+)\}\}/g,
                (match, key) => config_params[key] || match
              )
            )
          }
        }

        return node
      })
    }

    // 4. Mettre à jour le workflow dans n8n
    const updateResponse = await fetch(
      `${Deno.env.get('N8N_API_URL')}/workflows/${workflow.n8n_workflow_id}`,
      {
        method: 'PATCH',
        headers: {
          'X-N8N-API-KEY': Deno.env.get('N8N_API_KEY') ?? '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nodes: updatedNodes,
          settings: n8nWorkflow.settings
        })
      }
    )

    if (!updateResponse.ok) {
      throw new Error(`Failed to update n8n workflow: ${await updateResponse.text()}`)
    }

    console.log(`[configure-workflow-credentials] N8N workflow updated`)

    // 5. Calculer le nouveau status des credentials
    const requiredCredentials = workflow.workflow_templates?.required_credentials || []
    const newCredentialsStatus: Record<string, string> = { ...workflow.credentials_status }

    for (const credType of requiredCredentials) {
      if (credentials[credType]) {
        newCredentialsStatus[credType] = 'configured'
      }
    }

    // Vérifier si tous les credentials sont configurés
    const allConfigured = requiredCredentials.every(
      (cred: string) => newCredentialsStatus[cred] === 'configured'
    )

    const newStatus = allConfigured ? 'active' : 'pending_config'
    const shouldActivate = allConfigured && auto_activate

    // 6. Activer le workflow dans n8n si demandé
    if (shouldActivate) {
      console.log(`[configure-workflow-credentials] Activating workflow in n8n`)

      const activateResponse = await fetch(
        `${Deno.env.get('N8N_API_URL')}/workflows/${workflow.n8n_workflow_id}`,
        {
          method: 'PATCH',
          headers: {
            'X-N8N-API-KEY': Deno.env.get('N8N_API_KEY') ?? '',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            active: true
          })
        }
      )

      if (!activateResponse.ok) {
        console.error(`[configure-workflow-credentials] Failed to activate workflow: ${await activateResponse.text()}`)
      }
    }

    // 7. Mettre à jour dans la base de données
    const { data: updatedWorkflow, error: updateError } = await supabaseClient
      .from('workflows')
      .update({
        config_params: { ...workflow.config_params, ...config_params },
        credentials_status: newCredentialsStatus,
        status: newStatus,
        is_active: shouldActivate,
        updated_at: new Date().toISOString()
      })
      .eq('id', workflow_id)
      .select()
      .single()

    if (updateError) throw updateError

    console.log(`[configure-workflow-credentials] Database updated, new status: ${newStatus}`)

    // 8. Retourner le résultat
    return new Response(
      JSON.stringify({
        success: true,
        workflow_id: workflow_id,
        status: newStatus,
        is_active: shouldActivate,
        credentials_configured: Object.keys(credentialsUpdated),
        all_credentials_ready: allConfigured,
        workflow: updatedWorkflow,
        message: allConfigured 
          ? 'Workflow fully configured and ready' 
          : 'Workflow partially configured, some credentials still pending'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('[configure-workflow-credentials] Error:', error)
    
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

