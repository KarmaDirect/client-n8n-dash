import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonPremium } from "@/components/ui/button-premium";
import { 
  Code2, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight, 
  Copy, 
  CheckCircle,
  ExternalLink,
  BookOpen,
  Terminal,
  Webhook
} from "lucide-react";
import { Link } from "react-router-dom";
import { CTASection } from "@/components/cta-section";

const Api = () => {
  document.title = "API — Webstate";

  const apiFeatures = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "API RESTful Complète",
      description: "API moderne, rapide et intuitive pour intégrer Webstate dans vos applications.",
      features: ["Endpoints RESTful standard", "Réponses JSON structurées", "Pagination automatique", "Filtrage avancé"]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Sécurité Enterprise",
      description: "Authentification robuste et chiffrement de bout en bout pour protéger vos données.",
      features: ["API Keys sécurisées", "OAuth 2.0", "Rate limiting intelligent", "Audit trails complets"]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Webhooks Temps Réel",
      description: "Recevez des notifications instantanées pour tous les événements importants.",
      features: ["Events en temps réel", "Retry automatique", "Validation des signatures", "Multiple endpoints"]
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "SDKs Officiels",
      description: "Bibliothèques officielles pour les langages les plus populaires.",
      features: ["JavaScript/Node.js", "Python", "PHP", "Documentation complète"]
    }
  ];

  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/agents",
      description: "Liste tous vos agents IA",
      response: "Retourne la liste paginée de vos agents avec leurs statuts"
    },
    {
      method: "POST", 
      path: "/api/v1/agents",
      description: "Crée un nouvel agent IA",
      response: "Retourne les détails de l'agent créé avec son ID unique"
    },
    {
      method: "GET",
      path: "/api/v1/conversations",
      description: "Récupère les conversations",
      response: "Liste des conversations avec métadonnées et historique"
    },
    {
      method: "POST",
      path: "/api/v1/messages",
      description: "Envoie un message à un agent",
      response: "Retourne la réponse de l'agent et les actions effectuées"
    },
    {
      method: "GET",
      path: "/api/v1/analytics",
      description: "Accède aux métriques et analytics",
      response: "Données de performance et statistiques d'usage détaillées"
    }
  ];

  const codeExamples = [
    {
      language: "JavaScript",
      title: "Créer un agent IA",
      code: `const agent = await fetch('https://api.webstate.fr/v1/agents', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Support Client',
    type: 'customer_support',
    config: {
      language: 'fr',
      tone: 'professional'
    }
  })
});

const result = await agent.json();
console.log('Agent créé:', result.id);`
    },
    {
      language: "Python",
      title: "Envoyer un message",
      code: `import requests

response = requests.post(
    'https://api.webstate.fr/v1/messages',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'agent_id': 'agent_123',
        'message': 'Bonjour, j\\'ai besoin d\\'aide',
        'user_id': 'user_456'
    }
)

data = response.json()
print(f"Réponse: {data['response']}")`
    },
    {
      language: "PHP",
      title: "Récupérer les analytics",
      code: `<?php
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => 'https://api.webstate.fr/v1/analytics',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_API_KEY',
        'Content-Type: application/json'
    ]
]);

$response = curl_exec($curl);
$data = json_decode($response, true);

echo "Total conversations: " . $data['total_conversations'];
curl_close($curl);
?>`
    }
  ];

  const webhookEvents = [
    "agent.created", "agent.updated", "agent.deleted",
    "conversation.started", "conversation.ended", 
    "message.received", "message.sent",
    "workflow.triggered", "workflow.completed"
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
                  <Code2 className="w-4 h-4" />
                  <span className="text-sm font-medium">API Développeurs</span>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className="text-fluid-4xl sm:text-fluid-5xl font-display font-bold tracking-tight text-foreground mb-fluid-lg">
                  API Puissante pour{" "}
                  <span className="text-gradient">Développeurs</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-fluid-xl font-medium">
                  Intégrez facilement nos agents IA dans vos applications avec notre API RESTful moderne, sécurisée et bien documentée.
                </p>
              </BlurFade>

              <BlurFade delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/auth">
                    <ButtonPremium size="lg" className="group">
                      Obtenir une API Key
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </ButtonPremium>
                  </Link>
                  <ButtonPremium variant="outline" size="lg">
                    <BookOpen className="mr-2 w-5 h-5" />
                    Documentation
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </ButtonPremium>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* API Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Une API Pensée pour les Développeurs
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Tous les outils dont vous avez besoin pour créer des intégrations robustes
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {apiFeatures.map((feature, index) => (
                <BlurFade key={feature.title} delay={0.2 + index * 0.1}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-200">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 text-white">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 mb-6 text-lg">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Endpoints Principaux
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Découvrez les endpoints les plus utilisés de notre API
                </p>
              </div>
            </BlurFade>

            <div className="max-w-4xl mx-auto space-y-4">
              {endpoints.map((endpoint, index) => (
                <BlurFade key={endpoint.path} delay={0.2 + index * 0.1}>
                  <Card className="border-slate-200 bg-white">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            endpoint.method === 'GET' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className="text-slate-800 font-mono text-sm bg-slate-100 px-3 py-1 rounded">
                            {endpoint.path}
                          </code>
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-900 font-medium mb-1">
                            {endpoint.description}
                          </p>
                          <p className="text-slate-600 text-sm">
                            {endpoint.response}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Exemples de Code
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Commencez rapidement avec ces exemples pratiques
                </p>
              </div>
            </BlurFade>

            <div className="max-w-5xl mx-auto space-y-8">
              {codeExamples.map((example, index) => (
                <BlurFade key={example.language} delay={0.2 + index * 0.1}>
                  <Card className="border-slate-200">
                    <CardContent className="p-0">
                      <div className="bg-slate-900 text-white p-4 rounded-t-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Terminal className="w-4 h-4" />
                            <span className="font-medium">{example.language}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-400">{example.title}</span>
                          </div>
                          <ButtonPremium variant="ghost" size="sm" className="text-white hover:bg-slate-800">
                            <Copy className="w-4 h-4 mr-2" />
                            Copier
                          </ButtonPremium>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50">
                        <pre className="text-sm text-slate-800 overflow-x-auto">
                          <code>{example.code}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Webhooks Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Webhooks Temps Réel
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Restez synchronisé avec tous les événements de vos agents IA
                </p>
              </div>
            </BlurFade>

            <div className="max-w-4xl mx-auto">
              <BlurFade delay={0.2}>
                <Card className="border-slate-200 bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Webhook className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">
                          Événements Disponibles
                        </h3>
                        <p className="text-slate-600">
                          Recevez des notifications pour ces événements
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {webhookEvents.map((event, index) => (
                        <div key={event} className="bg-slate-50 rounded-lg p-3">
                          <code className="text-sm text-slate-800 font-mono">
                            {event}
                          </code>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Commencez Rapidement
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  En quelques étapes simples, intégrez notre API dans votre application
                </p>
              </div>
            </BlurFade>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: "Créez votre compte",
                    description: "Inscrivez-vous gratuitement et obtenez votre API key"
                  },
                  {
                    step: "2", 
                    title: "Testez l'API",
                    description: "Utilisez notre playground pour explorer les endpoints"
                  },
                  {
                    step: "3",
                    title: "Intégrez",
                    description: "Implémentez dans votre application avec nos SDKs"
                  }
                ].map((step, index) => (
                  <BlurFade key={step.step} delay={0.2 + index * 0.1}>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                        {step.step}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </BlurFade>
                ))}
              </div>
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

export default Api;
