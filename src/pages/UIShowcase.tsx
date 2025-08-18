import { ButtonPremium } from "@/components/ui/button-premium";
import { CardPremium, CardContent, CardHeader, CardTitle } from "@/components/ui/card-premium";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { motion } from "motion/react";

const UIShowcase = () => {
  return (
    <main className="min-h-screen bg-white grain-overlay p-8">
      <div className="container mx-auto max-w-6xl space-y-fluid-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-fluid-5xl font-display font-bold text-gradient">
            UI Premium Showcase
          </h1>
          <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
            Démonstration des améliorations UI/UX implémentées pour surpasser les standards des agences premium
          </p>
        </motion.div>

        {/* Buttons Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-fluid-2xl font-display font-semibold">Boutons Premium</h2>
          <div className="flex flex-wrap gap-4">
            <ButtonPremium size="default">
              Default Premium
            </ButtonPremium>
            <ButtonPremium size="lg" className="group">
              Large avec Icon
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </ButtonPremium>
            <ButtonPremium variant="glass" size="default">
              Glassmorphism
            </ButtonPremium>
            <ButtonPremium variant="outline" size="default">
              Outline Style
            </ButtonPremium>
            <ButtonPremium loading size="default">
              Loading State
            </ButtonPremium>
          </div>
        </motion.section>

        {/* Cards Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-fluid-2xl font-display font-semibold">Cards avec Glassmorphism</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <CardPremium>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Glass Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Card avec effet glassmorphism, backdrop blur et hover lift animation.
                </p>
              </CardContent>
            </CardPremium>

            <CardPremium>
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Premium Shadow</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ombres colorées dynamiques et transitions fluides au hover.
                </p>
              </CardContent>
            </CardPremium>

            <CardPremium>
              <CardHeader>
                <div className="w-12 h-12 bg-primary-darker/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary-darker" />
                </div>
                <CardTitle>Motion Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Intégration Framer Motion pour animations sophistiquées.
                </p>
              </CardContent>
            </CardPremium>
          </div>
        </motion.section>

        {/* Typography Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-fluid-2xl font-display font-semibold">Typographie Fluide</h2>
          <div className="space-y-4">
            <p className="text-fluid-5xl font-display font-bold">
              Titre Display 5XL
            </p>
            <p className="text-fluid-3xl font-display font-semibold text-primary">
              Sous-titre 3XL Primary
            </p>
            <p className="text-fluid-xl font-medium">
              Paragraphe XL avec Inter Font
            </p>
            <p className="text-fluid-base text-muted-foreground">
              Texte de base avec couleur muted pour meilleure hiérarchie visuelle
            </p>
          </div>
        </motion.section>

        {/* Effects Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-fluid-2xl font-display font-semibold">Effets Visuels</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
              <h3 className="text-xl font-semibold mb-4">Gradient Mesh Background</h3>
              <p className="text-muted-foreground">
                Arrière-plans avec gradients radiaux multiples pour créer de la profondeur
              </p>
            </div>
            <div className="p-8 rounded-xl neu-card">
              <h3 className="text-xl font-semibold mb-4">Neumorphism Subtil</h3>
              <p className="text-muted-foreground">
                Effet de relief doux avec ombres intérieures et extérieures
              </p>
            </div>
          </div>
        </motion.section>

        {/* Animations Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-6"
        >
          <h2 className="text-fluid-2xl font-display font-semibold">Animations Premium</h2>
          <div className="flex flex-wrap gap-8">
            <div className="animate-float p-4 bg-primary/10 rounded-lg">
              <p className="font-medium">Float Animation</p>
            </div>
            <div className="animate-pulse-glow p-4 bg-accent/10 rounded-lg">
              <p className="font-medium">Pulse Glow</p>
            </div>
            <div className="p-4 bg-border rounded-lg animate-shimmer">
              <p className="font-medium">Shimmer Effect</p>
            </div>
          </div>
        </motion.section>

        {/* Spacing System */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="space-y-6"
        >
          <h2 className="text-fluid-2xl font-display font-semibold">Système d'Espacement Golden Ratio</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-muted-foreground">XS</div>
              <div className="h-4 bg-primary/20 rounded" style={{ width: "var(--space-xs)" }} />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-muted-foreground">SM</div>
              <div className="h-4 bg-primary/30 rounded" style={{ width: "var(--space-sm)" }} />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-muted-foreground">MD</div>
              <div className="h-4 bg-primary/40 rounded" style={{ width: "var(--space-md)" }} />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-muted-foreground">LG</div>
              <div className="h-4 bg-primary/50 rounded" style={{ width: "var(--space-lg)" }} />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-muted-foreground">XL</div>
              <div className="h-4 bg-primary/60 rounded" style={{ width: "var(--space-xl)" }} />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-muted-foreground">2XL</div>
              <div className="h-4 bg-primary/70 rounded" style={{ width: "var(--space-2xl)" }} />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-muted-foreground">3XL</div>
              <div className="h-4 bg-primary/80 rounded" style={{ width: "var(--space-3xl)" }} />
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default UIShowcase;

