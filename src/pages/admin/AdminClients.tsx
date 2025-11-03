import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/hooks/useAdmin";
import { Users, CheckCircle2, XCircle, Eye, Activity, Search } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Organization {
  id: string;
  name: string;
  owner_id: string;
  approved: boolean;
  created_at: string;
  owner_email?: string;
  workflow_count?: number;
  active_workflows?: number;
}

const AdminClients = () => {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/app", { replace: true });
      return;
    }
    if (isAdmin) {
      fetchOrganizations();
    }
  }, [isAdmin, loading, navigate]);

  const fetchOrganizations = async () => {
    setLoadingOrgs(true);
    try {
      const { data, error } = await supabase
        .from("organizations")
        .select(`
          id,
          name,
          owner_id,
          approved,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Enrichir avec les emails des owners et les stats
      // Note: on ne peut pas récupérer les emails directement côté client
      // On utilise une RPC function ou on laisse vide (visible via admin_impersonate)
      const enriched = await Promise.all(
        (data || []).map(async (org) => {
          // Compter les workflows
          const { count: workflowCount } = await supabase
            .from("workflows")
            .select("*", { count: "exact", head: true })
            .eq("org_id", org.id);

          const { count: activeCount } = await supabase
            .from("workflows")
            .select("*", { count: "exact", head: true })
            .eq("org_id", org.id)
            .eq("is_active", true);

          return {
            ...org,
            owner_email: "N/A", // Non accessible côté client pour sécurité
            workflow_count: workflowCount || 0,
            active_workflows: activeCount || 0,
          };
        })
      );

      setOrganizations(enriched);
    } catch (error: any) {
      console.error("Error fetching organizations:", error);
      toast.error("Erreur lors du chargement des clients");
    } finally {
      setLoadingOrgs(false);
    }
  };

  const toggleApproval = async (orgId: string, currentApproved: boolean) => {
    try {
      const { error } = await supabase
        .from("organizations")
        .update({ approved: !currentApproved })
        .eq("id", orgId);

      if (error) throw error;

      toast.success(`Organisation ${!currentApproved ? "approuvée" : "désapprouvée"}`);
      fetchOrganizations();
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.owner_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || loadingOrgs) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Gestion Clients</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble et gestion de tous vos clients
          </p>
        </div>

        {/* Stats rapides */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{organizations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clients Approuvés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {organizations.filter((o) => o.approved).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {organizations.filter((o) => !o.approved).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Workflows Totaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {organizations.reduce((sum, o) => sum + (o.workflow_count || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recherche */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des clients */}
        <Card>
          <CardHeader>
            <CardTitle>Clients ({filteredOrgs.length})</CardTitle>
            <CardDescription>Liste complète des organisations</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrgs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucun client trouvé
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Propriétaire</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Workflows</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrgs.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {org.owner_email}
                      </TableCell>
                      <TableCell>
                        <Badge variant={org.approved ? "default" : "secondary"}>
                          {org.approved ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Approuvé
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              En attente
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{org.active_workflows || 0} actifs</span>
                          <span className="text-muted-foreground">
                            / {org.workflow_count || 0} total
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(org.created_at).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/app/admin/workflows?org=${org.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Voir workflows
                          </Button>
                          <Button
                            size="sm"
                            variant={org.approved ? "destructive" : "default"}
                            onClick={() => toggleApproval(org.id, org.approved)}
                          >
                            {org.approved ? "Désapprouver" : "Approuver"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminClients;

