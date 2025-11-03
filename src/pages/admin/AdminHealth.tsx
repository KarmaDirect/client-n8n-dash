import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/useAdmin";
import { Activity, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Database, Server, Zap } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface HealthStatus {
  supabase: "healthy" | "degraded" | "down";
  n8n: "healthy" | "degraded" | "down";
  workflows: {
    total: number;
    active: number;
    errors_24h: number;
  };
  clients: {
    total: number;
    with_errors: number;
  };
}

const AdminHealth = () => {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/app", { replace: true });
      return;
    }
    if (isAdmin) {
      checkHealth();
      const interval = setInterval(checkHealth, 30000); // Refresh toutes les 30s
      return () => clearInterval(interval);
    }
  }, [isAdmin, loading, navigate]);

  const checkHealth = async () => {
    setLoadingHealth(true);
    try {
      // Vérifier Supabase
      const { error: sbError } = await supabase.from("organizations").select("id").limit(1);
      const supabaseStatus = sbError ? "down" : "healthy";

      // Vérifier n8n (via Edge Function dédiée)
      let n8nStatus: "healthy" | "degraded" | "down" = "down";
      try {
        const { data: n8nHealthData, error: n8nError } = await supabase.functions.invoke("n8n-health-check");
        
        if (n8nError) {
          console.error("n8n health check error:", n8nError);
          n8nStatus = "down";
        } else if (n8nHealthData) {
          // L'Edge Function retourne { status: 'healthy' | 'degraded' | 'down', connected: boolean }
          if (n8nHealthData.status === 'healthy' && n8nHealthData.connected) {
            n8nStatus = "healthy";
          } else if (n8nHealthData.status === 'degraded') {
            n8nStatus = "degraded";
          } else {
            n8nStatus = "down";
          }
        }
      } catch (err) {
        console.error("n8n health check exception:", err);
        n8nStatus = "down";
      }

      // Stats workflows
      const { count: totalWorkflows } = await supabase
        .from("workflows")
        .select("*", { count: "exact", head: true });

      const { count: activeWorkflows } = await supabase
        .from("workflows")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      const { count: errorWorkflows } = await supabase
        .from("workflow_execution_logs")
        .select("*", { count: "exact", head: true })
        .eq("status", "error")
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Stats clients
      const { count: totalClients } = await supabase
        .from("organizations")
        .select("*", { count: "exact", head: true })
        .eq("approved", true);

      // Clients avec erreurs (simplifié - comptage des workflows avec erreurs)
      const { data: clientsWithErrors } = await supabase
        .from("workflow_execution_logs")
        .select("workflow_id")
        .eq("status", "error")
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const uniqueWorkflowIds = new Set(clientsWithErrors?.map((e) => e.workflow_id) || []);
      const { data: workflowsWithErrors } = await supabase
        .from("workflows")
        .select("org_id")
        .in("id", Array.from(uniqueWorkflowIds));

      const clientsWithErrorsSet = new Set(workflowsWithErrors?.map((w) => w.org_id) || []);

      setHealth({
        supabase: supabaseStatus,
        n8n: n8nStatus,
        workflows: {
          total: totalWorkflows || 0,
          active: activeWorkflows || 0,
          errors_24h: errorWorkflows || 0,
        },
        clients: {
          total: totalClients || 0,
          with_errors: clientsWithErrorsSet.size,
        },
      });

      setLastRefresh(new Date());
    } catch (error: any) {
      console.error("Error checking health:", error);
      toast.error("Erreur lors de la vérification de santé");
    } finally {
      setLoadingHealth(false);
    }
  };

  const getStatusBadge = (status: "healthy" | "degraded" | "down") => {
    switch (status) {
      case "healthy":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Opérationnel
          </Badge>
        );
      case "degraded":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Dégradé
          </Badge>
        );
      case "down":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Hors service
          </Badge>
        );
    }
  };

  if (loading || loadingHealth) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Vérification de la santé du système...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Santé Système</h1>
            <p className="text-muted-foreground">
              Statut de tous les services et santé globale
            </p>
          </div>
          <Button onClick={checkHealth} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {lastRefresh && (
          <p className="text-sm text-muted-foreground">
            Dernière actualisation : {lastRefresh.toLocaleTimeString("fr-FR")}
          </p>
        )}

        {/* Services */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Database className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Supabase</CardTitle>
                  <CardDescription>Base de données</CardDescription>
                </div>
              </div>
              {health && getStatusBadge(health.supabase)}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Connexion</span>
                  <span className="font-medium">
                    {health.supabase === "healthy" ? "✅ Connecté" : "❌ Erreur"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Server className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle>n8n</CardTitle>
                  <CardDescription>Moteur d'automatisation</CardDescription>
                </div>
              </div>
              {health && getStatusBadge(health.n8n)}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">API</span>
                  <span className="font-medium">
                    {health.n8n === "healthy" ? "✅ Accessible" : health.n8n === "degraded" ? "⚠️ Dégradé" : "❌ Erreur"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques globales */}
        {health && (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Workflows totaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{health.workflows.total}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {health.workflows.active} actifs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Erreurs 24h</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${health.workflows.errors_24h > 0 ? "text-red-600" : "text-green-600"}`}>
                    {health.workflows.errors_24h}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {health.workflows.errors_24h === 0 ? "✅ Aucune erreur" : "⚠️ Attention requise"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{health.clients.total}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tous approuvés
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Clients avec erreurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${health.clients.with_errors > 0 ? "text-orange-600" : "text-green-600"}`}>
                    {health.clients.with_errors}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sur 24 heures
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Vue d'ensemble */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Vue d'ensemble
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="font-medium">Statut global</span>
                    {health.supabase === "healthy" && health.n8n === "healthy" ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Tout opérationnel
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Service dégradé
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="font-medium">Taux de disponibilité</span>
                    <span className="font-bold text-lg">
                      {health.supabase === "healthy" && health.n8n === "healthy" ? "100%" : "Variable"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="font-medium">Taux d'erreur (24h)</span>
                    <span className={`font-bold text-lg ${health.workflows.errors_24h > 0 ? "text-red-600" : "text-green-600"}`}>
                      {health.workflows.total > 0
                        ? ((health.workflows.errors_24h / health.workflows.total) * 100).toFixed(2)
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminHealth;




