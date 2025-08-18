import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { WebstateLogo } from "@/components/ui/webstate-logo";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Zap, Users, Shield, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  document.title = mode === "signin" ? "Connexion — Webstate" : "Créer un compte — Webstate";

  useEffect(() => {
    if (user) navigate("/app", { replace: true });
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === "signin") {
        const { error } = await signIn(email, password);
        if (error) toast.error(error); 
        else toast.success("Bienvenue !");
      } else {
        const { error } = await signUp(email, password);
        if (error) toast.error(error); 
        else toast.success("Vérifiez votre email pour confirmer votre compte.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBootstrap = async () => {
    if (!email || !password) { 
      toast.error("Renseignez email et mot de passe."); 
      return; 
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("bootstrap-admin", {
        body: { email, password, org_name: "Webstate (Agence)" },
      });
      if (error) { 
        toast.error(error.message || "Échec de configuration"); 
        return; 
      }
      toast.success("Admin Webstate créé. Vous pouvez vous connecter.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex">
      {/* Bouton de retour */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-white/80 hover:bg-white rounded-lg px-4 py-2 shadow-sm backdrop-blur-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Retour</span>
      </button>

      {/* Colonne de gauche - Formulaire */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <WebstateLogo size="lg" variant="gradient" className="mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === "signin" ? "Connexion" : "Créer un compte"}
            </h1>
            <p className="text-gray-600">
              {mode === "signin" 
                ? "Entrez votre email et mot de passe pour vous connecter !" 
                : "Rejoignez Webstate et automatisez vos processus métier"
              }
            </p>
          </div>

          {/* Formulaire */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary"
                      placeholder="Votre adresse email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Votre mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      className="pl-10 pr-10 h-12 border-gray-300 focus:border-primary focus:ring-primary"
                      placeholder="Votre mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Bouton principal */}
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {mode === "signin" ? "Connexion..." : "Création du compte..."}
                    </div>
                  ) : (
                    mode === "signin" ? "Se connecter" : "Créer le compte"
                  )}
                </Button>

                {/* Liens de navigation */}
                <div className="text-center space-y-3">
                  {mode === "signin" ? (
                    <>
                      <button 
                        type="button" 
                        className="text-sm text-primary hover:text-primary/80 underline"
                        onClick={() => setMode("signup")}
                      >
                        Pas encore de compte ? Créez-en un
                      </button>
                      <div className="text-xs text-gray-500">
                        <button 
                          type="button" 
                          className="underline hover:text-gray-700"
                          onClick={handleBootstrap}
                        >
                          Configurer l'admin Webstate
                        </button>
                      </div>
                    </>
                  ) : (
                    <button 
                      type="button" 
                      className="text-sm text-primary hover:text-primary/80 underline"
                      onClick={() => setMode("signin")}
                    >
                      Déjà un compte ? Connectez-vous
                    </button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>En créant un compte ou en continuant par la connexion, vous acceptez nos</p>
            <div className="mt-2 space-x-4">
              <a href="#" className="underline hover:text-gray-700">Conditions générales</a>
              <a href="#" className="underline hover:text-gray-700">Politique de confidentialité</a>
              <a href="#" className="underline hover:text-gray-700">Politique de remboursement</a>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne de droite - Hero Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
        {/* Overlay avec pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Contenu principal */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          {/* Logo et titre */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold">Webstate</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Lancez votre automatisation métier
              <br />
              <span className="text-yellow-300">10X plus vite</span>
            </h2>
            <p className="text-lg text-white/90 max-w-md">
              Transformez vos processus avec l'automatisation alimentée par l'IA. De la génération de leads au support client, 
              laissez Webstate gérer les tâches répétitives pendant que vous vous concentrez sur la croissance.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Plateforme Multi-tenant</h3>
                <p className="text-white/80">Gérez plusieurs organisations sans effort</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Sécurité Entreprise</h3>
                <p className="text-white/80">Sécurité bancaire pour vos données</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Analytics de Performance</h3>
                <p className="text-white/80">Suivez le ROI et l'efficacité des processus</p>
              </div>
            </div>
          </div>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute top-8 right-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-white rotate-45" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;
