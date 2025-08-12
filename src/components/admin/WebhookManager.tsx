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
          <h2 className="text-2xl font-bold">Gestion N8N & Workflows</h2>
          <p className="text-muted-foreground">Créez et gérez les webhooks et workflows pour vos clients</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Webhook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouveau webhook</DialogTitle>
                <DialogDescription>
                  Configurez un point de réception pour les webhooks N8N
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="org-select">Organisation cliente *</Label>
                  <Select value={webhookForm.org_id} onValueChange={(value) => setWebhookForm({...webhookForm, org_id: value})}>
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
                  <Label htmlFor="webhook-name">Nom du webhook *</Label>
                  <Input
                    id="webhook-name"
                    value={webhookForm.name}
                    onChange={(e) => setWebhookForm({...webhookForm, name: e.target.value})}
                    placeholder="Ex: Lead Capture Agent"
                  />
                </div>
                <div>
                  <Label htmlFor="webhook-url">URL du webhook N8N *</Label>
                  <Input
                    id="webhook-url"
                    value={webhookForm.webhook_url}
                    onChange={(e) => setWebhookForm({...webhookForm, webhook_url: e.target.value})}
                    placeholder="https://n8n.example.com/webhook/..."
                  />
                </div>
                <div>
                  <Label htmlFor="webhook-desc">Description</Label>
                  <Textarea
                    id="webhook-desc"
                    value={webhookForm.description}
                    onChange={(e) => setWebhookForm({...webhookForm, description: e.target.value})}
                    placeholder="Description de l'automatisation..."
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={webhookForm.is_active}
                    onCheckedChange={(checked) => setWebhookForm({...webhookForm, is_active: checked})}
                  />
                  <Label>Actif</Label>
                </div>
                <Button onClick={createWebhook} className="w-full">Créer le webhook</Button>
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

      <div className="flex gap-4">
        <Select value={selectedOrg} onValueChange={setSelectedOrg}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Filtrer par organisation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les organisations</SelectItem>
            {orgs.map((org) => (
              <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhooks N8N
            </CardTitle>
            <CardDescription>Points de réception des automations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWebhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-medium">{webhook.name}</TableCell>
                      <TableCell>{getOrgName(webhook.org_id)}</TableCell>
                      <TableCell>
                        <Badge variant={webhook.is_active ? "default" : "secondary"}>
                          {webhook.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                       <TableCell>
                         <div className="flex gap-2">
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => toggleWebhookStatus(webhook.id, webhook.is_active)}
                           >
                             {webhook.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                           </Button>
                           {webhook.is_active && !workflows.find(w => w.webhook_id === webhook.id) && (
                             <Button
                               size="sm"
                               onClick={() => createQuickWorkflow(webhook.org_id, webhook.id, webhook.name)}
                               className="bg-green-600 hover:bg-green-700"
                             >
                               + Agent
                             </Button>
                           )}
                         </div>
                       </TableCell>
                    </TableRow>
                  ))}
                  {filteredWebhooks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Aucun webhook trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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