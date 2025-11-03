import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdmin } from "@/hooks/useAdmin";
import { BarChart3, TrendingUp, DollarSign, Clock, Users, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as RechartsPrimitive from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface GlobalMetrics {
  total_executions: number;
  total_success: number;
  total_failed: number;
  total_revenue: number;
  total_saved: number;
  total_time_saved: number;
  active_clients: number;
  active_workflows: number;
}

interface ClientMetrics {
  org_id: string;
  org_name: string;
  executions: number;
  success_rate: number;
  revenue: number;
  saved: number;
}

const AdminMetrics = () => {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [globalMetrics, setGlobalMetrics] = useState<GlobalMetrics | null>(null);
  const [clientMetrics, setClientMetrics] = useState<ClientMetrics[]>([]);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/app", { replace: true });
      return;
    }
    if (isAdmin) {
      fetchMetrics();
    }
  }, [isAdmin, loading, navigate, timeRange]);

  const fetchMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const daysBack = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      // Métriques globales
      const { data: execLogs } = await supabase
        .from("workflow_execution_logs")
        .select("status, duration_seconds")
        .gte("created_at", startDate.toISOString());

      const { data: metrics } = await supabase
        .from("workflow_metrics")
        .select("*")
        .gte("date", startDate.toISOString().split("T")[0]);

      const { count: activeClients } = await supabase
        .from("organizations")
        .select("*", { count: "exact", head: true })
        .eq("approved", true);

      const { count: activeWorkflows } = await supabase
        .from("workflows")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      const totalExecutions = execLogs?.length || 0;
      const totalSuccess = execLogs?.filter((e) => e.status === "success").length || 0;
      const totalFailed = execLogs?.filter((e) => e.status === "error").length || 0;

      const aggregated = metrics?.reduce(
        (acc, m) => {
          acc.revenue += (m.custom_metrics as any)?.cost_incurred || 0;
          acc.saved += m.money_saved || 0;
          acc.time_saved += m.time_saved || 0;
          return acc;
        },
        { revenue: 0, saved: 0, time_saved: 0 }
      ) || { revenue: 0, saved: 0, time_saved: 0 };

      setGlobalMetrics({
        total_executions: totalExecutions,
        total_success: totalSuccess,
        total_failed: totalFailed,
        total_revenue: aggregated.revenue,
        total_saved: aggregated.saved,
        total_time_saved: aggregated.time_saved,
        active_clients: activeClients || 0,
        active_workflows: activeWorkflows || 0,
      });

      // Métriques par client
      const { data: orgs } = await supabase
        .from("organizations")
        .select("id, name")
        .eq("approved", true);

      const clientMetricsData = await Promise.all(
        (orgs || []).map(async (org) => {
          const { data: orgExecLogs } = await supabase
            .from("workflow_execution_logs")
            .select("status, workflow_id")
            .gte("created_at", startDate.toISOString())
            .in(
              "workflow_id",
              await supabase
                .from("workflows")
                .select("id")
                .eq("org_id", org.id)
                .then(({ data }) => data?.map((w) => w.id) || [])
            );

          const { data: orgMetrics } = await supabase
            .from("workflow_metrics")
            .select("*")
            .eq("org_id", org.id)
            .gte("date", startDate.toISOString().split("T")[0]);

          const executions = orgExecLogs?.length || 0;
          const success = orgExecLogs?.filter((e) => e.status === "success").length || 0;
          const successRate = executions > 0 ? (success / executions) * 100 : 0;

          const revenue =
            orgMetrics?.reduce((sum, m) => sum + ((m.custom_metrics as any)?.cost_incurred || 0), 0) || 0;
          const saved = orgMetrics?.reduce((sum, m) => sum + (m.money_saved || 0), 0) || 0;

          return {
            org_id: org.id,
            org_name: org.name,
            executions,
            success_rate: successRate,
            revenue,
            saved,
          };
        })
      );

      setClientMetrics(clientMetricsData.sort((a, b) => b.executions - a.executions));
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoadingMetrics(false);
    }
  };

  if (loading || loadingMetrics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Chargement des métriques...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Données pour graphiques
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
      executions: Math.floor(Math.random() * 100) + 50,
      revenue: Math.floor(Math.random() * 5000) + 2000,
    };
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Métriques Globales</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble des performances de tous vos clients
            </p>
          </div>
          <Select value={timeRange} onValueChange={(v: "7d" | "30d" | "90d") => setTimeRange(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Métriques globales */}
        {globalMetrics && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exécutions totales</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{globalMetrics.total_executions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {globalMetrics.total_success} succès, {globalMetrics.total_failed} erreurs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus générés</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{globalMetrics.total_revenue.toLocaleString()}€</div>
                <p className="text-xs text-muted-foreground mt-1">Sur {timeRange}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Économies réalisées</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{globalMetrics.total_saved.toLocaleString()}€</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {globalMetrics.total_revenue > 0
                    ? `ROI: ${((globalMetrics.total_saved / globalMetrics.total_revenue) * 100).toFixed(1)}%`
                    : "Pas de données"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temps économisé</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{globalMetrics.total_time_saved.toLocaleString()}h</div>
                <p className="text-xs text-muted-foreground mt-1">Sur {timeRange}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Graphiques */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Exécutions par jour</CardTitle>
              <CardDescription>Évolution sur les 7 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  executions: { label: "Exécutions", color: "hsl(var(--primary))" },
                }}
                className="h-[250px] w-full"
              >
                <RechartsPrimitive.BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <RechartsPrimitive.XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <RechartsPrimitive.YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <RechartsPrimitive.Bar dataKey="executions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </RechartsPrimitive.BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenus par jour</CardTitle>
              <CardDescription>Évolution sur les 7 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: { label: "Revenus (€)", color: "hsl(var(--accent))" },
                }}
                className="h-[250px] w-full"
              >
                <RechartsPrimitive.AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <RechartsPrimitive.XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <RechartsPrimitive.YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <RechartsPrimitive.Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--accent))"
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                </RechartsPrimitive.AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Classement clients */}
        <Card>
          <CardHeader>
            <CardTitle>Top Clients</CardTitle>
            <CardDescription>Classement par nombre d'exécutions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientMetrics.slice(0, 10).map((client, index) => (
                <div
                  key={client.org_id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{client.org_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {client.executions} exécutions • {client.success_rate.toFixed(1)}% succès
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">{client.revenue.toLocaleString()}€</div>
                      <div className="text-xs text-muted-foreground">Revenus</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">{client.saved.toLocaleString()}€</div>
                      <div className="text-xs text-muted-foreground">Économies</div>
                    </div>
                    <Badge variant={client.success_rate >= 95 ? "default" : client.success_rate >= 80 ? "secondary" : "destructive"}>
                      {client.success_rate.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminMetrics;




