import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const SiteSection = ({ orgId }: { orgId?: string }) => {
  const { user } = useAuth();
  const [subject, setSubject] = useState("Demande de modification de page");
  const [message, setMessage] = useState("Bonjour, j’aimerais modifier …");
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    if (!orgId) return toast.error("Sélectionnez un espace de travail.");
    setLoading(true);
    const { error } = await supabase.from("support_messages").insert({
      org_id: orgId,
      author: "client",
      user_id: user?.id,
      message: `${subject}\n\n${message}`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Demande envoyée ✅");
    setSubject("Demande de modification de page");
    setMessage("Bonjour, j’aimerais modifier …");
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="w-2 h-2 rounded-full bg-primary/60"></div>
          Mon Site 🌐
        </CardTitle>
        <CardDescription>Statut, aperçu, pages et demandes de modification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Statut</div>
            <div className="font-medium">En construction</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              Voir mon site
            </Button>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Pages</div>
          <ul className="text-sm text-muted-foreground list-disc pl-5">
            <li>Accueil — brouillon</li>
            <li>Contact — publié</li>
            <li>Offre — brouillon</li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Demander une modification ✍️</div>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
          <Textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button onClick={sendRequest} disabled={loading}>Envoyer</Button>
        </div>
      </CardContent>
    </Card>
  );
};
