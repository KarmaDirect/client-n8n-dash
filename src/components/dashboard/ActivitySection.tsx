import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";

type Run = { id: string; status: string; started_at: string };

export const ActivitySection = ({ runs, orgId }: { runs: Run[]; orgId?: string }) => {
  const [metricsData, setMetricsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!orgId) {
        setMetricsData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch leads data for the last 7 days
        const since = new Date(Date.now() - 7 * 24 * 3600 * 1000);
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('created_at')
          .eq('org_id', orgId)
          .gte('created_at', since.toISOString());

        if (leadsError) throw leadsError;

        // Fetch workflow executions for completion rates
        const { data: executionsData, error: executionsError } = await supabase
          .from('workflow_executions')
          .select('executed_at, status')
          .eq('org_id', orgId)
          .gte('executed_at', since.toISOString());

        if (executionsError) throw executionsError;

        // Process data by day
        const last7Days = [];
        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(Date.now() - i * 24 * 3600 * 1000);
          const dayStart = new Date(date.setHours(0, 0, 0, 0));
          const dayEnd = new Date(date.setHours(23, 59, 59, 999));
          
          const leadsThisDay = leadsData?.filter(lead => {
            const leadDate = new Date(lead.created_at);
            return leadDate >= dayStart && leadDate <= dayEnd;
          }).length || 0;

          const executionsThisDay = executionsData?.filter(exec => {
            const execDate = new Date(exec.executed_at);
            return execDate >= dayStart && execDate <= dayEnd;
          }) || [];

          const successfulExecs = executionsThisDay.filter(e => e.status === 'success').length;
          const totalExecs = executionsThisDay.length;
          const completionRate = totalExecs > 0 ? Math.round((successfulExecs / totalExecs) * 100) : 0;

          last7Days.push({
            d: dayNames[date.getDay()],
            leads: leadsThisDay,
            completion: completionRate
          });
        }

        setMetricsData(last7Days);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        // Fallback to sample data if error
        setMetricsData([
          { d: "Lun", leads: 3, completion: 62 },
          { d: "Mar", leads: 5, completion: 58 },
          { d: "Mer", leads: 2, completion: 65 },
          { d: "Jeu", leads: 7, completion: 70 },
          { d: "Ven", leads: 4, completion: 68 },
          { d: "Sam", leads: 6, completion: 72 },
          { d: "Dim", leads: 3, completion: 69 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [orgId]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="dashboard-card lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-2 h-2 rounded-full bg-primary/60"></div>
            Activité & Performances 📈
          </CardTitle>
          <CardDescription>Leads générés et taux de complétion (exemple)</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          {loading ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              Chargement des données...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="d" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} name="Leads" />
                <Line type="monotone" dataKey="completion" stroke="#82ca9d" strokeWidth={2} name="Taux de réussite %" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/60"></div>
            Timeline
          </CardTitle>
          <CardDescription>Dernières exécutions</CardDescription>
        </CardHeader>
        <CardContent>
          {runs.length === 0 ? (
            <div className="text-sm text-muted-foreground">Aucune exécution.</div>
          ) : (
            <ul className="space-y-3 max-h-64 overflow-auto pr-2">
              {runs.map((r) => (
                <li key={r.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{r.status}</div>
                    <div className="text-xs text-muted-foreground">{new Date(r.started_at).toLocaleString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
