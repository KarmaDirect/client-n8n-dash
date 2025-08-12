
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

interface EventItem { id: string; type: string; created_at: string; org_id: string; meta: any }
interface RunItem { id: string; status: string; started_at: string; finished_at: string | null; workflow_id: string }
interface OrgItem { id: string; name: string; created_at: string; owner_id: string }
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
  const filteredOrgs = useMemo(() => {
    const q = orgSearch.trim().toLowerCase();
    if (!q) return orgs;
    return orgs.filter(o => o.name.toLowerCase().includes(q));
  }, [orgs, orgSearch]);

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
      const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
      const [orgs, workflows, leads, errors] = await Promise.all([
        supabase.from('organizations').select('id', { count: 'exact', head: true }),
        supabase.from('workflows').select('id', { count: 'exact', head: true }),
        supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', since),
        supabase.from('events').select('id', { count: 'exact', head: true }).gte('created_at', since).eq('type', 'error'),
      ]);
      setCounts({
        orgs: orgs.count ?? 0,
        workflows: workflows.count ?? 0,
        leads7d: leads.count ?? 0,
        errors7d: errors.count ?? 0,
      });
    };

    const fetchLists = async () => {
      const [{ data: evts }, { data: rns }] = await Promise.all([
        supabase.from('events').select('id,type,created_at,org_id,meta').order('created_at', { ascending: false }).limit(20),
        supabase.from('workflow_runs').select('id,status,started_at,finished_at,workflow_id').order('started_at', { ascending: false }).limit(20),
      ]);
      setEvents(evts || []);
      setRuns(rns || []);
    };

    fetchCounts();
    fetchLists();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .rpc('admin_list_organizations')
      .then(({ data, error }) => {
        if (error) console.error(error);
        setOrgs((data as any as OrgItem[]) || []);
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

  if (checking) {
    return <main className="min-h-screen grid place-items-center">Chargement…</main>;
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen px-4 py-10 container hero-aurora">
      {header}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
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
