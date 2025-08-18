import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonPremium } from "@/components/ui/button-premium";
import { 
  Zap, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Users, 
  BarChart3,
  ShoppingCart,
  Database,
  Cloud,
  ArrowRight,
  CheckCircle,
  Search,
  Filter,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { CTASection } from "@/components/cta-section";

const Integrations = () => {
  document.title = "Intégrations — Webstate";

  const categories = [
    {
      name: "Communication",
      icon: <MessageSquare className="w-6 h-6" />,
      count: 45,
      color: "from-blue-400 to-blue-600"
    },
    {
      name: "CRM & Ventes",
      icon: <Users className="w-6 h-6" />,
      count: 32,
      color: "from-green-400 to-emerald-600"
    },
    {
      name: "E-commerce",
      icon: <ShoppingCart className="w-6 h-6" />,
      count: 28,
      color: "from-purple-400 to-purple-600"
    },
    {
      name: "Productivité",
      icon: <Calendar className="w-6 h-6" />,
      count: 38,
      color: "from-orange-400 to-red-500"
    },
    {
      name: "Analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      count: 22,
      color: "from-pink-400 to-rose-500"
    },
    {
      name: "Base de Données",
      icon: <Database className="w-6 h-6" />,
      count: 19,
      color: "from-cyan-400 to-blue-500"
    }
  ];

  const popularIntegrations = [
    {
      name: "Slack",
      description: "Intégrez vos agents IA directement dans Slack pour automatiser les réponses et workflows d'équipe.",
      category: "Communication",
      logo: "🟦",
      features: ["Messages automatiques", "Notifications temps réel", "Commandes personnalisées"],
      setup: "5 minutes"
    },
    {
      name: "Salesforce",
      description: "Synchronisez vos leads et contacts avec Salesforce pour un CRM alimenté par l'IA.",
      category: "CRM & Ventes", 
      logo: "☁️",
      features: ["Sync bidirectionnelle", "Lead scoring IA", "Rapports automatisés"],
      setup: "10 minutes"
    },
    {
      name: "Shopify",
      description: "Automatisez le support client e-commerce et optimisez les conversions.",
      category: "E-commerce",
      logo: "🛍️",
      features: ["Support produits", "Gestion retours", "Recommandations IA"],
      setup: "15 minutes"
    },
    {
      name: "Google Calendar",
      description: "Planification intelligente de rendez-vous avec optimisation automatique des créneaux.",
      category: "Productivité",
      logo: "📅",
      features: ["Planification auto", "Rappels intelligents", "Gestion conflits"],
      setup: "5 minutes"
    },
    {
      name: "HubSpot",
      description: "Transformez vos processus marketing et ventes avec l'automation IA.",
      category: "CRM & Ventes",
      logo: "🟠",
      features: ["Lead nurturing", "Email automation", "Score comportemental"],
      setup: "10 minutes"
    },
    {
      name: "WhatsApp Business",
      description: "Support client WhatsApp 24/7 avec des réponses intelligentes et personnalisées.",
      category: "Communication",
      logo: "💬",
      features: ["Réponses auto", "Chat multilingue", "Escalade humaine"],
      setup: "8 minutes"
    }
  ];

  const comingSoon = [
    { name: "Microsoft Teams", category: "Communication", eta: "Q1 2024" },
    { name: "Notion", category: "Productivité", eta: "Q1 2024" },
    { name: "Stripe", category: "E-commerce", eta: "Q2 2024" },
    { name: "Zapier", category: "Automation", eta: "Q2 2024" },
    { name: "Discord", category: "Communication", eta: "Q2 2024" },
    { name: "Mailchimp", category: "Marketing", eta: "Q3 2024" }
  ];

  const benefits = [
    {
      title: "Configuration Simplifiée",
      description: "Connectez vos outils en quelques clics avec notre interface intuitive",
      icon: <Zap className="w-8 h-8" />
    },
    {
      title: "Synchronisation Temps Réel",
      description: "Données synchronisées instantanément entre tous vos outils connectés",
      icon: <Cloud className="w-8 h-8" />
    },
    {
      title: "Sécurité Avancée",
      description: "Chiffrement bout-en-bout et conformité aux standards de sécurité",
      icon: <CheckCircle className="w-8 h-8" />
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
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-8">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">200+ Intégrations</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className="text-fluid-4xl sm:text-fluid-5xl font-display font-bold tracking-tight text-foreground mb-fluid-lg">
                  Connectez Tous{" "}
                  <span className="text-gradient">Vos Outils</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                  Intégrez Webstate avec vos applications préférées. Configuration simple, synchronisation automatique, workflow unifié.
                </p>
              </BlurFade>

              <BlurFade delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/auth">
                    <ButtonPremium size="lg" className="group">
                      Explorer les Intégrations
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </ButtonPremium>
                  </Link>
                  <ButtonPremium variant="outline" size="lg">
                    <Search className="mr-2 w-5 h-5" />
                    Rechercher une App
                  </ButtonPremium>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Intégrations par Catégorie
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Trouvez rapidement les intégrations dont vous avez besoin
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {categories.map((category, index) => (
                <BlurFade key={category.name} delay={0.2 + index * 0.1}>
                  <Card className="hover:shadow-xl transition-all duration-300 border-slate-200 group cursor-pointer">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                        {category.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {category.count} intégrations disponibles
                      </p>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Integrations */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Intégrations Populaires
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Les intégrations les plus utilisées par nos clients
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {popularIntegrations.map((integration, index) => (
                <BlurFade key={integration.name} delay={0.2 + index * 0.1}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-200 bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-3xl">{integration.logo}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {integration.name}
                          </h3>
                          <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {integration.category}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 mb-4 text-sm">
                        {integration.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        {integration.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-slate-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-sm text-slate-500">
                          Configuration: {integration.setup}
                        </span>
                        <ButtonPremium variant="outline" size="sm">
                          Connecter
                          <ExternalLink className="ml-2 w-3 h-3" />
                        </ButtonPremium>
                      </div>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Pourquoi Intégrer ?
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Maximisez la valeur de vos outils existants
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <BlurFade key={benefit.title} delay={0.2 + index * 0.1}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Bientôt Disponibles
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Les prochaines intégrations en cours de développement
                </p>
              </div>
            </BlurFade>

            <div className="max-w-4xl mx-auto">
              <BlurFade delay={0.2}>
                <Card className="border-slate-200 bg-white">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {comingSoon.map((integration, index) => (
                        <div key={integration.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-slate-900">
                              {integration.name}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {integration.category}
                            </p>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {integration.eta}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Request Integration */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Votre Intégration n'est pas Listée ?
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                  Demandez-nous de développer l'intégration dont vous avez besoin
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/contact">
                    <ButtonPremium size="lg" className="group">
                      <Mail className="mr-2 w-5 h-5" />
                      Demander une Intégration
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </ButtonPremium>
                  </Link>
                  <ButtonPremium variant="outline" size="lg">
                    <Filter className="mr-2 w-5 h-5" />
                    Voir Toutes les Intégrations
                  </ButtonPremium>
                </div>
              </div>
            </BlurFade>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
};

export default Integrations;
