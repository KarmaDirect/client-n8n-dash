import { DashboardLayout } from "@/components/DashboardLayout";
import { SupportSection } from "@/components/dashboard/SupportSection";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Bot, Calendar, Mail, BookOpen, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DashboardSupport = () => {
  const { user } = useAuth();
  const [orgId, setOrgId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem("orgId");
    if (stored) {
      setOrgId(stored);
    } else {
      supabase
        .from('organizations')
        .select('id')
        .eq('owner_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setOrgId(data.id);
            localStorage.setItem("orgId", data.id);
          }
        });
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Support</h1>
          <p className="text-muted-foreground">
            Obtenez de l'aide et contactez notre équipe
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Prendre RDV</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Planifiez un appel avec un expert pour discuter de vos besoins
              </p>
              <Button asChild className="w-full">
                <a href="https://calendly.com/hatim-moro-2002/30min" target="_blank" rel="noreferrer">
                  Réserver un créneau
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Email Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Envoyez-nous un email pour toute question technique
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="mailto:support@webstate.com">
                  Contacter par email
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Documentation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Consultez notre documentation complète
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="/docs" target="_blank">
                  Voir la documentation
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Chat Support */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                Chat Support
              </CardTitle>
              <CardDescription>
                Échangez avec notre équipe de support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupportSection orgId={orgId} calendlyUrl="https://calendly.com/hatim-moro-2002/30min" />
            </CardContent>
          </Card>

          {/* FAQ Quick */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Questions fréquentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Comment démarrer un workflow ?</h4>
                  <p className="text-xs text-muted-foreground">
                    Allez dans Automations, sélectionnez un workflow et cliquez sur "Activer"
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Comment configurer mes credentials ?</h4>
                  <p className="text-xs text-muted-foreground">
                    Dans la page d'un workflow, cliquez sur "Configurer" pour ajouter vos clés API
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Comment annuler mon abonnement ?</h4>
                  <p className="text-xs text-muted-foreground">
                    Accédez au portail client depuis la page Abonnement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardSupport;

