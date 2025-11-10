import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { CardPremium } from "@/components/ui/card-premium";
import { ButtonPremium } from "@/components/ui/button-premium";
import { NumberTicker } from "@/components/ui/number-ticker";
import { 
  MessageSquare, 
  Mail, 
  Calendar, 
  BarChart3, 
  ShoppingCart, 
  Users, 
  Headphones,
  ArrowRight,
  Play,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { CTASection } from "@/components/cta-section";
import { typography } from "@/lib/constants/design-tokens";
import { cn } from "@/lib/utils";

const UseCases = () => {
  document.title = "Cas d'Usage — Webstate";

  const mainUseCases = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Support Client 24/7",
      description: "Automatisez vos réponses client et escaladez intelligemment les cas complexes.",
      benefits: [
        "Réduction de 80% du temps de réponse",
        "Satisfaction client +40%", 
        "Disponibilité 24h/24, 7j/7",
        "Support multilingue automatique"
      ],
      metrics: {
        improvement: "80%",
        label: "Temps de réponse réduit"
      },
      industry: "E-commerce, SaaS, Services",
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Génération & Qualification de Leads",
      description: "Identifiez, qualifiez et nurturez vos prospects automatiquement.",
      benefits: [
        "Augmentation de 200% de la conversion",
        "Lead scoring automatique",
        "Nurturing personnalisé",
        "CRM synchronisé en temps réel"
      ],
      metrics: {
        improvement: "200%",
        label: "Amélioration conversion"
      },
      industry: "Marketing, Vente, B2B",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Gestion des Rendez-vous",
      description: "Planification intelligente avec rappels automatiques et optimisation des créneaux.",
      benefits: [
        "Réduction de 90% des no-shows",
        "Optimisation automatique des créneaux",
        "Rappels multi-canaux",
        "Intégration calendriers existants"
      ],
      metrics: {
        improvement: "90%",
        label: "Réduction no-shows"
      },
      industry: "Santé, Conseil, Services",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analyse de Données Business",
      description: "Transformez vos données en insights actionables avec des rapports automatisés.",
      benefits: [
        "Gain de 15h par semaine",
        "Rapports temps réel",
        "Prédictions IA avancées",
        "Alertes automatiques"
      ],
      metrics: {
        improvement: "15h",
        label: "Gain hebdomadaire"
      },
      industry: "Finance, Retail, Manufacturing",
    }
  ];

  const industryUseCases = [
    {
      industry: "E-commerce",
      icon: <ShoppingCart className="w-6 h-6" />,
      useCases: [
        "Recommandations produits personnalisées",
        "Gestion automatique des retours",
        "Chat bot pour support achat",
        "Prévention de l'abandon de panier",
        "Gestion des stocks intelligente"
      ]
    },
    {
      industry: "Ressources Humaines", 
      icon: <Users className="w-6 h-6" />,
      useCases: [
        "Screening automatique des CV",
        "Planification des entretiens",
        "Onboarding personnalisé",
        "Évaluations de performance",
        "Gestion des congés intelligente"
      ]
    },
    {
      industry: "Finance",
      icon: <BarChart3 className="w-6 h-6" />,
      useCases: [
        "Détection de fraude en temps réel",
        "Évaluation automatique des risques",
        "Rapports de conformité",
        "Prévisions financières IA",
        "Gestion automatisée des factures"
      ]
    },
    {
      industry: "Santé",
      icon: <Headphones className="w-6 h-6" />,
      useCases: [
        "Prise de rendez-vous intelligente",
        "Rappels de traitement",
        "Triage automatique des urgences",
        "Suivi patient personnalisé",
        "Gestion des dossiers médicaux"
      ]
    }
  ];

  const successStories = [
    {
      company: "TechCorp",
      industry: "SaaS",
      result: "Réduction de 75% du temps de traitement client",
      metric: "75%",
      description: "Automatisation complète du support client avec escalade intelligente"
    },
    {
      company: "RetailPlus",
      industry: "E-commerce", 
      result: "Augmentation de 300% des ventes en ligne",
      metric: "300%",
      description: "IA de recommandation et chat bot personnalisé"
    },
    {
      company: "ConsultPro",
      industry: "Conseil",
      result: "Gain de 20h par semaine par consultant",
      metric: "20h",
      description: "Automatisation de la planification et des rapports"
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
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Cas d'Usage Concrets</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className={cn(typography.heading.h1, "mb-fluid-lg")}>
                  Des Solutions{" "}
                  <span className="text-primary">Éprouvées</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                  Découvrez comment nos clients transforment leurs opérations avec des cas d'usage concrets et des résultats mesurables.
                </p>
              </BlurFade>

              <BlurFade delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/auth">
                    <ButtonPremium size="lg" className="group">
                      Voir Votre Cas d'Usage
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </ButtonPremium>
                  </Link>
                  <ButtonPremium variant="outline" size="lg">
                    <Play className="mr-2 w-5 h-5" />
                    Études de Cas
                  </ButtonPremium>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Main Use Cases */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className={cn(typography.heading.h2, "mb-4")}>
                  Cas d'Usage Principaux
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Les domaines où notre IA excelle et transforme les entreprises
                </p>
              </div>
            </BlurFade>

            <div className="space-y-12 max-w-6xl mx-auto">
              {mainUseCases.map((useCase, index) => (
                <BlurFade key={useCase.title} delay={0.2 + index * 0.1}>
                  <CardPremium className="overflow-hidden hover:shadow-premium transition-all duration-base border-border">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                      {/* Content */}
                      <div className="lg:col-span-2 p-fluid-lg">
                        <div className="flex items-start gap-6">
                          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                            {useCase.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className={cn(typography.heading.h3, "mb-3")}>
                              {useCase.title}
                            </h3>
                            <p className="text-muted-foreground mb-6 text-lg">
                              {useCase.description}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                              {useCase.benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                  <span className="text-foreground text-sm">{benefit}</span>
                                </div>
                              ))}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <strong>Industries:</strong> {useCase.industry}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Metrics */}
                      <div className="bg-primary/10 p-fluid-lg text-primary flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border">
                        <div className="text-center">
                          <div className={cn(typography.heading.h1, "mb-2")}>
                            <NumberTicker value={parseInt(useCase.metrics.improvement.replace(/\D/g, '')) || 0} />
                            {useCase.metrics.improvement.replace(/\d/g, '')}
                          </div>
                          <p className="text-primary/80 font-medium">
                            {useCase.metrics.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardPremium>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Use Cases */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className={cn(typography.heading.h2, "mb-4")}>
                  Par Secteur d'Activité
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Des solutions adaptées à votre industrie
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {industryUseCases.map((industry, index) => (
                <BlurFade key={industry.industry} delay={0.2 + index * 0.1}>
                  <CardPremium className="h-full border-border">
                    <div className="p-fluid-lg">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          {industry.icon}
                        </div>
                        <h3 className={cn(typography.heading.h4)}>
                          {industry.industry}
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {industry.useCases.map((useCase, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-foreground">{useCase}</span>
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

        {/* Success Stories */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className={cn(typography.heading.h2, "mb-4")}>
                  Histoires de Succès
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Découvrez les résultats obtenus par nos clients
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {successStories.map((story, index) => (
                <BlurFade key={story.company} delay={0.2 + index * 0.1}>
                  <CardPremium className="text-center border-border hover:shadow-premium transition-shadow">
                    <div className="p-fluid-lg">
                      <div className={cn(typography.heading.h2, "text-primary mb-2")}>
                        <NumberTicker value={parseInt(story.metric.replace(/\D/g, '')) || 0} />
                        {story.metric.replace(/\d/g, '')}
                      </div>
                      <h3 className={cn(typography.heading.h5, "mb-2")}>
                        {story.company}
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm">
                        {story.industry}
                      </p>
                      <p className="text-foreground font-medium mb-3">
                        {story.result}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {story.description}
                      </p>
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

export default UseCases;