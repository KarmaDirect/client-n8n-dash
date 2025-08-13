import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const SubscriptionPanel = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [status, setStatus] = useState<{ subscribed?: boolean; subscription_tier?: string | null; subscription_end?: string | null } | null>(null);

  useEffect(() => { refresh(); }, []);

  const checkout = async (plan: "starter" | "pro", interval: "month" | "year") => {
    setLoading(`${plan}-${interval}`);
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { plan, interval },
    });
    setLoading(null);
    if (error) {
      toast.error(error.message || "Erreur de création du paiement");
      return;
    }
    if (data?.url) {
      window.open(data.url, "_blank");
    } else {
      toast.error("URL de paiement indisponible");
    }
  };

  const refresh = async () => {
    setLoading("refresh");
    const { data, error } = await supabase.functions.invoke("check-subscription");
    setLoading(null);
    if (error) {
      toast.error(error.message || "Erreur de vérification");
      return;
    }
    setStatus(data || {});
  };

  const portal = async () => {
    setLoading("portal");
    const { data, error } = await supabase.functions.invoke("customer-portal");
    setLoading(null);
    if (error) {
      toast.error(error.message || "Erreur d'accès au portail");
      return;
    }
    if (data?.url) {
      window.open(data.url, "_blank");
    }
  };

  const isActive = !!status?.subscribed;
  const tier = status?.subscription_tier || "Aucun";
  const renew = status?.subscription_end ? new Date(status.subscription_end).toLocaleDateString() : null;

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="w-2 h-2 rounded-full bg-primary/60"></div>
          Formules & Abonnement
        </CardTitle>
        <CardDescription>Gérez votre abonnement et accédez au portail Stripe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-md border p-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Statut:</span>
              <Badge variant={isActive ? "default" : "secondary"}>{isActive ? `Actif — ${tier}` : "Inactif"}</Badge>
            </div>
            {renew && (
              <div className="text-xs text-muted-foreground mt-1">Renouvellement: {renew}</div>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={refresh} disabled={loading === "refresh"}>Rafraîchir</Button>
            <Button variant="secondary" onClick={portal} disabled={loading === "portal"}>Gérer (Portail)</Button>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Starter</CardTitle>
                <Badge variant="outline">97€ / mois</Badge>
              </div>
              <CardDescription>Idéal pour démarrer avec les automations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Jusqu'à 3 agents N8N</li>
                <li>Support standard</li>
                <li>Historique 30 jours</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" disabled={loading === "starter-month"} onClick={() => checkout("starter", "month")}>Mensuel — 97€</Button>
                <Button variant="outline" disabled={loading === "starter-year"} onClick={() => checkout("starter", "year")}>Annuel — 930€</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pro</CardTitle>
                <Badge variant="outline">297€ / mois</Badge>
              </div>
              <CardDescription>Pour les équipes et besoins avancés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Agents N8N illimités</li>
                <li>Support prioritaire</li>
                <li>Historique 90 jours</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" disabled={loading === "pro-month"} onClick={() => checkout("pro", "month")}>Mensuel — 297€</Button>
                <Button variant="outline" disabled={loading === "pro-year"} onClick={() => checkout("pro", "year")}>Annuel — 2 850€</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
