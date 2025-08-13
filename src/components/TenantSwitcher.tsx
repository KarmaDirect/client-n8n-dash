import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Building2, Plus } from "lucide-react";

interface Organization { 
  id: string; 
  name: string; 
  created_at: string;
}

export const TenantSwitcher = ({ 
  value, 
  onChange, 
  showCreateNew = true 
}: { 
  value?: string; 
  onChange: (orgId: string) => void;
  showCreateNew?: boolean;
}) => {
  const { user } = useAuth();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  
  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("organizations")
          .select("id, name, created_at")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: true });
          
        if (error) throw error;
        setOrgs(data || []);
      } catch (error: any) {
        console.error('Error fetching organizations:', error);
        toast.error('Erreur lors du chargement des organisations');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [user]);

  const selectedOrg = useMemo(() => 
    orgs.find(o => o.id === value), 
    [orgs, value]
  );

  const createOrg = async () => {
    if (!newName.trim()) {
      toast.error("Veuillez saisir un nom d'organisation");
      return;
    }
    
    if (!user?.id) { 
      toast.error("Vous devez être connecté"); 
      return; 
    }
    
    setCreating(true);
    try {
      const { data, error } = await supabase
        .from("organizations")
        .insert({ name: newName.trim(), owner_id: user.id })
        .select("id, name, created_at")
        .single();
        
      if (error) throw error;
      
      if (data) {
        setOrgs(prev => [...prev, data]);
        onChange(data.id);
        toast.success(`Organisation "${data.name}" créée avec succès`);
        setNewName("");
      }
    } catch (error: any) {
      toast.error('Erreur lors de la création: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Building2 className="h-4 w-4" />
        Chargement des organisations...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Building2 className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">
            Organisation active
          </label>
          {orgs.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Aucune organisation trouvée
            </div>
          ) : (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="min-w-[200px]">
                <SelectValue placeholder="Sélectionner une organisation">
                  {selectedOrg && (
                    <div className="flex items-center gap-2">
                      <span>{selectedOrg.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {orgs.map(org => (
                  <SelectItem key={org.id} value={org.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{org.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(org.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {showCreateNew && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Créer une nouvelle organisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <input 
                className="flex-1 rounded-md border px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                placeholder="Nom de l'organisation (ex: Mon Entreprise)" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createOrg()}
                disabled={creating}
              />
              <Button 
                onClick={createOrg} 
                disabled={creating || !newName.trim()}
                size="sm"
              >
                {creating ? "Création..." : "Créer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {orgs.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {orgs.length} organisation(s) disponible(s)
        </div>
      )}
    </div>
  );
};