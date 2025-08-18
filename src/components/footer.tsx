import { Link } from "react-router-dom";
import { WebstateLogo } from "@/components/ui/webstate-logo";
import { ButtonPremium } from "@/components/ui/button-premium";
import { ArrowRight, Mail, Phone, MapPin, Twitter, Linkedin, Github } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    produit: [
      { label: "Fonctionnalités", href: "#features" },
      { label: "Cas d'Usage", href: "#use-cases" },
      { label: "Tarifs", href: "#pricing" },
      { label: "API", href: "#" },
      { label: "Intégrations", href: "#" }
    ],
    entreprise: [
      { label: "À propos", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Carrières", href: "#" },
      { label: "Presse", href: "#" },
      { label: "Partenaires", href: "#" }
    ],
    support: [
      { label: "Centre d'aide", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Formation", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Statut", href: "#" }
    ],
    légal: [
      { label: "Mentions légales", href: "#" },
      { label: "Confidentialité", href: "#" },
      { label: "CGU", href: "#" },
      { label: "RGPD", href: "#" },
      { label: "Cookies", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" }
  ];

  return (
    <footer className={cn("bg-slate-900 text-white relative overflow-hidden", className)}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-fluid-2xl">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-fluid-2xl">
            {/* Company Info */}
            <div className="space-y-6">
              <WebstateLogo size="lg" variant="white" />
              <p className="text-slate-300 max-w-md text-lg">
                Automatisez votre entreprise avec des agents IA intelligents. 
                Gagnez du temps, réduisez les erreurs et concentrez-vous sur ce qui compte vraiment.
              </p>
              
              {/* Newsletter Signup */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Restez informé</h3>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <ButtonPremium size="default" className="bg-primary hover:bg-primary-darker">
                    <ArrowRight className="w-4 h-4" />
                  </ButtonPremium>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Contactez-nous</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>contact@webstate.fr</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Paris, France</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-slate-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-fluid-xl">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-semibold capitalize">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-slate-300 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="pt-fluid-xl border-t border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <span>&copy; {currentYear} Webstate. Tous droits réservés.</span>
                <span>•</span>
                <span>Propulsé par l'IA</span>
              </div>
              
              <div className="flex items-center gap-6">
                <Link to="/auth">
                  <ButtonPremium variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    Connexion
                  </ButtonPremium>
                </Link>
                <Link to="/auth">
                  <ButtonPremium size="sm" className="bg-primary hover:bg-primary-darker">
                    Essai Gratuit
                  </ButtonPremium>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
    </footer>
  );
}

