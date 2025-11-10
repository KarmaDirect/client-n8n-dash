# 📋 Plan d'Action - Homogénéisation Design & Structure

## ✅ Ce qui a été fait

### 1. **Documentation du Système de Design**
- ✅ Créé `docs/DESIGN-SYSTEM.md` - Documentation complète du système
- ✅ Créé `src/lib/constants/design-tokens.ts` - Tokens centralisés
- ✅ Analysé la structure ShadCN + Tailwind + MagicUI

### 2. **Nettoyage du Projet**
- ✅ Créé `scripts/cleanup-project.sh` - Script d'archivage
- ✅ Identifié 47 fichiers .md à archiver
- ✅ Identifié fichiers temporaires et suspects

### 3. **Système d'Onboarding**
- ✅ Créé `src/features/onboarding/OnboardingFlow.tsx`
- ✅ 5 étapes : Entreprise → Équipe → Automatisation → Facturation → Confirmation
- ✅ Utilise les composants premium (ButtonPremium, CardPremium)
- ✅ Animations cohérentes avec la landing

## 🔄 En Cours

### 4. **Homogénéisation Design Dashboard/Auth**

**Objectifs :**
- Utiliser les mêmes composants premium que la landing
- Appliquer les mêmes polices (Inter + Space Grotesk)
- Utiliser les mêmes espacements (fluid spacing)
- Appliquer les mêmes shadows (shadow-premium)
- Utiliser les mêmes animations (fade-in-up, etc.)

**Fichiers à modifier :**
1. `src/pages/Auth.tsx` - Remplacer Card par CardPremium, Button par ButtonPremium
2. `src/pages/Dashboard.tsx` - Utiliser les tokens de design
3. `src/components/DashboardLayout.tsx` - Homogénéiser le header
4. Tous les composants dashboard - Utiliser les classes premium

## 📝 Actions Restantes

### Phase 1 : Vérification des Liens
- [ ] Vérifier tous les liens dans `src/components/navbar.tsx`
- [ ] Vérifier tous les liens dans `src/components/footer.tsx`
- [ ] Vérifier la navigation dashboard
- [ ] Tester tous les liens manuellement

### Phase 2 : Homogénéisation Progressive
- [ ] Modifier `Auth.tsx` pour utiliser CardPremium et ButtonPremium
- [ ] Modifier `Dashboard.tsx` pour utiliser les tokens
- [ ] Modifier les composants dashboard pour cohérence
- [ ] Appliquer les animations premium partout

### Phase 3 : Standardisation
- [ ] Créer un composant CardDashboard réutilisable
- [ ] Créer un composant ButtonAction réutilisable
- [ ] Standardiser les espacements dans tous les composants
- [ ] Uniformiser les tailles de police

## 🎯 Règles à Respecter

### ✅ À FAIRE
- Utiliser `ButtonPremium` au lieu de `Button` pour les CTAs
- Utiliser `CardPremium` pour les cards importantes
- Utiliser les tokens de design (`typography.heading.h1`, etc.)
- Utiliser les classes premium (`glass-card`, `btn-premium`, etc.)
- Appliquer les animations (`animate-fade-in-up`, etc.)

### ❌ À NE PAS FAIRE
- ❌ Modifier la landing page (`src/pages/Index.tsx`)
- ❌ Changer les couleurs principales (primary/secondary)
- ❌ Modifier la structure des composants ShadCN
- ❌ Supprimer des fichiers (seulement archiver)

## 🔍 Points d'Attention

1. **Landing Page** : Ne PAS toucher, c'est le design de référence
2. **Composants Premium** : Utiliser partout où c'est pertinent
3. **Animations** : Appliquer progressivement, tester sur mobile
4. **Responsive** : Vérifier sur mobile après chaque modification
5. **Performance** : Les animations ne doivent pas ralentir le site

## 📊 Progression

- [x] Documentation système design
- [x] Création tokens de design
- [x] Script de nettoyage
- [x] Système d'onboarding
- [ ] Homogénéisation Auth
- [ ] Homogénéisation Dashboard
- [ ] Vérification liens/footer/menu
- [ ] Standardisation composants
- [ ] Tests finaux

## 🚀 Prochaines Étapes Immédiates

1. Modifier `Auth.tsx` pour utiliser les composants premium
2. Modifier `Dashboard.tsx` pour utiliser les tokens
3. Vérifier tous les liens dans navbar et footer
4. Tester sur mobile et desktop
5. Commit et push progressifs
