import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, Target, DollarSign, DollarSign as SavingsIcon, Zap, Activity, AlertCircle, CheckCircle2, TrendingDown, Users, BarChart3, Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";
import * as RechartsPrimitive from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DashboardLayout } from "@/components/DashboardLayout";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    
    // Vérifier le statut d'approbation
    supabase
      .from("organizations")
      .select("id, approved")
      .eq("owner_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error checking approval status:", error);
          return;
        }
        if (data && !data.approved) {
          navigate("/pending-approval", { replace: true });
        }
      });
  }, [user, navigate]);

  useEffect(() => {
    if (!user) { setIsSubscribed(null); return; }
    supabase
      .from('subscribers')
      .select('subscribed')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('Subscription fetch error', error);
          setIsSubscribed(null);
        } else {
          setIsSubscribed(Boolean(data?.subscribed));
        }
      });
  }, [user]);

  // Données de performance
  const kpiData = [
    { month: "Jan", leads: 22, revenue: 1100, saved: 800 },
    { month: "Fév", leads: 28, revenue: 1450, saved: 950 },
    { month: "Mar", leads: 31, revenue: 1580, saved: 1100 },
    { month: "Avr", leads: 35, revenue: 1710, saved: 1250 },
    { month: "Mai", leads: 38, revenue: 1900, saved: 1400 },
    { month: "Juin", leads: 42, revenue: 2050, saved: 1550 },
  ];

  // Métriques calculées
  const totalRevenue = 9700; // € dépensés
  const totalSaved = 7050; // € économisés
  const timeSaved = 312; // heures économisées
  const roi = Math.round(((totalSaved / totalRevenue) * 100) * 100) / 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Vue d'ensemble
          </h1>
          <p className="text-muted-foreground">
            Aperçu financier et performances de vos automations
          </p>
        </div>

        {/* Métriques principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Dépenses */}
          <Card className="dashboard-card group hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total dépensé</CardTitle>
              <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                <DollarSign className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-1">{totalRevenue.toLocaleString()}€</div>
              <div className="flex items-center gap-2 mt-2">
                <ArrowDownRight className="w-3 h-3 text-red-500" />
                <p className="text-xs text-muted-foreground">Sur 6 mois</p>
              </div>
            </CardContent>
          </Card>

          {/* Économies */}
          <Card className="dashboard-card group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Économies réalisées</CardTitle>
              <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                <SavingsIcon className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-1">{totalSaved.toLocaleString()}€</div>
              <div className="flex items-center gap-2 mt-2">
                <ArrowUpRight className="w-3 h-3 text-green-500" />
                <p className="text-xs text-green-600 font-medium">+72.7% vs dépenses</p>
              </div>
            </CardContent>
          </Card>

          {/* Temps gagné */}
          <Card className="dashboard-card group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps gagné</CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-1">{timeSaved}h</div>
              <div className="flex items-center gap-2 mt-2">
                <Zap className="w-3 h-3 text-blue-500" />
                <p className="text-xs text-muted-foreground">~52h par mois</p>
              </div>
            </CardContent>
          </Card>

          {/* ROI */}
          <Card className="dashboard-card group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI</CardTitle>
              <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-1">+{roi}%</div>
              <div className="flex items-center gap-2 mt-2">
                <Sparkles className="w-3 h-3 text-purple-500" />
                <p className="text-xs text-muted-foreground">Retour sur investissement</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques - Fix débordement */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Graphique Dépenses vs Économies */}
          <Card className="dashboard-card overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Dépenses vs Économies</CardTitle>
                  <CardDescription className="text-xs">Évolution sur 6 mois (€)</CardDescription>
                </div>
                <Badge variant="outline" className="gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  +23%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="w-full overflow-hidden">
                <ChartContainer
                  config={{
                    revenue: { label: "Dépenses", color: "hsl(0, 84%, 60%)" },
                    saved: { label: "Économies", color: "hsl(142, 76%, 36%)" },
                  }}
                  className="h-[280px] w-full"
                >
                  <RechartsPrimitive.LineChart data={kpiData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <RechartsPrimitive.XAxis 
                      dataKey="month" 
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <RechartsPrimitive.YAxis 
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <RechartsPrimitive.Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(0, 84%, 60%)" 
                      strokeWidth={2.5} 
                      dot={{ fill: "hsl(0, 84%, 60%)", r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Dépenses"
                    />
                    <RechartsPrimitive.Line 
                      type="monotone" 
                      dataKey="saved" 
                      stroke="hsl(142, 76%, 36%)" 
                      strokeWidth={2.5} 
                      dot={{ fill: "hsl(142, 76%, 36%)", r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Économies"
                    />
                  </RechartsPrimitive.LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Graphique Leads */}
          <Card className="dashboard-card overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Leads générés</CardTitle>
                  <CardDescription className="text-xs">Croissance mensuelle</CardDescription>
                </div>
                <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20">
                  <Target className="w-3 h-3" />
                  42 ce mois
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="w-full overflow-hidden">
                <ChartContainer
                  config={{
                    leads: { label: "Leads", color: "hsl(var(--primary))" },
                  }}
                  className="h-[280px] w-full"
                >
                  <RechartsPrimitive.AreaChart data={kpiData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <RechartsPrimitive.XAxis 
                      dataKey="month" 
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <RechartsPrimitive.YAxis 
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <RechartsPrimitive.Area 
                      type="monotone" 
                      dataKey="leads" 
                      stroke="hsl(var(--primary))" 
                      fill="url(#leadsGradient)" 
                      strokeWidth={2.5}
                    />
                  </RechartsPrimitive.AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Widgets supplémentaires */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Efficacité des automations */}
          <Card className="dashboard-card border-l-4 border-l-blue-500/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Efficacité</CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Performance globale</span>
                  <span className="text-sm font-semibold text-blue-600">91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Automations actives</span>
                  <span className="text-sm font-semibold text-green-600">8/10</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>Tout fonctionne correctement</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques rapides */}
          <Card className="dashboard-card border-l-4 border-l-purple-500/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Activité ce mois</CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Exécutions</span>
                </div>
                <span className="text-lg font-bold text-foreground">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-muted-foreground">Succès</span>
                </div>
                <span className="text-lg font-bold text-green-600">98.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-muted-foreground">En attente</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">3</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-600 font-medium">+15% vs mois dernier</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Objectifs */}
          <Card className="dashboard-card border-l-4 border-l-orange-500/50 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Objectifs mensuels</CardTitle>
                <Target className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Leads générés</span>
                  <span className="text-sm font-semibold">42/50</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Économies</span>
                  <span className="text-sm font-semibold">1,550€/2,000€</span>
                </div>
                <Progress value={77.5} className="h-2" />
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-orange-500" />
                  <span>À 80% de vos objectifs</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Résumé mensuel amélioré */}
        <Card className="dashboard-card bg-gradient-to-br from-card via-card to-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Résumé mensuel - Juin 2025</CardTitle>
                <CardDescription>Détails financiers et performances du mois en cours</CardDescription>
              </div>
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Excellent
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-red-500" />
                  <div className="text-sm text-muted-foreground">Dépenses</div>
                </div>
                <div className="text-3xl font-bold text-red-600">2 050€</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowDownRight className="w-3 h-3" />
                  <span>-5% vs mai</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <SavingsIcon className="h-4 w-4 text-green-500" />
                  <div className="text-sm text-muted-foreground">Économies</div>
                </div>
                <div className="text-3xl font-bold text-green-600">1 550€</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+12% vs mai</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div className="text-sm text-muted-foreground">Temps gagné</div>
                </div>
                <div className="text-3xl font-bold text-blue-600">52h</div>
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+8% vs mai</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <div className="text-sm text-muted-foreground">ROI mensuel</div>
                </div>
                <div className="text-3xl font-bold text-purple-600">+75.6%</div>
                <div className="flex items-center gap-1 text-xs text-purple-600">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+3.2% vs mai</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Graphique ROI Evolution */}
        <Card className="dashboard-card overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Évolution du ROI</CardTitle>
                <CardDescription className="text-xs">Tendance du retour sur investissement</CardDescription>
              </div>
              <Badge variant="outline" className="gap-1 bg-purple-500/10 text-purple-600 border-purple-500/20">
                <TrendingUp className="w-3 h-3" />
                En hausse
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="w-full overflow-hidden">
              <ChartContainer
                config={{
                  roi: { label: "ROI (%)", color: "hsl(270, 70%, 50%)" },
                }}
                className="h-[250px] w-full"
              >
                <RechartsPrimitive.AreaChart data={kpiData.map((d, i) => ({ 
                  month: d.month, 
                  roi: Math.round(((d.saved / d.revenue) * 100) * 10) / 10 
                }))} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(270, 70%, 50%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(270, 70%, 50%)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <RechartsPrimitive.XAxis 
                    dataKey="month" 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <RechartsPrimitive.YAxis 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <RechartsPrimitive.Area 
                    type="monotone" 
                    dataKey="roi" 
                    stroke="hsl(270, 70%, 50%)" 
                    fill="url(#roiGradient)" 
                    strokeWidth={2.5}
                  />
                </RechartsPrimitive.AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
