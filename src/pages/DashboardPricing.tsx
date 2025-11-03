import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonPremium } from "@/components/ui/button-premium";
import { CardPremium, CardContent as CardContentPremium, CardHeader as CardHeaderPremium, CardTitle as CardTitlePremium } from "@/components/ui/card-premium";
import { DashboardLayout } from "@/components/DashboardLayout";
import { toast } from "sonner";
import { Check, ArrowRight, Zap, Crown, CreditCard, Calendar, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DashboardPricing = () => {
  const { user } = useAuth();
  const [pricingLoading, setPricingLoading] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_tier, subscription_end, stripe_customer_id, created_at')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      setIsSubscribed(Boolean(data?.subscribed));
      setSubscriptionDetails(data);
    } catch (error: any) {
      console.error('Subscription fetch error', error);
      setIsSubscribed(null);
    } finally {
      setLoading(false);
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

  const currentPlan = subscriptionDetails?.subscription_tier?.toLowerCase();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Abonnement</h1>
          <p className="text-muted-foreground">
            Choisissez le plan qui correspond à vos besoins
          </p>
        </div>

        {/* Statut d'abonnement actuel */}
        {loading ? (
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Chargement de votre abonnement...</span>
              </div>
            </CardContent>
          </Card>
        ) : subscriptionDetails && isSubscribed ? (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <CardTitle className="text-xl font-bold">Abonnement actif</CardTitle>
                  </div>
                  {subscriptionDetails.subscription_tier && (
                    <Badge variant="default" className="mt-2">
                      Plan {subscriptionDetails.subscription_tier.charAt(0).toUpperCase() + subscriptionDetails.subscription_tier.slice(1)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {subscriptionDetails.subscription_end && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Prochain renouvellement :</span>
                      <span className="font-medium ml-2">
                        {new Date(subscriptionDetails.subscription_end).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                )}
                {subscriptionDetails.created_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Membre depuis :</span>
                      <span className="font-medium ml-2">
                        {new Date(subscriptionDetails.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <Separator />
              <ButtonPremium
                onClick={handlePortal}
                disabled={pricingLoading === "portal"}
                className="w-full"
              >
                {pricingLoading === "portal" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Gérer mon abonnement
                  </>
                )}
              </ButtonPremium>
            </CardContent>
          </Card>
        ) : (
          <Alert className="border-amber-200 bg-amber-50">
            <XCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-900">Abonnement requis</AlertTitle>
            <AlertDescription className="text-amber-800">
              Activez votre abonnement pour lancer vos automations et accéder à toutes les fonctionnalités.
            </AlertDescription>
          </Alert>
        )}

        {/* Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.planId;
            return (
              <CardPremium 
                key={plan.name} 
                className={`relative overflow-hidden transition-all duration-300 ${
                  isCurrentPlan ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Actuel
                    </Badge>
                  </div>
                )}
                
                <CardHeaderPremium className="text-center pb-6 pt-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <plan.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitlePremium className="text-2xl font-bold mb-2">
                    {plan.name}
                  </CardTitlePremium>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </CardHeaderPremium>
                
                <CardContentPremium className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold">
                        {plan.price.monthly}€
                      </span>
                      <span className="text-muted-foreground text-lg">/mois</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ou <span className="font-semibold">{plan.price.yearly}€/an</span> 
                      <span className="text-green-600 font-medium ml-1">(économisez {savings[plan.planId as keyof typeof savings]}%)</span>
                    </p>
                  </div>

                  <Separator />

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Separator />

                  <div className="space-y-3">
                    {isCurrentPlan ? (
                      <ButtonPremium
                        onClick={handlePortal}
                        disabled={pricingLoading === "portal"}
                        className="w-full"
                        variant="outline"
                      >
                        {pricingLoading === "portal" ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Chargement...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Gérer mon abonnement
                          </>
                        )}
                      </ButtonPremium>
                    ) : (
                      <>
                        <ButtonPremium
                          onClick={() => handleCheckout(plan.planId as "starter" | "pro", "month")}
                          disabled={pricingLoading === `${plan.planId}-month` || !!pricingLoading}
                          className="w-full"
                        >
                          {pricingLoading === `${plan.planId}-month` ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Chargement...
                            </>
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
                          disabled={pricingLoading === `${plan.planId}-year` || !!pricingLoading}
                          className="w-full"
                        >
                          {pricingLoading === `${plan.planId}-year` ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Chargement...
                            </>
                          ) : (
                            <>
                              Annuel - {plan.price.yearly}€
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </ButtonPremium>
                      </>
                    )}
                  </div>
                </CardContentPremium>
              </CardPremium>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPricing;
