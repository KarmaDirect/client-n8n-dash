import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ButtonPremium } from "@/components/ui/button-premium";
import { CardPremium, CardContent as CardContentPremium, CardHeader as CardHeaderPremium, CardTitle as CardTitlePremium } from "@/components/ui/card-premium";

import { toast } from "sonner";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";
import { AutomationSection } from "@/components/dashboard/AutomationSection";
import { SupportSection } from "@/components/dashboard/SupportSection";
import WorkflowPanel from "@/components/dashboard/WorkflowPanel";
import { ArrowLeft, Check, Star, Zap, Crown, CreditCard, Calendar, Users, Shield, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Workflow { id: string; name: string; n8n_workflow_id: string | null; is_active: boolean; description?: string | null }
interface Run { id: string; workflow_id: string; status: string; started_at: string; finished_at: string | null; }

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orgId, setOrgId] = useState<string | undefined>(undefined);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [impersonationMode, setImpersonationMode] = useState<any>(null);
  const runsRef = useRef<Run[]>([]);
  const [, forceTick] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [pricingLoading, setPricingLoading] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  
  document.title = "Dashboard — n8n Client Hub";

  const checkApprovalStatus = async () => {
    if (!user) return;
    
    try {
      // Vérifier si l'utilisateur est admin (les admins bypassent la vérification)
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      
      if (roleData) {
        console.log("User is admin, bypassing approval check");
        return; // Admin bypass
      }
      
      // Vérifier le statut d'approbation de l'organisation
      const { data: org, error } = await supabase
        .from("organizations")
        .select("id, approved")
        .eq("owner_id", user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking approval status:", error);
        return;
      }
      
      if (org && !org.approved) {
        console.log("Organization not approved, redirecting to pending page");
        navigate("/pending-approval", { replace: true });
      }
    } catch (error) {
      console.error("Error in checkApprovalStatus:", error);
    }
  };

  useEffect(() => {
    console.log('Dashboard: Initial effect, checking impersonation mode...');
    // Vérifier si on est en mode impersonation (admin connecté dans un compte client)
    const impersonationData = localStorage.getItem("admin_impersonation");
    if (impersonationData) {
      const parsed = JSON.parse(impersonationData);
      console.log('Dashboard: Impersonation mode detected:', parsed);
      setImpersonationMode(parsed);
      setOrgId(parsed.target_org_id);
      return;
    }
    
    // Vérifier le statut d'approbation de l'organisation
    checkApprovalStatus();
    
    // Mode normal : utiliser l'org stockée ou chercher l'org par défaut
    const stored = localStorage.getItem("orgId");
    console.log('Dashboard: Stored orgId from localStorage:', stored);
    if (stored) {
      setOrgId(stored);
    } else if (user) {
      // Si pas d'orgId stocké, chercher l'organisation de l'utilisateur
      console.log('Dashboard: No stored orgId, fetching user organization...');
      supabase
        .from('organizations')
        .select('id')
        .eq('owner_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Dashboard: Error fetching user org:', error);
          } else if (data) {
            console.log('Dashboard: Found user org:', data.id);
            setOrgId(data.id);
            localStorage.setItem("orgId", data.id);
          }
        });
    }
  }, [user]);

  useEffect(() => {
    if (!orgId) return;
    localStorage.setItem("orgId", orgId);
    setLoading(true);
    supabase.from("workflows").select("id,name,n8n_workflow_id,is_active,description").eq("org_id", orgId).order("created_at", { ascending: true }).then(({ data, error }) => {
      if (error) console.error(error);
      setWorkflows(data ?? []);
      setLoading(false);
    });
  }, [orgId]);

  useEffect(() => {
    const channel = supabase
      .channel('runs-stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workflow_runs' }, (payload) => {
        const newRun = payload.new as Run;
        runsRef.current = [newRun, ...runsRef.current].slice(0, 50);
        forceTick(x => x + 1);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

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

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user]);

  const fetchSubscriptionStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      setSubscriptionStatus(data || {});
    } catch (error) {
      console.error("Erreur lors de la récupération du statut:", error);
    }
  };

  const handleCheckout = async (plan: "starter" | "pro", interval: "month" | "year") => {
    setPricingLoading(`${plan}-${interval}`);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan, interval },
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, "_blank");
        toast.success("Redirection vers Stripe...");
      } else {
        toast.error("URL de paiement indisponible");
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création du paiement");
    } finally {
      setPricingLoading(null);
    }
  };

  const handlePortal = async () => {
    setPricingLoading("portal");
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, "_blank");
        toast.success("Accès au portail client...");
      } else {
        toast.error("Portail client indisponible");
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur d'accès au portail");
    } finally {
      setPricingLoading(null);
    }
  };

  const triggerRun = async (w: Workflow) => {
    // Requires secrets to be set. For now, show guidance.
    toast.info("To trigger n8n, add your N8N_BASE_URL and N8N_API_KEY secrets.");
  };

  const exitImpersonation = () => {
    localStorage.removeItem("admin_impersonation");
    setImpersonationMode(null);
    navigate('/admin');
  };

  const plans = [
    {
      name: "Starter",
      description: "Idéal pour démarrer avec les automations",
      icon: Zap,
      price: {
        monthly: 97,
        yearly: 930
      },
      features: [
        "Jusqu'à 3 agents N8N",
        "Support standard",
        "Historique 30 jours",
        "Workflows de base",
        "Intégrations essentielles",
        "Email de support"
      ],
      popular: false,
      planId: "starter"
    },
    {
      name: "Pro",
      description: "Pour les équipes et besoins avancés",
      icon: Crown,
      price: {
        monthly: 297,
        yearly: 2850
      },
      features: [
        "Agents N8N illimités",
        "Support prioritaire",
        "Historique 90 jours",
        "Workflows avancés",
        "Intégrations premium",
        "Support téléphonique",
        "Formation personnalisée",
        "API dédiée"
      ],
      popular: true,
      planId: "pro"
    }
  ];

  const savings = {
    starter: Math.round(((97 * 12 - 930) / (97 * 12)) * 100),
    pro: Math.round(((297 * 12 - 2850) / (297 * 12)) * 100)
  };

  return (
    <main className="min-h-screen px-4 py-10 container hero-aurora">
      <header className="mb-8">
        {impersonationMode ? (
          <div className="bg-orange-100 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={exitImpersonation}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour Admin
                </Button>
                <div>
                  <span className="font-medium text-orange-800 dark:text-orange-200">
                    Mode Admin - Connecté dans le compte: {impersonationMode.org_name}
                  </span>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Vous voyez exactement ce que voit le client
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {impersonationMode ? `Dashboard de ${impersonationMode.org_name}` : `Welcome${user?.email ? `, ${user.email}` : ''}`}
            </h1>
            <p className="text-muted-foreground">
              {impersonationMode ? 'Vue client - Gérez vos workflows' : 'Manage, trigger, and monitor your n8n workflows'}
            </p>
          </div>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </div>
      </header>

      {isSubscribed === false && (
        <div className="mb-6 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Abonnement requis</p>
              <p className="text-sm text-muted-foreground">Activez votre abonnement pour lancer vos automations.</p>
            </div>
            <Button variant="secondary" onClick={() => setActiveTab("pricing")}>
              Voir les formules
            </Button>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8 p-1 dashboard-nav rounded-2xl">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="workflows" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Automations
          </TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Abonnement
          </TabsTrigger>
          <TabsTrigger value="support" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Support
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Paramètres
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-8">
          <section className="mb-8">
            <Card className="dashboard-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Votre système Webstate travaille pour vous ✨
                </CardTitle>
                <CardDescription className="text-muted-foreground/80">
                  Aperçu en temps réel de vos performances
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="metric-card p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-primary/60"></div>
                    <div className="text-sm font-medium text-muted-foreground">ROI estimé</div>
                  </div>
                  <div className="text-3xl font-bold text-primary">+312%</div>
                  <div className="text-xs text-muted-foreground mt-1">↗ +23% ce mois</div>
                </div>
                <div className="metric-card p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-primary/60"></div>
                    <div className="text-sm font-medium text-muted-foreground">Temps gagné</div>
                  </div>
                  <div className="text-3xl font-bold text-primary">12h</div>
                  <div className="text-xs text-muted-foreground mt-1">par semaine</div>
                </div>
                <div className="metric-card p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-primary/60"></div>
                    <div className="text-sm font-medium text-muted-foreground">Leads générés</div>
                  </div>
                  <div className="text-3xl font-bold text-primary">48</div>
                  <div className="text-xs text-muted-foreground mt-1">ce mois-ci</div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <AutomationSection workflows={workflows} onTrigger={(w) => triggerRun(w)} />
          </section>
        </TabsContent>

        {/* Automations */}
        <TabsContent value="workflows" className="space-y-8">
          {orgId ? (
            <section>
              <WorkflowPanel orgId={orgId} />
            </section>
          ) : (
            <section>
              <p className="text-red-500">Aucune organisation sélectionnée</p>
            </section>
          )}
        </TabsContent>

        {/* Abonnement */}
        <TabsContent value="pricing" className="space-y-8">
          {!impersonationMode && (
            <>
              {/* Section Tarifs Premium */}
              <section className="py-fluid-3xl bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl">
                <div className="container mx-auto px-4">
                  {/* Header */}
                  <div className="text-center mb-fluid-2xl">
                    <h2 className="text-fluid-3xl sm:text-fluid-4xl font-display font-bold text-foreground mb-fluid-md">
                      Tarifs Simples et Transparents
                    </h2>
                    <p className="text-fluid-lg text-muted-foreground max-w-3xl mx-auto">
                      Choisissez le plan qui correspond à vos besoins. Tous nos plans incluent un essai gratuit de 14 jours.
                    </p>
                  </div>

                  {/* Plans */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-fluid-xl max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                      <CardPremium key={plan.name} className="relative overflow-hidden">
                        {plan.popular && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                              ⭐ Plan le plus populaire
                            </div>
                          </div>
                        )}
                        
                        <CardHeaderPremium className="text-center pb-6">
                          <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                              <plan.icon className="w-8 h-8 text-primary" />
                            </div>
                          </div>
                          <CardTitlePremium className="text-fluid-2xl font-bold text-foreground mb-2">
                            {plan.name}
                          </CardTitlePremium>
                          <p className="text-muted-foreground">{plan.description}</p>
                        </CardHeaderPremium>
                        
                        <CardContentPremium className="space-y-6">
                          {/* Prix */}
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <span className="text-fluid-4xl font-bold text-foreground">
                                {plan.price.monthly}€
                              </span>
                              <span className="text-muted-foreground">/mois</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              ou {plan.price.yearly}€/an (économisez {savings[plan.planId as keyof typeof savings]}%)
                            </p>
                          </div>

                          {/* Features */}
                          <ul className="space-y-3">
                            {plan.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3 h-3 text-primary" />
                                </div>
                                <span className="text-sm text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {/* CTA */}
                          <div className="space-y-3">
                            <ButtonPremium
                              onClick={() => handleCheckout(plan.planId as "starter" | "pro", "month")}
                              disabled={pricingLoading === `${plan.planId}-month`}
                              className="w-full"
                            >
                              {pricingLoading === `${plan.planId}-month` ? (
                                "Chargement..."
                              ) : (
                                <>
                                  Commencer l'essai gratuit
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                              )}
                            </ButtonPremium>
                            
                            <ButtonPremium
                              variant="outline"
                              onClick={() => handleCheckout(plan.planId as "starter" | "pro", "year")}
                              disabled={pricingLoading === `${plan.planId}-year`}
                              className="w-full"
                            >
                              {pricingLoading === `${plan.planId}-year` ? (
                                "Chargement..."
                              ) : (
                                <>
                                  Annuel - {plan.price.yearly}€
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                              )}
                            </ButtonPremium>
                          </div>
                        </CardContentPremium>
                      </CardPremium>
                    ))}
                  </div>

                  {/* Gestion de l'abonnement existant */}
                  {subscriptionStatus && (
                    <div className="mt-fluid-2xl text-center">
                      <CardPremium className="max-w-2xl mx-auto">
                        <CardHeaderPremium className="text-center">
                          <CardTitlePremium className="text-fluid-xl font-bold text-foreground mb-2">
                            Gérer votre abonnement
                          </CardTitlePremium>
                          <p className="text-muted-foreground">
                            Accédez à votre portail client pour modifier votre plan ou annuler votre abonnement.
                          </p>
                        </CardHeaderPremium>
                        <CardContentPremium>
                          <ButtonPremium
                            onClick={handlePortal}
                            disabled={pricingLoading === "portal"}
                            className="w-full"
                          >
                            {pricingLoading === "portal" ? (
                              "Chargement..."
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Accéder au portail client
                              </>
                            )}
                          </ButtonPremium>
                        </CardContentPremium>
                      </CardPremium>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </TabsContent>

        {/* Support */}
        <TabsContent value="support" className="space-y-8">
          <section>
            <SupportSection orgId={orgId} calendlyUrl="https://calendly.com/hatim-moro-2002/30min" />
          </section>
        </TabsContent>

        {/* Paramètres */}
        <TabsContent value="settings" className="space-y-8">
          <section>
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="text-2xl">Paramètres du compte</CardTitle>
                <CardDescription>
                  Gérez vos préférences et informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profil */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Profil</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3 py-2 border border-border rounded-lg bg-muted"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom d'organisation</label>
                      <input
                        type="text"
                        placeholder="Nom de votre entreprise"
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Sécurité */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Sécurité</h3>
                  <Button variant="outline">Changer le mot de passe</Button>
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Notifications par email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Alertes de workflow</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Dashboard;
