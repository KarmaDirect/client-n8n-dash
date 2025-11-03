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
      client_org_id, 
      pack_level = 'start',
      custom_template_ids = [],
      initial_config = {}
    } = await req.json()

    console.log(`[provision-workflow-pack] Starting provisioning for org ${client_org_id}, pack: ${pack_level}`)

    // Normaliser l'URL n8n
    const N8N_API_URL = Deno.env.get('N8N_API_URL')
    const N8N_API_KEY = Deno.env.get('N8N_API_KEY')

    if (!N8N_API_URL || !N8N_API_KEY) {
      throw new Error('N8N_API_URL or N8N_API_KEY not configured')
    }

    const n8nBaseUrl = N8N_API_URL.replace(/\/api\/v1\/?$/, '')
    const n8nHeaders = {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Content-Type': 'application/json'
    }

    // Validate inputs
    if (!client_org_id) {
      throw new Error('client_org_id is required')
    }

    if (!['start', 'pro', 'elite', 'custom'].includes(pack_level)) {
      throw new Error('Invalid pack_level. Must be: start, pro, elite, or custom')
    }

    // 1. Récupérer les templates du pack
    let templates, templatesError;
    
    if (pack_level === 'custom' && custom_template_ids.length > 0) {
      // Mode custom : récupérer les templates spécifiés
      const { data, error } = await supabaseClient
        .from('workflow_templates')
        .select('*')
        .in('id', custom_template_ids)
        .eq('is_active', true)
      templates = data;
      templatesError = error;
    } else {
      // Mode pack standard
      const { data, error } = await supabaseClient
        .from('workflow_templates')
        .select('*')
        .eq('pack_level', pack_level)
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      templates = data;
      templatesError = error;
    }

    if (templatesError) throw templatesError

    console.log(`[provision-workflow-pack] Found ${templates?.length || 0} templates for pack ${pack_level}`)

    if (!templates || templates.length === 0) {
      throw new Error(`No templates found for pack level: ${pack_level}`)
    }

    // 2. Récupérer les infos de l'organisation
    const { data: org, error: orgError } = await supabaseClient
      .from('organizations')
      .select('name')
      .eq('id', client_org_id)
      .single()

    if (orgError) throw orgError

    const clientTag = `client-${client_org_id}`
    const provisionedWorkflows = []
    const errors = []

    // 3. Pour chaque template, dupliquer dans n8n et créer dans la DB
    for (const template of templates) {
      try {
        console.log(`[provision-workflow-pack] Processing template: ${template.name}`)

        // Récupérer le template depuis n8n puis créer une copie
        const getTemplateRes = await fetch(
          `${n8nBaseUrl}/api/v1/workflows/${template.n8n_template_id}`,
          { headers: n8nHeaders }
        )

        if (!getTemplateRes.ok) {
          throw new Error(`Failed to fetch template: ${await getTemplateRes.text()}`)
        }

        const templateWorkflow = await getTemplateRes.json()

        // Créer une copie avec le tag client
        const newWorkflowData = {
          ...templateWorkflow,
          id: undefined,
          name: `[${org.name}] ${template.name}`,
          tags: [
            { name: clientTag },
            { name: `template-${template.id}` },
            { name: `pack-${pack_level}` }
          ],
          active: false
        }

        // Créer le nouveau workflow
        const duplicateResponse = await fetch(
          `${n8nBaseUrl}/api/v1/workflows`,
          {
            method: 'POST',
            headers: n8nHeaders,
            body: JSON.stringify(newWorkflowData)
          }
        )

        if (!duplicateResponse.ok) {
          const errorText = await duplicateResponse.text()
          throw new Error(`N8N duplication failed: ${errorText}`)
        }

        const newWorkflow = await duplicateResponse.json()
        console.log(`[provision-workflow-pack] N8N workflow created: ${newWorkflow.id}`)

        // Préparer le status des credentials
        const credentialsStatus: Record<string, string> = {}
        if (template.required_credentials && Array.isArray(template.required_credentials)) {
          template.required_credentials.forEach((cred: string) => {
            credentialsStatus[cred] = 'pending'
          })
        }

        // Déterminer le status initial
        const hasRequiredCredentials = Object.keys(credentialsStatus).length > 0
        const initialStatus = hasRequiredCredentials ? 'pending_config' : 'active'

        // Insérer dans la base de données
        const { data: workflow, error: insertError } = await supabaseClient
          .from('workflows')
          .insert({
            org_id: client_org_id,
            template_id: template.id,
            n8n_workflow_id: newWorkflow.id,
            name: template.name,
            description: template.description,
            pack_level: pack_level,
            status: initialStatus,
            config_params: { ...template.default_config, ...initial_config },
            credentials_status: credentialsStatus,
            is_active: !hasRequiredCredentials // Actif seulement si pas de credentials requis
          })
          .select()
          .single()

        if (insertError) throw insertError

        console.log(`[provision-workflow-pack] Workflow created in DB: ${workflow.id}`)

        provisionedWorkflows.push({
          workflow_id: workflow.id,
          template_name: template.name,
          n8n_workflow_id: newWorkflow.id,
          status: initialStatus,
          requires_config: hasRequiredCredentials
        })

      } catch (error) {
        console.error(`[provision-workflow-pack] Error processing template ${template.name}:`, error)
        errors.push({
          template_name: template.name,
          error: error.message
        })
      }
    }

    // 4. Retourner le résultat
    const response = {
      success: provisionedWorkflows.length > 0,
      org_id: client_org_id,
      pack_level: pack_level,
      provisioned_count: provisionedWorkflows.length,
      workflows: provisionedWorkflows,
      errors: errors.length > 0 ? errors : undefined,
      message: provisionedWorkflows.length > 0 
        ? `Successfully provisioned ${provisionedWorkflows.length} workflow(s) for ${org.name}`
        : `Failed to provision workflows. ${errors.length} error(s) occurred. Check errors field for details.`
    }

    console.log(`[provision-workflow-pack] Completed: ${provisionedWorkflows.length} workflows provisioned, ${errors.length} errors`)

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('[provision-workflow-pack] Error:', error)
    
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

