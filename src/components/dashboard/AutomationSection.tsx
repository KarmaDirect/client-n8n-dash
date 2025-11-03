import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PlayCircle, Zap, Pause, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Workflow = { id: string; name: string; description?: string | null; is_active: boolean; status?: string; n8n_workflow_id: string | null };

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
    <Card className="dashboard-card border-2 border-primary/10 bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              Automatisations IA
              <span className="text-sm font-normal text-muted-foreground">🤖</span>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-base mt-2">
          {activeCount} workflow(s) actif(s). Déclenchez un workflow et injectez des infos si besoin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {workflows.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Aucun workflow pour l'instant.</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Créez votre premier workflow pour commencer.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {workflows.map((w) => (
              <div
                key={w.id}
                className={cn(
                  "group relative overflow-hidden rounded-xl border-2 p-5 transition-all duration-300",
                  "bg-gradient-to-br from-card to-card/50",
                  w.is_active
                    ? "border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                    : "border-muted/50 hover:border-muted"
                )}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {w.name}
                      </h3>
                      {w.status === 'pending_validation' ? (
                        <Badge
                          variant="outline"
                          className="gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          En attente validation
                        </Badge>
                      ) : (
                        <Badge
                          variant={w.is_active ? "default" : "secondary"}
                          className={cn(
                            "gap-1.5",
                            w.is_active
                              ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                              : "bg-muted"
                          )}
                        >
                          {w.is_active ? (
                            <>
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              Actif
                            </>
                          ) : (
                            <>
                              <Pause className="w-3 h-3" />
                              En pause
                            </>
                          )}
                        </Badge>
                      )}
                    </div>
                    {w.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {w.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <Textarea
                    placeholder="Texte / paramètres (optionnel)"
                    value={payloads[w.id] || ""}
                    onChange={(e) => setPayloads((p) => ({ ...p, [w.id]: e.target.value }))}
                    className="min-h-[80px] resize-none bg-muted/30 border-muted focus-visible:ring-primary/20"
                  />
                  <Button
                    onClick={() => onTrigger(w, { text: payloads[w.id] })}
                    disabled={!w.is_active || w.status === 'pending_validation'}
                    className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlayCircle className="w-4 h-4" />
                    {w.status === 'pending_validation' ? 'En attente validation' : 'Lancer le workflow'}
                  </Button>
                </div>
                
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/0 group-hover:to-primary/0 transition-all duration-500 pointer-events-none rounded-xl" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
