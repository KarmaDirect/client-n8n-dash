
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AdminOrgDetails from "@/components/admin/AdminOrgDetails";
import WebhookManager from "@/components/admin/WebhookManager";
import { UserCheck, Webhook } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface EventItem { id: string; type: string; created_at: string; org_id: string; meta: any }
interface RunItem { id: string; status: string; started_at: string; finished_at: string | null; workflow_id: string }
interface OrgItem { id: string; name: string; created_at: string; owner_id: string }
interface SubscriberItem { 
  email: string; 
  subscribed: boolean; 
  subscription_tier: string | null; 
  subscription_end: string | null; 
  updated_at: string;
  manually_approved: boolean;
  approved_by: string | null;
  approved_at: string | null;
  approval_notes: string | null;
}
const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [counts, setCounts] = useState<{ orgs: number; workflows: number; leads7d: number; errors7d: number }>({ orgs: 0, workflows: 0, leads7d: 0, errors7d: 0 });
  const [events, setEvents] = useState<EventItem[]>([]);
  const [runs, setRuns] = useState<RunItem[]>([]);
  const [orgs, setOrgs] = useState<OrgItem[]>([]);
  const [orgSearch, setOrgSearch] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [impersonating, setImpersonating] = useState(false);
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [subsSearch, setSubsSearch] = useState("");
  const [approvingSubEmail, setApprovingSubEmail] = useState<string | null>(null);
  const filteredOrgs = useMemo(() => {
    const q = orgSearch.trim().toLowerCase();
    if (!q) return orgs;
    return orgs.filter(o => o.name.toLowerCase().includes(q));
  }, [orgs, orgSearch]);
  const filteredSubs = useMemo(() => {
    const q = subsSearch.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter(s => (s.email || '').toLowerCase().includes(q));
  }, [subsSearch, subscribers]);

  useEffect(() => {
    document.title = "Admin Webstate — Vue d'ensemble";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', "Admin Webstate — Vue d'ensemble multi-tenant");
  }, []);

  useEffect(() => {
    if (!user) return;
    // Check role in client (RLS allows viewing own roles)
      supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' })
        .then(({ data, error }) => {
          if (error) console.error(error);
          const ok = !!data;
          setIsAdmin(ok);
          setChecking(false);
          if (!ok) navigate('/app', { replace: true });
        });
  }, [user, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchCounts = async () => {
      const [orgs, workflows] = await Promise.all([
        supabase.from('organizations').select('id', { count: 'exact', head: true }),
        supabase.from('workflows').select('id', { count: 'exact', head: true }),
      ]);
      setCounts({
        orgs: orgs.count ?? 0,
        workflows: workflows.count ?? 0,
        leads7d: 0, // Deprecated: leads table removed
        errors7d: 0, // Deprecated: events table removed
      });
    };

    const fetchLists = async () => {
      const [{ data: rns }, { data: organizations }] = await Promise.all([
        supabase.from('workflow_runs').select('id,status,started_at,finished_at,workflow_id').order('started_at', { ascending: false }).limit(20),
        supabase.from('organizations').select('id,name,created_at,owner_id').order('created_at', { ascending: false }),
      ]);
      setEvents([]); // Deprecated: events table removed
      setRuns(rns || []);
      setOrgs(organizations || []);
    };

    fetchCounts();
    fetchLists();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .from('subscribers')
      .select('email,subscribed,subscription_tier,subscription_end,updated_at,manually_approved,approved_by,approved_at,approval_notes')
      .order('updated_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        setSubscribers((data as any as SubscriberItem[]) || []);
      });
  }, [isAdmin]);

  const header = useMemo(() => (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Admin Webstate</h1>
        <p className="text-muted-foreground">Vue d'ensemble multi-tenant (lecture seule)</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate('/app')}>Retour au Dashboard</Button>
      </div>
    </header>
), [navigate]);

  const handleImpersonate = async (targetUserId: string, orgId: string, orgName: string) => {
    setImpersonating(true);
    try {
      // Vérifier que l'admin peut impersonner cet utilisateur
      const { data, error } = await supabase.rpc('admin_impersonate_user', {
        _target_user_id: targetUserId
      });
      
      if (error) throw error;
      if (!data || data.length === 0) {
        toast.error("Impossible d'accéder à ce compte client");
        return;
      }
      
      // Stocker les infos d'impersonation pour le Dashboard
      localStorage.setItem('admin_impersonation', JSON.stringify({
        target_user_id: targetUserId,
        target_org_id: orgId,
        admin_user_id: user?.id,
        org_name: orgName
      }));
      
      toast.success(`Connexion dans le compte de ${orgName}`);
      navigate('/app');
    } catch (error: any) {
      toast.error('Erreur lors de la connexion: ' + error.message);
    } finally {
      setImpersonating(false);
    }
  };

  const handleApproveSubscriber = async (email: string, approve: boolean) => {
    setApprovingSubEmail(email);
    try {
      const { error } = await supabase.functions.invoke(approve ? 'approve-subscriber' : 'revoke-subscriber-approval', {
        body: { 
          email,
          approval_notes: approve ? `Approuvé manuellement par admin pour tests le ${new Date().toLocaleDateString()}` : 'Approbation révoquée par admin'
        }
      });
      
      if (error) throw error;
      
      toast.success(approve ? `Compte ${email} débloqué pour les tests` : `Approbation révoquée pour ${email}`);
      
      // Refresh subscribers list
      const { data, error: refreshError } = await supabase
        .from('subscribers')
        .select('email,subscribed,subscription_tier,subscription_end,updated_at,manually_approved,approved_by,approved_at,approval_notes')
        .order('updated_at', { ascending: false });
      
      if (!refreshError) {
        setSubscribers((data as any as SubscriberItem[]) || []);
      }
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setApprovingSubEmail(null);
    }
  };

  if (checking) {
    return <main className="min-h-screen grid place-items-center">Chargement…</main>;
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen px-4 py-10 container hero-aurora">
      {header}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
          <TabsTrigger value="workflows">
            <Webhook className="h-4 w-4 mr-2" />
            Gestion N8N
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-8">

      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Organisations</CardTitle>
            <CardDescription>Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{counts.orgs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Workflows</CardTitle>
            <CardDescription>Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{counts.workflows}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leads (7j)</CardTitle>
            <CardDescription>Nouveaux</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{counts.leads7d}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Erreurs (7j)</CardTitle>
            <CardDescription>Events type "error"</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{counts.errors7d}</div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Comptes clients</CardTitle>
            <CardDescription>Organisations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Input
                placeholder="Rechercher une organisation..."
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                className="max-w-sm"
              />
              <div className="text-sm text-muted-foreground">{filteredOrgs.length} affichées</div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Créée le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrgs.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.name}</TableCell>
                      <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleImpersonate(o.owner_id, o.id, o.name)}
                          disabled={impersonating}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Entrer dans le compte
                        </Button>
                        <Button size="sm" onClick={() => setSelectedOrgId(o.id)}>
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOrgs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                        Aucune organisation trouvée.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Derniers events</CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-sm text-muted-foreground">Aucune activité.</div>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-auto pr-2">
                {events.map((e) => (
                  <li key={e.id} className="p-2 rounded border">
                    <div className="text-xs text-muted-foreground">
                      {e.type} — {new Date(e.created_at).toLocaleString()} — org: {e.org_id}
                    </div>
                    <pre className="text-xs whitespace-pre-wrap">
                      {typeof e.meta === 'string' ? e.meta : JSON.stringify(e.meta, null, 2)}
                    </pre>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exécutions récentes</CardTitle>
            <CardDescription>workflow_runs</CardDescription>
          </CardHeader>
          <CardContent>
            {runs.length === 0 ? (
              <div className="text-sm text-muted-foreground">Aucune exécution.</div>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-auto pr-2">
                {runs.map((r) => (
                  <li key={r.id} className="p-2 rounded border">
                    <div className="text-xs text-muted-foreground">
                      {r.status} — {new Date(r.started_at).toLocaleString()} (wf: {r.workflow_id})
                    </div>
                    <div className="text-xs">
                      Fin: {r.finished_at ? new Date(r.finished_at).toLocaleString() : '—'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Journaux (mini)</h2>
          <Button variant="secondary" onClick={() => window.location.reload()}>Rafraîchir</Button>
        </div>
        <p className="text-sm text-muted-foreground">Vue de base pour le MVP. On pourra brancher des logs avancés (Edge Functions/Stripe/N8N) ensuite.</p>
      </section>

        </TabsContent>
        
        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Abonnés</CardTitle>
              <CardDescription>Table des abonnements (lecture seule)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Input
                  placeholder="Rechercher un email..."
                  value={subsSearch}
                  onChange={(e) => setSubsSearch(e.target.value)}
                  className="max-w-sm"
                />
                <div className="text-sm text-muted-foreground">{filteredSubs.length} abonnés</div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Offre</TableHead>
                      <TableHead>Approbation manuelle</TableHead>
                      <TableHead>Fin</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubs.map((s, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{s.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={s.subscribed ? 'default' : 'secondary'}>
                              {s.subscribed ? 'Actif' : 'Inactif'}
                            </Badge>
                            {s.manually_approved && (
                              <Badge variant="outline" className="text-xs">
                                Approuvé manuellement
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{s.subscription_tier || '—'}</TableCell>
                        <TableCell>
                          {s.manually_approved ? (
                            <div className="text-xs">
                              <Badge variant="default">Débloqué</Badge>
                              {s.approved_at && (
                                <div className="text-muted-foreground mt-1">
                                  {new Date(s.approved_at).toLocaleDateString()}
                                </div>
                              )}
                              {s.approval_notes && (
                                <div className="text-muted-foreground text-xs mt-1" title={s.approval_notes}>
                                  {s.approval_notes.length > 30 ? s.approval_notes.substring(0, 30) + '...' : s.approval_notes}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Badge variant="secondary">Standard</Badge>
                          )}
                        </TableCell>
                        <TableCell>{s.subscription_end ? new Date(s.subscription_end).toLocaleDateString() : '—'}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {!s.manually_approved ? (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleApproveSubscriber(s.email, true)}
                                disabled={approvingSubEmail === s.email}
                                className="h-7 px-2 text-xs"
                              >
                                Débloquer pour tests
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleApproveSubscriber(s.email, false)}
                                disabled={approvingSubEmail === s.email}
                                className="h-7 px-2 text-xs"
                              >
                                Révoquer
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredSubs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                          Aucun abonné trouvé.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workflows">
          <WebhookManager />
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedOrgId} onOpenChange={(open) => !open && setSelectedOrgId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de l’organisation</DialogTitle>
            <DialogDescription>Workflows et support — en lecture/écriture (admin)</DialogDescription>
          </DialogHeader>
          {selectedOrgId ? <AdminOrgDetails orgId={selectedOrgId} /> : null}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Admin;
