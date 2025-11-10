/**
 * Design Tokens - WebState SaaS
 * 
 * Ce fichier centralise tous les tokens de design pour garantir l'homogénéité.
 * Utilisez ces constantes au lieu de valeurs hardcodées.
 */

// Typographie
export const typography = {
  heading: {
    h1: "text-fluid-4xl font-bold font-display tracking-tight",
    h2: "text-fluid-3xl font-semibold font-display tracking-tight",
    h3: "text-fluid-2xl font-semibold font-display tracking-tight",
    h4: "text-fluid-xl font-medium font-display",
    h5: "text-lg font-medium",
    h6: "text-base font-medium",
  },
  body: {
    large: "text-base font-normal",
    default: "text-sm font-normal",
    small: "text-xs font-normal",
  },
  weight: {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  },
} as const;

// Espacements (utiliser les classes Tailwind fluid ou standard)
export const spacing = {
  xs: "p-fluid-xs gap-fluid-xs",
  sm: "p-fluid-sm gap-fluid-sm",
  md: "p-fluid-md gap-fluid-md",
  lg: "p-fluid-lg gap-fluid-lg",
  xl: "p-fluid-xl gap-fluid-xl",
  "2xl": "p-fluid-2xl gap-fluid-2xl",
  "3xl": "p-fluid-3xl gap-fluid-3xl",
} as const;

// Couleurs (utiliser les variables CSS via Tailwind)
export const colors = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  muted: "bg-muted text-muted-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  card: "bg-card text-card-foreground",
} as const;

// Shadows
export const shadows = {
  xs: "shadow-xs",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
  glass: "shadow-glass",
  premium: "shadow-premium",
} as const;

// Border Radius
export const radius = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
} as const;

// Transitions
export const transitions = {
  standard: "transition-standard",
  fast: "transition-all duration-fast",
  base: "transition-all duration-base",
  slow: "transition-all duration-slow",
} as const;

// Animations
export const animations = {
  fadeInUp: "animate-fade-in-up",
  scaleIn: "animate-scale-in",
  float: "animate-float",
  pulseGlow: "animate-pulse-glow",
  shimmer: "animate-shimmer",
} as const;

// Composants réutilisables
export const components = {
  card: "dashboard-card",
  cardPremium: "glass-card",
  buttonPremium: "btn-premium",
  inputPremium: "input-premium",
  linkPremium: "link-premium",
} as const;

// Classes utilitaires combinées
export const utilities = {
  hoverLift: "hover-lift transition-standard",
  focusRing: "focus-ring",
  textGradient: "text-gradient",
  badgePremium: "badge-premium",
} as const;

/**
 * Helper pour combiner les classes de manière type-safe
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Exemples d'utilisation :
 * 
 * // Titre principal
 * <h1 className={typography.heading.h1}>Titre</h1>
 * 
 * // Card avec spacing
 * <div className={cn(components.cardPremium, spacing.lg, shadows.premium)}>
 *   Contenu
 * </div>
 * 
 * // Bouton premium avec animation
 * <button className={cn(components.buttonPremium, transitions.standard, utilities.hoverLift)}>
 *   Action
 * </button>
 */
