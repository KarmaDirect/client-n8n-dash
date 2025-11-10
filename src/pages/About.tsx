import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { CardPremium } from "@/components/ui/card-premium";
import { ButtonPremium } from "@/components/ui/button-premium";
import { NumberTicker } from "@/components/ui/number-ticker";
import { 
  Target, 
  Users, 
  Heart, 
  Zap, 
  Globe, 
  TrendingUp,
  ArrowRight,
  Linkedin
} from "lucide-react";
import { Link } from "react-router-dom";
import { typography } from "@/lib/constants/design-tokens";
import { cn } from "@/lib/utils";

const About = () => {
  document.title = "À propos — Webstate";

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Innovation",
      description: "Nous repoussons constamment les limites de l'IA pour créer des solutions révolutionnaires qui transforment la façon de travailler.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaboration",
      description: "Nous croyons au pouvoir de la collaboration entre humains et IA pour créer un avenir plus productif et épanouissant.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Excellence",
      description: "Nous nous engageons à fournir des solutions de la plus haute qualité avec un support client exceptionnel.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Impact",
      description: "Notre mission est de démocratiser l'IA pour permettre à chaque entreprise d'automatiser et de prospérer.",
    }
  ];

  const stats = [
    { value: "500+", label: "Entreprises clientes" },
    { value: "50+", label: "Pays desservis" },
    { value: "99.9%", label: "Uptime garanti" },
    { value: "24/7", label: "Support disponible" }
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
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">Notre Histoire</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className={cn(typography.heading.h1, "mb-fluid-lg")}>
                  À Propos de{" "}
                  <span className="text-primary">Webstate</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                  Nous construisons l'avenir de l'automatisation d'entreprise avec des agents IA intelligents qui transforment la façon dont vous travaillez.
                </p>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <BlurFade key={stat.label} delay={0.1 + index * 0.1}>
                  <div className="text-center">
                    <div className={cn(typography.heading.h2, "text-primary mb-2")}>
                      {stat.value}
                    </div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className={cn(typography.heading.h2, "mb-4")}>
                  Nos Valeurs
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Ce qui nous guide au quotidien
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <BlurFade key={value.title} delay={0.2 + index * 0.1}>
                  <CardPremium className="h-full border-border hover:shadow-premium transition-shadow">
                    <div className="p-fluid-lg">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                        {value.icon}
                      </div>
                      <h3 className={cn(typography.heading.h3, "mb-4")}>
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </CardPremium>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className={cn(typography.heading.h2, "mb-6")}>
                  Notre Mission
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Démocratiser l'intelligence artificielle pour permettre à chaque entreprise, 
                  quelle que soit sa taille, d'automatiser ses processus et de libérer le potentiel 
                  de ses équipes. Nous croyons que l'IA doit être accessible, compréhensible et 
                  bénéfique pour tous.
                </p>
              </div>
            </BlurFade>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default About;