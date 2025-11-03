import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/useAdmin";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, Play, Pause, Trash2, CheckCircle2, AlertCircle, ExternalLink, Rocket, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Réutiliser les interfaces de AdminWorkflows
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
  status: string; // ✅ Ajouter le champ status
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

export default function AdminWorkflowsPage() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedOrgParam = searchParams.get("org");
  
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>(selectedOrgParam || "");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [clientWorkflows, setClientWorkflows] = useState<ClientWorkflow[]>([]);
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [showVariablesSheet, setShowVariablesSheet] = useState(false);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/app", { replace: true });
      return;
    }
    if (isAdmin) {
      loadOrganizations();
      loadTemplates();
    }
  }, [isAdmin, adminLoading, navigate]);

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
      
      // Si un org est passé en paramètre, le sélectionner
      if (selectedOrgParam && data?.some(o => o.id === selectedOrgParam)) {
        setSelectedOrgId(selectedOrgParam);
      }
    } catch (error: any) {
      toast.error(`Impossible de charger les organisations: ${error.message}`);
    }
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("workflow_templates")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast.error(`Impossible de charger les templates: ${error.message}`);
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
      toast.error(`Impossible de charger les workflows: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async (orgId: string) => {
    try {
      const { data: metricsData } = await supabase
        .from("workflow_metrics")
        .select("executions_count, success_count, failed_count, custom_metrics")
        .eq("org_id", orgId);

      const aggregated = metricsData?.reduce((acc, m) => {
        acc.total_runs += m.executions_count || 0;
        acc.total_items_processed += (m.custom_metrics as any)?.itemsProcessed || 0;
        acc.total_errors += m.failed_count || 0;
        return acc;
      }, { total_runs: 0, total_items_processed: 0, total_errors: 0, estimated_roi: 0 });

      setMetrics(aggregated || { total_runs: 0, total_items_processed: 0, total_errors: 0, estimated_roi: 0 });
    } catch (error) {
      console.error("Error loading metrics:", error);
    }
  };

  const handleProvision = async () => {
    if (!selectedOrgId || selectedTemplates.size === 0) {
      toast.error("Veuillez sélectionner au moins un template");
      return;
    }

    setIsProvisioning(true);
    try {
      console.log("Provisioning templates:", Array.from(selectedTemplates));
      console.log("Organization ID:", selectedOrgId);
      console.log("Variables:", variables);

      const { data, error } = await supabase.functions.invoke("manage-client-workflows", {
        body: {
          action: "provision",
          organization_id: selectedOrgId,
          template_ids: Array.from(selectedTemplates),
          variables,
        },
      });

      if (error) {
        console.error("Edge Function error:", error);
        throw error;
      }

      console.log("Provisioning response:", data);

      if (data.errors && data.errors.length > 0) {
        console.error("Provisioning errors:", data.errors);
        data.errors.forEach((err: any) => {
          toast.error(`Erreur ${err.template_name}: ${err.error}`);
        });
      }

      if (data.copied === 0 && data.errors) {
        toast.error(`Échec: ${data.errors.length} erreur(s). Vérifiez les logs.`);
      } else {
        toast.success(`${data.copied} workflows copiés, ${data.enabled} activés`);
      }

      setShowVariablesSheet(false);
      setSelectedTemplates(new Set());
      loadClientWorkflows(selectedOrgId);
      loadMetrics(selectedOrgId);
    } catch (error: any) {
      console.error("Provisioning exception:", error);
      toast.error(`Erreur provisioning: ${error.message || JSON.stringify(error)}`);
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

      toast.success(`Workflow ${currentState ? "désactivé" : "activé"}`);
      loadClientWorkflows(selectedOrgId);
    } catch (error: any) {
      toast.error(error.message);
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

      toast.success("Workflow supprimé");
      loadClientWorkflows(selectedOrgId);
      loadMetrics(selectedOrgId);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const validateWorkflow = async (workflowId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("manage-client-workflows", {
        body: {
          action: "validate",
          workflow_id: workflowId,
        },
      });

      if (error) throw error;

      toast.success(`Workflow validé et activé avec succès !`);
      loadClientWorkflows(selectedOrgId);
      loadMetrics(selectedOrgId);
    } catch (error: any) {
      toast.error(error.message || "Impossible de valider le workflow");
    }
  };

  const testRun = async (workflowId: string) => {
    try {
      toast.info("Test run lancé...");

      const { data, error } = await supabase.functions.invoke("manage-client-workflows", {
        body: {
          action: "trigger",
          workflow_id: workflowId,
          variables: {
            test_mode: "true",
            triggered_by: "admin_ui",
          },
        },
      });

      if (error) throw error;

      toast.success(`Workflow déclenché - Execution ID: ${data.execution_id || "N/A"}`);

      setTimeout(() => {
        if (selectedOrgId) {
          loadClientWorkflows(selectedOrgId);
          loadMetrics(selectedOrgId);
        }
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Impossible de déclencher le workflow");
    }
  };

  const templatesByLevel = {
    start: templates.filter((t) => t.pack_level === "start"),
    pro: templates.filter((t) => t.pack_level === "pro"),
    elite: templates.filter((t) => t.pack_level === "elite"),
  };

  if (adminLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Workflows Multi-tenant</h1>
          <p className="text-muted-foreground">
            Provisionnement et gestion des workflows pour tous vos clients
          </p>
        </div>

        {/* Sélection Client */}
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
            <CardDescription>Sélectionnez une organisation pour gérer ses workflows</CardDescription>
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
            {metrics && (
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Exécutions totales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.total_runs}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Items traités</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.total_items_processed}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Erreurs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{metrics.total_errors}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">ROI estimé</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">+{metrics.estimated_roi}%</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Catalogue Templates */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Provisionner des workflows</CardTitle>
                    <CardDescription>
                      Sélectionnez les templates à provisionner pour {selectedOrg?.name}
                    </CardDescription>
                  </div>
                  {selectedTemplates.size > 0 && (
                    <Button
                      onClick={() => setShowVariablesSheet(true)}
                      disabled={isProvisioning}
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Provisionner ({selectedTemplates.size})
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="start">
                  <TabsList>
                    <TabsTrigger value="start">Start ({templatesByLevel.start.length})</TabsTrigger>
                    <TabsTrigger value="pro">Pro ({templatesByLevel.pro.length})</TabsTrigger>
                    <TabsTrigger value="elite">Elite ({templatesByLevel.elite.length})</TabsTrigger>
                  </TabsList>
                  {(["start", "pro", "elite"] as const).map((level) => (
                    <TabsContent key={level} value={level} className="space-y-2 mt-4">
                      {templatesByLevel[level].map((template) => {
                        const isSelected = selectedTemplates.has(template.id);
                        const isAlreadyProvisioned = clientWorkflows.some(
                          (w) => w.name.includes(template.name)
                        );

                        return (
                          <div
                            key={template.id}
                            className={`flex items-center justify-between p-4 rounded-lg border ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:bg-muted/50"
                            } ${isAlreadyProvisioned ? "opacity-50" : ""}`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{template.name}</h4>
                                {isAlreadyProvisioned && (
                                  <Badge variant="secondary" className="text-xs">
                                    Déjà provisionné
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={isAlreadyProvisioned}
                                onChange={() => {
                                  if (isAlreadyProvisioned) return;
                                  const newSet = new Set(selectedTemplates);
                                  if (isSelected) {
                                    newSet.delete(template.id);
                                  } else {
                                    newSet.add(template.id);
                                  }
                                  setSelectedTemplates(newSet);
                                }}
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
                <CardTitle>Workflows de {selectedOrg?.name}</CardTitle>
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
                            {workflow.status === 'pending_validation' ? (
                              <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                                🟠 En attente validation
                              </Badge>
                            ) : (
                              <Badge variant={workflow.is_active ? "default" : "secondary"}>
                                {workflow.is_active ? "🟢 ON" : "🔴 OFF"}
                              </Badge>
                            )}
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
                              {workflow.status === 'pending_validation' ? (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => validateWorkflow(workflow.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                  title="Valider le workflow (tech a terminé la config)"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Valider
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => toggleWorkflow(workflow.id, workflow.is_active)}
                                    title={workflow.is_active ? "Désactiver" : "Activer"}
                                  >
                                    {workflow.is_active ? (
                                      <Pause className="w-4 h-4" />
                                    ) : (
                                      <Play className="w-4 h-4" />
                                    )}
                                  </Button>
                                  {workflow.is_active && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => testRun(workflow.id)}
                                      title="Tester l'exécution du workflow"
                                    >
                                      <Play className="w-4 h-4 text-blue-600" />
                                    </Button>
                                  )}
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteWorkflow(workflow.id)}
                                title="Supprimer"
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

        {/* Sheet Variables */}
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
                      Provisionning...
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
    </DashboardLayout>
  );
}

