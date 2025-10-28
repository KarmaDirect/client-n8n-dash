import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface N8NWorkflow {
  id: string;
  name: string;
  tags?: Array<{ id?: string; name: string }>;
  active: boolean;
  nodes: any[];
  connections: any;
  settings: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { 
      action, // 'provision' | 'configure' | 'activate' | 'deactivate' | 'delete'
      organization_id,
      client_org_id, // Support legacy
      template_ids = [],
      workflow_id, // Pour configure/activate/deactivate/delete
      credentials = {},
      config_params = {},
      variables = {} // NEW: Variables à injecter dans les workflows
    } = await req.json()

    const orgId = organization_id || client_org_id
    console.log(`[manage-client-workflows] Action: ${action}, Org: ${orgId}`)

    const N8N_API_URL = Deno.env.get('N8N_API_URL')
    const N8N_API_KEY = Deno.env.get('N8N_API_KEY')

    if (!N8N_API_URL || !N8N_API_KEY) {
      throw new Error('N8N_API_URL or N8N_API_KEY not configured')
    }

    const n8nHeaders = {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Content-Type': 'application/json'
    }

    // 1. Récupérer les infos de l'organisation
    const { data: org, error: orgError } = await supabaseClient
      .from('organizations')
      .select('name')
      .eq('id', orgId)
      .single()

    if (orgError || !org) throw new Error(`Organization not found: ${orgId}`)

    const clientFolderTag = `client-${org.name.replace(/[^a-zA-Z0-9]/g, '-')}`

    // ========================================
    // ACTION: PROVISION
    // ========================================
    if (action === 'provision') {
      if (template_ids.length === 0) {
        throw new Error('No templates selected')
      }

      // Récupérer les templates depuis Supabase
      const { data: templates, error: templatesError } = await supabaseClient
        .from('workflow_templates')
        .select('*')
        .in('id', template_ids)
        .eq('is_active', true)

      if (templatesError || !templates || templates.length === 0) {
        throw new Error('Templates not found')
      }

      const provisionedWorkflows = []
      const errors = []

      for (const template of templates) {
        try {
          console.log(`[manage-client-workflows] Processing: ${template.name}`)

          // Dupliquer le workflow depuis n8n
          const duplicateRes = await fetch(
            `${N8N_API_URL}/api/v1/workflows/${template.n8n_template_id}`,
            { headers: n8nHeaders }
          )

          if (!duplicateRes.ok) {
            throw new Error(`Failed to fetch template: ${await duplicateRes.text()}`)
          }

          const templateWorkflow: N8NWorkflow = await duplicateRes.json()

          // Injecter les variables dans les nodes Code
          const updatedNodes = templateWorkflow.nodes.map(node => {
            if (node.type === 'n8n-nodes-base.code' && node.parameters?.jsCode) {
              let jsCode = node.parameters.jsCode
              
              // Injecter toutes les variables fournies
              Object.keys(variables).forEach(varName => {
                const placeholder = `{{$json.env.${varName}}}`
                jsCode = jsCode.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), variables[varName])
              })
              
              return {
                ...node,
                parameters: {
                  ...node.parameters,
                  jsCode
                }
              }
            }
            
            // Injecter dans les HTTP Request nodes
            if (node.type === 'n8n-nodes-base.httpRequest' && node.parameters) {
              const params = { ...node.parameters }
              
              // URL
              if (params.url) {
                Object.keys(variables).forEach(varName => {
                  const placeholder = `={{$json.env.${varName}}}`
                  if (typeof params.url === 'string') {
                    params.url = params.url.replace(placeholder, variables[varName])
                  }
                })
              }
              
              // Headers
              if (params.headerParameters?.parameters) {
                params.headerParameters.parameters = params.headerParameters.parameters.map((header: any) => {
                  if (header.value) {
                    let value = header.value
                    Object.keys(variables).forEach(varName => {
                      const placeholder = `={{$json.env.${varName}}}`
                      value = value.replace(placeholder, variables[varName])
                    })
                    return { ...header, value }
                  }
                  return header
                })
              }
              
              return {
                ...node,
                parameters: params
              }
            }
            
            return node
          })

          // Créer une copie avec le tag client
          const newWorkflow = {
            ...templateWorkflow,
            id: undefined, // Supprimer l'ID pour forcer la création
            name: `[${org.name}] ${template.name}`,
            nodes: updatedNodes, // Utiliser les nodes mis à jour
            tags: [
              { name: clientFolderTag },
              { name: `template-${template.id}` },
              { name: `pack-${template.pack_level}` }
            ],
            active: false
          }

          // Créer le nouveau workflow
          const createRes = await fetch(
            `${N8N_API_URL}/api/v1/workflows`,
            {
              method: 'POST',
              headers: n8nHeaders,
              body: JSON.stringify(newWorkflow)
            }
          )

          if (!createRes.ok) {
            throw new Error(`Failed to create workflow: ${await createRes.text()}`)
          }

          const createdWorkflow = await createRes.json()
          console.log(`[manage-client-workflows] Created n8n workflow: ${createdWorkflow.id}`)

          // Préparer le status des credentials
          const credentialsStatus: Record<string, string> = {}
          if (template.required_credentials && Array.isArray(template.required_credentials)) {
            template.required_credentials.forEach((cred: string) => {
              credentialsStatus[cred] = 'pending'
            })
          }

          const hasRequiredCredentials = Object.keys(credentialsStatus).length > 0
          const initialStatus = hasRequiredCredentials ? 'pending_config' : 'active'

          // Si toutes les variables sont fournies, activer automatiquement
          const allVariablesProvided = template.required_variables?.every((v: string) => 
            variables[v] && variables[v].trim() !== ''
          ) ?? true
          
          const shouldActivate = allVariablesProvided && !hasRequiredCredentials

          // Activer dans n8n si prêt
          if (shouldActivate) {
            await fetch(
              `${N8N_API_URL}/api/v1/workflows/${createdWorkflow.id}`,
              {
                method: 'PATCH',
                headers: n8nHeaders,
                body: JSON.stringify({ active: true })
              }
            )
          }

          // Insérer dans Supabase
          const { data: workflow, error: insertError } = await supabaseClient
            .from('workflows')
            .insert({
              organization_id: orgId,
              template_id: template.id,
              n8n_workflow_id: createdWorkflow.id,
              name: template.name,
              description: template.description,
              pack_level: template.pack_level,
              status: shouldActivate ? 'active' : 'pending_config',
              config_params: template.default_config || {},
              credentials_status: credentialsStatus,
              is_active: shouldActivate
            })
            .select()
            .single()

          if (insertError) throw insertError

          provisionedWorkflows.push({
            workflow_id: workflow.id,
            template_name: template.name,
            n8n_workflow_id: createdWorkflow.id,
            status: initialStatus
          })

        } catch (error) {
          console.error(`[manage-client-workflows] Error: ${template.name}`, error)
          errors.push({
            template_name: template.name,
            error: error.message
          })
        }
      }

      const activatedCount = provisionedWorkflows.filter(w => w.status === 'active').length

      return new Response(
        JSON.stringify({
          success: provisionedWorkflows.length > 0,
          copied: provisionedWorkflows.length,
          enabled: activatedCount,
          workflows: provisionedWorkflows,
          errors: errors.length > 0 ? errors : undefined,
          message: provisionedWorkflows.length > 0
            ? `${provisionedWorkflows.length} workflow(s) copiés, ${activatedCount} activés`
            : `Échec: ${errors.length} erreur(s)`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ========================================
    // ACTION: CONFIGURE
    // ========================================
    if (action === 'configure') {
      if (!workflow_id) throw new Error('workflow_id required')

      // Récupérer le workflow depuis Supabase
      const { data: workflow, error: workflowError } = await supabaseClient
        .from('workflows')
        .select('*')
        .eq('id', workflow_id)
        .single()

      if (workflowError || !workflow) throw new Error('Workflow not found')

      // Récupérer le workflow depuis n8n
      const getRes = await fetch(
        `${N8N_API_URL}/api/v1/workflows/${workflow.n8n_workflow_id}`,
        { headers: n8nHeaders }
      )

      if (!getRes.ok) throw new Error('N8N workflow not found')

      const n8nWorkflow: N8NWorkflow = await getRes.json()

      // Injecter les credentials et paramètres dans les nodes
      const updatedNodes = n8nWorkflow.nodes.map(node => {
        // Injecter les credentials
        if (node.credentials && credentials) {
          Object.keys(credentials).forEach(credKey => {
            if (node.credentials[credKey]) {
              node.parameters = {
                ...node.parameters,
                ...credentials[credKey]
              }
            }
          })
        }

        // Injecter les config_params
        if (config_params) {
          node.parameters = {
            ...node.parameters,
            ...config_params
          }
        }

        return node
      })

      // Mettre à jour le workflow dans n8n
      const updateRes = await fetch(
        `${N8N_API_URL}/api/v1/workflows/${workflow.n8n_workflow_id}`,
        {
          method: 'PUT',
          headers: n8nHeaders,
          body: JSON.stringify({
            ...n8nWorkflow,
            nodes: updatedNodes,
            active: true
          })
        }
      )

      if (!updateRes.ok) throw new Error('Failed to update n8n workflow')

      // Mettre à jour dans Supabase
      const { error: updateError } = await supabaseClient
        .from('workflows')
        .update({
          status: 'active',
          config_params: config_params,
          credentials_status: Object.keys(credentials).reduce((acc, key) => {
            acc[key] = 'configured'
            return acc
          }, {} as Record<string, string>),
          is_active: true
        })
        .eq('id', workflow_id)

      if (updateError) throw updateError

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Workflow configuré et activé'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ========================================
    // ACTION: ACTIVATE / DEACTIVATE
    // ========================================
    if (action === 'activate' || action === 'deactivate') {
      if (!workflow_id) throw new Error('workflow_id required')

      const { data: workflow } = await supabaseClient
        .from('workflows')
        .select('n8n_workflow_id')
        .eq('id', workflow_id)
        .single()

      if (!workflow) throw new Error('Workflow not found')

      // Mettre à jour dans n8n
      const updateRes = await fetch(
        `${N8N_API_URL}/api/v1/workflows/${workflow.n8n_workflow_id}`,
        {
          method: 'PATCH',
          headers: n8nHeaders,
          body: JSON.stringify({ active: action === 'activate' })
        }
      )

      if (!updateRes.ok) throw new Error('Failed to update n8n workflow')

      // Mettre à jour dans Supabase
      await supabaseClient
        .from('workflows')
        .update({ is_active: action === 'activate' })
        .eq('id', workflow_id)

      return new Response(
        JSON.stringify({
          success: true,
          message: `Workflow ${action === 'activate' ? 'activé' : 'désactivé'}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ========================================
    // ACTION: DELETE
    // ========================================
    if (action === 'delete') {
      if (!workflow_id) throw new Error('workflow_id required')

      const { data: workflow } = await supabaseClient
        .from('workflows')
        .select('n8n_workflow_id')
        .eq('id', workflow_id)
        .single()

      if (workflow?.n8n_workflow_id) {
        // Supprimer de n8n
        await fetch(
          `${N8N_API_URL}/api/v1/workflows/${workflow.n8n_workflow_id}`,
          { method: 'DELETE', headers: n8nHeaders }
        )
      }

      // Supprimer de Supabase
      await supabaseClient
        .from('workflows')
        .delete()
        .eq('id', workflow_id)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Workflow supprimé'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error(`Unknown action: ${action}`)

  } catch (error) {
    console.error('[manage-client-workflows] Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

