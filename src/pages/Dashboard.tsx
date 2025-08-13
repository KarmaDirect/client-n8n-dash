import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { toast } from "sonner";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";
import { SiteSection } from "@/components/dashboard/SiteSection";
import { AutomationSection } from "@/components/dashboard/AutomationSection";
import { ActivitySection } from "@/components/dashboard/ActivitySection";
import { SupportSection } from "@/components/dashboard/SupportSection";
import WorkflowPanel from "@/components/dashboard/WorkflowPanel";
import { ArrowLeft } from "lucide-react";
interface Workflow { id: string; name: string; n8n_workflow_id: string | null; is_active: boolean; description?: string | null }
interface Run { id: string; workflow_id: string; status: string; started_at: string; finished_at: string | null; }

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orgId, setOrgId] = useState<string | undefined>(undefined);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [impersonationMode, setImpersonationMode] = useState<any>(null);
  const runsRef = useRef<Run[]>([]);
  const [, forceTick] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  document.title = "Dashboard — n8n Client Hub";

  useEffect(() => {
    console.log('Dashboard: Initial effect, checking impersonation mode...');
    // Vérifier si on est en mode impersonation (admin connecté dans un compte client)
    const impersonationData = localStorage.getItem("admin_impersonation");
    if (impersonationData) {
      const parsed = JSON.parse(impersonationData);
      console.log('Dashboard: Impersonation mode detected:', parsed);
      setImpersonationMode(parsed);
      setOrgId(parsed.target_org_id);
      return;
    }
    
    // Mode normal : utiliser l'org stockée ou chercher l'org par défaut
    const stored = localStorage.getItem("orgId");
    console.log('Dashboard: Stored orgId from localStorage:', stored);
    if (stored) {
      setOrgId(stored);
    } else if (user) {
      // Si pas d'orgId stocké, chercher l'organisation de l'utilisateur
      console.log('Dashboard: No stored orgId, fetching user organization...');
      supabase
        .from('organizations')
        .select('id')
        .eq('owner_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Dashboard: Error fetching user org:', error);
          } else if (data) {
            console.log('Dashboard: Found user org:', data.id);
            setOrgId(data.id);
            localStorage.setItem("orgId", data.id);
          }
        });
    }
  }, [user]);

  useEffect(() => {
    if (!orgId) return;
    localStorage.setItem("orgId", orgId);
    setLoading(true);
    supabase.from("workflows").select("id,name,n8n_workflow_id,is_active,description").eq("org_id", orgId).order("created_at", { ascending: true }).then(({ data, error }) => {
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

  useEffect(() => {
    if (!user) { setIsSubscribed(null); return; }
    supabase
      .from('subscribers')
      .select('subscribed')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('Subscription fetch error', error);
          setIsSubscribed(null);
        } else {
          setIsSubscribed(Boolean(data?.subscribed));
        }
      });
  }, [user]);

  const triggerRun = async (w: Workflow) => {
    // Requires secrets to be set. For now, show guidance.
    toast.info("To trigger n8n, add your N8N_BASE_URL and N8N_API_KEY secrets.");
  };

  const exitImpersonation = () => {
    localStorage.removeItem("admin_impersonation");
    setImpersonationMode(null);
    navigate('/admin');
  };
  return (
    <main className="min-h-screen px-4 py-10 container hero-aurora">
      <header className="mb-8">
        {impersonationMode ? (
          <div className="bg-orange-100 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={exitImpersonation}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour Admin
                </Button>
                <div>
                  <span className="font-medium text-orange-800 dark:text-orange-200">
                    Mode Admin - Connecté dans le compte: {impersonationMode.org_name}
                  </span>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Vous voyez exactement ce que voit le client
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {impersonationMode ? `Dashboard de ${impersonationMode.org_name}` : `Welcome${user?.email ? `, ${user.email}` : ''}`}
            </h1>
            <p className="text-muted-foreground">
              {impersonationMode ? 'Vue client - Gérez vos workflows' : 'Manage, trigger, and monitor your n8n workflows'}
            </p>
          </div>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </div>
      </header>

      {isSubscribed === false && (
        <div className="mb-6 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Abonnement requis</p>
              <p className="text-sm text-muted-foreground">Activez votre abonnement pour lancer vos automations.</p>
            </div>
            <Button variant="secondary" onClick={() => document.getElementById('subscription')?.scrollIntoView({ behavior: 'smooth' })}>
              Voir les formules
            </Button>
          </div>
        </div>
      )}

      <nav className="dashboard-nav mb-8 p-3 rounded-2xl">
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" className="hover:bg-primary/10" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Vue d'ensemble</Button>
          <Button variant="ghost" size="sm" className="hover:bg-primary/10" onClick={() => document.getElementById('workflows')?.scrollIntoView({ behavior: 'smooth' })}>Automations</Button>
          {!impersonationMode && (
            <Button variant="ghost" size="sm" className="hover:bg-primary/10" onClick={() => document.getElementById('subscription')?.scrollIntoView({ behavior: 'smooth' })}>Abonnement</Button>
          )}
          <Button variant="ghost" size="sm" className="hover:bg-primary/10" onClick={() => document.getElementById('support')?.scrollIntoView({ behavior: 'smooth' })}>Support</Button>
          <Button variant="ghost" size="sm" className="hover:bg-primary/10" onClick={() => document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' })}>Profil</Button>
        </div>
      </nav>

      {!impersonationMode && (
        <>

          <section id="subscription" className="mb-10">
            <SubscriptionPanel />
          </section>
        </>
      )}

      <section id="overview" className="mb-8">
        <Card className="dashboard-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Votre système Webstate travaille pour vous ✨
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Aperçu en temps réel de vos performances
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="metric-card p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
                <div className="text-sm font-medium text-muted-foreground">ROI estimé</div>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">+312%</div>
              <div className="text-xs text-green-500 mt-1">↗ +23% ce mois</div>
            </div>
            <div className="metric-card p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500"></div>
                <div className="text-sm font-medium text-muted-foreground">Temps gagné</div>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">12h</div>
              <div className="text-xs text-blue-500 mt-1">par semaine</div>
            </div>
            <div className="metric-card p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
                <div className="text-sm font-medium text-muted-foreground">Leads générés</div>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">48</div>
              <div className="text-xs text-purple-500 mt-1">ce mois-ci</div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SiteSection orgId={orgId} />
        <AutomationSection workflows={workflows} onTrigger={(w) => triggerRun(w)} />
      </section>

      <section className="mt-6">
        <ActivitySection runs={runsRef.current} />
      </section>

      <section id="support" className="mt-6">
        <SupportSection orgId={orgId} calendlyUrl="https://calendly.com/hatim-moro-2002/30min" />
      </section>

      {orgId ? (
        <section id="workflows" className="mt-6">
          <WorkflowPanel orgId={orgId} />
        </section>
      ) : (
        <section className="mt-6">
          <p className="text-red-500">Aucune organisation sélectionnée</p>
        </section>
      )}
    </main>
  );
};

export default Dashboard;
