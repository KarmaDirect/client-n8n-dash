
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Workflow {
  id: string;
  name: string;
  is_active: boolean;
  description?: string | null;
}

interface SupportMessage {
  id: string;
  author: string;
  message: string;
  created_at: string;
}

export const AdminOrgDetails = ({ orgId }: { orgId: string }) => {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async () => {
    if (!orgId) return;
    setRefreshing(true);
    const [{ data: wData, error: wErr }, { data: mData, error: mErr }] = await Promise.all([
      supabase
        .from("workflows")
        .select("id,name,is_active,description")
        .eq("org_id", orgId)
        .order("created_at", { ascending: true }),
      supabase
        .from("support_messages")
        .select("id,author,message,created_at")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    if (wErr) console.error(wErr);
    if (mErr) console.error(mErr);
    setWorkflows(wData || []);
    setMessages(mData || []);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const sendAsAdmin = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("support_messages").insert({
      org_id: orgId,
      author: "admin",
      user_id: user?.id,
      message: text.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Échec de l’envoi");
      return;
    }
    toast.success("Message envoyé en tant qu’admin");
    setText("");
    fetchAll();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workflows</CardTitle>
          <CardDescription>Liste des workflows de l’organisation</CardDescription>
        </CardHeader>
        <CardContent>
          {workflows.length === 0 ? (
            <div className="text-sm text-muted-foreground">Aucun workflow.</div>
          ) : (
            <ul className="space-y-2">
              {workflows.map((w) => (
                <li key={w.id} className="p-2 rounded border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{w.name}</div>
                      {w.description ? (
                        <div className="text-sm text-muted-foreground">{w.description}</div>
                      ) : null}
                    </div>
                    <div className="text-xs px-2 py-1 rounded border">
                      {w.is_active ? "Actif" : "Inactif"}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Messages support</CardTitle>
            <CardDescription>Derniers échanges (20 plus récents)</CardDescription>
          </div>
          <Button variant="secondary" size="sm" onClick={fetchAll} disabled={refreshing}>
            {refreshing ? "Rafraîchissement..." : "Rafraîchir"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-sm text-muted-foreground">Aucun message.</div>
          ) : (
            <ul className="space-y-2 max-h-80 overflow-auto pr-2">
              {messages.map((m) => (
                <li key={m.id} className="p-2 rounded border">
                  <div className="text-xs text-muted-foreground">
                    {m.author} — {new Date(m.created_at).toLocaleString()}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{m.message}</div>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-2">
            <Textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Répondre en tant qu’admin…"
            />
            <div className="flex items-center justify-end gap-2">
              <Button onClick={sendAsAdmin} disabled={loading || !text.trim()}>
                Envoyer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrgDetails;
