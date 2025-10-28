import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Rocket, Settings, Play, Pause, CheckCircle, AlertCircle, Loader2, RefreshCw, FolderPlus } from "lucide-react";

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  pack_level: string;
  n8n_template_id: string;
  required_credentials: string[];
  estimated_cost_per_exec: number;
  estimated_time_saved_minutes: number;
  metrics_tracked: string[];
  is_active: boolean;
}

interface ClientOrganization {
  id: string;
  name: string;
  owner_id: string;
}

interface ProvisionedWorkflow {
  id: string;
  org_id: string;
  template_id: string;
  n8n_workflow_id: string;
  name: string;
  description: string;
  pack_level: string;
  status: string;
  is_active: boolean;
  total_executions: number;
}

const WorkflowManager = () => {
  const [loading, setLoading] = useState(true);
  
  // Clients
  const [clients, setClients] = useState<ClientOrganization[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<ClientOrganization | null>(null);
  
  // Templates
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  
  // Workflows provisionnés du client sélectionné
  const [clientWorkflows, setClientWorkflows] = useState<ProvisionedWorkflow[]>([]);
  
  // Formulaire credentials (dynamique par workflow)
  const [credentialsForm, setCredentialsForm] = useState<Record<string, string>>({});
  const [configParamsForm, setConfigParamsForm] = useState<Record<string, string>>({});
  const [configuringWorkflowId, setConfiguringWorkflowId] = useState<string | null>(null);
  const [credentialsDialogOpen, setCredentialsDialogOpen] = useState(false);
  const [selectedWorkflowForConfig, setSelectedWorkflowForConfig] = useState<ProvisionedWorkflow | null>(null);
  
  // Provision en cours
  const [provisioning, setProvisioning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      fetchClientWorkflows();
    }
  }, [selectedClientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch clients
      const { data: orgs, error: orgsError } = await supabase
        .from("organizations")
        .select("id, name, owner_id")
        .eq("approved", true)
        .order("name");
      
      if (orgsError) throw orgsError;
      setClients(orgs || []);
      
      // Fetch templates
      const { data: tmpls, error: tmplsError } = await supabase
        .from("workflow_templates")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      
      if (tmplsError) throw tmplsError;
      setTemplates(tmpls || []);
      
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const fetchClientWorkflows = async () => {
    if (!selectedClientId) return;
    
    try {
      const { data, error } = await supabase
        .from("workflows")
        .select(`
          id,
          org_id,
          template_id,
          n8n_workflow_id,
          name,
          description,
          pack_level,
          status,
          is_active,
          total_executions,
          config_params,
          credentials_status
        `)
        .eq("org_id", selectedClientId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setClientWorkflows(data || []);
    } catch (error: any) {
      console.error("Error fetching client workflows:", error);
      toast.error("Erreur lors du chargement des workflows du client");
    }
  };

  const handleProvisionWorkflows = async () => {
    if (!selectedClientId || selectedTemplateIds.length === 0) {
      toast.error("Sélectionnez un client et au moins un workflow");
      return;
    }

    try {
      setProvisioning(true);
      
      console.log("Provisioning workflows:", {
        client_org_id: selectedClientId,
        custom_template_ids: selectedTemplateIds
      });

      const { data, error } = await supabase.functions.invoke("manage-client-workflows", {
        body: {
          action: "provision",
          client_org_id: selectedClientId,
          template_ids: selectedTemplateIds,
        },
      });

      console.log("Edge Function response:", { data, error });

      if (error) {
        console.error("Edge Function error:", error);
        throw error;
      }

      if (data?.success) {
        toast.success(
          `${data.provisioned_count} workflow(s) provisionné(s) avec succès !`
        );
        
        // Reset selection
        setSelectedTemplateIds([]);
        
        // Refresh client workflows
        await fetchClientWorkflows();
      } else {
        console.error("Provision failed:", data);
        
        // Afficher le message détaillé avec erreurs
        let errorMessage = data?.message || "Erreur lors du provisionnement";
        
        if (data?.errors && data.errors.length > 0) {
          errorMessage += "\n\nDétails:\n";
          data.errors.forEach((err: any) => {
            errorMessage += `• ${err.template_name}: ${err.error}\n`;
          });
        }
        
        toast.error(errorMessage, { duration: 10000 });
      }
    } catch (error: any) {
      console.error("Error provisioning workflows:", error);
      toast.error("Erreur lors du provisionnement : " + error.message);
    } finally {
      setProvisioning(false);
    }
  };

  const handleToggleWorkflow = async (workflowId: string, currentStatus: boolean) => {
    try {
      const { data, error } = await supabase.functions.invoke("manage-client-workflows", {
        body: {
          action: currentStatus ? "deactivate" : "activate",
          client_org_id: selectedClientId,
          workflow_id: workflowId,
        },
      });

      if (error) throw error;

      toast.success(data?.message || (!currentStatus ? "Workflow activé" : "Workflow désactivé"));
      fetchClientWorkflows();
    } catch (error: any) {
      console.error("Error toggling workflow:", error);
      toast.error("Erreur lors de la modification");
    }
  };

  const openConfigureDialog = (workflow: ProvisionedWorkflow) => {
    setSelectedWorkflowForConfig(workflow);
    setCredentialsDialogOpen(true);
    
    // Initialize forms with existing data if any
    const template = templates.find(t => t.id === workflow.template_id);
    if (template?.required_credentials) {
      const initialCredentials: Record<string, string> = {};
      template.required_credentials.forEach(cred => {
        initialCredentials[cred] = "";
      });
      setCredentialsForm(initialCredentials);
    }
    
    if (template?.configurable_params) {
      const initialParams: Record<string, string> = {};
      Object.keys(template.configurable_params).forEach(param => {
        initialParams[param] = "";
      });
      setConfigParamsForm(initialParams);
    }
  };

  const handleConfigureWorkflow = async () => {
    if (!selectedWorkflowForConfig?.n8n_workflow_id) {
      toast.error("Ce workflow n'a pas d'ID n8n associé");
      return;
    }

    try {
      setConfiguringWorkflowId(selectedWorkflowForConfig.id);

      const { data, error } = await supabase.functions.invoke("manage-client-workflows", {
        body: {
          action: "configure",
          client_org_id: selectedClientId,
          workflow_id: selectedWorkflowForConfig.id,
          credentials: credentialsForm,
          config_params: configParamsForm,
        },
      });

      if (error) throw error;

      toast.success("Configuration enregistrée avec succès !");
      
      // Reset forms and close dialog
      setCredentialsForm({});
      setConfigParamsForm({});
      setCredentialsDialogOpen(false);
      setSelectedWorkflowForConfig(null);
      
      // Refresh
      await fetchClientWorkflows();
    } catch (error: any) {
      console.error("Error configuring workflow:", error);
      toast.error("Erreur lors de la configuration : " + error.message);
    } finally {
      setConfiguringWorkflowId(null);
    }
  };

  const handleTestRun = async (workflow: ProvisionedWorkflow) => {
    toast.info("Test run : Workflow en cours d'exécution...");
    // TODO: Implement test run via n8n API
  };

  const handleCreateClientFolder = async () => {
    if (!selectedClientId) return;
    
    toast.info("Création du dossier client dans n8n...");
    // TODO: Via MCP n8n
  };

  const toggleTemplateSelection = (templateId: string) => {
    setSelectedTemplateIds((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId]
    );
  };

  const getCategoryEmoji = (category: string) => {
    const map: Record<string, string> = {
      Communication: "💬",
      Commercial: "📈",
      Marketing: "🎯",
      Facturation: "💰",
      Support: "🎧",
      CRM: "👥",
      IA: "🤖",
      Analytics: "📊",
    };
    return map[category] || "⚙️";
  };

  const getStatusBadge = (workflow: ProvisionedWorkflow) => {
    if (workflow.status === "active") {
      return <Badge className="bg-green-500">Actif</Badge>;
    } else if (workflow.status === "pending_config") {
      return <Badge className="bg-orange-500">Config requise</Badge>;
    } else {
      return <Badge variant="secondary">{workflow.status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Group templates by pack level
  const templatesByPack = {
    start: templates.filter((t) => t.pack_level === "start"),
    pro: templates.filter((t) => t.pack_level === "pro"),
    elite: templates.filter((t) => t.pack_level === "elite"),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion Workflows Templates</h2>
          <p className="text-muted-foreground">
            Provisionnez et gérez les workflows n8n pour vos clients
          </p>
        </div>
        <Button variant="outline" onClick={fetchData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Rafraîchir
        </Button>
      </div>

      {/* SECTION 1 : Sélecteur Client */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            1. Sélectionner le Client
          </CardTitle>
          <CardDescription>
            Choisissez l'organisation pour laquelle provisionner des workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Sélectionner un client..." />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedClientId && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Client sélectionné :</strong> {clients.find((c) => c.id === selectedClientId)?.name}
                {" "}• {clientWorkflows.length} workflow(s) déjà provisionné(s)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 2 : Catalogue Templates (si client sélectionné) */}
      {selectedClientId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              2. Sélectionner les Templates ({selectedTemplateIds.length} sélectionné(s))
            </CardTitle>
            <CardDescription>
              Choisissez les workflows à provisionner pour ce client
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Pack START */}
            {templatesByPack.start.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-green-500">PACK START</Badge>
                  <span className="text-sm text-muted-foreground">
                    {templatesByPack.start.length} template(s) • Essentiels
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templatesByPack.start.map((template) => (
                    <div
                      key={template.id}
                      className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedTemplateIds.includes(template.id)
                          ? "bg-blue-50 dark:bg-blue-950 border-blue-500"
                          : "hover:border-blue-300"
                      }`}
                      onClick={() => toggleTemplateSelection(template.id)}
                    >
                      <Checkbox
                        checked={selectedTemplateIds.includes(template.id)}
                        onCheckedChange={() => toggleTemplateSelection(template.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{getCategoryEmoji(template.category)}</span>
                          <p className="font-medium text-sm">{template.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pack PRO */}
            {templatesByPack.pro.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-blue-500">PACK PRO</Badge>
                  <span className="text-sm text-muted-foreground">
                    {templatesByPack.pro.length} template(s) • Avancé
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templatesByPack.pro.map((template) => (
                    <div
                      key={template.id}
                      className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedTemplateIds.includes(template.id)
                          ? "bg-blue-50 dark:bg-blue-950 border-blue-500"
                          : "hover:border-blue-300"
                      }`}
                      onClick={() => toggleTemplateSelection(template.id)}
                    >
                      <Checkbox
                        checked={selectedTemplateIds.includes(template.id)}
                        onCheckedChange={() => toggleTemplateSelection(template.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{getCategoryEmoji(template.category)}</span>
                          <p className="font-medium text-sm">{template.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pack ELITE */}
            {templatesByPack.elite.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-purple-500">PACK ELITE</Badge>
                  <span className="text-sm text-muted-foreground">
                    {templatesByPack.elite.length} template(s) • Premium
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templatesByPack.elite.map((template) => (
                    <div
                      key={template.id}
                      className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedTemplateIds.includes(template.id)
                          ? "bg-blue-50 dark:bg-blue-950 border-blue-500"
                          : "hover:border-blue-300"
                      }`}
                      onClick={() => toggleTemplateSelection(template.id)}
                    >
                      <Checkbox
                        checked={selectedTemplateIds.includes(template.id)}
                        onCheckedChange={() => toggleTemplateSelection(template.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{getCategoryEmoji(template.category)}</span>
                          <p className="font-medium text-sm">{template.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton Provision */}
            <div className="mt-6 flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  {selectedTemplateIds.length} workflow(s) sélectionné(s)
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Seront dupliqués dans n8n et ajoutés au client
                </p>
              </div>
              <Button
                onClick={handleProvisionWorkflows}
                disabled={selectedTemplateIds.length === 0 || provisioning}
                className="gap-2"
              >
                {provisioning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Provisionnement...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    Provisionner maintenant
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 3 : Workflows du client (si client sélectionné) */}
      {selectedClientId && clientWorkflows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              3. Workflows Provisionnés
            </CardTitle>
            <CardDescription>
              Configurez, activez/désactivez et gérez les workflows du client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientWorkflows.map((workflow) => {
                const template = templates.find((t) => t.id === workflow.template_id);
                const credentialsProgress =
                  template?.required_credentials?.length > 0
                    ? workflow.credentials_status
                      ? Object.keys(workflow.credentials_status).filter(
                          (k) => workflow.credentials_status[k] === "configured"
                        ).length /
                        template.required_credentials.length
                      : 0
                    : 100;

                return (
                  <Card key={workflow.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{getCategoryEmoji(template?.category || "")}</span>
                            <h4 className="font-semibold">{workflow.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{workflow.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {getStatusBadge(workflow)}
                            {workflow.is_active ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                ON
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50">
                                OFF
                              </Badge>
                            )}
                            <Badge variant="secondary" className="uppercase">
                              {workflow.pack_level}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Credentials Progress */}
                      {workflow.status === "pending_config" && template?.required_credentials && (
                        <div className="space-y-2 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-orange-900 dark:text-orange-100">
                              Configuration requise ({template.required_credentials.length} credentials)
                            </span>
                            <span className="text-orange-700 dark:text-orange-300">
                              {Math.round(credentialsProgress * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-orange-500 transition-all"
                              style={{ width: `${credentialsProgress * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Metrics */}
                      <div className="grid grid-cols-4 gap-3 text-xs">
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                          <p className="text-gray-600 dark:text-gray-400">Exécutions</p>
                          <p className="font-bold">{workflow.total_executions}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                          <p className="text-gray-600 dark:text-gray-400">Status</p>
                          <p className="font-bold">{workflow.status}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                          <p className="text-gray-600 dark:text-gray-400">Pack</p>
                          <p className="font-bold uppercase">{workflow.pack_level}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                          <p className="text-gray-600 dark:text-gray-400">n8n ID</p>
                          <p className="font-mono text-xs truncate">{workflow.n8n_workflow_id || "N/A"}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t">
                        {workflow.status === "pending_config" ? (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => openConfigureDialog(workflow)}
                              disabled={configuringWorkflowId === workflow.id}
                              className="flex-1"
                            >
                              {configuringWorkflowId === workflow.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  Configuration...
                                </>
                              ) : (
                                <>
                                  <Settings className="w-4 h-4 mr-1" />
                                  Configurer
                                </>
                              )}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleWorkflow(workflow.id, workflow.is_active)}
                              className="flex-1"
                            >
                              {workflow.is_active ? (
                                <>
                                  <Pause className="w-4 h-4 mr-1" />
                                  Désactiver
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-1" />
                                  Activer
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTestRun(workflow)}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de Configuration Credentials */}
      <Dialog open={credentialsDialogOpen} onOpenChange={setCredentialsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuration du Workflow
            </DialogTitle>
            <DialogDescription>
              {selectedWorkflowForConfig?.name} - Configurez les credentials et paramètres
            </DialogDescription>
          </DialogHeader>
          
          {selectedWorkflowForConfig && (
            <div className="space-y-6">
              {/* Credentials Section */}
              {templates.find(t => t.id === selectedWorkflowForConfig.template_id)?.required_credentials && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <h3 className="font-semibold">Credentials Requis</h3>
                  </div>
                  
                  {templates.find(t => t.id === selectedWorkflowForConfig.template_id)?.required_credentials?.map((credential) => (
                    <div key={credential} className="space-y-2">
                      <Label htmlFor={credential} className="capitalize">
                        {credential.replace('_', ' ')} *
                      </Label>
                      <Input
                        id={credential}
                        type={credential.includes('key') || credential.includes('secret') || credential.includes('token') ? 'password' : 'text'}
                        value={credentialsForm[credential] || ''}
                        onChange={(e) => setCredentialsForm(prev => ({
                          ...prev,
                          [credential]: e.target.value
                        }))}
                        placeholder={`Entrez votre ${credential.replace('_', ' ')}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Config Parameters Section */}
              {templates.find(t => t.id === selectedWorkflowForConfig.template_id)?.configurable_params && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-blue-500" />
                    <h3 className="font-semibold">Paramètres de Configuration</h3>
                  </div>
                  
                  {Object.entries(templates.find(t => t.id === selectedWorkflowForConfig.template_id)?.configurable_params || {}).map(([param, description]) => (
                    <div key={param} className="space-y-2">
                      <Label htmlFor={param}>
                        {description as string}
                      </Label>
                      <Input
                        id={param}
                        value={configParamsForm[param] || ''}
                        onChange={(e) => setConfigParamsForm(prev => ({
                          ...prev,
                          [param]: e.target.value
                        }))}
                        placeholder={`Entrez ${description as string}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleConfigureWorkflow}
                  disabled={configuringWorkflowId === selectedWorkflowForConfig.id}
                  className="flex-1"
                >
                  {configuringWorkflowId === selectedWorkflowForConfig.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Configuration en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Enregistrer et Activer
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCredentialsDialogOpen(false);
                    setSelectedWorkflowForConfig(null);
                    setCredentialsForm({});
                    setConfigParamsForm({});
                  }}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowManager;

