import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const sample = [
  { d: "Lun", leads: 3, completion: 62 },
  { d: "Mar", leads: 5, completion: 58 },
  { d: "Mer", leads: 2, completion: 65 },
  { d: "Jeu", leads: 7, completion: 70 },
  { d: "Ven", leads: 4, completion: 68 },
  { d: "Sam", leads: 6, completion: 72 },
  { d: "Dim", leads: 3, completion: 69 },
];

type Run = { id: string; status: string; started_at: string };

export const ActivitySection = ({ runs }: { runs: Run[] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Activité & Performances 📈</CardTitle>
          <CardDescription>Leads générés et taux de complétion (exemple)</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sample}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="d" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="completion" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
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
