import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Loader2, Play, Pause, Trash2, FileText, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Organization {
  id: string;
  name: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  n8n_template_id: string;
  pack_level: "start" | "pro" | "elite";
  category: string;
  required_credentials: string[];
  is_active: boolean;
}

interface ClientWorkflow {
  id: string;
  name: string;
  n8n_workflow_id: string;
  is_active: boolean;
  last_run_at: string | null;
  error_count_24h: number;
  runs_count_24h: number;
}

interface MetricsSummary {
  total_runs: number;
  total_items_processed: number;
  total_errors: number;
  estimated_roi: number;
}

export default function AdminWorkflows() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [clientWorkflows, setClientWorkflows] = useState<ClientWorkflow[]>([]);
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [showVariablesSheet, setShowVariablesSheet] = useState(false);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Charger les organisations
  useEffect(() => {
    loadOrganizations();
    loadTemplates();
  }, []);

  // Charger les workflows client et métriques quand on sélectionne une org
  useEffect(() => {
    if (selectedOrgId) {
      const org = organizations.find((o) => o.id === selectedOrgId);
      setSelectedOrg(org || null);
      loadClientWorkflows(selectedOrgId);
      loadMetrics(selectedOrgId);
    }
  }, [selectedOrgId, organizations]);

  const loadOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from("organizations")
        .select("id, name")
        .eq("approved", true)
        .order("name");

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de charger les organisations: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("workflow_templates")
        .select("*")
        .eq("is_active", true)
        .order("pack_level", { ascending: true })
        .order("name");

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de charger les templates: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const loadClientWorkflows = async (orgId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("workflows")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClientWorkflows(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de charger les workflows: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async (orgId: string) => {
    try {
      // Calculer les métriques agrégées depuis workflow_metrics
      const { data: metricsData, error } = await supabase
        .from("workflow_metrics")
        .select("executions_count, success_count, failed_count, custom_metrics")
        .eq("org_id", orgId);

      if (error && error.code !== "PGRST116") throw error;
      
      // Agrégation des métriques
      const aggregated = metricsData?.reduce((acc, m) => {
        acc.total_runs += m.executions_count || 0;
        acc.total_success += m.success_count || 0;
        acc.total_errors += m.failed_count || 0;
        
        // Extraire itemsProcessed depuis custom_metrics si présent
        if (m.custom_metrics && typeof m.custom_metrics === 'object') {
          const items = (m.custom_metrics as any).itemsProcessed || 0;
          acc.total_items_processed += items;
        }
        
        return acc;
      }, { total_runs: 0, total_success: 0, total_errors: 0, total_items_processed: 0 }) || { total_runs: 0, total_success: 0, total_errors: 0, total_items_processed: 0 };
      
      // ROI estimé basé sur time_saved (simplifié)
      const estimated_roi = aggregated.total_runs * 10; // Placeholder
      
      setMetrics({
        total_runs: aggregated.total_runs,
        total_items_processed: aggregated.total_items_processed,
        total_errors: aggregated.total_errors,
        estimated_roi
      });
    } catch (error: any) {
      console.error("Erreur métriques:", error.message);
      setMetrics({ total_runs: 0, total_items_processed: 0, total_errors: 0, estimated_roi: 0 });
    }
  };

  const toggleTemplateSelection = (templateId: string) => {
    const newSelection = new Set(selectedTemplates);
    if (newSelection.has(templateId)) {
      newSelection.delete(templateId);
    } else {
      newSelection.add(templateId);
    }
    setSelectedTemplates(newSelection);
  };

  const handleProvisionClick = () => {
    if (!selectedOrgId || selectedTemplates.size === 0) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner un client et au moins un workflow",
        variant: "destructive",
      });
      return;
    }

    // Collecter toutes les credentials/variables requises
    const allVariables = new Set<string>();
    templates
      .filter((t) => selectedTemplates.has(t.id))
      .forEach((t) => {
        // required_credentials est un JSONB array
        if (t.required_credentials && Array.isArray(t.required_credentials)) {
          t.required_credentials.forEach((v: string) => allVariables.add(v));
        }
      });

    // Initialiser les variables avec des placeholders
    const initialVars: Record<string, string> = {};
    allVariables.forEach((v) => {
      initialVars[v] = "";
    });
    setVariables(initialVars);
    setShowVariablesSheet(true);
  };

  const handleProvision = async () => {
    setIsProvisioning(true);
    try {
      // Appeler l'Edge Function de provisioning
      const { data, error } = await supabase.functions.invoke("manage-client-workflows", {
        body: {
          action: "provision",
          organization_id: selectedOrgId,
          template_ids: Array.from(selectedTemplates),
          variables,
        },
      });

      if (error) throw error;

      toast({
        title: "✅ Provisioning réussi",
        description: `${data.copied} workflows copiés, ${data.enabled} activés`,
      });

      setShowVariablesSheet(false);
      setSelectedTemplates(new Set());
      loadClientWorkflows(selectedOrgId);
      loadMetrics(selectedOrgId);
    } catch (error: any) {
      toast({
        title: "❌ Erreur provisioning",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProvisioning(false);
    }
  };

  const toggleWorkflow = async (workflowId: string, currentState: boolean) => {
    try {
      const { error } = await supabase.functions.invoke("manage-client-workflows", {
        body: {
          action: currentState ? "deactivate" : "activate",
          workflow_id: workflowId,
        },
      });

      if (error) throw error;

      toast({
        title: "✅ Workflow mis à jour",
        description: `Workflow ${currentState ? "désactivé" : "activé"}`,
      });

      loadClientWorkflows(selectedOrgId);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteWorkflow = async (workflowId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce workflow ?")) return;

    try {
      const { error } = await supabase.functions.invoke("manage-client-workflows", {
        body: {
          action: "delete",
          workflow_id: workflowId,
        },
      });

      if (error) throw error;

      toast({
        title: "✅ Workflow supprimé",
      });

      loadClientWorkflows(selectedOrgId);
      loadMetrics(selectedOrgId);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const testRun = async (workflowId: string) => {
    try {
      toast({
        title: "⏳ Test run lancé...",
        description: "Déclenchement du workflow en cours...",
      });

      const { data, error } = await supabase.functions.invoke("manage-client-workflows", {
        body: {
          action: "trigger",
          workflow_id: workflowId,
          variables: {
            test_mode: "true",
            triggered_by: "admin_ui"
          }
        },
      });

      if (error) throw error;

      toast({
        title: "✅ Workflow déclenché",
        description: `Exécution ID: ${data.execution_id || 'N/A'}`,
      });

      // Recharger les workflows et métriques après 3 secondes
      setTimeout(() => {
        if (selectedOrgId) {
          loadClientWorkflows(selectedOrgId);
          loadMetrics(selectedOrgId);
        }
      }, 3000);
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message || "Impossible de déclencher le workflow",
        variant: "destructive",
      });
    }
  };

  const templatesByLevel = {
    start: templates.filter((t) => t.pack_level === "start"),
    pro: templates.filter((t) => t.pack_level === "pro"),
    elite: templates.filter((t) => t.pack_level === "elite"),
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion Workflows Client</h1>
          <p className="text-muted-foreground">Provisionnement et monitoring des workflows n8n</p>
        </div>
      </div>

      {/* Sélection Client */}
      <Card>
        <CardHeader>
          <CardTitle>Client</CardTitle>
          <CardDescription>Sélectionnez une organisation approuvée</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un client..." />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedOrgId && (
        <>
          {/* Métriques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Exécutions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.total_runs || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Items traités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.total_items_processed || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Erreurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{metrics?.total_errors || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">€ économisés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{metrics?.estimated_roi || 0}€</div>
              </CardContent>
            </Card>
          </div>

          {/* Catalogue Templates */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Catalogue Templates</CardTitle>
                  <CardDescription>Sélectionnez les workflows à provisionner</CardDescription>
                </div>
                <Button onClick={handleProvisionClick} disabled={selectedTemplates.size === 0}>
                  Provisionner ({selectedTemplates.size})
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="start">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="start">Start ({templatesByLevel.start.length})</TabsTrigger>
                  <TabsTrigger value="pro">Pro ({templatesByLevel.pro.length})</TabsTrigger>
                  <TabsTrigger value="elite">Elite ({templatesByLevel.elite.length})</TabsTrigger>
                </TabsList>

                {(["start", "pro", "elite"] as const).map((level) => (
                  <TabsContent key={level} value={level} className="space-y-2">
                    {templatesByLevel[level].map((template) => {
                      const isSelected = selectedTemplates.has(template.id);
                      const isAlreadyProvisioned = clientWorkflows.some(
                        (w) => w.name.includes(template.name)
                      );

                      return (
                        <div
                          key={template.id}
                          className={`flex items-start justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                            isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                          } ${isAlreadyProvisioned ? "opacity-50" : ""}`}
                          onClick={() => !isAlreadyProvisioned && toggleTemplateSelection(template.id)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{template.name}</h4>
                              {isAlreadyProvisioned && (
                                <Badge variant="outline" className="text-xs">
                                  Déjà provisionné
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {template.category}
                              </Badge>
                              {template.required_credentials?.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {Array.isArray(template.required_credentials) ? template.required_credentials.length : 0} credentials requises
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isAlreadyProvisioned}
                              onChange={() => {}}
                              className="w-5 h-5"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Workflows du client */}
          <Card>
            <CardHeader>
              <CardTitle>Workflows du client</CardTitle>
              <CardDescription>{clientWorkflows.length} workflows provisionnés</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : clientWorkflows.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun workflow provisionné. Utilisez le catalogue ci-dessus pour en ajouter.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernier run</TableHead>
                      <TableHead>Erreurs 24h</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientWorkflows.map((workflow) => (
                      <TableRow key={workflow.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span>{workflow.name}</span>
                            {workflow.n8n_workflow_id && (
                              <a
                                href={`https://primary-production-bdba.up.railway.app/workflow/${workflow.n8n_workflow_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                                title="Voir dans n8n"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          {workflow.n8n_workflow_id && (
                            <p className="text-xs text-muted-foreground font-mono mt-1">
                              ID: {workflow.n8n_workflow_id}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={workflow.is_active ? "default" : "secondary"}>
                            {workflow.is_active ? "🟢 ON" : "🔴 OFF"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {workflow.last_run_at
                            ? new Date(workflow.last_run_at).toLocaleString("fr-FR")
                            : "Jamais"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {workflow.error_count_24h > 0 ? (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            )}
                            {workflow.error_count_24h}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleWorkflow(workflow.id, workflow.is_active)}
                            >
                              {workflow.is_active ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => testRun(workflow.id)}
                              title="Tester l'exécution du workflow"
                            >
                              <Play className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteWorkflow(workflow.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Sheet Variables & Credentials */}
      <Sheet open={showVariablesSheet} onOpenChange={setShowVariablesSheet}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Variables & Credentials</SheetTitle>
            <SheetDescription>
              Configurez les variables requises avant d'activer les workflows
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {Object.keys(variables).map((varName) => (
              <div key={varName} className="space-y-2">
                <Label htmlFor={varName}>{varName}</Label>
                <Input
                  id={varName}
                  value={variables[varName]}
                  onChange={(e) => setVariables({ ...variables, [varName]: e.target.value })}
                  placeholder={`Entrez ${varName}...`}
                  type={varName.toLowerCase().includes("password") ? "password" : "text"}
                />
              </div>
            ))}

            <div className="pt-4 flex gap-2">
              <Button
                onClick={handleProvision}
                disabled={isProvisioning || Object.values(variables).some((v) => !v)}
                className="flex-1"
              >
                {isProvisioning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Provisioning...
                  </>
                ) : (
                  "Provisionner & Activer"
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowVariablesSheet(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}


