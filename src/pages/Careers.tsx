import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonPremium } from "@/components/ui/button-premium";
import { 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  Coffee,
  Laptop,
  ArrowRight,
  Briefcase,
  Star
} from "lucide-react";
import { CTASection } from "@/components/cta-section";

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
      <main className="min-h-screen bg-white">
        <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4 py-fluid-2xl">
            <div className="text-center max-w-4xl mx-auto">
              <BlurFade delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-8">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm font-medium">Rejoignez-nous</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className="text-fluid-4xl sm:text-fluid-5xl font-display font-bold tracking-tight text-foreground mb-fluid-lg">
                  Construisons l'Avenir de{" "}
                  <span className="text-gradient">l'IA Ensemble</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                  Rejoignez une équipe passionnée qui révolutionne l'automatisation des entreprises avec l'intelligence artificielle.
                </p>
              </BlurFade>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Postes Ouverts
                </h2>
              </div>
            </BlurFade>

            <div className="max-w-4xl mx-auto space-y-6">
              {jobs.map((job, index) => (
                <BlurFade key={job.title} delay={0.2 + index * 0.1}>
                  <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            {job.title}
                          </h3>
                          <p className="text-slate-600 mb-4">{job.description}</p>
                          <div className="flex gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.type}
                            </span>
                          </div>
                        </div>
                        <ButtonPremium className="ml-6">
                          Postuler
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </ButtonPremium>
                      </div>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Pourquoi Webstate ?
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <BlurFade key={benefit.title} delay={0.2 + index * 0.1}>
                  <div className="text-center bg-white p-6 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                      {benefit.icon}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {benefit.description}
                    </p>
                  </div>
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
