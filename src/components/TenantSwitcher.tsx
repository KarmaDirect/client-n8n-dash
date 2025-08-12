import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Organization { id: string; name: string; }

export const TenantSwitcher = ({ value, onChange }: { value?: string; onChange: (orgId: string) => void }) => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.from("organizations").select("id,name").order("created_at", { ascending: true });
      if (error) console.error(error);
      if (mounted) setOrgs(data ?? []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const selected = useMemo(() => orgs.find(o => o.id === value)?.name, [orgs, value]);

  const createOrg = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const { data, error } = await supabase.from("organizations").insert({ name: newName }).select("id,name").maybeSingle();
    setCreating(false);
    if (error) { toast.error(error.message); return; }
    if (data) {
      setOrgs(prev => [...prev, data]);
      onChange(data.id);
      toast.success("Workspace created");
      setNewName("");
    }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading workspaces…</div>;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Workspace:</span>
        <div className="flex items-center gap-2">
          {orgs.map(org => (
            <Button key={org.id} variant={org.id === value ? "default" : "outline"} size="sm" onClick={() => onChange(org.id)}>
              {org.name}
            </Button>
          ))}
          {orgs.length === 0 && <span className="text-sm">No workspaces yet</span>}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <input className="flex-1 rounded-md border px-3 py-2 bg-background" placeholder="Acme Corp" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Button variant="hero" onClick={createOrg} disabled={creating}>Create</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
