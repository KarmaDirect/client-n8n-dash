import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import WorkflowPanel from "@/components/dashboard/WorkflowPanel";
import { AutomationSection } from "@/components/dashboard/AutomationSection";
import { Bot } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

interface Workflow { 
  id: string; 
  name: string; 
  n8n_workflow_id: string | null; 
  is_active: boolean; 
  status?: string; // ✅ Ajouter status
  description?: string | null;
  category?: string;
}

const DashboardAutomations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const [orgId, setOrgId] = useState<string | undefined>(undefined);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    supabase
      .from("workflows")
      .select("id,name,n8n_workflow_id,is_active,status,description")
      .eq("org_id", orgId)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error);
        setWorkflows(data ?? []);
        setLoading(false);
      });
  }, [orgId]);

  const triggerRun = async (w: Workflow) => {
    // Implementation pour déclencher le workflow
    console.log("Trigger workflow", w);
  };

  const categories = [
    { id: "all", name: "Toutes", icon: Bot },
    { id: "marketing", name: "Marketing", icon: Bot },
    { id: "ecommerce", name: "E-commerce", icon: Bot },
    { id: "data", name: "Data & CRM", icon: Bot },
    { id: "email", name: "Email", icon: Bot },
  ];

  const filteredWorkflows = category === "all" 
    ? workflows 
    : workflows.filter(w => w.category === category);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Automations</h1>
          <p className="text-muted-foreground">
            Gérez et déclenchez vos workflows n8n
          </p>
        </div>

        {/* Filtres par catégorie */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = category === cat.id;
                return (
                  <Button
                    key={cat.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => navigate(`/app/automations${cat.id !== "all" ? `?category=${cat.id}` : ""}`)}
                    className={isActive ? "bg-primary" : ""}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {cat.name}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Liste des automations */}
        {orgId ? (
          <div className="space-y-6">
            <AutomationSection workflows={filteredWorkflows} onTrigger={triggerRun} />
            <WorkflowPanel orgId={orgId} />
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Aucune organisation sélectionnée</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardAutomations;

