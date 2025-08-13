import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Play, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface WorkflowItem {
  id: string;
  name: string;
  description: string | null;
  webhook_id: string | null;
  usage_limit_per_hour: number | null;
  usage_limit_per_day: number | null;
  is_active: boolean;
  last_executed_at: string | null;
}

interface WorkflowExecution {
  id: string;
  workflow_id: string;
  executed_at: string;
  status: string;
  response_data: any;
}

interface WebhookItem {
  id: string;
  webhook_url: string;
}

const WorkflowPanel = ({ orgId }: { orgId: string }) => {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const fetchData = async () => {
    console.log('WorkflowPanel: fetchData called with orgId:', orgId);
    try {
      const [workflowsRes, executionsRes, webhooksRes] = await Promise.all([
        supabase
          .from('workflows')
          .select('*')
          .eq('org_id', orgId)
          .eq('is_active', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('workflow_executions')
          .select('*')
          .eq('org_id', orgId)
          .order('executed_at', { ascending: false })
          .limit(10),
        supabase
          .from('webhooks')
          .select('id, webhook_url')
          .eq('org_id', orgId)
          .eq('is_active', true)
      ]);

      console.log('WorkflowPanel: workflowsRes:', workflowsRes);
      console.log('WorkflowPanel: executionsRes:', executionsRes);
      console.log('WorkflowPanel: webhooksRes:', webhooksRes);

      if (workflowsRes.error) throw workflowsRes.error;
      if (executionsRes.error) throw executionsRes.error;
      if (webhooksRes.error) throw webhooksRes.error;

      setWorkflows(workflowsRes.data || []);
      setExecutions(executionsRes.data || []);
      setWebhooks(webhooksRes.data || []);
      
      console.log('WorkflowPanel: Final workflows set:', workflowsRes.data || []);
    } catch (error: any) {
      console.error('WorkflowPanel: Error fetching data:', error);
      toast.error('Erreur lors du chargement: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    setExecuting(workflowId);
    
    try {
      // Check usage limits
      const { data: canExecute, error: limitError } = await supabase.rpc(
        'check_workflow_usage_limit',
        { _workflow_id: workflowId, _user_id: user.id }
      );

      if (limitError) throw limitError;
      if (!canExecute) {
        toast.error('Limite d\'utilisation atteinte pour ce workflow');
        return;
      }

      const workflow = workflows.find(w => w.id === workflowId);
      if (!workflow) {
        toast.error('Workflow introuvable');
        return;
      }

      const webhook = webhooks.find(w => w.id === workflow.webhook_id);
      if (!webhook) {
        toast.error('Webhook introuvable');
        return;
      }

      // Execute the webhook
      const response = await fetch(webhook.webhook_url, {
        method: 'GET'
      });

      const responseData = await response.text();
      
      // Log the execution
      const { error: logError } = await supabase
        .from('workflow_executions')
        .insert([{
          workflow_id: workflowId,
          org_id: orgId,
          user_id: user.id,
          status: response.ok ? 'success' : 'error',
          response_data: { status: response.status, data: responseData }
        }]);

      if (logError) console.error('Log error:', logError);

      // Update last executed timestamp
      await supabase
        .from('workflows')
        .update({ last_executed_at: new Date().toISOString() })
        .eq('id', workflowId);

      if (response.ok) {
        toast.success('Workflow exécuté avec succès');
      } else {
        toast.error('Erreur lors de l\'exécution du workflow');
      }

      fetchData(); // Refresh data
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
      
      // Log failed execution
      await supabase
        .from('workflow_executions')
        .insert([{
          workflow_id: workflowId,
          org_id: orgId,
          user_id: user.id,
          status: 'error',
          response_data: { error: error.message }
        }]);
    } finally {
      setExecuting(null);
    }
  };

  const getUsageInfo = (workflow: WorkflowItem) => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const executionsLastHour = executions.filter(
      e => e.executed_at > oneHourAgo.toISOString() && 
      e.workflow_id === workflow.id
    ).length;

    const executionsLastDay = executions.filter(
      e => e.executed_at > oneDayAgo.toISOString() && 
      e.workflow_id === workflow.id
    ).length;

    return { executionsLastHour, executionsLastDay };
  };

  const canExecuteWorkflow = (workflow: WorkflowItem) => {
    const { executionsLastHour, executionsLastDay } = getUsageInfo(workflow);
    
    if (workflow.usage_limit_per_hour && executionsLastHour >= workflow.usage_limit_per_hour) {
      return false;
    }
    
    if (workflow.usage_limit_per_day && executionsLastDay >= workflow.usage_limit_per_day) {
      return false;
    }
    
    return true;
  };

  if (loading) {
    return <div className="text-center">Chargement des workflows...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Mes Agents N8N
          </CardTitle>
          <CardDescription>
            Lancez vos automations et workflows personnalisés
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workflows.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun workflow disponible</p>
              <p className="text-sm">Contactez votre administrateur pour configurer vos automations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workflows.map((workflow) => {
                const { executionsLastHour, executionsLastDay } = getUsageInfo(workflow);
                const canExecute = canExecuteWorkflow(workflow);
                
                return (
                  <Card key={workflow.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{workflow.name}</h4>
                        {workflow.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {workflow.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          {workflow.last_executed_at && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Dernière exécution: {new Date(workflow.last_executed_at).toLocaleString()}
                            </div>
                          )}
                          {(workflow.usage_limit_per_hour || workflow.usage_limit_per_day) && (
                            <div className="flex items-center gap-2 text-xs">
                              {workflow.usage_limit_per_hour && (
                                <Badge variant="outline" className="text-xs">
                                  {executionsLastHour}/{workflow.usage_limit_per_hour} cette heure
                                </Badge>
                              )}
                              {workflow.usage_limit_per_day && (
                                <Badge variant="outline" className="text-xs">
                                  {executionsLastDay}/{workflow.usage_limit_per_day} aujourd'hui
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => executeWorkflow(workflow.id)}
                          disabled={!canExecute || executing === workflow.id}
                        >
                          {executing === workflow.id ? (
                            "Exécution..."
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" />
                              Lancer
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {executions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des exécutions</CardTitle>
            <CardDescription>Dernières activités de vos workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {executions.map((execution) => {
                    const workflow = workflows.find(w => w.id === execution.workflow_id);
                    return (
                      <TableRow key={execution.id}>
                        <TableCell className="text-sm">
                          {new Date(execution.executed_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {workflow?.name || 'Workflow supprimé'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={execution.status === 'success' ? 'default' : 'destructive'}>
                            {execution.status === 'success' ? (
                              <><CheckCircle className="h-3 w-3 mr-1" />Succès</>
                            ) : (
                              <><AlertCircle className="h-3 w-3 mr-1" />Erreur</>
                            )}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowPanel;