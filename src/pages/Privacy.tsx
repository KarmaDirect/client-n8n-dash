import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { CardPremium } from "@/components/ui/card-premium";
import { Shield, Calendar } from "lucide-react";
import { typography } from "@/lib/constants/design-tokens";
import { cn } from "@/lib/utils";

const Privacy = () => {
  document.title = "Politique de Confidentialité — Webstate";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="pt-20 pb-16 bg-background">
          <div className="container mx-auto px-4 py-fluid-2xl">
            <div className="text-center max-w-4xl mx-auto">
              <BlurFade delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-8">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Confidentialité</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className={cn(typography.heading.h1, "mb-fluid-lg")}>
                  Politique de{" "}
                  <span className="text-primary">Confidentialité</span>
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
                <CardPremium className="border-border mb-8">
                  <div className="p-fluid-lg prose prose-slate max-w-none">
                    <h2 className={cn(typography.heading.h3, "mb-4")}>
                      1. Collecte des Informations
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Nous collectons les informations que vous nous fournissez directement lors de l'inscription, 
                      de l'utilisation de nos services, ou lors de vos communications avec nous.
                    </p>

                    <h2 className={cn(typography.heading.h3, "mb-4 mt-8")}>
                      2. Utilisation des Informations
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Nous utilisons vos informations pour fournir, maintenir et améliorer nos services, 
                      traiter vos transactions, et communiquer avec vous.
                    </p>

                    <h2 className={cn(typography.heading.h3, "mb-4 mt-8")}>
                      3. Partage des Informations
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations 
                      uniquement avec votre consentement ou dans les cas prévus par la loi.
                    </p>

                    <h2 className={cn(typography.heading.h3, "mb-4 mt-8")}>
                      4. Sécurité des Données
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées 
                      pour protéger vos données personnelles contre tout accès non autorisé, altération, divulgation ou destruction.
                    </p>

                    <h2 className={cn(typography.heading.h3, "mb-4 mt-8")}>
                      5. Vos Droits
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Conformément au RGPD, vous avez le droit d'accéder, de rectifier, de supprimer vos données, 
                      de vous opposer à leur traitement, et de demander la portabilité de vos données.
                    </p>

                    <h2 className={cn(typography.heading.h3, "mb-4 mt-8")}>
                      6. Cookies
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
                      Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
                    </p>

                    <h2 className={cn(typography.heading.h3, "mb-4 mt-8")}>
                      7. Contact
                    </h2>
                    <p className="text-muted-foreground">
                      Pour toute question concernant cette politique de confidentialité, contactez-nous à contact@webstate.fr
                    </p>
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

export default Privacy;