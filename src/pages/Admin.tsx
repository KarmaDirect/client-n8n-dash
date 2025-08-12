import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface EventItem { id: string; type: string; created_at: string; org_id: string; meta: any }
interface RunItem { id: string; status: string; started_at: string; finished_at: string | null; workflow_id: string }

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [counts, setCounts] = useState<{ orgs: number; workflows: number; leads7d: number; errors7d: number }>({ orgs: 0, workflows: 0, leads7d: 0, errors7d: 0 });
  const [events, setEvents] = useState<EventItem[]>([]);
  const [runs, setRuns] = useState<RunItem[]>([]);

  useEffect(() => {
    document.title = "Admin Webstate — Vue d'ensemble";
  }, []);

  useEffect(() => {
    if (!user) return;
    // Check role in client (RLS allows viewing own roles)
    supabase.from("user_roles").select("role").eq("user_id", user.id)
      .then(({ data, error }) => {
        if (error) console.error(error);
        const ok = (data || []).some(r => r.role === 'admin');
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

  if (checking) {
    return <main className="min-h-screen grid place-items-center">Chargement…</main>;
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen px-4 py-10 container hero-aurora">
      {header}

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
    </main>
  );
};

export default Admin;
