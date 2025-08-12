import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Workflow = { id: string; name: string; description?: string | null; is_active: boolean; n8n_workflow_id: string | null };

export const AutomationSection = ({
  workflows,
  onTrigger,
}: {
  workflows: Workflow[];
  onTrigger: (w: Workflow, payload?: { text?: string }) => void;
}) => {
  const [payloads, setPayloads] = useState<Record<string, string>>({});

  const activeCount = useMemo(() => workflows.filter((w) => w.is_active).length, [workflows]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automatisations IA 🤖</CardTitle>
        <CardDescription>
          {activeCount} workflow(s) actif(s). Déclenchez un workflow et injectez des infos si besoin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {workflows.length === 0 ? (
          <div className="text-sm text-muted-foreground">Aucun workflow pour l’instant.</div>
        ) : (
          <ul className="space-y-3">
            {workflows.map((w) => (
              <li key={w.id} className="border rounded-md p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{w.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {w.description || "—"}
                    </div>
                  </div>
                  <div className="text-xs">
                    {w.is_active ? "Actif" : "En pause"}
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Textarea
                    placeholder="Texte / paramètres (optionnel)"
                    value={payloads[w.id] || ""}
                    onChange={(e) => setPayloads((p) => ({ ...p, [w.id]: e.target.value }))}
                  />
                  <div className="flex items-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => onTrigger(w, { text: payloads[w.id] })}
                    >
                      Lancer le workflow
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
