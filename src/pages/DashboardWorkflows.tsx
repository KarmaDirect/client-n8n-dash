import { motion } from "motion/react";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { CardPremium, CardContent, CardHeader, CardTitle } from "@/components/ui/card-premium";
import { ButtonPremium } from "@/components/ui/button-premium";
import { 
  Bot, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  BarChart3, 
  Clock,
  Zap,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardWorkflowsProps {}

export function DashboardWorkflows({}: DashboardWorkflowsProps) {
  // Mock data - à remplacer par vos vraies données
  const workflows = [
    {
      id: 1,
      name: "Support Client Automatique",
      description: "Répond automatiquement aux questions fréquentes des clients",
      status: "active",
      lastRun: "2 min",
      runsToday: 45,
      efficiency: 92
    },
    {
      id: 2,
      name: "Génération de Leads",
      description: "Qualifie et suit automatiquement les prospects",
      status: "paused",
      lastRun: "1h",
      runsToday: 23,
      efficiency: 87
    },
    {
      id: 3,
      name: "Rapports Quotidiens",
      description: "Génère et envoie les rapports de performance",
      status: "active",
      lastRun: "5 min",
      runsToday: 12,
      efficiency: 95
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "paused":
        return "bg-yellow-100 text-yellow-700";
      case "error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="w-4 h-4" />;
      case "paused":
        return <Pause className="w-4 h-4" />;
      case "error":
        return <Settings className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-16">
        <div className="container mx-auto px-4 py-fluid-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-fluid-2xl"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h1 className="text-fluid-3xl sm:text-fluid-4xl font-display font-bold text-foreground mb-fluid-md">
                  Mes Workflows
                </h1>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl">
                  Gérez et surveillez vos agents IA automatisés
                </p>
              </div>
              
              <ButtonPremium size="lg" className="group">
                <Plus className="mr-2 w-5 h-5" />
                Nouveau Workflow
              </ButtonPremium>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-fluid-xl"
          >
            {[
              { label: "Workflows Actifs", value: "3", icon: Bot, color: "text-blue-600", bg: "bg-blue-100" },
              { label: "Exécutions Aujourd'hui", value: "80", icon: Play, color: "text-green-600", bg: "bg-green-100" },
              { label: "Efficacité Moyenne", value: "91%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
              { label: "Temps Économisé", value: "12h", icon: Zap, color: "text-orange-600", bg: "bg-orange-100" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Workflows List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-fluid-xl font-display font-semibold text-foreground">
              Workflows Récents
            </h2>
            
            <div className="grid gap-6">
              {workflows.map((workflow, index) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <CardPremium className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        {/* Workflow Info */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                              <Bot className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-foreground mb-1">
                                {workflow.name}
                              </h3>
                              <p className="text-muted-foreground mb-3">
                                {workflow.description}
                              </p>
                              
                              {/* Status Badge */}
                              <div className="flex items-center gap-3">
                                <span className={cn(
                                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                                  getStatusColor(workflow.status)
                                )}>
                                  {getStatusIcon(workflow.status)}
                                  {workflow.status === "active" ? "Actif" : 
                                   workflow.status === "paused" ? "En pause" : "Erreur"}
                                </span>
                                
                                <span className="text-sm text-muted-foreground">
                                  Dernière exécution: {workflow.lastRun}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Metrics & Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {/* Metrics */}
                          <div className="flex items-center gap-6 text-center">
                            <div>
                              <p className="text-2xl font-bold text-foreground">{workflow.runsToday}</p>
                              <p className="text-xs text-muted-foreground">Exécutions</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-foreground">{workflow.efficiency}%</p>
                              <p className="text-xs text-muted-foreground">Efficacité</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {workflow.status === "active" ? (
                              <ButtonPremium
                                variant="outline"
                                size="sm"
                                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                              >
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </ButtonPremium>
                            ) : (
                              <ButtonPremium
                                size="sm"
                                className="text-green-600 bg-green-50 hover:bg-green-100"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Démarrer
                              </ButtonPremium>
                            )}
                            
                            <ButtonPremium
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Settings className="w-4 h-4" />
                            </ButtonPremium>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CardPremium>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Empty State (if no workflows) */}
          {workflows.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center py-fluid-3xl"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Aucun workflow créé
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Commencez par créer votre premier workflow pour automatiser vos tâches répétitives.
              </p>
              <ButtonPremium size="lg">
                <Plus className="mr-2 w-5 h-5" />
                Créer mon premier workflow
              </ButtonPremium>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}

export default DashboardWorkflows;

