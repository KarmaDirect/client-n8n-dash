import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { CardPremium } from "@/components/ui/card-premium";
import { ButtonPremium } from "@/components/ui/button-premium";
import { 
  MapPin, 
  Clock, 
  Heart, 
  Coffee,
  Laptop,
  ArrowRight,
  Briefcase
} from "lucide-react";
import { CTASection } from "@/components/cta-section";
import { typography } from "@/lib/constants/design-tokens";
import { cn } from "@/lib/utils";

const Careers = () => {
  document.title = "Carrières — Webstate";

  const jobs = [
    {
      title: "Ingénieur IA Senior",
      department: "Technique",
      location: "Paris / Remote",
      type: "CDI",
      description: "Développez les algorithmes de machine learning qui alimentent nos agents IA."
    },
    {
      title: "Product Manager",
      department: "Produit", 
      location: "Paris",
      type: "CDI",
      description: "Définissez la roadmap produit et travaillez avec nos équipes techniques."
    },
    {
      title: "Sales Executive",
      department: "Commercial",
      location: "Paris / Lyon",
      type: "CDI", 
      description: "Développez notre portefeuille client et évangélisez l'IA en entreprise."
    }
  ];

  const benefits = [
    { icon: <Heart className="w-6 h-6" />, title: "Mutuelle Premium", description: "100% prise en charge" },
    { icon: <Coffee className="w-6 h-6" />, title: "Petit-déjeuners", description: "Tous les matins" },
    { icon: <Laptop className="w-6 h-6" />, title: "Équipement Top", description: "MacBook Pro dernière génération" },
    { icon: <Clock className="w-6 h-6" />, title: "Horaires Flexibles", description: "Work-life balance" }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="pt-20 pb-16 bg-background">
          <div className="container mx-auto px-4 py-fluid-2xl">
            <div className="text-center max-w-4xl mx-auto">
              <BlurFade delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-8">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm font-medium">Rejoignez-Nous</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className={cn(typography.heading.h1, "mb-fluid-lg")}>
                  Carrières{" "}
                  <span className="text-primary">Webstate</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                  Rejoignez une équipe passionnée qui construit l'avenir de l'automatisation IA.
                </p>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Jobs */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className={cn(typography.heading.h2, "mb-4")}>
                  Postes Ouverts
                </h2>
              </div>
            </BlurFade>

            <div className="max-w-4xl mx-auto space-y-6">
              {jobs.map((job, index) => (
                <BlurFade key={job.title} delay={0.2 + index * 0.1}>
                  <CardPremium className="border-border hover:shadow-premium transition-shadow">
                    <div className="p-fluid-lg">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className={cn(typography.heading.h4, "mb-2")}>
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span>{job.department}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                            <span>•</span>
                            <span>{job.type}</span>
                          </div>
                          <p className="text-muted-foreground mt-3">
                            {job.description}
                          </p>
                        </div>
                        <ButtonPremium variant="outline" size="sm">
                          Postuler
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </ButtonPremium>
                      </div>
                    </div>
                  </CardPremium>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className={cn(typography.heading.h2, "mb-4")}>
                  Avantages
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <BlurFade key={benefit.title} delay={0.2 + index * 0.1}>
                  <CardPremium className="text-center border-border">
                    <div className="p-fluid-lg">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                        {benefit.icon}
                      </div>
                      <h3 className={cn(typography.heading.h6, "mb-2")}>
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </CardPremium>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
};

export default Careers;