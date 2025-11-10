import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { CardPremium } from "@/components/ui/card-premium";
import { ButtonPremium } from "@/components/ui/button-premium";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  Send,
  Clock,
  Calendar
} from "lucide-react";
import { typography } from "@/lib/constants/design-tokens";
import { cn } from "@/lib/utils";

const Contact = () => {
  document.title = "Contact — Webstate";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="pt-20 pb-16 bg-background">
          <div className="container mx-auto px-4 py-fluid-2xl">
            <div className="text-center max-w-4xl mx-auto">
              <BlurFade delay={0.2}>
                <h1 className={cn(typography.heading.h1, "mb-fluid-lg")}>
                  Contactez-<span className="text-primary">Nous</span>
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

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <BlurFade delay={0.1}>
                <CardPremium className="border-border">
                  <div className="p-fluid-lg">
                    <h2 className={cn(typography.heading.h2, "mb-6")}>
                      Envoyez-nous un message
                    </h2>
                    <form className="space-y-6">
                      <div>
                        <Label htmlFor="name">Nom complet</Label>
                        <Input id="name" className="mt-2" placeholder="Jean Dupont" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" className="mt-2" placeholder="jean@exemple.com" />
                      </div>
                      <div>
                        <Label htmlFor="company">Entreprise</Label>
                        <Input id="company" className="mt-2" placeholder="Nom de votre entreprise" />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" className="mt-2" rows={6} placeholder="Décrivez votre projet..." />
                      </div>
                      <ButtonPremium type="submit" className="w-full group">
                        Envoyer le message
                        <Send className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </ButtonPremium>
                    </form>
                  </div>
                </CardPremium>
              </BlurFade>

              {/* Contact Info */}
              <BlurFade delay={0.2}>
                <div className="space-y-8">
                  <CardPremium className="border-border">
                    <div className="p-fluid-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className={cn(typography.heading.h5, "mb-2")}>Email</h3>
                          <p className="text-muted-foreground">contact@webstate.fr</p>
                          <p className="text-sm text-muted-foreground mt-1">Réponse sous 24h</p>
                        </div>
                      </div>
                    </div>
                  </CardPremium>

                  <CardPremium className="border-border">
                    <div className="p-fluid-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                          <Phone className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className={cn(typography.heading.h5, "mb-2")}>Téléphone</h3>
                          <p className="text-foreground">+33 1 23 45 67 89</p>
                          <p className="text-sm text-muted-foreground mt-1">Lun-Ven, 9h-18h</p>
                        </div>
                      </div>
                    </div>
                  </CardPremium>

                  <CardPremium className="border-border">
                    <div className="p-fluid-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className={cn(typography.heading.h5, "mb-2")}>Adresse</h3>
                          <p className="text-foreground">123 Rue de la Tech</p>
                          <p className="text-foreground">75001 Paris, France</p>
                        </div>
                      </div>
                    </div>
                  </CardPremium>

                  <CardPremium className="border-border">
                    <div className="p-fluid-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className={cn(typography.heading.h5, "mb-2")}>Prendre rendez-vous</h3>
                          <p className="text-muted-foreground mb-4">Planifiez un appel avec notre équipe</p>
                          <ButtonPremium variant="outline" size="sm">
                            Réserver un créneau
                          </ButtonPremium>
                        </div>
                      </div>
                    </div>
                  </CardPremium>
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