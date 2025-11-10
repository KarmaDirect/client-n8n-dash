import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { ButtonPremium } from "@/components/ui/button-premium";
import { CardPremium } from "@/components/ui/card-premium";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Building2, Users, Zap, CreditCard, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OnboardingData {
  // Étape 1: Informations Entreprise
  companyName: string;
  companySize: string;
  industry: string;
  website?: string;
  
  // Étape 2: Équipe
  teamSize: string;
  primaryContact: string;
  role: string;
  
  // Étape 3: Besoins Automation
  automationNeeds: string[];
  currentTools: string[];
  priority: string;
  
  // Étape 4: Facturation
  billingEmail: string;
  billingAddress?: string;
  vatNumber?: string;
  
  // Étape 5: Confirmation
  termsAccepted: boolean;
  newsletter: boolean;
}

const STEPS = [
  { id: 1, title: "Entreprise", icon: Building2 },
  { id: 2, title: "Équipe", icon: Users },
  { id: 3, title: "Automatisation", icon: Zap },
  { id: 4, title: "Facturation", icon: CreditCard },
  { id: 5, title: "Confirmation", icon: CheckCircle2 },
];

export const OnboardingFlow = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    companyName: "",
    companySize: "",
    industry: "",
    website: "",
    teamSize: "",
    primaryContact: "",
    role: "",
    automationNeeds: [],
    currentTools: [],
    priority: "",
    billingEmail: "",
    billingAddress: "",
    vatNumber: "",
    termsAccepted: false,
    newsletter: false,
  });

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.companyName && data.companySize && data.industry;
      case 2:
        return data.teamSize && data.primaryContact && data.role;
      case 3:
        return data.automationNeeds.length > 0 && data.priority;
      case 4:
        return data.billingEmail;
      case 5:
        return data.termsAccepted;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    setLoading(true);
    try {
      // Créer l'organisation
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: data.companyName,
          owner_id: user.id,
          approved: false, // Nécessite approbation manuelle
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Sauvegarder les données d'onboarding (créer une table onboarding_data si nécessaire)
      // Pour l'instant, on peut les mettre dans le metadata de l'org
      const { error: updateError } = await supabase
        .from("organizations")
        .update({
          // On peut ajouter un champ metadata JSON pour stocker ces infos
        })
        .eq("id", org.id);

      if (updateError) throw updateError;

      toast.success("Inscription terminée ! Votre compte est en attente d'approbation.");
      navigate("/pending-approval");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`);
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-base",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-premium"
                        : isCompleted
                        ? "bg-primary/20 text-primary border-primary"
                        : "bg-muted text-muted-foreground border-muted"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "mt-2 text-xs font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <CardPremium className="p-fluid-xl">
          {/* Step 1: Informations Entreprise */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-3xl font-bold mb-2">Informations sur votre entreprise</h2>
                <p className="text-muted-foreground">Commençons par les bases</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                  <Input
                    id="companyName"
                    value={data.companyName}
                    onChange={(e) => updateData({ companyName: e.target.value })}
                    placeholder="Ex: Acme Corp"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="companySize">Taille de l'entreprise *</Label>
                  <Select
                    value={data.companySize}
                    onValueChange={(value) => updateData({ companySize: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employés</SelectItem>
                      <SelectItem value="11-50">11-50 employés</SelectItem>
                      <SelectItem value="51-200">51-200 employés</SelectItem>
                      <SelectItem value="201-500">201-500 employés</SelectItem>
                      <SelectItem value="500+">500+ employés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="industry">Secteur d'activité *</Label>
                  <Select
                    value={data.industry}
                    onValueChange={(value) => updateData({ industry: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technologie</SelectItem>
                      <SelectItem value="retail">Commerce</SelectItem>
                      <SelectItem value="healthcare">Santé</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Éducation</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="website">Site web (optionnel)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={data.website}
                    onChange={(e) => updateData({ website: e.target.value })}
                    placeholder="https://example.com"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Équipe */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-3xl font-bold mb-2">Votre équipe</h2>
                <p className="text-muted-foreground">Qui utilisera WebState ?</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teamSize">Taille de l'équipe qui utilisera WebState *</Label>
                  <Select
                    value={data.teamSize}
                    onValueChange={(value) => updateData({ teamSize: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Moi seul</SelectItem>
                      <SelectItem value="2-5">2-5 personnes</SelectItem>
                      <SelectItem value="6-20">6-20 personnes</SelectItem>
                      <SelectItem value="21+">21+ personnes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="primaryContact">Contact principal *</Label>
                  <Input
                    id="primaryContact"
                    value={data.primaryContact}
                    onChange={(e) => updateData({ primaryContact: e.target.value })}
                    placeholder="nom@entreprise.com"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Votre rôle *</Label>
                  <Select
                    value={data.role}
                    onValueChange={(value) => updateData({ role: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ceo">CEO / Fondateur</SelectItem>
                      <SelectItem value="cto">CTO / Tech Lead</SelectItem>
                      <SelectItem value="manager">Manager / Directeur</SelectItem>
                      <SelectItem value="developer">Développeur</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Besoins Automation */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-3xl font-bold mb-2">Vos besoins en automatisation</h2>
                <p className="text-muted-foreground">Qu'aimeriez-vous automatiser ?</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Besoins d'automatisation *</Label>
                  <div className="mt-3 space-y-2">
                    {[
                      { value: "support", label: "Support client 24/7" },
                      { value: "leads", label: "Génération de leads" },
                      { value: "rdv", label: "Gestion des rendez-vous" },
                      { value: "data", label: "Analyse de données" },
                      { value: "email", label: "Campagnes email" },
                      { value: "crm", label: "Synchronisation CRM" },
                    ].map((need) => (
                      <div key={need.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={need.value}
                          checked={data.automationNeeds.includes(need.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateData({
                                automationNeeds: [...data.automationNeeds, need.value],
                              });
                            } else {
                              updateData({
                                automationNeeds: data.automationNeeds.filter(
                                  (n) => n !== need.value
                                ),
                              });
                            }
                          }}
                        />
                        <Label htmlFor={need.value} className="cursor-pointer">
                          {need.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="priority">Priorité principale *</Label>
                  <Select
                    value={data.priority}
                    onValueChange={(value) => updateData({ priority: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time">Gagner du temps</SelectItem>
                      <SelectItem value="cost">Réduire les coûts</SelectItem>
                      <SelectItem value="scale">Scaler rapidement</SelectItem>
                      <SelectItem value="quality">Améliorer la qualité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Facturation */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-3xl font-bold mb-2">Informations de facturation</h2>
                <p className="text-muted-foreground">Pour la facturation et les reçus</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="billingEmail">Email de facturation *</Label>
                  <Input
                    id="billingEmail"
                    type="email"
                    value={data.billingEmail}
                    onChange={(e) => updateData({ billingEmail: e.target.value })}
                    placeholder="facturation@entreprise.com"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="billingAddress">Adresse de facturation (optionnel)</Label>
                  <Textarea
                    id="billingAddress"
                    value={data.billingAddress}
                    onChange={(e) => updateData({ billingAddress: e.target.value })}
                    placeholder="Adresse complète..."
                    className="mt-2"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="vatNumber">Numéro TVA (optionnel)</Label>
                  <Input
                    id="vatNumber"
                    value={data.vatNumber}
                    onChange={(e) => updateData({ vatNumber: e.target.value })}
                    placeholder="FR12345678901"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-3xl font-bold mb-2">Dernière étape</h2>
                <p className="text-muted-foreground">Vérifiez vos informations et acceptez les conditions</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <p><strong>Entreprise:</strong> {data.companyName}</p>
                  <p><strong>Taille:</strong> {data.companySize}</p>
                  <p><strong>Secteur:</strong> {data.industry}</p>
                  <p><strong>Contact:</strong> {data.primaryContact}</p>
                  <p><strong>Facturation:</strong> {data.billingEmail}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={data.termsAccepted}
                      onCheckedChange={(checked) =>
                        updateData({ termsAccepted: checked === true })
                      }
                    />
                    <Label htmlFor="terms" className="cursor-pointer">
                      J'accepte les{" "}
                      <a href="/terms" target="_blank" className="text-primary hover:underline">
                        conditions d'utilisation
                      </a>{" "}
                      et la{" "}
                      <a href="/privacy" target="_blank" className="text-primary hover:underline">
                        politique de confidentialité
                      </a>{" "}
                      *
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={data.newsletter}
                      onCheckedChange={(checked) =>
                        updateData({ newsletter: checked === true })
                      }
                    />
                    <Label htmlFor="newsletter" className="cursor-pointer">
                      Je souhaite recevoir des mises à jour et des conseils (optionnel)
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <ButtonPremium
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Précédent
            </ButtonPremium>
            
            {currentStep < STEPS.length ? (
              <ButtonPremium
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Suivant
                <ArrowRight className="w-4 h-4" />
              </ButtonPremium>
            ) : (
              <ButtonPremium
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="flex items-center gap-2"
              >
                {loading ? "Envoi..." : "Terminer l'inscription"}
                <CheckCircle2 className="w-4 h-4" />
              </ButtonPremium>
            )}
          </div>
        </CardPremium>
      </div>
    </div>
  );
};
