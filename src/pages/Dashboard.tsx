import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TenantSwitcher } from "@/components/TenantSwitcher";
import { toast } from "sonner";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";

interface Workflow { id: string; name: string; n8n_workflow_id: string | null; is_active: boolean; }
interface Run { id: string; workflow_id: string; status: string; started_at: string; finished_at: string | null; }

const Dashboard = () => {
  const { user } = useAuth();
  const [orgId, setOrgId] = useState<string | undefined>(undefined);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);
  const runsRef = useRef<Run[]>([]);
  const [, forceTick] = useState(0);
  document.title = "Dashboard — n8n Client Hub";

  useEffect(() => {
    const stored = localStorage.getItem("orgId");
    if (stored) setOrgId(stored);
  }, []);

  useEffect(() => {
    if (!orgId) return;
    localStorage.setItem("orgId", orgId);
    setLoading(true);
    supabase.from("workflows").select("id,name,n8n_workflow_id,is_active").eq("org_id", orgId).order("created_at", { ascending: true }).then(({ data, error }) => {
      if (error) console.error(error);
      setWorkflows(data ?? []);
      setLoading(false);
    });
  }, [orgId]);

  useEffect(() => {
    const channel = supabase
      .channel('runs-stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workflow_runs' }, (payload) => {
        const newRun = payload.new as Run;
        runsRef.current = [newRun, ...runsRef.current].slice(0, 50);
        forceTick(x => x + 1);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const triggerRun = async (w: Workflow) => {
    // Requires secrets to be set. For now, show guidance.
    toast.info("To trigger n8n, add your N8N_BASE_URL and N8N_API_KEY secrets.");
  };

  return (
    <main className="min-h-screen px-4 py-10 container hero-aurora">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome{user?.email ? `, ${user.email}` : ''}</h1>
          <p className="text-muted-foreground">Manage, trigger, and monitor your n8n workflows</p>
        </div>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
      </header>

      <section className="mb-10">
        <TenantSwitcher value={orgId} onChange={setOrgId} />
      </section>

      <section className="mb-10">
        <SubscriptionPanel />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workflows</CardTitle>
            <CardDescription>Registered workflows in this workspace</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : workflows.length === 0 ? (
              <div className="text-sm text-muted-foreground">No workflows yet. Add one to get started.</div>
            ) : (
              <ul className="space-y-3">
                {workflows.map(w => (
                  <li key={w.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{w.name}</div>
                      <div className="text-xs text-muted-foreground">n8n id: {w.n8n_workflow_id || '—'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => triggerRun(w)}>Trigger</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent runs</CardTitle>
            <CardDescription>Realtime status stream</CardDescription>
          </CardHeader>
          <CardContent>
            {runsRef.current.length === 0 ? (
              <div className="text-sm text-muted-foreground">No runs yet.</div>
            ) : (
              <ul className="space-y-3 max-h-96 overflow-auto pr-2">
                {runsRef.current.map(r => (
                  <li key={r.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{r.status}</div>
                      <div className="text-xs text-muted-foreground">{new Date(r.started_at).toLocaleString()}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Dashboard;
