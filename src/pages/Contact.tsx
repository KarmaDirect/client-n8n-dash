import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonPremium } from "@/components/ui/button-premium";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  Send,
  Clock,
  Calendar
} from "lucide-react";

const Contact = () => {
  document.title = "Contact — Webstate";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4 py-fluid-2xl">
            <div className="text-center max-w-4xl mx-auto">
              <BlurFade delay={0.2}>
                <h1 className="text-fluid-4xl sm:text-fluid-5xl font-display font-bold tracking-tight text-foreground mb-fluid-lg">
                  Contactez-<span className="text-gradient">Nous</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                  Notre équipe d'experts est là pour répondre à toutes vos questions et vous accompagner dans votre projet d'automatisation IA.
                </p>
              </BlurFade>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <BlurFade delay={0.1}>
                <Card className="border-slate-200">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                      Envoyez-nous un message
                    </h2>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Prénom"
                          className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Nom"
                          className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <input
                        type="email"
                        placeholder="Email professionnel"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Entreprise"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        placeholder="Décrivez votre projet..."
                        rows={5}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ButtonPremium size="lg" className="w-full">
                        <Send className="mr-2 w-4 h-4" />
                        Envoyer le message
                      </ButtonPremium>
                    </form>
                  </CardContent>
                </Card>
              </BlurFade>

              {/* Contact Info */}
              <BlurFade delay={0.2}>
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                      Autres moyens de nous contacter
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                        <p className="text-slate-600">contact@webstate.fr</p>
                        <p className="text-sm text-slate-500">Réponse sous 24h</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Téléphone</h3>
                        <p className="text-slate-600">+33 1 23 45 67 89</p>
                        <p className="text-sm text-slate-500">Lun-Ven 9h-18h</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Adresse</h3>
                        <p className="text-slate-600">42 Avenue des Champs-Élysées</p>
                        <p className="text-slate-600">75008 Paris, France</p>
                      </div>
                    </div>
                  </div>

                  <Card className="border-slate-200 bg-blue-50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-slate-900">
                          Consultation Gratuite
                        </h3>
                      </div>
                      <p className="text-slate-600 mb-4">
                        Réservez un créneau de 30 minutes avec nos experts pour discuter de votre projet.
                      </p>
                      <ButtonPremium variant="outline" className="w-full">
                        Réserver un créneau
                      </ButtonPremium>
                    </CardContent>
                  </Card>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
