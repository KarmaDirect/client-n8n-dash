import { useState, useEffect } from "react";
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
  const [message, setMessage] = useState("Bonjour, j'aimerais modifier …");
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [siteInfo, setSiteInfo] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!orgId) return;
    
    const fetchSiteData = async () => {
      setLoadingData(true);
      try {
        // Fetch pages
        const { data: pagesData, error: pagesError } = await supabase
          .from('pages')
          .select('*')
          .eq('org_id', orgId)
          .order('created_at', { ascending: true });
        
        if (pagesError) throw pagesError;
        setPages(pagesData || []);

        // Fetch site info
        const { data: siteData, error: siteError } = await supabase
          .from('sites')
          .select('*')
          .eq('org_id', orgId)
          .maybeSingle();
        
        if (siteError && siteError.code !== 'PGRST116') throw siteError;
        setSiteInfo(siteData);
      } catch (error: any) {
        console.error('Error fetching site data:', error);
        toast.error('Erreur lors du chargement des données du site');
      } finally {
        setLoadingData(false);
      }
    };

    fetchSiteData();
  }, [orgId]);

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
    setMessage("Bonjour, j'aimerais modifier …");
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'en_construction': return { label: 'En construction', color: 'orange' };
      case 'brouillon': return { label: 'Brouillon', color: 'gray' };
      case 'publie': return { label: 'Publié', color: 'green' };
      default: return { label: status, color: 'gray' };
    }
  };

  const hasPublishedSite = siteInfo?.status === 'publie' || siteInfo?.site_url;

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
        {loadingData ? (
          <div className="text-sm text-muted-foreground">Chargement...</div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Statut</div>
                <div className="font-medium">
                  {siteInfo ? getStatusDisplay(siteInfo.status).label : 'Aucun site configuré'}
                </div>
              </div>
              <div className="flex gap-2">
                {hasPublishedSite && siteInfo?.site_url ? (
                  <Button variant="outline" asChild>
                    <a href={siteInfo.site_url} target="_blank" rel="noopener noreferrer">
                      Voir mon site
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    Site en préparation
                  </Button>
                )}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Pages {pages.length > 0 && `(${pages.length})`}</div>
              {pages.length === 0 ? (
                <div className="text-sm text-muted-foreground">Aucune page créée pour le moment.</div>
              ) : (
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {pages.map((page) => {
                    const statusInfo = getStatusDisplay(page.status);
                    return (
                      <li key={page.id}>
                        <span className="font-medium text-foreground">{page.title}</span>
                        <span className="mx-2">—</span>
                        <span style={{ color: statusInfo.color === 'green' ? '#22c55e' : statusInfo.color === 'orange' ? '#f59e0b' : '#6b7280' }}>
                          {statusInfo.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}

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