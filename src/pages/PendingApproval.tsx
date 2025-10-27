import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Mail, LogOut } from "lucide-react";
import { motion } from "motion/react";

const PendingApproval = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApprovalStatus();
  }, [user]);

  const checkApprovalStatus = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      // Vérifier si l'utilisateur a une organisation
      const { data: org, error } = await supabase
        .from("organizations")
        .select("id, name, approved")
        .eq("owner_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching organization:", error);
        setLoading(false);
        return;
      }

      if (org) {
        setOrgName(org.name);
        
        // Si approuvé, rediriger vers le dashboard
        if (org.approved) {
          navigate("/app");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center"
            >
              <Clock className="w-8 h-8 text-yellow-600" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Compte en attente de validation
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Votre compte a été créé avec succès !
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Info utilisateur */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4" />
                <span className="font-medium">Email :</span>
                <span>{user?.email}</span>
              </div>
              {orgName && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-medium">Organisation :</span>
                  <span>{orgName}</span>
                </div>
              )}
            </div>

            {/* Message d'attente */}
            <div className="space-y-3">
              <p className="text-slate-700 leading-relaxed">
                Votre compte est actuellement <strong>en attente d'approbation</strong> par notre équipe.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Vous recevrez un email de confirmation dès que votre compte sera activé. 
                Cela prend généralement <strong>24 à 48 heures</strong>.
              </p>
            </div>

            {/* Prochaines étapes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 text-sm">
                📋 Prochaines étapes
              </h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>✓ Votre compte a été créé</li>
                <li>⏳ En attente de validation par notre équipe</li>
                <li>📧 Vous recevrez un email de confirmation</li>
                <li>🚀 Accès complet à votre dashboard</li>
              </ul>
            </div>

            {/* Bouton de déconnexion */}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>

            {/* Support */}
            <div className="text-center text-xs text-slate-500">
              <p>Besoin d'aide ?</p>
              <a 
                href="mailto:support@webstate.com" 
                className="text-primary hover:underline font-medium"
              >
                Contactez le support
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PendingApproval;





