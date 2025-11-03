import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

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

    const { 
      action, // 'provision' | 'configure' | 'activate' | 'deactivate' | 'delete' | 'trigger'
      organization_id,
      client_org_id, // Support legacy
      template_ids = [],
      workflow_id, // Pour configure/activate/deactivate/delete/trigger
      credentials = {},
      config_params = {},
      variables = {} // Variables à injecter dans les workflows
    } = await req.json();

    const orgId = organization_id || client_org_id;
    console.log(`[manage-client-workflows] Action: ${action}, Org: ${orgId}`);

    const N8N_API_URL = Deno.env.get('N8N_API_URL');
    const N8N_API_KEY = Deno.env.get('N8N_API_KEY');

    if (!N8N_API_URL || !N8N_API_KEY) {
      throw new Error('N8N_API_URL or N8N_API_KEY not configured');
    }

    // Normaliser l'URL : enlever /api/v1 si présent et les slashes en fin
    let n8nBaseUrl = N8N_API_URL.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
    console.log(`[manage-client-workflows] n8n Base URL: ${n8nBaseUrl}`);
    console.log(`[manage-client-workflows] n8n API Key configured: ${N8N_API_KEY ? 'Yes' : 'No'}`);

    const n8nHeaders = {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Log pour debug (sans exposer la clé complète)
    console.log(`[manage-client-workflows] API Key prefix: ${N8N_API_KEY?.substring(0, 20)}...`);
    console.log(`[manage-client-workflows] Full API URL will be: ${n8nBaseUrl}/api/v1/...`);

    // ========================================
    // ACTION: PROVISION
    // ========================================
    if (action === 'provision') {
      if (!orgId) throw new Error('organization_id or client_org_id required');
      if (template_ids.length === 0) {
        throw new Error('No templates selected');
      }

      // Récupérer les infos de l'organisation
      const { data: org, error: orgError } = await supabaseClient
        .from('organizations')
        .select('name')
        .eq('id', orgId)
        .single();

      if (orgError || !org) throw new Error(`Organization not found: ${orgId}`);

      const clientFolderTag = `client-${org.name.replace(/[^a-zA-Z0-9]/g, '-')}`;

      // Récupérer les templates depuis Supabase
      console.log(`[provision] Looking for templates:`, template_ids);
      const { data: templates, error: templatesError } = await supabaseClient
        .from('workflow_templates')
        .select('*')
        .in('id', template_ids)
        .eq('is_active', true);

      console.log(`[provision] Found ${templates?.length || 0} templates`, templates?.map(t => ({ id: t.id, name: t.name, n8n_id: t.n8n_template_id })));

      if (templatesError) {
        console.error('[provision] Templates query error:', templatesError);
        throw new Error(`Templates query error: ${templatesError.message}`);
      }

      if (!templates || templates.length === 0) {
        console.error('[provision] No templates found for IDs:', template_ids);
        throw new Error(`Aucun template actif trouvé pour les IDs: ${template_ids.join(', ')}`);
      }

      const provisionedWorkflows = [];
      const errors = [];

      for (const template of templates) {
        try {
          console.log(`[manage-client-workflows] Processing: ${template.name}`);

          // Dupliquer le workflow depuis n8n
          console.log(`[provision] Fetching n8n workflow: ${template.n8n_template_id}`);
          console.log(`[provision] n8n URL: ${n8nBaseUrl}/api/v1/workflows/${template.n8n_template_id}`);
          
          // Construire l'URL complète
          const workflowUrl = `${n8nBaseUrl}/api/v1/workflows/${template.n8n_template_id}`;
          console.log(`[provision] Making request to: ${workflowUrl}`);
          console.log(`[provision] Headers: X-N8N-API-KEY present: ${!!n8nHeaders['X-N8N-API-KEY']}`);
          
          const duplicateRes = await fetch(
            workflowUrl,
            { 
              headers: n8nHeaders,
              method: 'GET'
            }
          );
          
          // Log les headers de réponse pour debug
          console.log(`[provision] Response headers:`, {
            'content-type': duplicateRes.headers.get('content-type'),
            'status': duplicateRes.status,
            'status-text': duplicateRes.statusText
          });

          // Vérifier le Content-Type
          const contentType = duplicateRes.headers.get('content-type') || '';
          console.log(`[provision] Response Content-Type: ${contentType}, Status: ${duplicateRes.status}`);

          if (!duplicateRes.ok) {
            const errorText = await duplicateRes.text();
            console.error(`[provision] Failed to fetch n8n workflow ${template.n8n_template_id}:`, errorText.substring(0, 500));
            throw new Error(`Impossible de récupérer le workflow n8n ${template.n8n_template_id}: Status ${duplicateRes.status} - ${errorText.substring(0, 200)}`);
          }

          // Vérifier que la réponse est bien du JSON
          if (!contentType.includes('application/json')) {
            const errorText = await duplicateRes.text();
            console.error(`[provision] Response is not JSON! Content-Type: ${contentType}`);
            console.error(`[provision] Response body (first 500 chars):`, errorText.substring(0, 500));
            throw new Error(`L'API n8n a retourné du ${contentType} au lieu de JSON. Vérifiez N8N_API_URL et N8N_API_KEY. Réponse: ${errorText.substring(0, 200)}`);
          }

          const templateWorkflow: N8NWorkflow = await duplicateRes.json();
          console.log(`[provision] Successfully fetched workflow from n8n: ${templateWorkflow.name} (${templateWorkflow.id})`);

          // Injecter les variables dans les nodes Code
          const updatedNodes = templateWorkflow.nodes.map(node => {
            if (node.type === 'n8n-nodes-base.code' && node.parameters?.jsCode) {
              let jsCode = node.parameters.jsCode;
              
              // Injecter toutes les variables fournies
              Object.keys(variables).forEach(varName => {
                const placeholder = `{{$json.env.${varName}}}`;
                jsCode = jsCode.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), variables[varName]);
              });
              
              return {
                ...node,
                parameters: {
                  ...node.parameters,
                  jsCode
                }
              };
            }
            
            // Injecter dans les HTTP Request nodes
            if (node.type === 'n8n-nodes-base.httpRequest' && node.parameters) {
              const params = { ...node.parameters };
              
              // URL
              if (params.url) {
                Object.keys(variables).forEach(varName => {
                  const placeholder = `={{$json.env.${varName}}}`;
                  if (typeof params.url === 'string') {
                    params.url = params.url.replace(placeholder, variables[varName]);
                  }
                });
              }
              
              // Headers
              if (params.headerParameters?.parameters) {
                params.headerParameters.parameters = params.headerParameters.parameters.map((header: any) => {
                  if (header.value) {
                    let value = header.value;
                    Object.keys(variables).forEach(varName => {
                      const placeholder = `={{$json.env.${varName}}}`;
                      value = value.replace(placeholder, variables[varName]);
                    });
                    return { ...header, value };
                  }
                  return header;
                });
              }
              
              return {
                ...node,
                parameters: params
              };
            }
            
            return node;
          });

          // Créer une copie avec le tag client
          // N8N API n'accepte que certaines propriétés lors de la création
          // Ne pas inclure : id, createdAt, updatedAt, versionId, triggerCount, shared, active (read-only), tags (read-only)
          const tagsToAdd = [
            { name: clientFolderTag },
            { name: `template-${template.id}` },
            { name: `pack-${template.pack_level}` }
          ];
          
          const newWorkflow = {
            name: `[${org.name}] ${template.name}`,
            nodes: updatedNodes,
            connections: templateWorkflow.connections,
            settings: templateWorkflow.settings || {},
            staticData: templateWorkflow.staticData || null
          };
          
          console.log(`[provision] Workflow to create (structure only):`, {
            name: newWorkflow.name,
            nodesCount: newWorkflow.nodes.length,
            tagsToAdd: tagsToAdd.map(t => t.name)
          });

          // Créer le nouveau workflow
          console.log(`[provision] Creating workflow in n8n: ${newWorkflow.name}`);
          const createRes = await fetch(
            `${n8nBaseUrl}/api/v1/workflows`,
            {
              method: 'POST',
              headers: n8nHeaders,
              body: JSON.stringify(newWorkflow)
            }
          );

          const createContentType = createRes.headers.get('content-type') || '';
          console.log(`[provision] Create response Content-Type: ${createContentType}, Status: ${createRes.status}`);

          if (!createRes.ok) {
            const errorText = await createRes.text();
            console.error(`[provision] Failed to create workflow:`, errorText.substring(0, 500));
            throw new Error(`Échec de création du workflow dans n8n: Status ${createRes.status} - ${errorText.substring(0, 200)}`);
          }

          // Vérifier que la réponse est bien du JSON
          if (!createContentType.includes('application/json')) {
            const errorText = await createRes.text();
            console.error(`[provision] Create response is not JSON! Content-Type: ${createContentType}`);
            console.error(`[provision] Response body (first 500 chars):`, errorText.substring(0, 500));
            throw new Error(`L'API n8n a retourné du ${createContentType} au lieu de JSON lors de la création. Vérifiez N8N_API_URL et N8N_API_KEY.`);
          }

          const createdWorkflow = await createRes.json();
          console.log(`[manage-client-workflows] Created n8n workflow: ${createdWorkflow.id}`);

          if (!createdWorkflow.id) {
            throw new Error(`Le workflow n8n a été créé mais sans ID. Réponse: ${JSON.stringify(createdWorkflow)}`);
          }

          // Ajouter les tags après la création (tags est read-only lors de la création)
          // L'API n8n nécessite des tagIds, pas des noms. On doit obtenir/créer les tags d'abord.
          try {
            const tagIds: string[] = [];
            
            for (const tagToAdd of tagsToAdd) {
              // Récupérer tous les tags pour vérifier s'ils existent
              const getTagsUrl = `${n8nBaseUrl}/api/v1/tags`.replace(/\/+\//g, '/');
              const getTagsRes = await fetch(getTagsUrl, { headers: n8nHeaders });
              
              if (getTagsRes.ok) {
                const allTags = await getTagsRes.json();
                const existingTag = allTags.data?.find((t: any) => t.name === tagToAdd.name);
                
                if (existingTag) {
                  tagIds.push(existingTag.id);
                } else {
                  // Créer le tag s'il n'existe pas
                  const createTagUrl = `${n8nBaseUrl}/api/v1/tags`.replace(/\/+\//g, '/');
                  const createTagRes = await fetch(
                    createTagUrl,
                    {
                      method: 'POST',
                      headers: n8nHeaders,
                      body: JSON.stringify({ name: tagToAdd.name })
                    }
                  );
                  if (createTagRes.ok) {
                    const newTag = await createTagRes.json();
                    tagIds.push(newTag.id || newTag.data?.id);
                  }
                }
              }
            }
            
            // Ajouter les tags au workflow si on a des IDs
            if (tagIds.length > 0) {
              const tagsUrl = `${n8nBaseUrl}/api/v1/workflows/${createdWorkflow.id}/tags`.replace(/\/+\//g, '/');
              console.log(`[provision] Adding ${tagIds.length} tags to workflow: ${tagsUrl}`);
              const tagsRes = await fetch(
                tagsUrl,
                {
                  method: 'PUT',
                  headers: n8nHeaders,
                  body: JSON.stringify({ tagIds })
                }
              );
              if (!tagsRes.ok) {
                const errorText = await tagsRes.text();
                console.warn(`[provision] Failed to add tags to workflow (non-critical):`, errorText.substring(0, 200));
              } else {
                console.log(`[provision] Tags added successfully`);
              }
            }
          } catch (tagError: any) {
            console.warn(`[provision] Error adding tags (non-critical):`, tagError.message);
          }

          // Préparer le status des credentials
          const credentialsStatus: Record<string, string> = {};
          if (template.required_credentials && Array.isArray(template.required_credentials)) {
            template.required_credentials.forEach((cred: string) => {
              credentialsStatus[cred] = 'pending';
            });
          }

          const hasRequiredCredentials = Object.keys(credentialsStatus).length > 0;

          // Vérifier si des variables sont passées et si elles sont toutes renseignées
          const variablesKeys = Object.keys(variables || {});
          const allVariablesProvided = variablesKeys.length === 0 || 
            variablesKeys.every((v: string) => variables[v] && variables[v].trim() !== '');
          
          // Activer si : pas de credentials requis ET toutes les variables fournies (ou aucune variable)
          const shouldActivate = allVariablesProvided && !hasRequiredCredentials;

          // Activer dans n8n si prêt
          if (shouldActivate) {
            await fetch(
              `${n8nBaseUrl}/api/v1/workflows/${createdWorkflow.id}`,
              {
                method: 'PATCH',
                headers: n8nHeaders,
                body: JSON.stringify({ active: true })
              }
            );
          }

          // Insérer dans Supabase avec statut 'pending_validation' par défaut
          // Le tech devra valider manuellement après configuration dans n8n
          const { data: workflow, error: insertError } = await supabaseClient
            .from('workflows')
            .insert({
              org_id: orgId,
              template_id: template.id,
              n8n_workflow_id: createdWorkflow.id,
              name: template.name,
              description: template.description,
              pack_level: template.pack_level,
              status: 'pending_validation', // ✅ Toujours en attente de validation manuelle
              config_params: template.default_config || {},
              credentials_status: credentialsStatus,
              is_active: false // ✅ Inactif jusqu'à validation
            })
            .select()
            .single();

          if (insertError) {
            console.error(`[provision] Failed to insert workflow in Supabase:`, insertError);
            throw new Error(`Erreur insertion Supabase: ${insertError.message} - Détails: ${JSON.stringify(insertError)}`);
          }

          provisionedWorkflows.push({
            workflow_id: workflow.id,
            template_name: template.name,
            n8n_workflow_id: createdWorkflow.id,
            status: 'pending_validation' // ✅ Toujours pending_validation après provisioning
          });

        } catch (error: any) {
          console.error(`[manage-client-workflows] Error: ${template.name}`, error);
          errors.push({
            template_name: template.name,
            error: error.message
          });
        }
      }

      const activatedCount = provisionedWorkflows.filter(w => w.status === 'active').length;

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
      );
    }

    // ========================================
    // ACTION: CONFIGURE
    // ========================================
    if (action === 'configure') {
      if (!workflow_id) throw new Error('workflow_id required');

      // Récupérer le workflow depuis Supabase
      const { data: workflow, error: workflowError } = await supabaseClient
        .from('workflows')
        .select('*')
        .eq('id', workflow_id)
        .single();

      if (workflowError || !workflow) throw new Error('Workflow not found');

      // Récupérer le workflow depuis n8n
      const getRes = await fetch(
        `${n8nBaseUrl}/api/v1/workflows/${workflow.n8n_workflow_id}`,
        { headers: n8nHeaders }
      );

      if (!getRes.ok) throw new Error('N8N workflow not found');

      const n8nWorkflow: N8NWorkflow = await getRes.json();

      // Injecter les credentials et paramètres dans les nodes
      const updatedNodes = n8nWorkflow.nodes.map(node => {
        // Injecter les credentials
        if (node.credentials && credentials) {
          Object.keys(credentials).forEach(credKey => {
            if (node.credentials[credKey]) {
              node.parameters = {
                ...node.parameters,
                ...credentials[credKey]
              };
            }
          });
        }

        // Injecter les config_params
        if (config_params) {
          node.parameters = {
            ...node.parameters,
            ...config_params
          };
        }

        return node;
      });

      // Mettre à jour le workflow dans n8n
      const updateRes = await fetch(
        `${n8nBaseUrl}/api/v1/workflows/${workflow.n8n_workflow_id}`,
        {
          method: 'PUT',
          headers: n8nHeaders,
          body: JSON.stringify({
            ...n8nWorkflow,
            nodes: updatedNodes,
            active: true
          })
        }
      );

      if (!updateRes.ok) throw new Error('Failed to update n8n workflow');

      // Mettre à jour dans Supabase
      const { error: updateError } = await supabaseClient
        .from('workflows')
        .update({
          status: 'active',
          config_params: config_params,
          credentials_status: Object.keys(credentials).reduce((acc, key) => {
            acc[key] = 'configured';
            return acc;
          }, {} as Record<string, string>),
          is_active: true
        })
        .eq('id', workflow_id);

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Workflow configuré et activé'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // ACTION: ACTIVATE / DEACTIVATE
    // ========================================
    if (action === 'activate' || action === 'deactivate') {
      if (!workflow_id) throw new Error('workflow_id required');

      const { data: workflow } = await supabaseClient
        .from('workflows')
        .select('n8n_workflow_id')
        .eq('id', workflow_id)
        .single();

      if (!workflow) throw new Error('Workflow not found');

      // Mettre à jour dans n8n
      const updateRes = await fetch(
        `${n8nBaseUrl}/api/v1/workflows/${workflow.n8n_workflow_id}`,
        {
          method: 'PATCH',
          headers: n8nHeaders,
          body: JSON.stringify({ active: action === 'activate' })
        }
      );

      if (!updateRes.ok) throw new Error('Failed to update n8n workflow');

      // Mettre à jour dans Supabase
      await supabaseClient
        .from('workflows')
        .update({ is_active: action === 'activate' })
        .eq('id', workflow_id);

      return new Response(
        JSON.stringify({
          success: true,
          message: `Workflow ${action === 'activate' ? 'activé' : 'désactivé'}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // ACTION: DELETE
    // ========================================
    if (action === 'delete') {
      if (!workflow_id) throw new Error('workflow_id required');

      const { data: workflow } = await supabaseClient
        .from('workflows')
        .select('n8n_workflow_id')
        .eq('id', workflow_id)
        .single();

      if (workflow?.n8n_workflow_id) {
        // Supprimer de n8n
        await fetch(
          `${n8nBaseUrl}/api/v1/workflows/${workflow.n8n_workflow_id}`,
          { method: 'DELETE', headers: n8nHeaders }
        );
      }

      // Supprimer de Supabase
      await supabaseClient
        .from('workflows')
        .delete()
        .eq('id', workflow_id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Workflow supprimé'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // ACTION: TRIGGER (Déclencher un workflow)
    // ========================================
    if (action === 'trigger') {
      if (!workflow_id) throw new Error('workflow_id required');

      const { data: workflow } = await supabaseClient
        .from('workflows')
        .select('n8n_workflow_id, org_id, name, is_active')
        .eq('id', workflow_id)
        .single();

      if (!workflow || !workflow.n8n_workflow_id) {
        throw new Error('Workflow not found or n8n_workflow_id missing');
      }

      // Vérifier que le workflow est actif
      if (!workflow.is_active) {
        throw new Error('Workflow is not active. Please activate it first.');
      }

      // Récupérer les données à envoyer (optionnel)
      const triggerData = variables || {};

      console.log(`[manage-client-workflows] Triggering workflow ${workflow.name} (${workflow.n8n_workflow_id})`);

      // Déclencher le workflow via API n8n
      const triggerRes = await fetch(
        `${n8nBaseUrl}/api/v1/workflows/${workflow.n8n_workflow_id}/execute`,
        {
          method: 'POST',
          headers: {
            ...n8nHeaders,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              ...triggerData,
              client_id: workflow.org_id,
              workflow_id: workflow_id,
              triggered_at: new Date().toISOString()
            }
          })
        }
      );

      if (!triggerRes.ok) {
        const errorText = await triggerRes.text();
        throw new Error(`Failed to trigger workflow: ${errorText}`);
      }

      const execution = await triggerRes.json();
      const executionId = execution.data?.id || execution.id;

      console.log(`[manage-client-workflows] Workflow triggered, execution ID: ${executionId}`);

      return new Response(
        JSON.stringify({
          success: true,
          execution_id: executionId,
          workflow_id: workflow_id,
          workflow_name: workflow.name,
          message: 'Workflow déclenché avec succès'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // ACTION: VALIDATE (Valider un workflow - tech confirme qu'il est configuré et prêt)
    // ========================================
    if (action === 'validate') {
      if (!workflow_id) throw new Error('workflow_id required');

      const { data: workflow } = await supabaseClient
        .from('workflows')
        .select('n8n_workflow_id, status, org_id, name')
        .eq('id', workflow_id)
        .single();

      if (!workflow) throw new Error('Workflow not found');

      // Vérifier que le workflow est bien en pending_validation
      if (workflow.status !== 'pending_validation') {
        throw new Error(`Workflow is not in pending_validation status. Current status: ${workflow.status}`);
      }

      // Vérifier que le workflow existe bien dans n8n et est actif
      const verifyRes = await fetch(
        `${n8nBaseUrl}/api/v1/workflows/${workflow.n8n_workflow_id}`,
        { headers: n8nHeaders }
      );

      if (!verifyRes.ok) {
        throw new Error('Workflow not found in n8n. Please ensure it exists and is configured.');
      }

      const n8nWorkflow = await verifyRes.json();

      // Activer le workflow dans n8n s'il ne l'est pas déjà
      if (!n8nWorkflow.active) {
        const activateRes = await fetch(
          `${n8nBaseUrl}/api/v1/workflows/${workflow.n8n_workflow_id}`,
          {
            method: 'PATCH',
            headers: n8nHeaders,
            body: JSON.stringify({ active: true })
          }
        );
        if (!activateRes.ok) {
          console.warn(`[validate] Failed to activate workflow in n8n, but continuing with validation`);
        }
      }

      // Mettre à jour dans Supabase : status = 'active', is_active = true
      const { error: updateError } = await supabaseClient
        .from('workflows')
        .update({
          status: 'active',
          is_active: true
        })
        .eq('id', workflow_id);

      if (updateError) throw updateError;

      console.log(`[validate] Workflow ${workflow.name} (${workflow_id}) validated and activated`);

      return new Response(
        JSON.stringify({
          success: true,
          workflow_id: workflow_id,
          workflow_name: workflow.name,
          n8n_active: n8nWorkflow.active,
          message: 'Workflow validé et activé avec succès'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // ACTION: VERIFY (Vérifier la connexion)
    // ========================================
    if (action === 'verify') {
      if (!workflow_id && !n8n_workflow_id) throw new Error('workflow_id or n8n_workflow_id required');

      let n8nId = n8n_workflow_id;

      // Si seulement workflow_id fourni, récupérer n8n_workflow_id depuis Supabase
      if (!n8nId && workflow_id) {
        const { data: workflow } = await supabaseClient
          .from('workflows')
          .select('n8n_workflow_id, is_active')
          .eq('id', workflow_id)
          .single();
        
        if (!workflow) throw new Error('Workflow not found in Supabase');
        n8nId = workflow.n8n_workflow_id;
      }

      if (!n8nId) throw new Error('n8n_workflow_id required');

      // Vérifier dans n8n
      const getRes = await fetch(
        `${n8nBaseUrl}/api/v1/workflows/${n8nId}`,
        { headers: n8nHeaders }
      );

      if (!getRes.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            connected: false,
            error: 'Workflow not found in n8n'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const n8nWorkflow = await getRes.json();

      return new Response(
        JSON.stringify({
          success: true,
          connected: true,
          n8n_workflow_id: n8nId,
          n8n_active: n8nWorkflow.active || false,
          n8n_name: n8nWorkflow.name,
          webhook_url: n8nWorkflow.settings?.webhookUrl || null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (error: any) {
    console.error('[manage-client-workflows] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
