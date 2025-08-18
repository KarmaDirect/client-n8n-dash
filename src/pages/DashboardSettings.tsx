import { useState } from "react";
import { motion } from "motion/react";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { CardPremium, CardContent, CardHeader, CardTitle } from "@/components/ui/card-premium";
import { ButtonPremium } from "@/components/ui/button-premium";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Key, 
  Save,
  Eye,
  EyeOff,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface DashboardSettingsProps {}

export function DashboardSettings({}: DashboardSettingsProps) {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });
  const [privacy, setPrivacy] = useState({
    analytics: true,
    marketing: false,
    thirdParty: false
  });

  const handleSave = () => {
    // Logique de sauvegarde
    console.log("Sauvegarde des paramètres...");
  };

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-16">
        <div className="container mx-auto px-4 py-fluid-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-fluid-2xl"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h1 className="text-fluid-3xl sm:text-fluid-4xl font-display font-bold text-foreground mb-fluid-md">
                  Paramètres
                </h1>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl">
                  Gérez vos préférences et la configuration de votre compte
                </p>
              </div>
              
              <ButtonPremium size="lg" onClick={handleSave} className="group">
                <Save className="mr-2 w-5 h-5" />
                Sauvegarder
              </ButtonPremium>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <CardPremium>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle>Profil</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          defaultValue={user?.email?.split('@')[0] || ''}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          placeholder="Votre nom"
                          className="mt-2"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user?.email || ''}
                        disabled
                        className="mt-2 bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        L'email ne peut pas être modifié
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="company">Entreprise</Label>
                      <Input
                        id="company"
                        placeholder="Nom de votre entreprise"
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </CardPremium>
              </motion.div>

              {/* Security Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CardPremium>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle>Sécurité</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <div className="relative mt-2">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Entrez votre mot de passe actuel"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Entrez votre nouveau mot de passe"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirmez votre nouveau mot de passe"
                        className="mt-2"
                      />
                    </div>

                    <div className="pt-4">
                      <ButtonPremium variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer le compte
                      </ButtonPremium>
                    </div>
                  </CardContent>
                </CardPremium>
              </motion.div>

              {/* Notification Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <CardPremium>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bell className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle>Notifications</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotif">Notifications par email</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevoir les notifications importantes par email
                        </p>
                      </div>
                      <Switch
                        id="emailNotif"
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotif">Notifications push</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications en temps réel dans le navigateur
                        </p>
                      </div>
                      <Switch
                        id="pushNotif"
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsNotif">Notifications SMS</Label>
                        <p className="text-sm text-muted-foreground">
                          Alertes critiques par SMS
                        </p>
                      </div>
                      <Switch
                        id="smsNotif"
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                      />
                    </div>
                  </CardContent>
                </CardPremium>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Privacy Settings */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <CardPremium>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle>Confidentialité</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="analytics">Analytics anonymes</Label>
                        <p className="text-sm text-muted-foreground">
                          Aider à améliorer le service
                        </p>
                      </div>
                      <Switch
                        id="analytics"
                        checked={privacy.analytics}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, analytics: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing">Emails marketing</Label>
                        <p className="text-sm text-muted-foreground">
                          Nouvelles fonctionnalités
                        </p>
                      </div>
                      <Switch
                        id="marketing"
                        checked={privacy.marketing}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, marketing: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="thirdParty">Partage tiers</Label>
                        <p className="text-sm text-muted-foreground">
                          Intégrations externes
                        </p>
                      </div>
                      <Switch
                        id="thirdParty"
                        checked={privacy.thirdParty}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, thirdParty: checked })}
                      />
                    </div>
                  </CardContent>
                </CardPremium>
              </motion.div>

              {/* API Keys */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <CardPremium>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Key className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle>Clés API</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="apiKey">Clé API principale</Label>
                      <div className="relative mt-2">
                        <Input
                          id="apiKey"
                          type="password"
                          value="sk_live_...1234"
                          readOnly
                          className="bg-muted font-mono text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <ButtonPremium variant="outline" size="sm" className="flex-1">
                        Régénérer
                      </ButtonPremium>
                      <ButtonPremium variant="outline" size="sm" className="flex-1">
                        Copier
                      </ButtonPremium>
                    </div>
                  </CardContent>
                </CardPremium>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default DashboardSettings;

