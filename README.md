# 🚀 Webstate SAAS 2 - Système Admin & Clients Multi-Tenant

## 📋 Vue d'ensemble du projet

**Webstate SAAS 2** est un système de gestion multi-tenant qui fonctionne comme un mini-GoHighLevel privé. Il permet à un administrateur de gérer tous les comptes clients depuis un tableau de bord centralisé, tandis que chaque client a accès à son propre espace privé et sécurisé.

### 🎯 Objectifs principaux

- **Admin centralisé** : Vue d'ensemble de tous les clients, gestion des workflows, impersonation
- **Isolation client** : Chaque client voit uniquement ses propres données
- **Workflows intégrés** : Installation et gestion facilitée des workflows depuis l'interface admin
- **Vérification système** : Monitoring en temps réel de l'état des comptes et workflows

## 🏗️ Architecture technique

### Stack technologique

```
Frontend:
├── React 18.3.1 + TypeScript
├── Vite (build tool)
├── Tailwind CSS (design system)
├── shadcn/ui (composants UI)
├── React Router DOM (routing)
├── TanStack React Query (data fetching)
└── Lucide React (icônes)

Backend:
├── Supabase (BaaS)
├── PostgreSQL (base de données)
├── Row Level Security (RLS)
├── Edge Functions
├── Authentication
└── Storage
```

### 🗂️ Structure du projet

```
webstate-saas-2/
├── 📁 src/
│   ├── 📁 components/         # Composants réutilisables
│   │   ├── 📁 ui/             # Composants shadcn/ui
│   │   ├── 📁 admin/          # Composants spécifiques admin
│   │   ├── 📁 dashboard/      # Composants dashboard client
│   │   ├── ProtectedRoute.tsx # Protection des routes
│   │   ├── SubscriptionPanel.tsx # Gestion abonnements
│   │   └── TenantSwitcher.tsx # Sélecteur d'organisation
│   ├── 📁 context/            # Contextes React
│   │   └── AuthContext.tsx    # Contexte d'authentification
│   ├── 📁 integrations/       # Intégrations externes
│   │   └── 📁 supabase/       # Configuration Supabase
│   │       ├── client.ts      # Client Supabase
│   │       └── types.ts       # Types TypeScript générés
│   ├── 📁 pages/              # Pages principales
│   │   ├── Index.tsx          # Page d'accueil publique
│   │   ├── Auth.tsx           # Authentification
│   │   ├── Dashboard.tsx      # Dashboard client
│   │   ├── Admin.tsx          # Interface admin
│   │   └── NotFound.tsx       # Page 404
│   ├── 📁 assets/             # Ressources statiques
│   ├── App.tsx                # Composant racine
│   ├── main.tsx               # Point d'entrée
│   └── index.css              # Design system CSS
├── 📁 supabase/               # Configuration Supabase
│   ├── 📁 functions/          # Edge Functions
│   │   ├── bootstrap-admin/   # Initialisation admin
│   │   ├── execute-webhook/   # Exécution webhooks
│   │   ├── create-checkout/   # Stripe checkout
│   │   └── ...
│   └── config.toml            # Configuration Supabase
├── 📁 public/                 # Fichiers publics
├── package.json               # Dépendances npm
├── vite.config.ts             # Configuration Vite
├── tailwind.config.ts         # Configuration Tailwind
└── tsconfig.json              # Configuration TypeScript
```

## 🗄️ Base de données Supabase

### 📊 Schéma de données

#### Tables principales

**🏢 Organizations** - Organisations clients
```sql
- id: uuid (PK)
- name: text (nom de l'organisation)
- owner_id: uuid (propriétaire)
- created_at: timestamp
- updated_at: timestamp
```

**👥 Organization Members** - Membres des organisations
```sql
- id: uuid (PK)
- org_id: uuid (FK → organizations)
- user_id: uuid (référence auth.users)
- role: org_role (member/admin)
- created_at: timestamp
```

**👤 User Roles** - Rôles système
```sql
- id: uuid (PK)
- user_id: uuid (référence auth.users)
- role: app_role (admin/user)
- created_at: timestamp
```

**🔄 Workflows** - Workflows automatisés
```sql
- id: uuid (PK)
- org_id: uuid (FK → organizations)
- name: text (nom du workflow)
- description: text
- is_active: boolean
- webhook_id: uuid (FK → webhooks)
- usage_limit_per_hour: integer
- usage_limit_per_day: integer
- last_executed_at: timestamp
- created_at: timestamp
- updated_at: timestamp
```

**🪝 Webhooks** - Configuration des webhooks
```sql
- id: uuid (PK)
- org_id: uuid (FK → organizations)
- name: text
- webhook_url: text
- webhook_type: text (button/scheduled)
- execution_method: text (GET/POST)
- is_active: boolean
- form_fields: jsonb
- schedule_config: jsonb
- created_at: timestamp
- updated_at: timestamp
```

**📊 Leads** - Prospects collectés
```sql
- id: uuid (PK)
- org_id: uuid (FK → organizations)
- status: text
- source: text
- metadata: jsonb
- created_at: timestamp
- updated_at: timestamp
```

**📄 Pages** - Pages web des clients
```sql
- id: uuid (PK)
- org_id: uuid (FK → organizations)
- title: text
- slug: text
- status: text (brouillon/publié)
- created_at: timestamp
- updated_at: timestamp
```

**🌐 Sites** - Sites web des clients
```sql
- id: uuid (PK)
- org_id: uuid (FK → organizations)
- site_url: text
- screenshot_url: text
- status: text (en_construction/actif)
- created_at: timestamp
- updated_at: timestamp
```

### 🔒 Sécurité RLS (Row Level Security)

Toutes les tables utilisent des politiques RLS pour assurer l'isolation des données :

#### Politiques Admin
```sql
-- L'admin peut tout voir/modifier
CREATE POLICY "admin_select_all_[table]" ON [table]
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
```

#### Politiques Organisation
```sql
-- Les membres peuvent voir/modifier les données de leur organisation
CREATE POLICY "[table]_select_members" ON [table]
FOR SELECT USING (user_is_org_member(auth.uid(), org_id));
```

### 🔧 Fonctions de base de données

**`has_role(user_id, role)`** - Vérifie si un utilisateur a un rôle spécifique
**`user_is_org_member(user_id, org_id)`** - Vérifie l'appartenance à une organisation
**`admin_list_organizations()`** - Liste toutes les organisations (admin uniquement)
**`admin_impersonate_user(user_id)`** - Impersonation utilisateur (admin uniquement)

## 🚀 Installation et configuration

### Prérequis

```bash
# Versions requises
Node.js >= 18.0.0
npm >= 8.0.0
```

### 1. Clonage et installation

```bash
# Cloner le projet
git clone <YOUR_GIT_URL>
cd webstate-saas-2

# Installation des dépendances
npm install
```

### 2. Configuration Supabase

#### Variables d'environnement Supabase
Le projet utilise les variables intégrées dans `src/integrations/supabase/client.ts` :

```typescript
const SUPABASE_URL = "https://ijybwfdkiteebytdwhyu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

#### Accès à la base de données
- **URL du projet** : https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu
- **Référence du projet** : `ijybwfdkiteebytdwhyu`

#### Secrets configurés
```
- admin@demo.local (compte admin par défaut)
- STRIPE_SECRET_KEY (clé secrète Stripe)
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_DB_URL
```

### 3. Démarrage du projet

```bash
# Mode développement
npm run dev

# Construction pour production
npm run build

# Prévisualisation de la production
npm run preview

# Linter
npm run lint
```

Le serveur de développement démarre sur : http://localhost:8080

## 🎮 Utilisation du système

### 🔑 Authentification

#### Comptes par défaut

**Admin** :
- Email : `admin@demo.local`
- Mot de passe : Configuré dans les secrets Supabase

**Client de test** :
- Les clients peuvent s'inscrire via `/auth`
- Chaque inscription crée automatiquement une organisation personnelle

### 👨‍💼 Interface Admin (`/admin`)

#### Fonctionnalités disponibles

1. **Vue d'ensemble multi-tenant**
   - Statistiques globales (organisations, workflows, leads, erreurs)
   - Métriques temps réel sur 7 jours

2. **Gestion des comptes clients**
   - Liste de toutes les organisations
   - Détails de chaque client
   - **Impersonation** : entrer dans le compte d'un client

3. **Monitoring des workflows**
   - État des workflows par organisation
   - Statistiques d'exécution
   - Gestion des erreurs

4. **Activité système**
   - Logs des événements
   - Exécutions récentes de workflows
   - Monitoring des erreurs

#### Impersonation client
```typescript
// Fonction d'impersonation dans Admin.tsx
const handleImpersonate = async (orgId: string) => {
  // L'admin peut "entrer" dans le compte client
  // et voir exactement ce que le client voit
};
```

### 👤 Interface Client (`/app`)

#### Fonctionnalités disponibles

1. **Dashboard personnel**
   - Métriques de performance (ROI, temps gagné, leads)
   - Statut des workflows actifs

2. **Gestion des sites**
   - Liste des pages créées
   - Statut de publication
   - Aperçu des sites actifs

3. **Automatisations**
   - Workflows disponibles
   - Statistiques d'exécution
   - Configuration des automatisations

4. **Activités et leads**
   - Leads collectés
   - Taux de conversion
   - Sources de trafic

5. **Support**
   - Canal de communication avec l'admin
   - Historique des demandes

## 🔧 Développement

### 🎨 Design System

Le projet utilise un design system basé sur les tokens CSS et Tailwind :

#### Couleurs principales
```css
/* Variables CSS dans index.css */
--primary: 255 85% 60%;          /* Electric violet */
--primary-foreground: 210 40% 98%;
--primary-glow: 255 85% 70%;
--accent: 262 83% 58%;
```

#### Classes utilitaires
```css
.dashboard-card     /* Cartes du dashboard */
.stats-card         /* Cartes de statistiques */
.metric-card        /* Cartes de métriques */
.auth-card          /* Cartes d'authentification */
```

### 🧩 Composants clés

#### AuthContext
```typescript
// Gestion de l'authentification globale
const { user, session, signIn, signOut } = useAuth();
```

#### ProtectedRoute
```typescript
// Protection des routes nécessitant une authentification
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

#### TenantSwitcher
```typescript
// Sélecteur d'organisation (si l'utilisateur appartient à plusieurs)
<TenantSwitcher />
```

### 📡 Edge Functions

#### Structure des functions
```
supabase/functions/
├── bootstrap-admin/     # Initialise le compte admin
├── execute-webhook/     # Exécute les webhooks
├── create-checkout/     # Stripe checkout
├── customer-portal/     # Portail client Stripe
├── check-subscription/  # Vérification abonnement
├── approve-subscriber/  # Approbation manuelle
└── revoke-subscriber-approval/ # Révocation approbation
```

#### Configuration dans config.toml
```toml
[functions.bootstrap-admin]
verify_jwt = false

[functions.execute-webhook]
verify_jwt = true
```

### 🔍 Debugging et monitoring

#### Console logs
```typescript
// Utiliser les outils de debugging Lovable
console.log('Debug info:', data);
```

#### Monitoring Supabase
- **Analytics** : https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/logs/analytics
- **Edge Functions logs** : https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/functions
- **Database logs** : https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/logs/database

## 🔐 Sécurité

### Principes de sécurité

1. **Isolation totale** : Chaque client ne voit que ses données
2. **RLS partout** : Toutes les tables ont des politiques de sécurité
3. **Vérification des rôles** : Admin vs utilisateur standard
4. **Audit trail** : Tous les événements sont loggés

### Variables sensibles

```typescript
// ❌ JAMAIS en dur dans le code
const apiKey = "sk_live_...";

// ✅ Toujours dans les secrets Supabase
const { data } = await supabase.functions.invoke('function', {
  // Les secrets sont injectés côté serveur
});
```

## 🚢 Déploiement

### Via Lovable (recommandé)
1. Aller sur : https://lovable.dev/projects/e21cd30b-2357-4f4c-b6b7-9bf9ef38fdca
2. Cliquer sur "Share" → "Publish"
3. Le déploiement se fait automatiquement

### Build local
```bash
# Construction
npm run build

# Les fichiers sont dans dist/
ls dist/
```

## 🔧 Maintenance

### Base de données

#### Migrations
```sql
-- Exemple de migration pour ajouter une colonne
ALTER TABLE workflows ADD COLUMN priority integer DEFAULT 1;
```

#### Monitoring des performances
```sql
-- Requête pour vérifier les performances
SELECT schemaname, tablename, attname, avg_width, n_distinct
FROM pg_stats 
WHERE schemaname = 'public';
```

### Edge Functions

#### Logs des functions
```bash
# Voir les logs en temps réel (si CLI Supabase installée)
supabase functions logs --project-ref ijybwfdkiteebytdwhyu
```

## 🐛 Résolution de problèmes

### Problèmes courants

#### 1. Clients non visibles dans l'admin
```typescript
// Vérifier que fetchLists() récupère bien les organisations
const fetchLists = async () => {
  const [evts, rns, organizations] = await Promise.all([
    supabase.from('events').select('*'),
    supabase.from('workflow_runs').select('*'),
    supabase.from('organizations').select('*') // ← Important !
  ]);
};
```

#### 2. Erreurs RLS
```sql
-- Vérifier les politiques
SELECT * FROM pg_policies WHERE tablename = 'organizations';
```

#### 3. Problèmes d'authentification
```typescript
// Vérifier le statut de session
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

## 📚 Ressources utiles

### Documentation
- **Supabase** : https://supabase.com/docs
- **React** : https://react.dev
- **Tailwind CSS** : https://tailwindcss.com/docs
- **shadcn/ui** : https://ui.shadcn.com

### Liens du projet
- **Dashboard Supabase** : https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu
- **Lovable Project** : https://lovable.dev/projects/e21cd30b-2357-4f4c-b6b7-9bf9ef38fdca

## 🤝 Contribution

### Workflow de développement

1. **Branche feature** : Créer une branche pour chaque fonctionnalité
2. **Tests** : Tester l'isolation des données entre clients
3. **Review** : Vérifier que l'admin et le client voient les bonnes données
4. **Déploiement** : Via Lovable ou build manuel

### Checklist avant commit

- [ ] Les nouveaux composants utilisent le design system
- [ ] Les tables ont des politiques RLS appropriées
- [ ] L'isolation client est respectée
- [ ] L'admin peut gérer les nouveaux éléments
- [ ] Pas de données hardcodées
- [ ] Types TypeScript à jour

---

## 📞 Support

Pour toute question technique, consulter :
1. Cette documentation
2. Les logs Supabase
3. Le code source commenté
4. L'historique des commits

**Version** : 2.0.0  
**Dernière mise à jour** : Janvier 2025  
**Auteur** : Équipe Webstate