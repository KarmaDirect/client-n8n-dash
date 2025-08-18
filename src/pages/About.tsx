import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonPremium } from "@/components/ui/button-premium";
import { NumberTicker } from "@/components/ui/number-ticker";
import { 
  Target, 
  Users, 
  Heart, 
  Zap, 
  Globe, 
  TrendingUp,
  ArrowRight,
  Linkedin,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { CTASection } from "@/components/cta-section";

const About = () => {
  document.title = "À propos — Webstate";

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Innovation",
      description: "Nous repoussons constamment les limites de l'IA pour créer des solutions révolutionnaires qui transforment la façon de travailler.",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaboration",
      description: "Nous croyons au pouvoir de la collaboration entre humains et IA pour créer un avenir plus productif et épanouissant.",
      color: "from-green-400 to-emerald-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Excellence",
      description: "Nous nous engageons à fournir des solutions de la plus haute qualité avec un support client exceptionnel.",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Impact",
      description: "Notre mission est de démocratiser l'IA pour permettre à chaque entreprise d'automatiser et de prospérer.",
      color: "from-orange-400 to-red-500"
    }
  ];

  const team = [
    {
      name: "Sophie Martin",
      role: "CEO & Co-fondatrice",
      bio: "Ancienne directrice IA chez Google, passionnée par l'automatisation intelligente des entreprises.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      linkedin: "#"
    },
    {
      name: "Thomas Dubois", 
      role: "CTO & Co-fondateur",
      bio: "Expert en machine learning avec 15 ans d'expérience chez Microsoft et Amazon.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      linkedin: "#"
    },
    {
      name: "Marie Laurent",
      role: "Directrice Produit",
      bio: "Spécialiste UX/UI et stratégie produit, ancienne chef produit chez Slack.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      linkedin: "#"
    },
    {
      name: "Pierre Moreau",
      role: "Directeur Commercial",
      bio: "Expert en ventes B2B et développement commercial dans la tech depuis 12 ans.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      linkedin: "#"
    }
  ];

  const milestones = [
    {
      year: "2022",
      title: "Fondation",
      description: "Création de Webstate avec la vision de démocratiser l'IA pour les entreprises"
    },
    {
      year: "2023",
      title: "Premiers Clients",
      description: "100 entreprises adoptent notre plateforme avec des résultats exceptionnels"
    },
    {
      year: "2023",
      title: "Levée de Fonds",
      description: "Série A de 10M€ pour accélérer notre développement et expansion"
    },
    {
      year: "2024",
      title: "Expansion",
      description: "500+ clients, équipe de 50+ experts, présence dans 12 pays"
    }
  ];

  const stats = [
    { value: 500, label: "Entreprises clientes", suffix: "+" },
    { value: 50, label: "Experts dédiés", suffix: "+" },
    { value: 12, label: "Pays", suffix: "" },
    { value: 99, label: "Satisfaction client", suffix: "%" }
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
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">Notre Histoire</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className="text-fluid-4xl sm:text-fluid-5xl font-display font-bold tracking-tight text-foreground mb-fluid-lg">
                  L'IA au Service de{" "}
                  <span className="text-gradient">Votre Succès</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                  Nous sommes une équipe passionnée d'experts en IA dédiée à transformer la façon dont les entreprises automatisent leurs processus et libèrent leur potentiel.
                </p>
              </BlurFade>

              <BlurFade delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/careers">
                    <ButtonPremium size="lg" className="group">
                      Rejoindre l'Équipe
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </ButtonPremium>
                  </Link>
                  <Link to="/contact">
                    <ButtonPremium variant="outline" size="lg">
                      <Mail className="mr-2 w-5 h-5" />
                      Nous Contacter
                    </ButtonPremium>
                  </Link>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Webstate en Chiffres
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <BlurFade key={stat.label} delay={0.2 + index * 0.1}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      <NumberTicker value={stat.value} />
                      {stat.suffix}
                    </div>
                    <p className="text-slate-600 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <BlurFade delay={0.1}>
                <Card className="h-full border-slate-200 bg-white">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 text-white">
                      <Target className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      Notre Mission
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Démocratiser l'intelligence artificielle pour permettre à chaque entreprise, 
                      quelle que soit sa taille, d'automatiser ses processus et de se concentrer sur 
                      ce qui compte vraiment : l'innovation et la croissance.
                    </p>
                  </CardContent>
                </Card>
              </BlurFade>

              <BlurFade delay={0.2}>
                <Card className="h-full border-slate-200 bg-white">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      Notre Vision
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Créer un avenir où l'IA et l'humain collaborent harmonieusement, 
                      où chaque tâche répétitive est automatisée, et où les équipes peuvent 
                      se consacrer pleinement à la créativité et à la stratégie.
                    </p>
                  </CardContent>
                </Card>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Nos Valeurs
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Les principes qui guident chacune de nos décisions et actions
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <BlurFade key={value.title} delay={0.2 + index * 0.1}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-200">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 text-white`}>
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">
                        {value.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Notre Parcours
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Les étapes clés de notre évolution
                </p>
              </div>
            </BlurFade>

            <div className="max-w-4xl mx-auto">
              {milestones.map((milestone, index) => (
                <BlurFade key={milestone.year} delay={0.2 + index * 0.1}>
                  <div className="flex items-start space-x-6 mb-12 last:mb-0">
                    <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {milestone.year}
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-slate-600 text-lg">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Notre Équipe de Direction
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Des experts passionnés qui donnent vie à notre vision
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {team.map((member, index) => (
                <BlurFade key={member.name} delay={0.2 + index * 0.1}>
                  <Card className="text-center border-slate-200 bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                          {member.name}
                        </h3>
                        <p className="text-blue-600 font-medium mb-3">
                          {member.role}
                        </p>
                        <p className="text-slate-600 text-sm">
                          {member.bio}
                        </p>
                      </div>
                      <a
                        href={member.linkedin}
                        className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                      >
                        <Linkedin className="w-5 h-5 text-blue-600" />
                      </a>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Office Location */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Venez Nous Voir
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Nos bureaux parisiens vous accueillent dans un environnement innovant
                </p>
              </div>
            </BlurFade>

            <div className="max-w-4xl mx-auto">
              <BlurFade delay={0.2}>
                <Card className="border-slate-200 bg-white">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900">
                              Siège Social Paris
                            </h3>
                            <p className="text-slate-600">Innovation District</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-slate-900 mb-2">Adresse</h4>
                            <p className="text-slate-600">
                              42 Avenue des Champs-Élysées<br />
                              75008 Paris, France
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-slate-900 mb-2">Horaires</h4>
                            <p className="text-slate-600">
                              Lundi - Vendredi: 9h00 - 18h00<br />
                              Weekend: Sur rendez-vous
                            </p>
                          </div>
                          
                          <div className="pt-4">
                            <Link to="/contact">
                              <ButtonPremium className="group">
                                <Calendar className="mr-2 w-4 h-4" />
                                Prendre Rendez-vous
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                              </ButtonPremium>
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-100 rounded-xl p-6 flex items-center justify-center">
                        <div className="text-center text-slate-500">
                          <MapPin className="w-16 h-16 mx-auto mb-4" />
                          <p>Plan interactif bientôt disponible</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
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

export default About;
