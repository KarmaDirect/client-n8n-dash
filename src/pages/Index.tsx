"use client";

import { Button } from "@/components/ui/button";
import { ButtonPremium } from "@/components/ui/button-premium";
import { Card, CardContent } from "@/components/ui/card";
import { CardPremium, CardContent as CardContentPremium } from "@/components/ui/card-premium";
import { Link } from "react-router-dom";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { useRef, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { 
  ArrowRight, 
  Bot, 
  Building2, 
  CheckCircle, 
  MessageSquare, 
  Mail, 
  Calendar, 
  BarChart3,
  Users,
  Zap,
  Shield,
  TrendingUp,
  Play
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { PricingSection } from "@/components/pricing-section";
import { Footer } from "@/components/footer";
import { VideoSection } from "@/components/ui/video-section";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import { Ripple } from "@/components/magicui/ripple";
import { Marquee } from "@/components/magicui/marquee";
import { Marquee3D } from "@/components/magicui/marquee-3d";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

const Index = () => {
  document.title = "Webstate — Agents IA pour automatiser votre entreprise";
  
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  const companies = [
    "Microsoft", "Google", "Amazon", "Apple", "Meta", "Tesla", "Netflix", "Adobe"
  ];

  const useCases = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Support Client 24/7",
      description: "Répondez automatiquement aux questions clients et escaladez les cas complexes",
      metrics: "Réduction de 80% du temps de réponse"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Génération de Leads",
      description: "Qualifiez et suivez automatiquement vos prospects commerciaux",
      metrics: "Augmentation de 200% de la conversion"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Gestion des Rendez-vous",
      description: "Planification automatique et rappels intelligents",
      metrics: "Réduction de 90% des no-shows"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analyse de Données",
      description: "Rapports automatisés et insights business en temps réel",
      metrics: "Gain de 15h par semaine"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Consultation Gratuite",
      description: "Analysons ensemble vos besoins et identifions les tâches à automatiser"
    },
    {
      step: "02", 
      title: "Configuration sur Mesure",
      description: "Nous créons vos agents IA personnalisés selon vos processus métier"
    },
    {
      step: "03",
      title: "Intégration Transparente",
      description: "Déploiement et connexion avec vos outils existants"
    },
    {
      step: "04",
      title: "Formation & Support",
      description: "Formation de vos équipes et support technique continu"
    }
  ];

    return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white grain-overlay">
        {/* Hero Section */}
        <section id="hero" className="hero-premium relative overflow-hidden pt-20">
          {/* Ripple Background Effect */}
          <div className="absolute inset-0 overflow-hidden">
            <Ripple 
              mainCircleSize={400}
              mainCircleOpacity={0.03}
              numCircles={8}
            />
          </div>
          
          <div className="container mx-auto px-4 py-fluid-2xl sm:py-fluid-3xl relative z-10">
            <div className="text-center max-w-4xl mx-auto">
            
            <BlurFade delay={0.2}>
              <h1 className="text-fluid-4xl sm:text-fluid-5xl font-display font-bold tracking-tight text-foreground mb-fluid-lg">
                Automatisez votre entreprise avec des{" "}
                <span className="text-gradient">agents IA</span>
              </h1>
            </BlurFade>
            
            <BlurFade delay={0.3}>
              <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                Transformez vos tâches répétitives en automatisations intelligentes. 
                Gagnez du temps, réduisez les erreurs et concentrez-vous sur ce qui compte vraiment.
              </p>
            </BlurFade>
            
            {/* Avatar Circles - Utilisateurs qui nous font confiance */}
            <BlurFade delay={0.35}>
              <div className="flex justify-center mb-fluid-xl">
                <AvatarCircles 
                  numPeople={127} 
                  avatarUrls={[
                    {
                      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                      profileUrl: "#"
                    },
                    {
                      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                      profileUrl: "#"
                    },
                    {
                      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                      profileUrl: "#"
                    },
                    {
                      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
                      profileUrl: "#"
                    },
                    {
                      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                      profileUrl: "#"
                    },
                    {
                      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
                      profileUrl: "#"
                    }
                  ]} 
                />
              </div>
            </BlurFade>
            
            <BlurFade delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-fluid-xl">
                <Link to="/auth">
                  <ButtonPremium size="lg" className="group">
                    Commencer Gratuitement
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </ButtonPremium>
                </Link>
                <ButtonPremium variant="glass" size="lg">
                  <Play className="mr-2 w-5 h-5" />
                  Voir la Démo
                </ButtonPremium>
              </div>
            </BlurFade>

            {/* Metrics */}
            <BlurFade delay={0.5}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">
                    <NumberTicker value={90} />%
                  </div>
                  <p className="text-slate-600">Temps économisé</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">
                    <NumberTicker value={500} />+
                  </div>
                  <p className="text-slate-600">Entreprises clientes</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">
                    <NumberTicker value={24} />h
                  </div>
                  <p className="text-slate-600">Support 24/7</p>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection />

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Cas d'Usage Concrets
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Nos agents IA excellent dans ces domaines critiques pour votre entreprise
              </p>
            </div>
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {useCases.map((useCase, index) => (
              <BlurFade key={useCase.title} delay={0.2 + index * 0.1}>
                <Card className="h-full hover:shadow-lg transition-shadow border-slate-200">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                        {useCase.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          {useCase.title}
                        </h3>
                        <p className="text-slate-600 mb-4">
                          {useCase.description}
                        </p>
                        <div className="text-blue-600 font-medium text-sm">
                          {useCase.metrics}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            ))}
          </div>

          {/* AI Integration Diagram */}
          <BlurFade delay={0.6}>
            <div className="mt-20 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-center text-slate-900 mb-12">
                Intégration Transparente avec Vos Outils
              </h3>
              
              <div
                className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-10"
                ref={containerRef}
              >
                <div className="flex size-full max-w-lg flex-col items-stretch justify-between gap-10">
                  <div className="flex flex-row items-center justify-between">
                    <Circle ref={div1Ref} className="bg-white border-slate-300">
                      <Mail className="w-6 h-6 text-slate-700" />
                    </Circle>
                    <Circle ref={div5Ref} className="bg-white border-slate-300">
                      <Calendar className="w-6 h-6 text-slate-700" />
                    </Circle>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <Circle ref={div2Ref} className="bg-white border-slate-300">
                      <Users className="w-6 h-6 text-slate-700" />
                    </Circle>
                    <Circle ref={div4Ref} className="size-16 bg-blue-600 border-blue-600">
                      <Bot className="w-8 h-8 text-white" />
                    </Circle>
                    <Circle ref={div6Ref} className="bg-white border-slate-300">
                      <BarChart3 className="w-6 h-6 text-slate-700" />
                    </Circle>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <Circle ref={div3Ref} className="bg-white border-slate-300">
                      <MessageSquare className="w-6 h-6 text-slate-700" />
                    </Circle>
                    <Circle ref={div7Ref} className="bg-white border-slate-300">
                      <Building2 className="w-6 h-6 text-slate-700" />
                    </Circle>
                  </div>
                </div>

                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={div1Ref}
                  toRef={div4Ref}
                  curvature={-75}
                  endYOffset={-10}
                />
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={div2Ref}
                  toRef={div4Ref}
                />
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={div3Ref}
                  toRef={div4Ref}
                  curvature={75}
                  endYOffset={10}
                />
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={div5Ref}
                  toRef={div4Ref}
                  curvature={-75}
                  endYOffset={-10}
                  reverse
                />
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={div6Ref}
                  toRef={div4Ref}
                  reverse
                />
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={div7Ref}
                  toRef={div4Ref}
                  curvature={75}
                  endYOffset={10}
                  reverse
                />
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Trusted Companies Scroll */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.1}>
            <p className="text-center text-slate-600 mb-8 text-lg">
              Ils nous font confiance
            </p>
          </BlurFade>
          
          <BlurFade delay={0.2}>
            <div className="relative overflow-hidden">
              <div className="flex animate-scroll space-x-12">
                {[...companies, ...companies].map((company, index) => (
                  <div
                    key={`${company}-${index}`}
                    className="flex-shrink-0 text-2xl font-semibold text-slate-400 whitespace-nowrap"
                  >
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Comment Ça Marche
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                De l'analyse à la mise en production, nous vous accompagnons à chaque étape
              </p>
            </div>
          </BlurFade>

          <div className="max-w-4xl mx-auto">
            {processSteps.map((process, index) => (
              <BlurFade key={process.step} delay={0.2 + index * 0.1}>
                <div className="flex items-start space-x-6 mb-12 last:mb-0">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {process.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {process.title}
                    </h3>
                    <p className="text-slate-600 text-lg">
                      {process.description}
                    </p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Pourquoi Choisir Webstate
              </h2>
            </div>
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Mise en place rapide",
                description: "Vos premiers agents IA opérationnels en moins de 48h"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Sécurité garantie",
                description: "Conformité RGPD et chiffrement bout-en-bout"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "ROI mesurable",
                description: "Analyse détaillée de vos gains de productivité"
              }
            ].map((benefit, index) => (
              <BlurFade key={benefit.title} delay={0.2 + index * 0.1}>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
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

      {/* Pricing Section */}
      <PricingSection />
      
             {/* Testimonials Section - Avis Clients 3D */}
       <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
         <div className="container mx-auto px-4">
           <BlurFade delay={0.1}>
             <div className="text-center mb-16">
               <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                 Ce que disent nos clients
               </h2>
               <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                 Découvrez les témoignages de ceux qui ont transformé leur entreprise avec Webstate
               </p>
             </div>
           </BlurFade>
           
           <BlurFade delay={0.2}>
             <div className="relative">
               {/* Marquee 3D des avis clients */}
               <Marquee3D />
               
               {/* Statistiques des avis */}
               <div className="mt-16 text-center">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                   <div className="text-center">
                     <div className="text-3xl font-bold text-blue-600 mb-2">
                       <NumberTicker value={98} />%
                     </div>
                     <p className="text-slate-600">Satisfaction client</p>
                   </div>
                   <div className="text-center">
                     <div className="text-3xl font-bold text-blue-600 mb-2">
                       <NumberTicker value={4} />.9/5
                     </div>
                     <p className="text-slate-600">Note moyenne</p>
                   </div>
                   <div className="text-center">
                     <div className="text-3xl font-bold text-blue-600 mb-2">
                       <NumberTicker value={500} />+
                     </div>
                     <p className="text-slate-600">Avis vérifiés</p>
                   </div>
                 </div>
               </div>
             </div>
           </BlurFade>
         </div>
       </section>
       
    </main>
    
    {/* Footer */}
    <Footer />
    </>
  );
};

export default Index;
