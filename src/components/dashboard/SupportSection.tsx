import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Loader2, User, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface Message { 
  id: string; 
  author: string; 
  message: string; 
  created_at: string;
  user_id?: string;
}

export const SupportSection = ({ orgId, calendlyUrl = "https://calendly.com/your-link" }: { orgId?: string, calendlyUrl?: string }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!orgId) return;
    fetchMessages();
  }, [orgId]);

  const fetchMessages = async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("support_messages")
        .select("id,author,message,created_at,user_id")
        .eq("org_id", orgId)
        .order("created_at", { ascending: true })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast.error("Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!orgId || !text.trim()) return;
    
    setSending(true);
    try {
      const { error } = await supabase.from("support_messages").insert({
        org_id: orgId,
        author: "client",
        user_id: user?.id,
        message: text.trim(),
      });

      if (error) throw error;
      
      toast.success("Message envoyé");
      setText("");
      await fetchMessages();
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Erreur lors de l'envoi");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-64 border rounded-lg bg-muted/30 flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-muted-foreground">
            <div>
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucun message pour le moment</p>
              <p className="text-xs mt-1">Démarrez la conversation ci-dessous</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.author === "client" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      m.author === "client"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {m.author === "client" ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <MessageSquare className="w-3 h-3" />
                      )}
                      <span className="text-xs opacity-70">
                        {m.author === "client" ? "Vous" : "Support"}
                      </span>
                      <span className="text-xs opacity-50">
                        {formatDistanceToNow(new Date(m.created_at), { 
                          addSuffix: true
                        })}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words">{m.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrire un message à l'équipe support..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              send();
            }
          }}
          disabled={sending || !orgId}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {orgId ? "Appuyez sur Cmd/Ctrl + Enter pour envoyer" : "Chargement..."}
          </p>
          <Button onClick={send} disabled={sending || !orgId || !text.trim()}>
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Envoyer
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};