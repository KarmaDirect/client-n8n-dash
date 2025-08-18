import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { PricingSection } from "@/components/pricing-section";
import { ButtonPremium } from "@/components/ui/button-premium";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Check, 
  Star, 
  Users, 
  Building2, 
  Crown,
  MessageCircle,
  Phone,
  Shield,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { CTASection } from "@/components/cta-section";

const Pricing = () => {
  document.title = "Tarifs — Webstate";

  const faqs = [
    {
      question: "Puis-je changer de plan à tout moment ?",
      answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et vous ne payez que la différence au prorata."
    },
    {
      question: "Y a-t-il des frais de mise en place ?",
      answer: "Non, aucun frais de mise en place. Nous vous accompagnons gratuitement dans la configuration initiale de vos agents IA."
    },
    {
      question: "Que se passe-t-il si je dépasse mes limites ?",
      answer: "Nous vous alertons à 80% de votre limite. Au-delà, vous pouvez soit upgrader votre plan, soit payer l'usage supplémentaire à la demande."
    },
    {
      question: "Proposez-vous des tarifs pour les associations ?",
      answer: "Oui, nous offrons des remises spéciales pour les associations, ONG et organisations à but non lucratif. Contactez-nous pour en savoir plus."
    },
    {
      question: "Comment fonctionne l'essai gratuit ?",
      answer: "14 jours d'essai complet sans carte de crédit. Accès à toutes les fonctionnalités du plan Pro. Aucun engagement."
    },
    {
      question: "Vos prix incluent-ils le support ?",
      answer: "Oui, tous nos plans incluent le support. Le niveau varie selon le plan : email pour Starter, prioritaire pour Pro, dédié pour Enterprise."
    }
  ];

  const addons = [
    {
      name: "Agent IA Supplémentaire",
      price: "29€/mois",
      description: "Ajoutez des agents spécialisés pour différents départements"
    },
    {
      name: "Intégrations Premium", 
      price: "49€/mois",
      description: "Connectez-vous à plus de 500 applications tierces"
    },
    {
      name: "Analytics Avancés",
      price: "39€/mois", 
      description: "Rapports détaillés et prédictions IA personnalisées"
    },
    {
      name: "Support Prioritaire",
      price: "99€/mois",
      description: "Support téléphonique et temps de réponse garanti < 2h"
    }
  ];

  const testimonials = [
    {
      quote: "Le ROI a été immédiat. En 3 mois, nous avons récupéré notre investissement.",
      author: "Marie Dubois",
      role: "Directrice Marketing",
      company: "TechStart",
      rating: 5
    },
    {
      quote: "La flexibilité des tarifs nous permet de scaler selon nos besoins.",
      author: "Pierre Martin", 
      role: "CEO",
      company: "GrowthCorp",
      rating: 5
    },
    {
      quote: "Support exceptionnel et valeur incroyable pour le prix payé.",
      author: "Sophie Laurent",
      role: "COO", 
      company: "InnovateLtd",
      rating: 5
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
                  <Crown className="w-4 h-4" />
                  <span className="text-sm font-medium">Tarifs Transparents</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className="text-fluid-4xl sm:text-fluid-5xl font-display font-bold tracking-tight text-foreground mb-fluid-lg">
                  Des Tarifs qui{" "}
                  <span className="text-gradient">S'adaptent</span> à Vous
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                  Choisissez le plan qui correspond à vos besoins. Commencez gratuitement, scalez selon votre croissance. Aucun engagement, aucun frais caché.
                </p>
              </BlurFade>

              <BlurFade delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/auth">
                    <ButtonPremium size="lg" className="group">
                      Commencer l'Essai Gratuit
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </ButtonPremium>
                  </Link>
                  <ButtonPremium variant="outline" size="lg">
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Parler à un Expert
                  </ButtonPremium>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Main Pricing Section */}
        <PricingSection />

        {/* Add-ons Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Options Supplémentaires
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Personnalisez votre expérience avec nos modules complémentaires
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {addons.map((addon, index) => (
                <BlurFade key={addon.name} delay={0.2 + index * 0.1}>
                  <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {addon.name}
                        </h3>
                        <span className="text-xl font-bold text-blue-600">
                          {addon.price}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-4">
                        {addon.description}
                      </p>
                      <ButtonPremium variant="outline" size="sm" className="w-full">
                        Ajouter à mon Plan
                      </ButtonPremium>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Ce que Disent Nos Clients
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Découvrez pourquoi ils ont choisi Webstate
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <BlurFade key={testimonial.author} delay={0.2 + index * 0.1}>
                  <Card className="border-slate-200 bg-white">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-slate-700 mb-4 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-slate-600">
                          {testimonial.role} • {testimonial.company}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Questions Fréquentes
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Tout ce que vous devez savoir sur nos tarifs
                </p>
              </div>
            </BlurFade>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <BlurFade key={faq.question} delay={0.2 + index * 0.1}>
                  <Card className="border-slate-200 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-slate-600">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Besoin d'un Tarif Personnalisé ?
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                  Contactez notre équipe pour discuter de vos besoins spécifiques
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/contact">
                    <ButtonPremium size="lg" className="group">
                      <MessageCircle className="mr-2 w-5 h-5" />
                      Demander un Devis
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </ButtonPremium>
                  </Link>
                  <ButtonPremium variant="outline" size="lg">
                    <Phone className="mr-2 w-5 h-5" />
                    Appeler un Expert
                  </ButtonPremium>
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Sans Engagement
                  </h3>
                  <p className="text-slate-600">
                    Aucun contrat long terme, annulation à tout moment
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Mise en Route Rapide
                  </h3>
                  <p className="text-slate-600">
                    Vos premiers agents opérationnels en moins de 48h
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Support Dédié
                  </h3>
                  <p className="text-slate-600">
                    Une équipe d'experts pour vous accompagner
                  </p>
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

export default Pricing;
