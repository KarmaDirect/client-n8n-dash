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
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Zap, Users, Shield, TrendingUp, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
  });
  
  document.title = mode === "signin" ? "Connexion — Webstate" : mode === "reset" ? "Réinitialiser le mot de passe — Webstate" : "Créer un compte — Webstate";

  useEffect(() => {
    if (user) navigate("/app", { replace: true });
  }, [user, navigate]);

  // Validate email in real-time
  useEffect(() => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Email invalide");
    } else {
      setEmailError("");
    }
  }, [email]);

  // Check password strength in real-time
  useEffect(() => {
    if (mode === "signup" && password) {
      setPasswordStrength({
        hasMinLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      });
    }
  }, [password, mode]);

  // Validate password match
  useEffect(() => {
    if (mode === "signup" && confirmPassword && password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword, mode]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (emailError) {
      toast.error("Veuillez entrer un email valide");
      return;
    }

    if (mode === "signup") {
      if (password !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }
      if (password.length < 8) {
        toast.error("Le mot de passe doit contenir au moins 8 caractères");
        return;
      }
    }

    setIsLoading(true);
    
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.");
          setMode("signin");
        }
      } else if (mode === "signin") {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error);
        } else {
          toast.success("Bienvenue !");
        }
      } else {
        // Sign up
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          toast.error(signUpError);
        } else {
          toast.success("Compte créé ! Vérifiez votre email pour confirmer.");
        }
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

  const getPasswordStrengthScore = () => {
    const { hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecial } = passwordStrength;
    return [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length;
  };

  const getPasswordStrengthColor = () => {
    const score = getPasswordStrengthScore();
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-yellow-500";
    if (score <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthLabel = () => {
    const score = getPasswordStrengthScore();
    if (score <= 2) return "Faible";
    if (score <= 3) return "Moyen";
    if (score <= 4) return "Bon";
    return "Excellent";
  };
  return (
    <main className="min-h-screen flex">
      {/* Bouton de retour */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-white/80 hover:bg-white rounded-lg px-4 py-2 shadow-sm backdrop-blur-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Retour</span>
      </motion.button>

      {/* Colonne de gauche - Formulaire */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <WebstateLogo size="lg" variant="gradient" className="mx-auto" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              {mode === "signin" ? "Connexion" : mode === "reset" ? "Mot de passe oublié" : "Créer un compte"}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-600"
            >
              {mode === "signin" 
                ? "Entrez votre email et mot de passe pour vous connecter" 
                : mode === "reset"
                ? "Entrez votre email pour réinitialiser votre mot de passe"
                : "Rejoignez Webstate et automatisez vos processus métier"
              }
            </motion.p>
          </div>

          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl">
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
                        className={`pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary transition-all ${
                          emailError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                        placeholder="votre@email.com"
                      />
                      <AnimatePresence>
                        {emailError && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-xs text-red-500 mt-1 flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            {emailError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Password */}
                  {mode !== "reset" && (
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required 
                          className="pl-10 pr-10 h-12 border-gray-300 focus:border-primary focus:ring-primary transition-all"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {mode === "signup" && password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 mt-3"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(getPasswordStrengthScore() / 5) * 100}%` }}
                                className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600">
                              {getPasswordStrengthLabel()}
                            </span>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className={`flex items-center gap-1 ${passwordStrength.hasMinLength ? "text-green-600" : "text-gray-400"}`}>
                              {passwordStrength.hasMinLength ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                              <span>Au moins 8 caractères</span>
                            </div>
                            <div className={`flex items-center gap-1 ${passwordStrength.hasUpperCase ? "text-green-600" : "text-gray-400"}`}>
                              {passwordStrength.hasUpperCase ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                              <span>Une majuscule</span>
                            </div>
                            <div className={`flex items-center gap-1 ${passwordStrength.hasLowerCase ? "text-green-600" : "text-gray-400"}`}>
                              {passwordStrength.hasLowerCase ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                              <span>Une minuscule</span>
                            </div>
                            <div className={`flex items-center gap-1 ${passwordStrength.hasNumber ? "text-green-600" : "text-gray-400"}`}>
                              {passwordStrength.hasNumber ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                              <span>Un chiffre</span>
                            </div>
                            <div className={`flex items-center gap-1 ${passwordStrength.hasSpecial ? "text-green-600" : "text-gray-400"}`}>
                              {passwordStrength.hasSpecial ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                              <span>Un caractère spécial</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Confirm Password */}
                  {mode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirmer le mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                          id="confirmPassword" 
                          type={showPassword ? "text" : "password"} 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          required 
                          className={`pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary transition-all ${
                            passwordError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                          }`}
                          placeholder="••••••••"
                        />
                      </div>
                      <AnimatePresence>
                        {passwordError && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-xs text-red-500 flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            {passwordError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* Forgot Password Link */}
                  {mode === "signin" && (
                    <div className="text-right">
                      <button 
                        type="button" 
                        className="text-sm text-primary hover:text-primary/80 underline transition-colors"
                        onClick={() => setMode("reset")}
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                  )}

                  {/* Bouton principal */}
                  <Button 
                    type="submit" 
                    disabled={isLoading || (mode === "signup" && (!!emailError || !!passwordError))}
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {mode === "signin" ? "Connexion..." : mode === "reset" ? "Envoi..." : "Création du compte..."}
                      </div>
                    ) : (
                      mode === "signin" ? "Se connecter" : mode === "reset" ? "Envoyer le lien" : "Créer le compte"
                    )}
                  </Button>

                  {/* Liens de navigation */}
                  <div className="text-center space-y-3">
                    {mode === "signin" ? (
                      <>
                        <button 
                          type="button" 
                          className="text-sm text-primary hover:text-primary/80 underline transition-colors"
                          onClick={() => setMode("signup")}
                        >
                          Pas encore de compte ? Créez-en un
                        </button>
                        <div className="text-xs text-gray-500">
                          <button 
                            type="button" 
                            className="underline hover:text-gray-700 transition-colors"
                            onClick={handleBootstrap}
                          >
                            Configurer l'admin Webstate
                          </button>
                        </div>
                      </>
                    ) : mode === "reset" ? (
                      <button 
                        type="button" 
                        className="text-sm text-primary hover:text-primary/80 underline transition-colors"
                        onClick={() => setMode("signin")}
                      >
                        Retour à la connexion
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        className="text-sm text-primary hover:text-primary/80 underline transition-colors"
                        onClick={() => setMode("signin")}
                      >
                        Déjà un compte ? Connectez-vous
                      </button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 text-center text-xs text-gray-500"
          >
            <p>En créant un compte ou en continuant par la connexion, vous acceptez nos</p>
            <div className="mt-2 space-x-4">
              <a href="#" className="underline hover:text-gray-700 transition-colors">Conditions générales</a>
              <a href="#" className="underline hover:text-gray-700 transition-colors">Politique de confidentialité</a>
              <a href="#" className="underline hover:text-gray-700 transition-colors">Politique de remboursement</a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Colonne de droite - Hero Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Overlay avec pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Contenu principal */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col justify-center px-12 py-16 text-white"
        >
          {/* Logo et titre */}
          <div className="mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold">Webstate</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-5xl font-bold mb-6 leading-tight"
            >
              Lancez votre automatisation métier
              <br />
              <span className="text-yellow-300">10X plus vite</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-white/90 max-w-md leading-relaxed"
            >
              Transformez vos processus avec l'automatisation alimentée par l'IA. De la génération de leads au support client, 
              laissez Webstate gérer les tâches répétitives pendant que vous vous concentrez sur la croissance.
            </motion.p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {[
              {
                icon: <Users className="w-6 h-6 text-white" />,
                title: "Plateforme Multi-tenant",
                description: "Gérez plusieurs organisations sans effort",
                delay: 0.5
              },
              {
                icon: <Shield className="w-6 h-6 text-white" />,
                title: "Sécurité Entreprise",
                description: "Sécurité bancaire pour vos données",
                delay: 0.6
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-white" />,
                title: "Analytics de Performance",
                description: "Suivez le ROI et l'efficacité des processus",
                delay: 0.7
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-white/80 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>

        {/* Floating circles animation */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-12 w-32 h-32 bg-white/5 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-12 w-40 h-40 bg-yellow-300/10 rounded-full blur-3xl"
        />
      </div>
    </main>
  );
};

export default Auth;
