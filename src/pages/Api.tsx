import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { CardPremium } from "@/components/ui/card-premium";
import { ButtonPremium } from "@/components/ui/button-premium";
import { 
  Code2, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight, 
  CheckCircle,
  BookOpen,
  Terminal,
  Webhook
} from "lucide-react";
import { Link } from "react-router-dom";
import { typography } from "@/lib/constants/design-tokens";
import { cn } from "@/lib/utils";

const Api = () => {
  document.title = "API — Webstate";

  const apiFeatures = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "API RESTful Complète",
      description: "API moderne, rapide et intuitive pour intégrer Webstate dans vos applications.",
      features: ["Endpoints RESTful standard", "Réponses JSON structurées", "Pagination automatique", "Filtrage avancé"]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Sécurité Enterprise",
      description: "Authentification robuste et chiffrement de bout en bout pour protéger vos données.",
      features: ["API Keys sécurisées", "OAuth 2.0", "Rate limiting intelligent", "Audit trails complets"]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Webhooks Temps Réel",
      description: "Recevez des notifications instantanées pour tous les événements importants.",
      features: ["Events en temps réel", "Retry automatique", "Validation des signatures", "Multiple endpoints"]
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "SDKs Officiels",
      description: "Bibliothèques officielles pour les langages les plus populaires.",
      features: ["JavaScript/Node.js", "Python", "PHP", "Documentation complète"]
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
                  <Code2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Documentation API</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className={cn(typography.heading.h1, "mb-fluid-lg")}>
                  API{" "}
                  <span className="text-primary">Développeur</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                  Intégrez Webstate dans vos applications avec notre API RESTful complète et nos SDKs officiels.
                </p>
              </BlurFade>

              <BlurFade delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/auth">
                    <ButtonPremium size="lg" className="group">
                      Obtenir une Clé API
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </ButtonPremium>
                  </Link>
                  <ButtonPremium variant="outline" size="lg">
                    <BookOpen className="mr-2 w-5 h-5" />
                    Voir la Documentation
                  </ButtonPremium>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className={cn(typography.heading.h2, "mb-4")}>
                  Fonctionnalités API
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Tout ce dont vous avez besoin pour intégrer Webstate
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {apiFeatures.map((feature, index) => (
                <BlurFade key={feature.title} delay={0.2 + index * 0.1}>
                  <CardPremium className="h-full border-border hover:shadow-premium transition-shadow">
                    <div className="p-fluid-lg">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                        {feature.icon}
                      </div>
                      <h3 className={cn(typography.heading.h3, "mb-4")}>
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {feature.description}
                      </p>
                      <ul className="space-y-3">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-foreground text-sm">{item}</span>
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

        {/* Code Example */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="max-w-4xl mx-auto">
                <CardPremium className="border-border">
                  <div className="p-fluid-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Terminal className="w-5 h-5 text-primary" />
                      <h3 className={cn(typography.heading.h4)}>Exemple de Code</h3>
                    </div>
                    <pre className="bg-muted p-6 rounded-lg overflow-x-auto">
                      <code className="text-sm text-foreground">
{`// Créer un workflow
const response = await fetch(
  'https://api.webstate.fr/v1/workflows',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Mon Workflow',
      trigger: 'webhook',
      actions: [...]
    })
  }
);`}
                      </code>
                    </pre>
                  </div>
                </CardPremium>
              </div>
            </BlurFade>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default Api;