import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { CardPremium } from "@/components/ui/card-premium";
import { ButtonPremium } from "@/components/ui/button-premium";
import { 
  Zap, 
  MessageSquare, 
  Calendar, 
  Users, 
  BarChart3,
  ShoppingCart,
  Database,
  Cloud,
  ArrowRight,
  CheckCircle,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";
import { CTASection } from "@/components/cta-section";
import { typography } from "@/lib/constants/design-tokens";
import { cn } from "@/lib/utils";

const Integrations = () => {
  document.title = "Intégrations — Webstate";

  const categories = [
    {
      name: "Communication",
      icon: <MessageSquare className="w-6 h-6" />,
      integrations: ["Slack", "Microsoft Teams", "Discord", "WhatsApp", "Telegram"]
    },
    {
      name: "CRM & Ventes",
      icon: <Users className="w-6 h-6" />,
      integrations: ["Salesforce", "HubSpot", "Pipedrive", "Zoho CRM", "Monday.com"]
    },
    {
      name: "E-commerce",
      icon: <ShoppingCart className="w-6 h-6" />,
      integrations: ["Shopify", "WooCommerce", "Magento", "PrestaShop", "BigCommerce"]
    },
    {
      name: "Productivité",
      icon: <Calendar className="w-6 h-6" />,
      integrations: ["Google Workspace", "Microsoft 365", "Notion", "Airtable", "Trello"]
    },
    {
      name: "Analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      integrations: ["Google Analytics", "Mixpanel", "Amplitude", "Tableau", "Power BI"]
    },
    {
      name: "Base de Données",
      icon: <Database className="w-6 h-6" />,
      integrations: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Supabase"]
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
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">500+ Intégrations</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className={cn(typography.heading.h1, "mb-fluid-lg")}>
                  Connectez{" "}
                  <span className="text-primary">Vos Outils</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                  Intégrez Webstate avec tous vos outils existants. Une seule plateforme pour tout automatiser.
                </p>
              </BlurFade>

              <BlurFade delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/auth">
                    <ButtonPremium size="lg" className="group">
                      Commencer l'Intégration
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </ButtonPremium>
                  </Link>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className={cn(typography.heading.h2, "mb-4")}>
                  Intégrations par Catégorie
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Trouvez l'intégration dont vous avez besoin
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {categories.map((category, index) => (
                <BlurFade key={category.name} delay={0.2 + index * 0.1}>
                  <CardPremium className="h-full border-border hover:shadow-premium transition-shadow">
                    <div className="p-fluid-lg">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          {category.icon}
                        </div>
                        <h3 className={cn(typography.heading.h4)}>
                          {category.name}
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {category.integrations.map((integration, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-foreground">{integration}</span>
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

        {/* CTA Section */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
};

export default Integrations;