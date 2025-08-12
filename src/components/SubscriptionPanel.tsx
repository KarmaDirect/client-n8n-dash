import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const SubscriptionPanel = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [status, setStatus] = useState<{ subscribed?: boolean; subscription_tier?: string | null; subscription_end?: string | null } | null>(null);

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
    const msg = data?.subscribed ? `Actif — ${data.subscription_tier || ""}` : "Aucun abonnement actif";
    toast.success(`Statut: ${msg}`);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Abonnements</CardTitle>
        <CardDescription>
          Starter 97€/mois ou 930€/an • Pro 297€/mois ou 2 850€/an • 30 jours satisfait ou remboursé • Engagement 12 mois
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button variant="outline" disabled={loading === "starter-month"} onClick={() => checkout("starter", "month")}>Starter Mensuel — 97€</Button>
          <Button variant="outline" disabled={loading === "starter-year"} onClick={() => checkout("starter", "year")}>Starter Annuel — 930€</Button>
          <Button variant="outline" disabled={loading === "pro-month"} onClick={() => checkout("pro", "month")}>Pro Mensuel — 297€</Button>
          <Button variant="outline" disabled={loading === "pro-year"} onClick={() => checkout("pro", "year")}>Pro Annuel — 2 850€</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={refresh} disabled={loading === "refresh"}>Rafraîchir le statut</Button>
          <Button variant="secondary" onClick={portal} disabled={loading === "portal"}>Gérer mon abonnement</Button>
        </div>
        {status && (
          <div className="text-sm text-muted-foreground">
            Statut: {status.subscribed ? `Actif — ${status.subscription_tier}` : "Aucun"}
            {status.subscription_end && (
              <span> • Renouvellement: {new Date(status.subscription_end).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
