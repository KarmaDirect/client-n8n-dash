import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonPremium } from "@/components/ui/button-premium";
import { 
  Calendar, 
  User, 
  ArrowRight, 
  BookOpen, 
  TrendingUp,
  Search,
  Filter,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  document.title = "Blog — Webstate";

  const featuredPost = {
    title: "L'Avenir de l'Automatisation IA dans les Entreprises",
    excerpt: "Découvrez comment l'IA transforme fondamentalement la façon dont les entreprises abordent l'automatisation et quelles sont les tendances à surveiller en 2024.",
    author: "Sophie Martin",
    date: "15 Mars 2024",
    readTime: "8 min",
    category: "Tendances IA",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop"
  };

  const posts = [
    {
      title: "10 Cas d'Usage IA qui Révolutionnent le Service Client",
      excerpt: "Les applications concrètes de l'IA pour transformer votre relation client et améliorer la satisfaction.",
      author: "Thomas Dubois",
      date: "12 Mars 2024", 
      readTime: "6 min",
      category: "Cas d'Usage",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop"
    },
    {
      title: "Guide Complet : Intégrer l'IA dans Votre Workflow",
      excerpt: "Un guide étape par étape pour implémenter avec succès l'IA dans vos processus métier.",
      author: "Marie Laurent",
      date: "10 Mars 2024",
      readTime: "12 min", 
      category: "Guide",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
    },
    {
      title: "ROI de l'IA : Comment Mesurer le Retour sur Investissement",
      excerpt: "Les métriques clés et méthodes pour évaluer l'impact financier de vos projets IA.",
      author: "Pierre Moreau",
      date: "8 Mars 2024",
      readTime: "10 min",
      category: "Business",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
    },
    {
      title: "Sécurité et IA : Protéger Vos Données Sensibles",
      excerpt: "Best practices pour maintenir la sécurité lors de l'implémentation d'agents IA.",
      author: "Lisa Chen",
      date: "5 Mars 2024",
      readTime: "7 min",
      category: "Sécurité",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop"
    },
    {
      title: "IA Conversationnelle : Créer des Chatbots Efficaces",
      excerpt: "Les techniques avancées pour développer des agents conversationnels qui comprennent vraiment vos clients.",
      author: "Alex Rivera",
      date: "3 Mars 2024", 
      readTime: "9 min",
      category: "Technologie",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=250&fit=crop"
    },
    {
      title: "Automatisation RH : L'IA au Service des Ressources Humaines",
      excerpt: "Comment l'IA transforme le recrutement, l'onboarding et la gestion des talents.",
      author: "Sarah Johnson",
      date: "1 Mars 2024",
      readTime: "8 min",
      category: "RH",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop"
    }
  ];

  const categories = [
    "Tous les articles",
    "Tendances IA",
    "Cas d'Usage", 
    "Guide",
    "Business",
    "Sécurité",
    "Technologie",
    "RH"
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4 py-fluid-2xl">
            <div className="text-center max-w-4xl mx-auto">
              <BlurFade delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-8">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">Blog Webstate</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className="text-fluid-4xl sm:text-fluid-5xl font-display font-bold tracking-tight text-foreground mb-fluid-lg">
                  Insights & Actualités{" "}
                  <span className="text-gradient">IA</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                  Découvrez les dernières tendances, guides pratiques et success stories pour maîtriser l'IA dans votre entreprise.
                </p>
              </BlurFade>

              <BlurFade delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un article..."
                      className="pl-10 pr-4 py-3 w-80 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <ButtonPremium variant="outline" size="default">
                    <Filter className="mr-2 w-4 h-4" />
                    Filtres
                  </ButtonPremium>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Article à la Une
                </h2>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <Card className="max-w-4xl mx-auto overflow-hidden border-slate-200 hover:shadow-xl transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {featuredPost.category}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      {featuredPost.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <ButtonPremium className="group w-fit">
                      Lire l'Article
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </ButtonPremium>
                  </CardContent>
                </div>
              </Card>
            </BlurFade>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      index === 0 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </BlurFade>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Derniers Articles
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {posts.map((post, index) => (
                <BlurFade key={post.title} delay={0.2 + index * 0.1}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-200 group cursor-pointer">
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-slate-700 px-2 py-1 rounded text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                        Lire la suite
                        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Restez Informé
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  Recevez nos derniers articles et insights IA directement dans votre boîte mail
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <ButtonPremium>
                    S'Abonner
                  </ButtonPremium>
                </div>
                
                <p className="text-sm text-slate-500 mt-4">
                  Pas de spam, désinscription en un clic
                </p>
              </div>
            </BlurFade>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
