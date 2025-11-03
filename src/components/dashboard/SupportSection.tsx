import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Loader2, User, MessageSquare, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

// Helper function pour formater la date de manière sécurisée
const formatDateSafe = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Date inconnue';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Date invalide';
  }
};

interface Message { 
  id: string; 
  author: string; 
  message: string; 
  created_at: string;
  user_id?: string;
  read?: boolean;
  read_at?: string | null;
}

export const SupportSection = ({ orgId, calendlyUrl = "https://calendly.com/your-link" }: { orgId?: string, calendlyUrl?: string }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orgId) return;
    fetchMessages();
    
    // Setup realtime pour les nouveaux messages
    const channel = supabase
      .channel(`support_messages_client_${orgId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'support_messages',
        filter: `org_id=eq.${orgId}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages((prev) => [...prev, newMessage]);
        // Marquer les messages admin comme lus quand ils arrivent
        if (newMessage.author === 'admin' && !newMessage.read) {
          markAsRead(newMessage.id);
        }
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'support_messages',
        filter: `org_id=eq.${orgId}`
      }, (payload) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === payload.new.id ? (payload.new as Message) : msg
          )
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orgId]);

  useEffect(() => {
    // Scroll vers le bas quand de nouveaux messages arrivent
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
      
      // Marquer tous les messages admin non lus comme lus
      const unreadAdminMessages = (data || []).filter(
        (msg) => msg.author === 'admin' && !msg.read
      );
      if (unreadAdminMessages.length > 0) {
        await Promise.all(
          unreadAdminMessages.map((msg) => markAsRead(msg.id))
        );
      }
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast.error("Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('support_messages')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking as read:', error);
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
        read: false, // L'admin doit le lire
      });

      if (error) throw error;
      
      toast.success("Message envoyé");
      setText("");
      // Le message sera ajouté via realtime
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
                  className={cn("flex", m.author === "client" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      m.author === "client"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border"
                    )}
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
                      {m.author === "client" && m.read && (
                        <CheckCircle2 className="w-3 h-3 opacity-50" />
                      )}
                      <span className="text-xs opacity-50">
                        {formatDateSafe(m.created_at)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words">{m.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
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