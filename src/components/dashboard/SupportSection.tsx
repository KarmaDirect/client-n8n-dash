import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Message { id: string; author: string; message: string; created_at: string }

export const SupportSection = ({ orgId, calendlyUrl = "https://calendly.com/your-link" }: { orgId?: string, calendlyUrl?: string }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orgId) return;
    supabase
      .from("support_messages")
      .select("id,author,message,created_at")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data, error }) => {
        if (error) console.error(error);
        setMessages(data || []);
      });
  }, [orgId]);

  const send = async () => {
    if (!orgId || !text.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("support_messages").insert({
      org_id: orgId,
      author: "client",
      user_id: user?.id,
      message: text,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Message envoyé");
    setText("");
    // Refresh
    const { data } = await supabase
      .from("support_messages")
      .select("id,author,message,created_at")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(10);
    setMessages(data || []);
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="w-2 h-2 rounded-full bg-primary/60"></div>
          Support & Communication 💬
        </CardTitle>
        <CardDescription>Échangez avec l'équipe et accédez aux documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <a href={calendlyUrl} target="_blank" rel="noreferrer">Prendre RDV avec un expert</a>
          </Button>
          <Button variant="outline" disabled>Mes documents (bientôt)</Button>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Messages récents</div>
          {messages.length === 0 ? (
            <div className="text-sm text-muted-foreground">Aucun message.</div>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-auto pr-2">
              {messages.map((m) => (
                <li key={m.id} className="p-2 rounded border">
                  <div className="text-xs text-muted-foreground">{m.author} — {new Date(m.created_at).toLocaleString()}</div>
                  <div className="text-sm whitespace-pre-wrap">{m.message}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <Textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Écrire un message…" />
          <div className="flex items-center justify-end gap-2">
            <Button onClick={send} disabled={loading || !orgId}>Envoyer</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};