import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { MessageSquare, Send, Loader2, User, Bot, Search, CheckCircle2 } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface SupportMessage {
  id: string;
  org_id: string;
  author: string;
  message: string;
  created_at: string;
  read: boolean;
  read_at: string | null;
  user_id?: string;
}

interface Conversation {
  org_id: string;
  org_name: string;
  owner_email: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

const AdminSupportChat = () => {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAdmin) return;
    fetchConversations();
    // Setup realtime pour les nouvelles conversations
    const channel = supabase
      .channel('support_conversations')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'support_messages'
      }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  useEffect(() => {
    if (selectedOrgId) {
      fetchMessages(selectedOrgId);
      markAsRead(selectedOrgId);
    }
  }, [selectedOrgId]);

  useEffect(() => {
    if (selectedOrgId) {
      // Setup realtime pour les nouveaux messages de cette org
      const channel = supabase
        .channel(`support_messages_${selectedOrgId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `org_id=eq.${selectedOrgId}`
        }, (payload) => {
          setMessages((prev) => [...prev, payload.new as SupportMessage]);
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'support_messages',
          filter: `org_id=eq.${selectedOrgId}`
        }, (payload) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.new.id ? (payload.new as SupportMessage) : msg
            )
          );
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedOrgId]);

  useEffect(() => {
    // Scroll vers le bas quand de nouveaux messages arrivent
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      // Récupérer toutes les organisations avec leurs derniers messages
      const { data: orgs, error: orgsError } = await supabase
        .from('organizations')
        .select('id, name, owner_id')
        .order('created_at', { ascending: false });

      if (orgsError) throw orgsError;

      // Pour chaque org, récupérer le dernier message et le nombre de non lus
      const conversationsData = await Promise.all(
        (orgs || []).map(async (org) => {
          const { data: lastMsg } = await supabase
            .from('support_messages')
            .select('message, created_at, author')
            .eq('org_id', org.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const { count: unreadCount } = await supabase
            .from('support_messages')
            .select('id', { count: 'exact', head: true })
            .eq('org_id', org.id)
            .eq('author', 'client')
            .eq('read', false);

          // Récupérer l'email du propriétaire via une query sur auth.users n'est pas possible côté client
          // On va utiliser une fonction RPC ou une vue pour ça
          // Pour l'instant, on va juste utiliser l'org_id et chercher dans subscribers
          const { data: subscriberData } = await supabase
            .from('subscribers')
            .select('email')
            .eq('user_id', org.owner_id)
            .maybeSingle();

          return {
            org_id: org.id,
            org_name: org.name,
            owner_email: subscriberData?.email || 'Unknown',
            last_message: lastMsg?.message || 'Aucun message',
            last_message_at: lastMsg?.created_at || org.created_at,
            unread_count: unreadCount || 0,
          };
        })
      );

      setConversations(conversationsData.sort((a, b) => 
        new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      ));
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast.error('Erreur lors du chargement des conversations');
    }
  };

  const fetchMessages = async (orgId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (orgId: string) => {
    try {
      // Marquer tous les messages du client comme lus
      await supabase.rpc('mark_support_messages_as_read', {
        _org_id: orgId,
        _author: 'client'
      });
      // Mettre à jour localement
      setMessages((prev) =>
        prev.map((msg) =>
          msg.org_id === orgId && msg.author === 'client' && !msg.read
            ? { ...msg, read: true, read_at: new Date().toISOString() }
            : msg
        )
      );
      fetchConversations(); // Rafraîchir le compteur
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedOrgId || !messageText.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase.from('support_messages').insert({
        org_id: selectedOrgId,
        author: 'admin',
        user_id: user?.id,
        message: messageText.trim(),
        read: false, // Le client doit le lire
      });

      if (error) throw error;

      toast.success('Message envoyé');
      setMessageText('');
      // Le message sera ajouté via realtime
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.org_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.owner_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversation = conversations.find((c) => c.org_id === selectedOrgId);

  if (adminLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Accès réservé aux administrateurs</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Support Chat</h1>
          <p className="text-muted-foreground">
            Gérez les conversations avec vos clients
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Liste des conversations */}
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Conversations
              </CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                <div className="p-2 space-y-1">
                  {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <div
                        key={conv.org_id}
                        onClick={() => setSelectedOrgId(conv.org_id)}
                        className={cn(
                          "p-3 rounded-lg cursor-pointer transition-colors",
                          selectedOrgId === conv.org_id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm truncate">{conv.org_name}</p>
                              {conv.unread_count > 0 && (
                                <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                                  {conv.unread_count}
                                </Badge>
                              )}
                            </div>
                            <p className={cn(
                              "text-xs truncate",
                              selectedOrgId === conv.org_id ? "text-primary-foreground/80" : "text-muted-foreground"
                            )}>
                              {conv.owner_email}
                            </p>
                            <p className={cn(
                              "text-xs mt-1 truncate",
                              selectedOrgId === conv.org_id ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              {conv.last_message}
                            </p>
                          </div>
                        </div>
                        <p className={cn(
                          "text-xs mt-1",
                          selectedOrgId === conv.org_id ? "text-primary-foreground/60" : "text-muted-foreground"
                        )}>
                          {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Zone de chat */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedOrgId ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {selectedConversation?.org_name}
                      </CardTitle>
                      <CardDescription>{selectedConversation?.owner_email}</CardDescription>
                    </div>
                    {selectedConversation && selectedConversation.unread_count > 0 && (
                      <Badge variant="destructive">
                        {selectedConversation.unread_count} non lu(s)
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4" ref={messagesContainerRef}>
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                        <div>
                          <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Aucun message pour le moment</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              "flex",
                              msg.author === "admin" ? "justify-end" : "justify-start"
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[75%] rounded-lg p-3",
                                msg.author === "admin"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              )}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {msg.author === "admin" ? (
                                  <Bot className="w-3 h-3" />
                                ) : (
                                  <User className="w-3 h-3" />
                                )}
                                <span className="text-xs opacity-70">
                                  {msg.author === "admin" ? "Vous" : "Client"}
                                </span>
                                {msg.read && msg.author === "admin" && (
                                  <CheckCircle2 className="w-3 h-3 opacity-50" />
                                )}
                              </div>
                              <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                              <p className="text-xs opacity-50 mt-1">
                                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  <Separator />

                  {/* Input */}
                  <div className="p-4">
                    <div className="flex gap-2">
                      <Textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                            sendMessage();
                          }
                        }}
                        placeholder="Tapez votre message... (Cmd/Ctrl + Enter pour envoyer)"
                        rows={3}
                        disabled={sending}
                        className="resize-none"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={sending || !messageText.trim()}
                        size="icon"
                        className="self-end"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez une conversation pour commencer</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSupportChat;

