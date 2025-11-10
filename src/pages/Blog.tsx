import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { CardPremium } from "@/components/ui/card-premium";
import { ButtonPremium } from "@/components/ui/button-premium";
import { 
  Calendar, 
  User, 
  ArrowRight, 
  BookOpen, 
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { typography } from "@/lib/constants/design-tokens";
import { cn } from "@/lib/utils";

const Blog = () => {
  document.title = "Blog — Webstate";

  const posts = [
    {
      title: "L'Avenir de l'Automatisation IA dans les Entreprises",
      excerpt: "Découvrez comment l'IA transforme fondamentalement la façon dont les entreprises abordent l'automatisation.",
      author: "Sophie Martin",
      date: "15 Mars 2024",
      readTime: "8 min",
      category: "Tendances IA"
    },
    {
      title: "10 Cas d'Usage IA qui Révolutionnent le Service Client",
      excerpt: "Les applications concrètes de l'IA pour transformer votre relation client.",
      author: "Thomas Dubois",
      date: "12 Mars 2024", 
      readTime: "6 min",
      category: "Cas d'Usage"
    },
    {
      title: "Guide Complet : Intégrer l'IA dans Votre Workflow",
      excerpt: "Un guide étape par étape pour implémenter avec succès l'IA dans vos processus métier.",
      author: "Marie Laurent",
      date: "10 Mars 2024",
      readTime: "12 min", 
      category: "Guide"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="pt-20 pb-16 bg-background">
          <div className="container mx-auto px-4 py-fluid-2xl">
            <div className="text-center max-w-4xl mx-auto">
              <BlurFade delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-8">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">Blog</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className={cn(typography.heading.h1, "mb-fluid-lg")}>
                  Blog{" "}
                  <span className="text-primary">Webstate</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                  Découvrez les dernières tendances, guides pratiques et actualités sur l'automatisation IA.
                </p>
              </BlurFade>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {posts.map((post, index) => (
                <BlurFade key={post.title} delay={0.1 + index * 0.1}>
                  <CardPremium className="h-full border-border hover:shadow-premium transition-shadow">
                    <div className="p-fluid-lg">
                      <div className="text-xs text-primary font-medium mb-3">{post.category}</div>
                      <h3 className={cn(typography.heading.h4, "mb-3")}>
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </div>
                      </div>
                      <ButtonPremium variant="outline" size="sm" className="w-full">
                        Lire l'article
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </ButtonPremium>
                    </div>
                  </CardPremium>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;