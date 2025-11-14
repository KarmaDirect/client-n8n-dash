import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère l'URL du webhook d'un workflow n8n
 */
export const getWorkflowWebhookUrl = async (n8nWorkflowId: string): Promise<string | null> => {
  try {
    // Utiliser l'API n8n via MCP si disponible, sinon via Edge Function
    // Pour l'instant, on récupère depuis Supabase qui devrait avoir l'info
    const { data, error } = await supabase
      .from('workflows')
      .select('n8n_workflow_id, workflow_templates(n8n_template_id)')
      .eq('n8n_workflow_id', n8nWorkflowId)
      .single();

    if (error) {
      console.error('Error fetching workflow:', error);
      return null;
    }

    // L'URL webhook est construite à partir de l'ID n8n
    // Format: https://[N8N_BASE_URL]/webhook/[path]
    // Pour Hello World Test, le path est "hello-world-test"
    return `https://primary-production-bdba.up.railway.app/webhook/hello-world-test`;
  } catch (error) {
    console.error('Error in getWorkflowWebhookUrl:', error);
    return null;
  }
};

/**
 * Active un workflow dans n8n via Supabase Edge Function
 */
export const activateWorkflow = async (workflowId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Récupérer le workflow depuis Supabase
    const { data: workflow, error: fetchError } = await supabase
      .from('workflows')
      .select('n8n_workflow_id, name')
      .eq('id', workflowId)
      .single();

    if (fetchError || !workflow || !workflow.n8n_workflow_id) {
      return { success: false, error: 'Workflow non trouvé' };
    }

    // Appeler l'Edge Function pour activer dans n8n
    const { data, error } = await supabase.functions.invoke('manage-client-workflows', {
      body: {
        action: 'activate',
        workflow_id: workflowId,
        n8n_workflow_id: workflow.n8n_workflow_id
      }
    });

    if (error) {
      console.error('Error activating workflow:', error);
      return { success: false, error: error.message };
    }

    // Mettre à jour le statut dans Supabase
    const { error: updateError } = await supabase
      .from('workflows')
      .update({ is_active: true })
      .eq('id', workflowId);

    if (updateError) {
      console.error('Error updating workflow status:', updateError);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in activateWorkflow:', error);
    return { success: false, error: error.message || 'Erreur inconnue' };
  }
};

/**
 * Désactive un workflow dans n8n via Supabase Edge Function
 */
export const deactivateWorkflow = async (workflowId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Récupérer le workflow depuis Supabase
    const { data: workflow, error: fetchError } = await supabase
      .from('workflows')
      .select('n8n_workflow_id, name')
      .eq('id', workflowId)
      .single();

    if (fetchError || !workflow || !workflow.n8n_workflow_id) {
      return { success: false, error: 'Workflow non trouvé' };
    }

    // Appeler l'Edge Function pour désactiver dans n8n
    const { data, error } = await supabase.functions.invoke('manage-client-workflows', {
      body: {
        action: 'deactivate',
        workflow_id: workflowId,
        n8n_workflow_id: workflow.n8n_workflow_id
      }
    });

    if (error) {
      console.error('Error deactivating workflow:', error);
      return { success: false, error: error.message };
    }

    // Mettre à jour le statut dans Supabase
    const { error: updateError } = await supabase
      .from('workflows')
      .update({ is_active: false })
      .eq('id', workflowId);

    if (updateError) {
      console.error('Error updating workflow status:', updateError);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in deactivateWorkflow:', error);
    return { success: false, error: error.message || 'Erreur inconnue' };
  }
};

/**
 * Vérifie la connexion entre un workflow Supabase et n8n
 */
export const verifyWorkflowConnection = async (workflowId: string): Promise<{
  connected: boolean;
  n8nWorkflowId?: string;
  n8nActive?: boolean;
  webhookUrl?: string;
  error?: string;
}> => {
  try {
    // Récupérer le workflow depuis Supabase
    const { data: workflow, error: fetchError } = await supabase
      .from('workflows')
      .select('n8n_workflow_id, name, is_active')
      .eq('id', workflowId)
      .single();

    if (fetchError || !workflow) {
      return { connected: false, error: 'Workflow non trouvé dans Supabase' };
    }

    if (!workflow.n8n_workflow_id) {
      return { connected: false, error: 'Aucun workflow n8n associé' };
    }

    // Vérifier dans n8n via Edge Function
    const { data, error } = await supabase.functions.invoke('manage-client-workflows', {
      body: {
        action: 'verify',
        workflow_id: workflowId,
        n8n_workflow_id: workflow.n8n_workflow_id
      }
    });

    if (error) {
      return { connected: false, error: error.message };
    }

    const webhookUrl = await getWorkflowWebhookUrl(workflow.n8n_workflow_id);

    return {
      connected: true,
      n8nWorkflowId: workflow.n8n_workflow_id,
      n8nActive: data?.active || false,
      webhookUrl: webhookUrl || undefined
    };
  } catch (error: any) {
    return { connected: false, error: error.message || 'Erreur inconnue' };
  }
};

/**
 * Synchronise les métriques d'un workflow depuis n8n vers Supabase
 */
export const syncWorkflowMetrics = async (workflowId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('track-workflow-execution', {
      body: {
        workflow_id: workflowId,
        sync: true
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erreur inconnue' };
  }
};






