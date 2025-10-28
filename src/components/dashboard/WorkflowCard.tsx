import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Play,
  Pause,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Workflow {
  id: string;
  name: string;
  description: string;
  n8n_workflow_id: string;
  status: string;
  pack_level: string;
  config_params: Record<string, any>;
  credentials_status: Record<string, string>;
  is_active: boolean;
  last_execution_at: string | null;
  total_executions: number;
  template_id: string;
  workflow_templates?: {
    name: string;
    category: string;
    required_credentials: string[];
  };
}

interface WorkflowMetrics {
  executions_count: number;
  success_count: number;
  failed_count: number;
  time_saved_minutes: number;
  cost_incurred: number;
  money_saved: number;
  custom_metrics: Record<string, number>;
}

interface WorkflowCardProps {
  workflow: Workflow;
  metrics?: WorkflowMetrics;
  onRefresh: () => void;
}

export default function WorkflowCard({ workflow, metrics, onRefresh }: WorkflowCardProps) {
  const [configuring, setConfiguring] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [configParams, setConfigParams] = useState<Record<string, string>>(
    workflow.config_params || {}
  );
  const [credentials, setCredentials] = useState<Record<string, string>>({});

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

  const getStatusBadge = () => {
    if (workflow.status === "active") {
      return <Badge className="bg-green-500">Actif</Badge>;
    } else if (workflow.status === "pending_config") {
      return (
        <Badge className="bg-orange-500">
          <Settings className="w-3 h-3 mr-1" />
          Configuration requise
        </Badge>
      );
    } else {
      return <Badge variant="secondary">{workflow.status}</Badge>;
    }
  };

  const getCredentialsProgress = () => {
    const requiredCreds = workflow.workflow_templates?.required_credentials || [];
    if (requiredCreds.length === 0) return 100;

    const configuredCount = requiredCreds.filter(
      (cred) => workflow.credentials_status?.[cred] === "configured"
    ).length;

    return (configuredCount / requiredCreds.length) * 100;
  };

  const handleToggleActive = async () => {
    try {
      // Update in database
      const { error } = await supabase
        .from("workflows")
        .update({ is_active: !workflow.is_active })
        .eq("id", workflow.id);

      if (error) throw error;

      toast.success(
        !workflow.is_active ? "Workflow activé" : "Workflow désactivé"
      );
      onRefresh();
    } catch (error: any) {
      console.error("Error toggling workflow:", error);
      toast.error("Erreur lors de la modification");
    }
  };

  const handleSaveConfiguration = async () => {
    try {
      setConfiguring(true);

      // Call Edge Function to configure credentials
      const { data, error } = await supabase.functions.invoke(
        "configure-workflow-credentials",
        {
          body: {
            workflow_id: workflow.id,
            credentials: credentials,
            config_params: configParams,
            auto_activate: true,
          },
        }
      );

      if (error) throw error;

      toast.success("Configuration enregistrée !");
      onRefresh();
    } catch (error: any) {
      console.error("Error configuring workflow:", error);
      toast.error("Erreur lors de la configuration");
    } finally {
      setConfiguring(false);
    }
  };

  const successRate =
    metrics && metrics.executions_count > 0
      ? ((metrics.success_count / metrics.executions_count) * 100).toFixed(0)
      : "N/A";

  const credentialsProgress = getCredentialsProgress();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {getCategoryEmoji(workflow.workflow_templates?.category || "")}
                </span>
                <h3 className="text-lg font-bold">{workflow.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
              <div className="flex items-center gap-2">
                {getStatusBadge()}
                {workflow.is_active ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    ON
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50">
                    <Pause className="w-3 h-3 mr-1" />
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
          {workflow.status === "pending_config" && (
            <div className="space-y-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-orange-900">
                  Configuration requise
                </span>
                <span className="text-orange-700">
                  {credentialsProgress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-orange-500 transition-all"
                  style={{ width: `${credentialsProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Metrics Summary */}
          {metrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Play className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-600">Exécutions</span>
                </div>
                <p className="text-xl font-bold">{metrics.executions_count}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">Succès</span>
                </div>
                <p className="text-xl font-bold text-green-600">{successRate}%</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-gray-600">Temps</span>
                </div>
                <p className="text-xl font-bold text-purple-600">
                  {metrics.time_saved_minutes}min
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs text-gray-600">Économisé</span>
                </div>
                <p className="text-xl font-bold text-yellow-600">
                  {metrics.money_saved.toFixed(0)}€
                </p>
              </div>
            </div>
          )}

          {/* Last Execution */}
          {workflow.last_execution_at && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              Dernière exécution:{" "}
              {new Date(workflow.last_execution_at).toLocaleString()}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            {/* Configure Button */}
            {workflow.status === "pending_config" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" className="flex-1">
                    <Settings className="w-4 h-4 mr-1" />
                    Configurer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Configurer {workflow.name}</DialogTitle>
                    <DialogDescription>
                      Renseignez les credentials et paramètres pour activer ce workflow
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 max-h-96 overflow-y-auto p-4">
                    {/* Credentials */}
                    {workflow.workflow_templates?.required_credentials &&
                      workflow.workflow_templates.required_credentials.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-medium">Credentials requis</h4>
                          {workflow.workflow_templates.required_credentials.map((cred) => (
                            <div key={cred} className="space-y-2">
                              <Label>{cred}</Label>
                              <Input
                                type="password"
                                placeholder={`Entrer ${cred}...`}
                                value={credentials[cred] || ""}
                                onChange={(e) =>
                                  setCredentials({
                                    ...credentials,
                                    [cred]: e.target.value,
                                  })
                                }
                              />
                              {workflow.credentials_status?.[cred] === "configured" && (
                                <p className="text-xs text-green-600">✓ Déjà configuré</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Config Params */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Paramètres configurables</h4>
                      {Object.keys(workflow.config_params || {}).map((key) => (
                        <div key={key} className="space-y-2">
                          <Label>{key}</Label>
                          <Textarea
                            placeholder={`Entrer ${key}...`}
                            value={configParams[key] || ""}
                            onChange={(e) =>
                              setConfigParams({
                                ...configParams,
                                [key]: e.target.value,
                              })
                            }
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={handleSaveConfiguration}
                      disabled={configuring}
                    >
                      {configuring ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        "Enregistrer et activer"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Toggle Active */}
            {workflow.status === "active" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleActive}
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
            )}

            {/* Metrics Dialog */}
            <Dialog open={showMetrics} onOpenChange={setShowMetrics}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Métriques détaillées - {workflow.name}</DialogTitle>
                  <DialogDescription>
                    Statistiques et performances de ce workflow
                  </DialogDescription>
                </DialogHeader>
                {metrics ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-sm text-gray-600 mb-1">Total exécutions</p>
                          <p className="text-3xl font-bold">{metrics.executions_count}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-sm text-gray-600 mb-1">Taux de succès</p>
                          <p className="text-3xl font-bold text-green-600">
                            {successRate}%
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-sm text-gray-600 mb-1">Temps économisé</p>
                          <p className="text-3xl font-bold text-purple-600">
                            {metrics.time_saved_minutes} min
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-sm text-gray-600 mb-1">Argent économisé</p>
                          <p className="text-3xl font-bold text-yellow-600">
                            {metrics.money_saved.toFixed(2)} €
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Custom Metrics */}
                    {metrics.custom_metrics &&
                      Object.keys(metrics.custom_metrics).length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3">Métriques personnalisées</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(metrics.custom_metrics).map(([key, value]) => (
                              <Card key={key} className="bg-blue-50">
                                <CardContent className="pt-4">
                                  <p className="text-sm text-gray-700 mb-1">{key}</p>
                                  <p className="text-2xl font-bold text-blue-600">{value}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Cost/Success Details */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Succès</p>
                        <p className="text-lg font-bold text-green-600">
                          {metrics.success_count}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Échecs</p>
                        <p className="text-lg font-bold text-red-600">
                          {metrics.failed_count}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Coût total</p>
                        <p className="text-lg font-bold">
                          {metrics.cost_incurred.toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune métrique disponible pour ce workflow</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

