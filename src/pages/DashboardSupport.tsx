import { DashboardLayout } from "@/components/DashboardLayout";
import { SupportSection } from "@/components/dashboard/SupportSection";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Bot } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DashboardSupport = () => {
  const { user } = useAuth();
  const [orgId, setOrgId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem("orgId");
    if (stored) {
      setOrgId(stored);
    } else {
      supabase
        .from('organizations')
        .select('id')
        .eq('owner_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setOrgId(data.id);
            localStorage.setItem("orgId", data.id);
          }
        });
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const messageContent = inputValue;
    const userMessage = { role: "user" as const, content: messageContent };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simuler une réponse IA (à remplacer par une vraie API)
    setTimeout(() => {
      const aiMessage = {
        role: "assistant" as const,
        content: `Merci pour votre message : "${messageContent}". Je suis là pour vous aider avec vos automations n8n. Comment puis-je vous assister aujourd'hui ?`,
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Support</h1>
          <p className="text-muted-foreground">
            Obtenez de l'aide et contactez notre équipe
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Chatbot IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                Chat Support IA
              </CardTitle>
              <CardDescription>
                Obtenez des réponses instantanées à vos questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64 border rounded-lg p-4 overflow-y-auto bg-muted/30 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-center">
                    <div>
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Démarrez une conversation</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Tapez votre question..."
                />
                <Button onClick={handleSendMessage}>Envoyer</Button>
              </div>
            </CardContent>
          </Card>

          {/* Support Section existante */}
          <div>
            <SupportSection orgId={orgId} calendlyUrl="https://calendly.com/hatim-moro-2002/30min" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardSupport;

