import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonPremium } from "@/components/ui/button-premium";
import { NumberTicker } from "@/components/ui/number-ticker";
import { 
  MessageSquare, 
  Mail, 
  Calendar, 
  BarChart3, 
  ShoppingCart, 
  Users, 
  FileText, 
  Headphones,
  ArrowRight,
  Play,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { CTASection } from "@/components/cta-section";

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
      color: "from-blue-400 to-blue-600"
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
      color: "from-green-400 to-emerald-600"
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
      color: "from-purple-400 to-purple-600"
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
      color: "from-orange-400 to-red-500"
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
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4 py-fluid-2xl">
            <div className="text-center max-w-4xl mx-auto">
              <BlurFade delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-8">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Cas d'Usage Concrets</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className="text-fluid-4xl sm:text-fluid-5xl font-display font-bold tracking-tight text-foreground mb-fluid-lg">
                  Des Solutions{" "}
                  <span className="text-gradient">Éprouvées</span>
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
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Cas d'Usage Principaux
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Les domaines où notre IA excelle et transforme les entreprises
                </p>
              </div>
            </BlurFade>

            <div className="space-y-12 max-w-6xl mx-auto">
              {mainUseCases.map((useCase, index) => (
                <BlurFade key={useCase.title} delay={0.2 + index * 0.1}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                        {/* Content */}
                        <div className="lg:col-span-2 p-8">
                          <div className="flex items-start gap-6">
                            <div className={`w-16 h-16 bg-gradient-to-r ${useCase.color} rounded-2xl flex items-center justify-center text-white flex-shrink-0`}>
                              {useCase.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                {useCase.title}
                              </h3>
                              <p className="text-slate-600 mb-6 text-lg">
                                {useCase.description}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                {useCase.benefits.map((benefit, idx) => (
                                  <div key={idx} className="flex items-center gap-3">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span className="text-slate-700 text-sm">{benefit}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="text-sm text-slate-500">
                                <strong>Industries:</strong> {useCase.industry}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Metrics */}
                        <div className={`bg-gradient-to-br ${useCase.color} p-8 text-white flex flex-col justify-center`}>
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2">
                              <NumberTicker value={parseInt(useCase.metrics.improvement.replace(/\D/g, '')) || 0} />
                              {useCase.metrics.improvement.replace(/\d/g, '')}
                            </div>
                            <p className="text-white/90 font-medium">
                              {useCase.metrics.label}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Use Cases */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Par Secteur d'Activité
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Des solutions adaptées à votre industrie
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {industryUseCases.map((industry, index) => (
                <BlurFade key={industry.industry} delay={0.2 + index * 0.1}>
                  <Card className="h-full border-slate-200 bg-white">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                          {industry.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">
                          {industry.industry}
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {industry.useCases.map((useCase, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-700">{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Histoires de Succès
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Découvrez les résultats obtenus par nos clients
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {successStories.map((story, index) => (
                <BlurFade key={story.company} delay={0.2 + index * 0.1}>
                  <Card className="text-center border-slate-200 bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        <NumberTicker value={parseInt(story.metric.replace(/\D/g, '')) || 0} />
                        {story.metric.replace(/\d/g, '')}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {story.company}
                      </h3>
                      <p className="text-slate-600 mb-4 text-sm">
                        {story.industry}
                      </p>
                      <p className="text-slate-700 font-medium mb-3">
                        {story.result}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {story.description}
                      </p>
                    </CardContent>
                  </Card>
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
