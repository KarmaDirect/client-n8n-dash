import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ButtonPremium } from "@/components/ui/button-premium";
import { CardPremium, CardContent, CardHeader, CardTitle } from "@/components/ui/card-premium";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { Check, Star, Zap, Crown, ArrowRight, CreditCard, Calendar, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DashboardPricingProps {}

export function DashboardPricing({}: DashboardPricingProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

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
    setLoading(`${plan}-${interval}`);
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
      setLoading(null);
    }
  };

  const handlePortal = async () => {
    setLoading("portal");
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
      setLoading(null);
    }
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

  const isCurrentPlan = (planId: string) => {
    return subscriptionStatus?.subscription_tier === planId;
  };

  const isSubscribed = !!subscriptionStatus?.subscribed;

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
            className="text-center mb-fluid-2xl"
          >
            <h1 className="text-fluid-3xl sm:text-fluid-4xl font-display font-bold text-foreground mb-fluid-md">
              Tarifs & Abonnement
            </h1>
            <p className="text-fluid-lg text-muted-foreground max-w-3xl mx-auto">
              Gérez votre abonnement et choisissez le plan qui correspond à vos besoins.
            </p>
          </motion.div>

          {/* Current Subscription Status */}
          {isSubscribed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-4xl mx-auto mb-fluid-xl"
            >
              <CardPremium className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Abonnement Actif</CardTitle>
                      <p className="text-muted-foreground">
                        Plan {subscriptionStatus.subscription_tier} • 
                        {subscriptionStatus.subscription_end && (
                          <span> Renouvellement le {new Date(subscriptionStatus.subscription_end).toLocaleDateString()}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <ButtonPremium
                      onClick={handlePortal}
                      disabled={loading === "portal"}
                      variant="outline"
                      className="flex-1"
                    >
                      {loading === "portal" ? "Chargement..." : "Gérer l'abonnement"}
                    </ButtonPremium>
                    <ButtonPremium
                      onClick={fetchSubscriptionStatus}
                      disabled={loading === "refresh"}
                      variant="ghost"
                    >
                      Actualiser
                    </ButtonPremium>
                  </div>
                </CardContent>
              </CardPremium>
            </motion.div>
          )}

          {/* Toggle Billing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center mb-fluid-xl"
          >
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-border">
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  !isYearly ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:text-foreground"
                )}>
                  Mensuel
                </span>
                <button
                  onClick={() => setIsYearly(!isYearly)}
                  className="relative w-16 h-8 bg-muted rounded-full p-1 transition-all duration-300"
                >
                  <motion.div
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{ x: isYearly ? 32 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
                <span className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  isYearly ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:text-foreground"
                )}>
                  Annuel
                  {isYearly && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Économisez jusqu'à 20%
                    </span>
                  )}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-fluid-2xl">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                  >
                    <div className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Plus Populaire
                    </div>
                  </motion.div>
                )}

                <CardPremium className={cn(
                  "h-full transition-all duration-300",
                  plan.popular && "ring-2 ring-primary/20 shadow-xl",
                  isCurrentPlan(plan.planId) && "ring-2 ring-green-500/50 bg-green-50/30"
                )}>
                  <CardHeader className="text-center pb-6">
                    <div className="flex justify-center mb-4">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center",
                        plan.popular ? "bg-gradient-to-br from-primary to-accent" : "bg-primary/10"
                      )}>
                        <plan.icon className={cn(
                          "w-8 h-8",
                          plan.popular ? "text-white" : "text-primary"
                        )} />
                      </div>
                    </div>
                    
                    <CardTitle className="text-fluid-2xl font-display font-bold">
                      {plan.name}
                    </CardTitle>
                    
                    <p className="text-muted-foreground">
                      {plan.description}
                    </p>

                    {isCurrentPlan(plan.planId) && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        <Check className="w-4 h-4" />
                        Plan actuel
                      </div>
                    )}

                    <div className="mt-6">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-fluid-4xl font-display font-bold text-foreground">
                          {isYearly ? plan.price.yearly : plan.price.monthly}€
                        </span>
                        <span className="text-muted-foreground">
                          /{isYearly ? "an" : "mois"}
                        </span>
                      </div>
                      
                      {isYearly && (
                        <div className="mt-2">
                          <span className="text-sm text-muted-foreground line-through">
                            {plan.price.monthly * 12}€/an
                          </span>
                          <span className="ml-2 text-sm font-medium text-green-600">
                            Économisez {plan.name === "Starter" ? savings.starter : savings.pro}%
                          </span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 + featureIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-muted-foreground">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <div className="pt-4">
                      {isCurrentPlan(plan.planId) ? (
                        <ButtonPremium
                          size="lg"
                          variant="outline"
                          className="w-full"
                          disabled
                        >
                          Plan actuel
                        </ButtonPremium>
                      ) : (
                        <ButtonPremium
                          size="lg"
                          className={cn(
                            "w-full group",
                            plan.popular && "bg-gradient-to-r from-primary to-accent hover:from-primary-darker hover:to-accent-darker"
                          )}
                          onClick={() => handleCheckout(plan.planId as "starter" | "pro", isYearly ? "year" : "month")}
                          disabled={loading === `${plan.planId}-${isYearly ? "year" : "month"}`}
                        >
                          {loading === `${plan.planId}-${isYearly ? "year" : "month"}` ? (
                            "Redirection vers Stripe..."
                          ) : (
                            <>
                              {isSubscribed ? "Changer de plan" : "Commencer l'essai gratuit"}
                              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </ButtonPremium>
                      )}
                    </div>
                  </CardContent>
                </CardPremium>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-border max-w-4xl mx-auto">
              <h3 className="text-fluid-xl font-display font-semibold mb-4">
                Questions sur nos tarifs ?
              </h3>
              <p className="text-muted-foreground mb-6">
                Notre équipe est là pour vous aider à choisir le bon plan pour votre entreprise.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <ButtonPremium variant="outline" size="lg">
                  Contacter l'équipe
                </ButtonPremium>
                <ButtonPremium size="lg" className="group">
                  Voir la documentation
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </ButtonPremium>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}

export default DashboardPricing;
