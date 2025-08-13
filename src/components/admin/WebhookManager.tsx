import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Webhook, Settings, Play, Pause } from "lucide-react";

interface WebhookItem {
  id: string;
  name: string;
  webhook_url: string;
  description: string | null;
  is_active: boolean;
  org_id: string;
  created_at: string;
  webhook_type: string;
  execution_method: string;
  form_fields: any;
  schedule_config: any;
  response_format: string;
}

interface WorkflowItem {
  id: string;
  name: string;
  description: string | null;
  webhook_id: string | null;
  usage_limit_per_hour: number | null;
  usage_limit_per_day: number | null;
  is_active: boolean;
  org_id: string;
}

interface OrgItem {
  id: string;
  name: string;
}

const WebhookManager = () => {
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [orgs, setOrgs] = useState<OrgItem[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [webhookForm, setWebhookForm] = useState({
    name: "",
    webhook_url: "",
    description: "",
    org_id: "",
    is_active: true,
    webhook_type: "button",
    execution_method: "GET",
    response_format: "json",
    form_fields: [],
    schedule_config: null
  });

  const [workflowForm, setWorkflowForm] = useState({
    name: "",
    description: "",
    webhook_id: "",
    usage_limit_per_hour: "",
    usage_limit_per_day: "",
    org_id: "",
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [webhooksRes, workflowsRes, orgsRes] = await Promise.all([
        supabase.from('webhooks').select('*').order('created_at', { ascending: false }),
        supabase.from('workflows').select('*').order('created_at', { ascending: false }),
        supabase.rpc('admin_list_organizations')
      ]);

      if (webhooksRes.error) throw webhooksRes.error;
      if (workflowsRes.error) throw workflowsRes.error;
      if (orgsRes.error) throw orgsRes.error;

      setWebhooks(webhooksRes.data || []);
      setWorkflows(workflowsRes.data || []);
      setOrgs((orgsRes.data as any) || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createWebhookAndWorkflow = async () => {
    if (!webhookForm.name || !webhookForm.webhook_url || !webhookForm.org_id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      // Créer le webhook
      const { data: webhookData, error: webhookError } = await supabase
        .from('webhooks')
        .insert([webhookForm])
        .select()
        .single();
      
      if (webhookError) throw webhookError;

      // Créer automatiquement le workflow client associé
      const workflowData = {
        name: `Agent ${webhookForm.name}`,
        description: webhookForm.description || `Automatisation ${webhookForm.name}`,
        org_id: webhookForm.org_id,
        webhook_id: webhookData.id,
        is_active: webhookForm.is_active,
        usage_limit_per_hour: workflowForm.usage_limit_per_hour ? parseInt(workflowForm.usage_limit_per_hour) : 10,
        usage_limit_per_day: workflowForm.usage_limit_per_day ? parseInt(workflowForm.usage_limit_per_day) : 50,
      };

      const { error: workflowError } = await supabase
        .from('workflows')
        .insert([workflowData]);
      
      if (workflowError) throw workflowError;

      toast.success(`Agent "${webhookForm.name}" créé avec succès pour ${getOrgName(webhookForm.org_id)} !`);
      setIsCreateOpen(false);
      setWebhookForm({ 
        name: "", 
        webhook_url: "", 
        description: "", 
        org_id: "", 
        is_active: true,
        webhook_type: "button",
        execution_method: "GET",
        response_format: "json",
        form_fields: [],
        schedule_config: null
      });
      setWorkflowForm({ name: "", description: "", webhook_id: "", usage_limit_per_hour: "", usage_limit_per_day: "", org_id: "", is_active: true });
      fetchData();
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    }
  };

  const toggleWebhookStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('webhooks')
        .update({ is_active: !isActive })
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Statut mis à jour');
      fetchData();
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    }
  };

  const filteredWebhooks = selectedOrg && selectedOrg !== "all"
    ? webhooks.filter(w => w.org_id === selectedOrg)
    : webhooks;

  const filteredWorkflows = selectedOrg && selectedOrg !== "all"
    ? workflows.filter(w => w.org_id === selectedOrg)
    : workflows;

  const getOrgName = (orgId: string) => {
    return orgs.find(org => org.id === orgId)?.name || 'Organisation inconnue';
  };

  const getWebhookName = (webhookId: string) => {
    return webhooks.find(wh => wh.id === webhookId)?.name || 'Webhook inconnu';
  };

  if (loading) {
    return <div className="text-center">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion Agents N8N</h1>
          <p className="text-muted-foreground mt-1">Créez des agents IA pour vos clients en une seule étape</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Agent N8N
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl">Créer un nouvel agent N8N</DialogTitle>
                <DialogDescription>
                  Collez votre URL N8N et l'agent sera automatiquement disponible pour votre client
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-select">Client *</Label>
                    <Select value={webhookForm.org_id} onValueChange={(value) => setWebhookForm({...webhookForm, org_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir le client" />
                      </SelectTrigger>
                      <SelectContent>
                        {orgs.map((org) => (
                          <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent-name">Nom de l'agent *</Label>
                    <Input
                      id="agent-name"
                      value={webhookForm.name}
                      onChange={(e) => setWebhookForm({...webhookForm, name: e.target.value})}
                      placeholder="Ex: Agent SMS & Email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-url" className="text-base font-medium">URL du webhook N8N *</Label>
                  <div className="relative">
                    <Textarea
                      id="webhook-url"
                      value={webhookForm.webhook_url}
                      onChange={(e) => setWebhookForm({...webhookForm, webhook_url: e.target.value})}
                      placeholder="Collez ici votre URL complète N8N
Ex: https://n8n.mondomaine.com/webhook/12345-67890-abcde..."
                      className="min-h-[80px] font-mono text-sm"
                      rows={3}
                    />
                    <div className="absolute top-2 right-2">
                      <Webhook className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Copiez l'URL complète depuis votre workflow N8N
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent-desc">Description pour le client</Label>
                  <Textarea
                    id="agent-desc"
                    value={webhookForm.description}
                    onChange={(e) => setWebhookForm({...webhookForm, description: e.target.value})}
                    placeholder="Ex: Envoie automatiquement un SMS et un email de confirmation après votre action"
                    rows={2}
                  />
                </div>

                <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                  <Label className="text-base font-medium">Mode d'exécution</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook-type">Type d'interface</Label>
                      <Select value={webhookForm.webhook_type} onValueChange={(value) => setWebhookForm({...webhookForm, webhook_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type d'interface" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="button">🔘 Bouton simple</SelectItem>
                          <SelectItem value="form">📝 Formulaire personnalisé</SelectItem>
                          <SelectItem value="schedule">⏰ Tâche programmée</SelectItem>
                          <SelectItem value="manual">📋 Manuel (pas d'interface)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="execution-method">Méthode HTTP</Label>
                      <Select value={webhookForm.execution_method} onValueChange={(value) => setWebhookForm({...webhookForm, execution_method: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Méthode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET (simple)</SelectItem>
                          <SelectItem value="POST">POST (avec données)</SelectItem>
                          <SelectItem value="PUT">PUT (mise à jour)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {webhookForm.webhook_type === 'form' && (
                    <div className="space-y-2">
                      <Label>Configuration du formulaire</Label>
                      <Textarea
                        placeholder="Définissez vos champs JSON:
{
  &quot;fields&quot;: [
    {&quot;name&quot;: &quot;email&quot;, &quot;type&quot;: &quot;email&quot;, &quot;label&quot;: &quot;Email du client&quot;, &quot;required&quot;: true},
    {&quot;name&quot;: &quot;message&quot;, &quot;type&quot;: &quot;textarea&quot;, &quot;label&quot;: &quot;Message&quot;, &quot;required&quot;: false}
  ]
}"
                        rows={4}
                        className="font-mono text-xs"
                        value={JSON.stringify(webhookForm.form_fields, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setWebhookForm({...webhookForm, form_fields: parsed});
                          } catch (error) {
                            // Invalid JSON, keep the string for editing
                          }
                        }}
                      />
                    </div>
                  )}

                  {webhookForm.webhook_type === 'schedule' && (
                    <div className="space-y-2">
                      <Label>Configuration de planification</Label>
                      <Textarea
                        placeholder="Configuration cron et paramètres:
{
  &quot;cron&quot;: &quot;0 9 * * 1&quot;,
  &quot;description&quot;: &quot;Tous les lundis à 9h&quot;,
  &quot;timezone&quot;: &quot;Europe/Paris&quot;
}"
                        rows={3}
                        className="font-mono text-xs"
                        value={JSON.stringify(webhookForm.schedule_config, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setWebhookForm({...webhookForm, schedule_config: parsed});
                          } catch (error) {
                            // Invalid JSON, keep the string for editing
                          }
                        }}
                      />
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    {webhookForm.webhook_type === 'button' && '💡 Interface simple avec un bouton "Lancer"'}
                    {webhookForm.webhook_type === 'form' && '💡 Le client remplira un formulaire avant exécution'}
                    {webhookForm.webhook_type === 'schedule' && '💡 Exécution automatique selon planning'}
                    {webhookForm.webhook_type === 'manual' && '💡 Visible dans les historiques uniquement'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="limit-hour">Limite par heure</Label>
                    <Input
                      id="limit-hour"
                      type="number"
                      value={workflowForm.usage_limit_per_hour}
                      onChange={(e) => setWorkflowForm({...workflowForm, usage_limit_per_hour: e.target.value})}
                      placeholder="Ex: 10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="limit-day">Limite par jour</Label>
                    <Input
                      id="limit-day"
                      type="number"
                      value={workflowForm.usage_limit_per_day}
                      onChange={(e) => setWorkflowForm({...workflowForm, usage_limit_per_day: e.target.value})}
                      placeholder="Ex: 50"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">Activer l'agent</p>
                    <p className="text-sm text-muted-foreground">L'agent sera directement disponible pour le client</p>
                  </div>
                  <Switch
                    checked={webhookForm.is_active}
                    onCheckedChange={(checked) => setWebhookForm({...webhookForm, is_active: checked})}
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button onClick={createWebhookAndWorkflow} className="flex-1" size="lg">
                    <Webhook className="h-4 w-4 mr-2" />
                    Créer l'agent
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)} size="lg">
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Filtrer par client:</Label>
          <Select value={selectedOrg} onValueChange={setSelectedOrg}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Tous les clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">📋 Tous les clients</SelectItem>
              {orgs.map((org) => (
                <SelectItem key={org.id} value={org.id}>👤 {org.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Badge variant="outline" className="ml-auto">
          {filteredWorkflows.length} agent(s) configuré(s)
        </Badge>
      </div>

      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Agents N8N Configurés
              </div>
              <Badge variant="secondary">{filteredWorkflows.length}</Badge>
            </CardTitle>
            <CardDescription>Tous vos agents IA disponibles pour vos clients</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredWorkflows.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-2">Aucun agent configuré</p>
                <p className="text-sm">Créez votre premier agent N8N pour commencer</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWorkflows.map((workflow) => {
                  const webhook = webhooks.find(w => w.id === workflow.webhook_id);
                  return (
                    <Card key={workflow.id} className="p-4 border-l-4 border-l-green-500/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-sm">{workflow.name}</h4>
                            <Badge variant={workflow.is_active ? "default" : "secondary"} className="text-xs">
                              {workflow.is_active ? "🟢 Actif" : "⭕ Inactif"}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              👤 {getOrgName(workflow.org_id)}
                            </p>
                            {workflow.description && (
                              <p className="text-xs text-muted-foreground">
                                {workflow.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {(workflow.usage_limit_per_hour || workflow.usage_limit_per_day) && (
                                <div className="flex items-center gap-2">
                                  {workflow.usage_limit_per_hour && (
                                    <span>⏱️ {workflow.usage_limit_per_hour}/h</span>
                                  )}
                                  {workflow.usage_limit_per_day && (
                                    <span>📅 {workflow.usage_limit_per_day}/j</span>
                                  )}
                                </div>
                              )}
                              {webhook && (
                                <span className="font-mono bg-muted/30 px-1 py-0.5 rounded text-xs truncate max-w-[200px]">
                                  🔗 {webhook.webhook_url}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => webhook && toggleWebhookStatus(webhook.id, webhook.is_active)}
                            className="h-8 w-8 p-0"
                          >
                            {workflow.is_active ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
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
      </div>
    </div>
  );
};

export default WebhookManager;