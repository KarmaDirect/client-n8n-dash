import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Calendar } from "lucide-react";

const Privacy = () => {
  document.title = "Politique de Confidentialité — Webstate";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4 py-fluid-2xl">
            <div className="text-center max-w-4xl mx-auto">
              <BlurFade delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-8">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Confidentialité</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className="text-fluid-4xl sm:text-fluid-5xl font-display font-bold tracking-tight text-foreground mb-fluid-lg">
                  Politique de <span className="text-gradient">Confidentialité</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>Dernière mise à jour : 15 mars 2024</span>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <BlurFade delay={0.1}>
                <Card className="border-slate-200 mb-8">
                  <CardContent className="p-8">
                    <div className="prose prose-slate max-w-none">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        1. Collecte des Informations
                      </h2>
                      <p className="text-slate-600 mb-4">
                        Nous collectons les informations que vous nous fournissez directement, comme votre nom, 
                        adresse email, et informations de votre entreprise lorsque vous créez un compte ou nous contactez.
                      </p>

                      <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">
                        2. Utilisation des Données
                      </h2>
                      <p className="text-slate-600 mb-4">
                        Nous utilisons vos informations pour fournir, maintenir et améliorer nos services, 
                        vous contacter concernant votre compte, et vous envoyer des informations sur nos produits.
                      </p>

                      <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">
                        3. Partage des Informations
                      </h2>
                      <p className="text-slate-600 mb-4">
                        Nous ne vendons pas vos informations personnelles. Nous pouvons partager vos informations 
                        avec des fournisseurs de services tiers qui nous aident à exploiter notre plateforme.
                      </p>

                      <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">
                        4. Sécurité des Données
                      </h2>
                      <p className="text-slate-600 mb-4">
                        Nous implementons des mesures de sécurité appropriées pour protéger vos informations 
                        contre l'accès non autorisé, l'altération, la divulgation ou la destruction.
                      </p>

                      <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">
                        5. Vos Droits RGPD
                      </h2>
                      <p className="text-slate-600 mb-4">
                        Conformément au RGPD, vous avez le droit d'accéder, de rectifier, de supprimer vos données 
                        personnelles, et de vous opposer à leur traitement. Contactez-nous à privacy@webstate.fr.
                      </p>

                      <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">
                        6. Contact
                      </h2>
                      <p className="text-slate-600 mb-4">
                        Pour toute question concernant cette politique de confidentialité, 
                        contactez-nous à <a href="mailto:privacy@webstate.fr" className="text-blue-600 hover:underline">privacy@webstate.fr</a>.
                      </p>
                    </div>
                  </CardContent>
                </Card>
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
