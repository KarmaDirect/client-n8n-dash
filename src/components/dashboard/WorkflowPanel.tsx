import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Rocket, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import WorkflowCard from "./WorkflowCard";

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
  workflow_id: string;
  executions_count: number;
  success_count: number;
  failed_count: number;
  time_saved_minutes: number;
  cost_incurred: number;
  money_saved: number;
  custom_metrics: Record<string, number>;
}

const WorkflowPanel = ({ orgId }: { orgId: string }) => {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [metricsMap, setMetricsMap] = useState<Map<string, WorkflowMetrics>>(new Map());
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (orgId) {
      fetchData();
    }
  }, [orgId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch workflows with templates
      const { data: workflowsData, error: workflowsError } = await supabase
        .from("workflows")
        .select(`
          *,
          workflow_templates (
            name,
            category,
            required_credentials
          )
        `)
        .eq("org_id", orgId)
        .order("created_at", { ascending: false });

      if (workflowsError) throw workflowsError;

      setWorkflows(workflowsData || []);

      // Fetch today's metrics for each workflow
      if (workflowsData && workflowsData.length > 0) {
        const today = new Date().toISOString().split("T")[0];

        const { data: metricsData, error: metricsError } = await supabase
          .from("workflow_metrics")
          .select("*")
          .eq("org_id", orgId)
          .eq("date", today);

        if (metricsError) throw metricsError;

        // Create metrics map
        const newMetricsMap = new Map<string, WorkflowMetrics>();
        metricsData?.forEach((metric) => {
          newMetricsMap.set(metric.workflow_id, metric);
        });

        setMetricsMap(newMetricsMap);
      }
    } catch (error: any) {
      console.error("Error fetching workflows:", error);
      toast.error("Erreur lors du chargement des workflows");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-2 h-2 rounded-full bg-primary/60"></div>
            <Rocket className="h-5 w-5" />
            Mes Workflows IA
          </CardTitle>
          <CardDescription>
            Gérez vos automatisations intelligentes et consultez leurs performances
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workflows.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">Aucun workflow disponible</p>
              <p className="text-sm">
                Contactez votre administrateur pour configurer vos premières
                automations
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  metrics={metricsMap.get(workflow.id)}
                  onRefresh={fetchData}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Global Summary Card */}
      {workflows.length > 0 && (
        <Card className="dashboard-card bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/60"></div>
              Résumé global
            </CardTitle>
            <CardDescription>
              Performance globale de tous vos workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{workflows.length}</p>
                <p className="text-sm text-gray-600">Workflows actifs</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {workflows.filter((w) => w.is_active).length}
                </p>
                <p className="text-sm text-gray-600">En service</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {workflows.filter((w) => w.status === "pending_config").length}
                </p>
                <p className="text-sm text-gray-600">À configurer</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {Array.from(metricsMap.values()).reduce(
                    (sum, m) => sum + m.executions_count,
                    0
                  )}
                </p>
                <p className="text-sm text-gray-600">Exécutions totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowPanel;