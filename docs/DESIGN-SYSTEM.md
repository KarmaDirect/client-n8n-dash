# 🎨 Documentation du Système de Design - WebState SaaS

## 📚 Architecture du Design System

### **Stack Technique**
- **Framework UI** : ShadCN UI (composants React basés sur Radix UI)
- **Styling** : Tailwind CSS avec variables CSS personnalisées
- **Animations** : MagicUI (marquee-3d, ripple, avatar-circles, etc.)
- **Polices** : 
  - `Inter` (sans-serif) pour le texte
  - `Space Grotesk` (display) pour les titres
- **Configuration** : `components.json` pour ShadCN CLI

### **Structure des Fichiers Clés**

```
tailwind.config.ts     → Configuration Tailwind (extensions, plugins)
components.json        → Configuration ShadCN (aliases, style)
src/index.css         → Variables CSS, animations, composants premium
src/components/ui/    → Composants ShadCN de base
src/components/ui/*-premium.tsx → Variantes premium (button, card)
src/components/magicui/ → Composants MagicUI (animations avancées)
```

## 🎨 Système de Couleurs

### **Variables CSS (HSL)**
Toutes les couleurs sont définies en HSL dans `src/index.css` via des variables CSS :

```css
--primary: 234 89% 55%;          /* Bleu premium principal */
--primary-foreground: 0 0% 100%; /* Texte sur primary */
--primary-glow: 234 100% 65%;    /* Effet glow */
--primary-lighter: 234 89% 65%; /* Variante claire */
--primary-darker: 234 89% 45%;   /* Variante foncée */
```

**Utilisation dans Tailwind :**
```tsx
className="bg-primary text-primary-foreground"
className="border-primary/20"  // Opacité avec /
className="shadow-premium"     // Shadow personnalisée
```

### **Palette Complète**
- **Primary** : Bleu premium (234° hue)
- **Secondary** : Gris neutre
- **Accent** : Bleu accent
- **Muted** : Gris clair pour backgrounds
- **Destructive** : Rouge pour erreurs
- **Card/Popover** : Surfaces avec transparence

## 📐 Typographie

### **Polices**
```css
--font-sans: 'Inter', system-ui, sans-serif;      /* Texte général */
--font-display: 'Space Grotesk', var(--font-sans); /* Titres */
```

### **Hiérarchie**
- **H1-H6** : Utilisent `font-display` (Space Grotesk)
- **Body** : Utilisent `font-sans` (Inter)
- **Letter-spacing** : -0.02em pour les titres

### **Tailles Fluid (Responsive)**
```css
--fluid-sm: clamp(0.875rem, 0.8rem + 0.25vw, 1rem)
--fluid-base: clamp(1rem, 0.925rem + 0.25vw, 1.125rem)
--fluid-lg: clamp(1.125rem, 1rem + 0.5vw, 1.25rem)
--fluid-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)
--fluid-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem)
--fluid-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)
--fluid-4xl: clamp(2.25rem, 1.75rem + 2.5vw, 3rem)
--fluid-5xl: clamp(3rem, 2rem + 5vw, 4rem)
```

## 🎭 Composants Premium

### **Button Premium**
```tsx
import { ButtonPremium } from "@/components/ui/button-premium";

<ButtonPremium>Action</ButtonPremium>
```
- Gradient primary → primary-darker
- Effet shimmer au hover
- Shadow premium avec glow
- Animation translateY au hover

### **Card Premium**
```tsx
import { CardPremium } from "@/components/ui/card-premium";

<CardPremium>Contenu</CardPremium>
```
- Glassmorphism optionnel
- Border avec gradient
- Hover lift effect

### **Classes CSS Premium**
```css
.btn-premium      → Bouton avec gradient et animations
.glass-card       → Glassmorphism avec backdrop-filter
.neu-card         → Neumorphism (ombres douces)
.input-premium    → Input avec focus ring animé
.link-premium     → Lien avec underline animé
.text-gradient    → Texte avec gradient primary → accent
```

## 🎬 Animations & Effets

### **MagicUI Components**
- `Marquee3D` : Marquee avec effet 3D
- `Ripple` : Effet de vague
- `AvatarCircles` : Avatars en cercle animés
- `BlurFade` : Fade avec blur

### **Animations CSS Personnalisées**
```css
.animate-float         → Flottement doux
.animate-pulse-glow    → Pulsation avec glow
.animate-shimmer       → Effet shimmer
.animate-fade-in-up    → Fade depuis le bas
.animate-scale-in      → Scale depuis 0.95
```

### **Timing Functions**
```css
--ease-in-out-expo: cubic-bezier(0.87, 0, 0.13, 1)
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)
--duration-fast: 150ms
--duration-base: 250ms
--duration-slow: 350ms
--duration-slower: 500ms
```

## 📦 Espacements (Spacing)

### **Système Golden Ratio**
```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 0.75rem;   /* 12px */
--space-lg: 1.25rem;   /* 20px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3.25rem;  /* 52px */
--space-3xl: 5.25rem;  /* 84px */
```

**Utilisation :**
```tsx
className="p-fluid-lg gap-fluid-md"
```

## 🎯 Shadows & Effets

### **Système de Shadows**
```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
--shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.15)
--shadow-premium: 0 10px 40px -10px hsl(var(--primary) / 0.25)
```

## 🔄 Comment Changer de Thème (Futur)

### **Option 1 : Changer les Variables CSS**
Modifier uniquement `src/index.css` :
```css
:root {
  --primary: 142 76% 36%;  /* Vert au lieu de bleu */
  /* Garder toutes les autres variables */
}
```

### **Option 2 : Remplacer ShadCN**
1. Garder la structure `src/components/ui/`
2. Remplacer les composants ShadCN par d'autres
3. Adapter `tailwind.config.ts` si nécessaire
4. **Ne PAS toucher** aux variables CSS (elles restent compatibles)

### **Option 3 : Nouveau Design System**
1. Créer `src/styles/new-theme.css`
2. Importer après `index.css` dans `main.tsx`
3. Overrider les variables CSS
4. Garder la même structure de composants

## ⚠️ Points Critiques à Respecter

### **NE PAS Modifier**
- ❌ Les variables CSS dans `index.css` (sauf pour changer les couleurs)
- ❌ La structure des composants ShadCN (sauf remplacement complet)
- ❌ Les animations MagicUI (elles sont spécifiques)
- ❌ La landing page (`src/pages/Index.tsx`) - design finalisé

### **Peut Être Modifié**
- ✅ Les tailles de police dans les composants (utiliser les tokens)
- ✅ Les espacements (utiliser le système de spacing)
- ✅ Les couleurs via les variables CSS
- ✅ Ajouter de nouveaux composants premium

## 📋 Checklist pour Homogénéiser

### **Dashboard & Auth doivent utiliser :**
1. ✅ Mêmes polices (Inter + Space Grotesk)
2. ✅ Mêmes couleurs (variables CSS primary/secondary)
3. ✅ Mêmes espacements (système fluid spacing)
4. ✅ Mêmes shadows (shadow-premium pour les cards)
5. ✅ Mêmes animations (animate-fade-in-up, etc.)
6. ✅ Mêmes composants premium (ButtonPremium, CardPremium)

### **Patterns à Appliquer**
```tsx
// ✅ BON : Utiliser les composants premium
<ButtonPremium>Action</ButtonPremium>
<CardPremium className="p-fluid-lg">Contenu</CardPremium>

// ❌ MAUVAIS : Créer des styles custom
<button className="bg-blue-500">Action</button>
<div className="p-4 bg-white">Contenu</div>
```

## 🔍 Vérification des Liens

### **Navbar (`src/components/navbar.tsx`)**
- Doit pointer vers `/` (landing)
- Doit pointer vers `/pricing`, `/features`, etc.
- Bouton CTA vers `/auth`

### **Footer (`src/components/footer.tsx`)**
- Liens légaux (`/terms`, `/privacy`)
- Liens sociaux
- Liens produits
- Liens support

### **Menu Dashboard**
- Navigation entre sections dashboard
- Liens vers admin (si admin)
- Logout fonctionnel

## 🚀 Prochaines Étapes

1. ✅ Documenter le système (ce fichier)
2. 🔄 Nettoyer les fichiers obsolètes
3. 🔄 Créer l'onboarding multi-étapes
4. 🔄 Homogénéiser dashboard/auth avec landing
5. 🔄 Vérifier tous les liens/footer/menu
6. 🔄 Standardiser les composants similaires
