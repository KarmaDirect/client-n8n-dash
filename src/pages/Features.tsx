import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { CardPremium } from "@/components/ui/card-premium";
import { ButtonPremium } from "@/components/ui/button-premium";
import { NumberTicker } from "@/components/ui/number-ticker";
import { CheckCircle, Zap, Shield, Users, Clock, Bot, BarChart3, MessageSquare, Mail, Calendar, ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { CTASection } from "@/components/cta-section";
import { typography } from "@/lib/constants/design-tokens";
import { cn } from "@/lib/utils";

const Features = () => {
  document.title = "Fonctionnalités — Webstate";

  const mainFeatures = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "Agents IA Intelligents",
      description: "Créez des agents personnalisés qui comprennent votre métier et s'adaptent à vos processus.",
      features: ["Formation sur vos données", "Apprentissage continu", "Personnalisation avancée"],
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Automatisation Avancée",
      description: "Automatisez les tâches répétitives et libérez le potentiel de vos équipes.",
      features: ["Workflows intelligents", "Déclencheurs automatiques", "Intégrations natives"],
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Insights",
      description: "Suivez les performances et obtenez des insights actionables en temps réel.",
      features: ["Tableaux de bord temps réel", "Rapports automatisés", "KPIs personnalisés"],
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Sécurité Avancée",
      description: "Protection de niveau entreprise avec conformité RGPD garantie.",
      features: ["Chiffrement bout-en-bout", "Conformité RGPD", "Audit trails complets"],
    }
  ];

  const detailedFeatures = [
    {
      category: "Communication",
      icon: <MessageSquare className="w-6 h-6" />,
      items: [
        "Chat multicanal (email, SMS, WhatsApp)",
        "Réponses automatiques intelligentes",
        "Escalade automatique vers humains",
        "Support multilingue",
        "Sentiment analysis"
      ]
    },
    {
      category: "Gestion des Leads",
      icon: <Mail className="w-6 h-6" />,
      items: [
        "Qualification automatique des prospects",
        "Scoring comportemental",
        "Nurturing personnalisé",
        "CRM intégré",
        "Prévisions de conversion"
      ]
    },
    {
      category: "Planification",
      icon: <Calendar className="w-6 h-6" />,
      items: [
        "Calendrier intelligent",
        "Rappels automatiques",
        "Optimisation des créneaux",
        "Gestion des conflits",
        "Synchronisation multi-calendriers"
      ]
    },
    {
      category: "Analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      items: [
        "Dashboards personnalisables",
        "Métriques en temps réel",
        "Prédictions IA",
        "Export automatisé",
        "Alertes intelligentes"
      ]
    }
  ];

  const benefits = [
    {
      stat: "90%",
      label: "Réduction du temps de traitement",
      description: "Automatisez jusqu'à 90% de vos tâches répétitives"
    },
    {
      stat: "24/7",
      label: "Disponibilité continue",
      description: "Vos agents travaillent sans interruption"
    },
    {
      stat: "300%",
      label: "Augmentation du ROI",
      description: "ROI moyen observé chez nos clients"
    },
    {
      stat: "99.9%",
      label: "Temps de disponibilité",
      description: "Infrastructure haute disponibilité"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-background">
          <div className="container mx-auto px-4 py-fluid-2xl">
            <div className="text-center max-w-4xl mx-auto">
              <BlurFade delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-8">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Fonctionnalités Avancées</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className={cn(typography.heading.h1, "mb-fluid-lg")}>
                  Des Fonctionnalités{" "}
                  <span className="text-primary">Révolutionnaires</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                  Découvrez comment nos agents IA transforment votre façon de travailler avec des fonctionnalités conçues pour maximiser votre productivité.
                </p>
              </BlurFade>

              <BlurFade delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/auth">
                    <ButtonPremium size="lg" className="group">
                      Essayer Gratuitement
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </ButtonPremium>
                  </Link>
                  <ButtonPremium variant="outline" size="lg">
                    <Play className="mr-2 w-5 h-5" />
                    Voir la Démo
                  </ButtonPremium>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Main Features Grid */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className={cn(typography.heading.h2, "mb-4")}>
                  Fonctionnalités Principales
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Des outils puissants pour transformer votre entreprise
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {mainFeatures.map((feature, index) => (
                <BlurFade key={feature.title} delay={0.2 + index * 0.1}>
                  <CardPremium className="h-full hover:shadow-premium transition-all duration-base border-border">
                    <div className="p-fluid-lg">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <h3 className={cn(typography.heading.h3, "mb-4")}>
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 text-lg">
                        {feature.description}
                      </p>
                      <ul className="space-y-3">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardPremium>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Stats */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className={cn(typography.heading.h2, "mb-4")}>
                  Des Résultats Mesurables
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <BlurFade key={benefit.label} delay={0.2 + index * 0.1}>
                  <CardPremium className="text-center p-fluid-lg hover:shadow-premium transition-shadow">
                    <div className="text-4xl font-bold text-primary mb-2">
                      <NumberTicker value={parseInt(benefit.stat.replace(/\D/g, '')) || 0} />
                      {benefit.stat.replace(/\d/g, '')}
                    </div>
                    <h3 className={cn(typography.heading.h5, "mb-2")}>
                      {benefit.label}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
                  </CardPremium>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Features */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className={cn(typography.heading.h2, "mb-4")}>
                  Fonctionnalités Détaillées
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Explorez en détail toutes les capacités de notre plateforme
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {detailedFeatures.map((category, index) => (
                <BlurFade key={category.category} delay={0.2 + index * 0.1}>
                  <CardPremium className="h-full border-border">
                    <div className="p-fluid-lg">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          {category.icon}
                        </div>
                        <h3 className={cn(typography.heading.h4)}>
                          {category.category}
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {category.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardPremium>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
};

export default Features;