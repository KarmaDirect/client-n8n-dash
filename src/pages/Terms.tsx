import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar } from "lucide-react";

const Terms = () => {
  document.title = "Conditions Générales d'Utilisation — Webstate";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4 py-fluid-2xl">
            <div className="text-center max-w-4xl mx-auto">
              <BlurFade delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-8">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">Conditions Générales</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className="text-fluid-4xl sm:text-fluid-5xl font-display font-bold tracking-tight text-foreground mb-fluid-lg">
                  Conditions Générales <span className="text-gradient">d'Utilisation</span>
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
                <Card className="border-slate-200">
                  <CardContent className="p-8">
                    <div className="prose prose-slate max-w-none">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">1. Acceptation des Conditions</h2>
                      <p className="text-slate-600 mb-4">En accédant et en utilisant Webstate, vous acceptez d'être lié par ces conditions d'utilisation.</p>

                      <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">2. Description du Service</h2>
                      <p className="text-slate-600 mb-4">Webstate fournit une plateforme d'agents IA pour automatiser les processus d'entreprise.</p>

                      <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">3. Compte Utilisateur</h2>
                      <p className="text-slate-600 mb-4">Vous êtes responsable de maintenir la confidentialité de votre compte et mot de passe.</p>

                      <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">4. Utilisation Acceptable</h2>
                      <p className="text-slate-600 mb-4">Vous vous engagez à utiliser notre service de manière légale et appropriée.</p>

                      <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">5. Propriété Intellectuelle</h2>
                      <p className="text-slate-600 mb-4">Tous les droits de propriété intellectuelle sur la plateforme Webstate nous appartiennent.</p>

                      <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">6. Limitation de Responsabilité</h2>
                      <p className="text-slate-600 mb-4">Notre responsabilité est limitée dans les termes prévus par la loi applicable.</p>
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

export default Terms;
