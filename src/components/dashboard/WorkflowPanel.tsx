import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  webhook_type: string;
  execution_method: string;
  form_fields: any;
  schedule_config: any;
  response_format: string;
}

const WorkflowPanel = ({ orgId }: { orgId: string }) => {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState<string | null>(null);

  // Abonnement utilisateur
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);

  // Form modal state
  const [showForm, setShowForm] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookItem | null>(null);
  const [submittingForm, setSubmittingForm] = useState(false);
  const form = useForm<Record<string, any>>({ defaultValues: {} });
  useEffect(() => {
    fetchData();
  }, [orgId]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) { setIsSubscribed(null); return; }
      const { data, error } = await supabase
        .from('subscribers')
        .select('subscribed')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) {
        console.error('Subscription fetch error', error);
        setIsSubscribed(null);
      } else {
        setIsSubscribed(Boolean(data?.subscribed));
      }
    };
    fetchSubscription();
  }, [user]);

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
          .select('id, webhook_url, webhook_type, execution_method, form_fields, schedule_config, response_format')
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

    if (isSubscribed === false) {
      toast.error("Abonnement requis pour exécuter les workflows");
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

      // Execute via secure Edge Function
      const { data: execData, error: execError } = await supabase.functions.invoke('execute-webhook', {
        body: {
          workflow_id: workflowId,
        },
      });

      if (execError) {
        throw new Error(execError.message);
      }

      if (execData?.ok) {
        toast.success('Workflow exécuté avec succès');
      } else {
        toast.error(execData?.error || 'Erreur lors de l\'exécution du workflow');
      }

      // Refresh data after execution
      await fetchData();
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
      
      // Journalisation gérée côté serveur via l'Edge Function
    } finally {
      setExecuting(null);
    }
  };

  const openForm = (workflow: WorkflowItem) => {
    const wh = webhooks.find(w => w.id === workflow.webhook_id) || null;
    setSelectedWorkflow(workflow);
    setSelectedWebhook(wh);

    const defaults: Record<string, any> = {};
    const fields = (wh?.form_fields as any[]) || [];
    fields.forEach((f: any, idx: number) => {
      const key = f?.name || `field_${idx}`;
      defaults[key] = f?.default ?? (f?.type === 'checkbox' ? false : '');
    });
    form.reset(defaults);
    setShowForm(true);
  };

  const submitForm = async (values: Record<string, any>) => {
    if (!selectedWorkflow) return;
    setSubmittingForm(true);
    try {
      const { data: execData, error: execError } = await supabase.functions.invoke('execute-webhook', {
        body: {
          workflow_id: selectedWorkflow.id,
          payload: values,
        },
      });
      if (execError) throw new Error(execError.message);
      if (execData?.ok) {
        toast.success('Formulaire envoyé, exécution en cours');
        setShowForm(false);
        setSelectedWorkflow(null);
        setSelectedWebhook(null);
        await fetchData();
      } else {
        toast.error(execData?.error || "Erreur lors de l'exécution");
      }
    } catch (e: any) {
      toast.error('Erreur: ' + e.message);
    } finally {
      setSubmittingForm(false);
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
                const webhook = webhooks.find(w => w.id === workflow.webhook_id);
                
                return (
                  <Card key={workflow.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{workflow.name}</h4>
                          {webhook && (
                            <Badge variant="outline" className="text-xs">
                              {webhook.webhook_type === 'button' && '🔘 Bouton'}
                              {webhook.webhook_type === 'form' && '📝 Formulaire'}
                              {webhook.webhook_type === 'schedule' && '⏰ Programmé'}
                              {webhook.webhook_type === 'manual' && '📋 Manuel'}
                            </Badge>
                          )}
                          {webhook && (
                            <Badge variant="secondary" className="text-xs">
                              {webhook.execution_method}
                            </Badge>
                          )}
                        </div>
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
                        {webhook?.webhook_type === 'schedule' && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Planification N8N: {((webhook as any)?.schedule_config?.description) || ((webhook as any)?.schedule_config?.cron) || 'voir N8N'}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {webhook?.webhook_type === 'button' && (
                          <Button
                            size="sm"
                            onClick={() => executeWorkflow(workflow.id)}
                            disabled={!canExecute || executing === workflow.id || isSubscribed === false}
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
                        )}
                        
                        {webhook?.webhook_type === 'form' && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!canExecute || isSubscribed === false}
                            onClick={() => openForm(workflow)}
                          >
                            📝 Formulaire
                          </Button>
                        )}
                        
                        {webhook?.webhook_type === 'schedule' && (
                          <Badge variant="outline" className="text-xs">
                            ⏰ Automatique
                          </Badge>
                        )}
                        
                        {webhook?.webhook_type === 'manual' && (
                          <Badge variant="secondary" className="text-xs">
                            📋 Manuel
                          </Badge>
                        )}
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
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedWorkflow?.name || 'Formulaire'}</DialogTitle>
            <DialogDescription>
              Renseignez les informations requises puis validez pour lancer l'exécution.
            </DialogDescription>
          </DialogHeader>
          {selectedWebhook?.form_fields && (selectedWebhook.form_fields as any[])?.length ? (
            <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
              {(selectedWebhook.form_fields as any[]).map((f: any, idx: number) => (
                <div key={f?.name || idx} className="space-y-2">
                  <Label htmlFor={f?.name}>{f?.label || f?.name || `Champ ${idx+1}`}</Label>
                  {f?.type === 'textarea' ? (
                    <Textarea id={f?.name} placeholder={f?.placeholder}
                      {...form.register(f?.name || `field_${idx}`, { required: !!f?.required })} />
                  ) : f?.type === 'select' ? (
                    <Select defaultValue={form.getValues(f?.name || `field_${idx}`)}
                      onValueChange={(val) => form.setValue(f?.name || `field_${idx}`, val)}>
                      <SelectTrigger id={f?.name}>
                        <SelectValue placeholder={f?.placeholder || 'Sélectionnez'} />
                      </SelectTrigger>
                      <SelectContent>
                        {(f?.options || []).map((opt: any, i: number) => {
                          const value = String(opt?.value ?? opt);
                          const label = String(opt?.label ?? opt);
                          return <SelectItem key={i} value={value}>{label}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                  ) : f?.type === 'number' ? (
                    <Input id={f?.name} type="number" placeholder={f?.placeholder}
                      {...form.register(f?.name || `field_${idx}`, { required: !!f?.required, valueAsNumber: true })} />
                  ) : f?.type === 'checkbox' ? (
                    <input id={f?.name} type="checkbox" className="h-4 w-4"
                      {...form.register(f?.name || `field_${idx}`)} />
                  ) : (
                    <Input id={f?.name} type={f?.type || 'text'} placeholder={f?.placeholder}
                      {...form.register(f?.name || `field_${idx}`, { required: !!f?.required })} />
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
                <Button type="submit" disabled={submittingForm}>{submittingForm ? 'Envoi...' : 'Envoyer'}</Button>
              </div>
            </form>
          ) : (
            <div className="text-sm text-muted-foreground">
              Aucun champ configuré pour ce formulaire.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowPanel;