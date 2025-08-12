import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [webhookForm, setWebhookForm] = useState({
    name: "",
    webhook_url: "",
    description: "",
    org_id: "",
    is_active: true
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

  const createWebhook = async () => {
    if (!webhookForm.name || !webhookForm.webhook_url || !webhookForm.org_id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const { error } = await supabase.from('webhooks').insert([webhookForm]);
      if (error) throw error;

      toast.success('Webhook créé avec succès');
      setIsCreateOpen(false);
      setWebhookForm({ name: "", webhook_url: "", description: "", org_id: "", is_active: true });
      fetchData();
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    }
  };

  const createWorkflow = async () => {
    if (!workflowForm.name || !workflowForm.webhook_id || !workflowForm.org_id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const workflowData = {
        ...workflowForm,
        usage_limit_per_hour: workflowForm.usage_limit_per_hour ? parseInt(workflowForm.usage_limit_per_hour) : null,
        usage_limit_per_day: workflowForm.usage_limit_per_day ? parseInt(workflowForm.usage_limit_per_day) : null,
      };

      const { error } = await supabase.from('workflows').insert([workflowData]);
      if (error) throw error;

      toast.success(`Workflow créé avec succès pour ${getOrgName(workflowForm.org_id)} !`);
      setIsWorkflowOpen(false);
      setWorkflowForm({ name: "", description: "", webhook_id: "", usage_limit_per_hour: "", usage_limit_per_day: "", org_id: "", is_active: true });
      fetchData();
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    }
  };

  const createQuickWorkflow = async (orgId: string, webhookId: string, webhookName: string) => {
    try {
      const { error } = await supabase.from('workflows').insert([{
        name: `Agent ${webhookName}`,
        description: `Automatisation ${webhookName} créée rapidement`,
        org_id: orgId,
        webhook_id: webhookId,
        is_active: true,
        usage_limit_per_hour: 10,
        usage_limit_per_day: 50,
      }]);
      
      if (error) throw error;
      
      toast.success(`Workflow "${webhookName}" créé pour ${getOrgName(orgId)} !`);
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
          <h1 className="text-3xl font-bold tracking-tight">Gestion N8N & Workflows</h1>
          <p className="text-muted-foreground mt-1">Créez et gérez les webhooks et workflows pour vos clients</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl">Créer un nouveau webhook N8N</DialogTitle>
                <DialogDescription>
                  Collez votre URL N8N et configurez l'automatisation pour votre client
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-select">Organisation cliente *</Label>
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
                    <Label htmlFor="webhook-name">Nom de l'agent *</Label>
                    <Input
                      id="webhook-name"
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
                  <Label htmlFor="webhook-desc">Description de l'automatisation</Label>
                  <Textarea
                    id="webhook-desc"
                    value={webhookForm.description}
                    onChange={(e) => setWebhookForm({...webhookForm, description: e.target.value})}
                    placeholder="Ex: Envoi automatique de SMS et email de confirmation après action utilisateur"
                    rows={2}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">Activer le webhook</p>
                    <p className="text-sm text-muted-foreground">Le webhook sera directement utilisable</p>
                  </div>
                  <Switch
                    checked={webhookForm.is_active}
                    onCheckedChange={(checked) => setWebhookForm({...webhookForm, is_active: checked})}
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button onClick={createWebhook} className="flex-1" size="lg">
                    <Webhook className="h-4 w-4 mr-2" />
                    Créer le webhook
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)} size="lg">
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isWorkflowOpen} onOpenChange={setIsWorkflowOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Nouveau Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un workflow client</DialogTitle>
                <DialogDescription>
                  Assignez un webhook à un client avec des limites d'usage
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="workflow-org">Organisation cliente *</Label>
                  <Select value={workflowForm.org_id} onValueChange={(value) => setWorkflowForm({...workflowForm, org_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une organisation" />
                    </SelectTrigger>
                    <SelectContent>
                      {orgs.map((org) => (
                        <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="workflow-webhook">Webhook associé *</Label>
                  <Select value={workflowForm.webhook_id} onValueChange={(value) => setWorkflowForm({...workflowForm, webhook_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un webhook" />
                    </SelectTrigger>
                    <SelectContent>
                      {webhooks.filter(wh => wh.org_id === workflowForm.org_id).map((webhook) => (
                        <SelectItem key={webhook.id} value={webhook.id}>{webhook.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="workflow-name">Nom visible pour le client *</Label>
                  <Input
                    id="workflow-name"
                    value={workflowForm.name}
                    onChange={(e) => setWorkflowForm({...workflowForm, name: e.target.value})}
                    placeholder="Agent Lead Capture"
                  />
                </div>
                <div>
                  <Label htmlFor="workflow-desc">Description pour le client</Label>
                  <Textarea
                    id="workflow-desc"
                    value={workflowForm.description}
                    onChange={(e) => setWorkflowForm({...workflowForm, description: e.target.value})}
                    placeholder="Cet agent capture automatiquement les leads..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="limit-hour">Limite par heure</Label>
                    <Input
                      id="limit-hour"
                      type="number"
                      value={workflowForm.usage_limit_per_hour}
                      onChange={(e) => setWorkflowForm({...workflowForm, usage_limit_per_hour: e.target.value})}
                      placeholder="Ex: 10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="limit-day">Limite par jour</Label>
                    <Input
                      id="limit-day"
                      type="number"
                      value={workflowForm.usage_limit_per_day}
                      onChange={(e) => setWorkflowForm({...workflowForm, usage_limit_per_day: e.target.value})}
                      placeholder="Ex: 100"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={workflowForm.is_active}
                    onCheckedChange={(checked) => setWorkflowForm({...workflowForm, is_active: checked})}
                  />
                  <Label>Actif pour le client</Label>
                </div>
                <Button onClick={createWorkflow} className="w-full">Créer le workflow</Button>
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
          {filteredWebhooks.length} webhook(s) • {filteredWorkflows.length} workflow(s)
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Webhook className="h-5 w-5 text-primary" />
                Webhooks N8N
              </div>
              <Badge variant="secondary">{filteredWebhooks.length}</Badge>
            </CardTitle>
            <CardDescription>URLs de réception pour vos automations N8N</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredWebhooks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Webhook className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-2">Aucun webhook configuré</p>
                <p className="text-sm">Créez votre premier webhook pour commencer</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredWebhooks.map((webhook) => {
                  const hasWorkflow = workflows.find(w => w.webhook_id === webhook.id);
                  return (
                    <Card key={webhook.id} className="p-4 border-l-4 border-l-primary/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-sm">{webhook.name}</h4>
                            <Badge variant={webhook.is_active ? "default" : "secondary"} className="text-xs">
                              {webhook.is_active ? "🟢 Actif" : "⭕ Inactif"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            👤 {getOrgName(webhook.org_id)}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-1 rounded truncate">
                            {webhook.webhook_url}
                          </p>
                        </div>
                        <div className="flex gap-1 ml-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleWebhookStatus(webhook.id, webhook.is_active)}
                            className="h-8 w-8 p-0"
                          >
                            {webhook.is_active ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                          {webhook.is_active && !hasWorkflow && (
                            <Button
                              size="sm"
                              onClick={() => createQuickWorkflow(webhook.org_id, webhook.id, webhook.name)}
                              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                            >
                              + Agent
                            </Button>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Workflows Clients
            </CardTitle>
            <CardDescription>Automations visibles par les clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Webhook</TableHead>
                    <TableHead>Limites</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell className="font-medium">{workflow.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {workflow.webhook_id ? getWebhookName(workflow.webhook_id) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {workflow.usage_limit_per_hour && `${workflow.usage_limit_per_hour}/h`}
                        {workflow.usage_limit_per_hour && workflow.usage_limit_per_day && ', '}
                        {workflow.usage_limit_per_day && `${workflow.usage_limit_per_day}/j`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={workflow.is_active ? "default" : "secondary"}>
                          {workflow.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredWorkflows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Aucun workflow trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebhookManager;