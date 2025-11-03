import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonPremium } from "@/components/ui/button-premium";
import { CardPremium, CardContent as CardContentPremium, CardHeader as CardHeaderPremium, CardTitle as CardTitlePremium } from "@/components/ui/card-premium";
import { DashboardLayout } from "@/components/DashboardLayout";
import { toast } from "sonner";
import { Check, ArrowRight, Zap, Crown, CreditCard } from "lucide-react";

const DashboardPricing = () => {
  const { user } = useAuth();
  const [pricingLoading, setPricingLoading] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user]);

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
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Abonnement</h1>
          <p className="text-muted-foreground">
            Choisissez le plan qui correspond à vos besoins
          </p>
        </div>

        {isSubscribed === false && (
          <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Abonnement requis</h3>
                  <p className="text-sm text-muted-foreground">Activez votre abonnement pour lancer vos automations.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
          {plans.map((plan) => (
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
                <CardTitlePremium className="text-2xl font-bold mb-2">
                  {plan.name}
                </CardTitlePremium>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeaderPremium>
              
              <CardContentPremium className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold">
                      {plan.price.monthly}€
                    </span>
                    <span className="text-muted-foreground">/mois</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ou {plan.price.yearly}€/an (économisez {savings[plan.planId as keyof typeof savings]}%)
                  </p>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

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
          <CardPremium className="max-w-2xl mx-auto">
            <CardHeaderPremium className="text-center">
              <CardTitlePremium className="text-xl font-bold mb-2">
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
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPricing;
