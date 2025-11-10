import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { CardPremium } from "@/components/ui/card-premium";
import { FileText, Calendar } from "lucide-react";
import { typography } from "@/lib/constants/design-tokens";
import { cn } from "@/lib/utils";

const Terms = () => {
  document.title = "Conditions Générales d'Utilisation — Webstate";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="pt-20 pb-16 bg-background">
          <div className="container mx-auto px-4 py-fluid-2xl">
            <div className="text-center max-w-4xl mx-auto">
              <BlurFade delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-8">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">Conditions Générales</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className={cn(typography.heading.h1, "mb-fluid-lg")}>
                  Conditions Générales{" "}
                  <span className="text-primary">d'Utilisation</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Dernière mise à jour : 15 mars 2024</span>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <BlurFade delay={0.1}>
                <CardPremium className="border-border">
                  <div className="p-fluid-lg prose prose-slate max-w-none">
                    <h2 className={cn(typography.heading.h3, "mb-4")}>1. Acceptation des Conditions</h2>
                    <p className="text-muted-foreground mb-6">En accédant et en utilisant Webstate, vous acceptez d'être lié par ces conditions d'utilisation.</p>

                    <h2 className={cn(typography.heading.h3, "mb-4 mt-8")}>2. Description du Service</h2>
                    <p className="text-muted-foreground mb-6">Webstate est une plateforme SaaS d'automatisation d'entreprise utilisant l'intelligence artificielle pour créer et gérer des workflows automatisés.</p>

                    <h2 className={cn(typography.heading.h3, "mb-4 mt-8")}>3. Compte Utilisateur</h2>
                    <p className="text-muted-foreground mb-6">Vous êtes responsable de maintenir la confidentialité de votre compte et de votre mot de passe. Vous acceptez de nous notifier immédiatement de toute utilisation non autorisée.</p>

                    <h2 className={cn(typography.heading.h3, "mb-4 mt-8")}>4. Utilisation Acceptable</h2>
                    <p className="text-muted-foreground mb-6">Vous vous engagez à utiliser Webstate uniquement à des fins légales et conformément à ces conditions. Toute utilisation abusive peut entraîner la suspension ou la résiliation de votre compte.</p>

                    <h2 className={cn(typography.heading.h3, "mb-4 mt-8")}>5. Propriété Intellectuelle</h2>
                    <p className="text-muted-foreground mb-6">Tous les contenus de Webstate, y compris mais sans s'y limiter, les textes, graphiques, logos, et logiciels, sont la propriété de Webstate et sont protégés par les lois sur la propriété intellectuelle.</p>

                    <h2 className={cn(typography.heading.h3, "mb-4 mt-8")}>6. Limitation de Responsabilité</h2>
                    <p className="text-muted-foreground mb-6">Webstate est fourni "tel quel" sans garantie d'aucune sorte. Nous ne serons pas responsables des dommages indirects, accessoires ou consécutifs résultant de l'utilisation de notre service.</p>

                    <h2 className={cn(typography.heading.h3, "mb-4 mt-8")}>7. Modifications</h2>
                    <p className="text-muted-foreground mb-6">Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication sur cette page.</p>

                    <h2 className={cn(typography.heading.h3, "mb-4 mt-8")}>8. Contact</h2>
                    <p className="text-muted-foreground">Pour toute question concernant ces conditions, contactez-nous à contact@webstate.fr</p>
                  </div>
                </CardPremium>
              </BlurFade>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Terms;