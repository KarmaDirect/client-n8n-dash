import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Mail, Calendar, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

interface PendingOrg {
  id: string;
  name: string;
  owner_id: string;
  owner_email: string;
  created_at: string;
  approved: boolean;
}

const AdminApprovals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingOrgs, setPendingOrgs] = useState<PendingOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAndFetch();
  }, [user]);

  const checkAdminAndFetch = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      // Vérifier si l'utilisateur est admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        toast.error("Accès refusé : Vous n'êtes pas administrateur");
        navigate("/app");
        return;
      }

      setIsAdmin(true);
      await fetchPendingOrganizations();
    } catch (error) {
      console.error("Error checking admin status:", error);
      navigate("/app");
    }
  };

  const fetchPendingOrganizations = async () => {
    setLoading(true);
    try {
      // ✅ Utiliser la vue SQL sécurisée au lieu de auth.admin.listUsers()
      // Cette vue joint automatiquement les organisations avec les emails des users
      const { data: orgs, error } = await supabase
        .from("pending_organizations_with_emails")
        .select("*");

      if (error) throw error;

      setPendingOrgs(orgs || []);
    } catch (error) {
      console.error("Error fetching pending organizations:", error);
      toast.error("Erreur lors du chargement des organisations");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orgId: string, orgName: string) => {
    try {
      const { data, error } = await supabase.rpc("approve_organization", {
        org_id_param: orgId
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(`Organisation "${orgName}" approuvée !`);
        await fetchPendingOrganizations();
      } else {
        toast.error(data?.error || "Erreur lors de l'approbation");
      }
    } catch (error: any) {
      console.error("Error approving organization:", error);
      toast.error(error.message || "Erreur lors de l'approbation");
    }
  };

  const handleReject = async (orgId: string, orgName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir rejeter "${orgName}" ? Cette action est irréversible.`)) {
      return;
    }

    try {
      const { data, error } = await supabase.rpc("reject_organization", {
        org_id_param: orgId
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(`Organisation "${orgName}" rejetée et supprimée`);
        await fetchPendingOrganizations();
      } else {
        toast.error(data?.error || "Erreur lors du rejet");
      }
    } catch (error: any) {
      console.error("Error rejecting organization:", error);
      toast.error(error.message || "Erreur lors du rejet");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/app")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au dashboard
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Approbation des comptes
            </h1>
            <p className="text-slate-600">
              Gérez les demandes d'inscription en attente de validation
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">En attente</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingOrgs.length}</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Liste des organisations en attente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Organisations en attente</CardTitle>
              <CardDescription>
                Approuvez ou rejetez les nouvelles inscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : pendingOrgs.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg font-medium">
                    Aucune organisation en attente
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    Toutes les demandes ont été traitées
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOrgs.map((org, index) => (
                    <motion.div
                      key={org.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {org.name}
                            </h3>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              En attente
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{org.owner_email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Inscrit le {formatDate(org.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => handleApprove(org.id, org.name)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approuver
                          </Button>
                          <Button
                            onClick={() => handleReject(org.id, org.name)}
                            variant="destructive"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Rejeter
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminApprovals;




