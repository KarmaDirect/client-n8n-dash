import { Button } from "@/components/ui/button";
import webstateLogo from "@/assets/webstate-logo.png";

const Index = () => {
  document.title = "n8n Client Hub — Multi-tenant Workflow Dashboard";
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <section className="container text-center space-y-6 hero-aurora">
        <div className="mb-8">
          <img 
            src={webstateLogo} 
            alt="Webstate" 
            className="logo-webstate h-20 mx-auto mb-6"
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto">
          Client access to your n8n workflows
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Multi-tenant workspaces, role-based permissions, realtime run logs, and built-in subscriptions.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="/auth"><Button variant="hero" size="xl">Get started</Button></a>
          <a href="/app"><Button variant="outline" size="xl">View dashboard</Button></a>
        </div>
      </section>
    </main>
  );
};

export default Index;
