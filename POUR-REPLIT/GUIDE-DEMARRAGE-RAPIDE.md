# 🚀 WebState - Guide de Démarrage Rapide

## Setup Initial (5 minutes)

### 1. Clone du Projet
```bash
git clone https://github.com/KarmaDirect/client-n8n-dash.git
cd client-n8n-dash
```

### 2. Installation des Dépendances
```bash
npm install
```

### 3. Configuration des Variables d'Environnement
```bash
cp .env.example .env.local
```

Éditer `.env.local` avec vos clés :
```bash
# Supabase
VITE_SUPABASE_URL=https://ijybwfdkiteebytdwhyu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# n8n
VITE_N8N_API_URL=https://n8n.railway.app
VITE_N8N_API_KEY=your_n8n_api_key

# Services externes (optionnel pour le dev)
VITE_TWILIO_API_KEY=sk_...
VITE_SENDGRID_API_KEY=SG...
VITE_OPENAI_API_KEY=sk-...
```

### 4. Démarrage Local
```bash
# Frontend
npm run dev                    # http://localhost:8080

# Supabase local (optionnel)
supabase start                 # http://localhost:54321
```

## Structure du Projet

```
client-n8n-dash/
├── 📁 src/                          # Frontend React
│   ├── 📁 pages/                   # Pages principales
│   │   ├── Index.tsx              # Landing page
│   │   ├── Dashboard.tsx          # Dashboard client
│   │   ├── Admin.tsx              # Interface admin
│   │   ├── AdminWorkflows.tsx     # Provisioning workflows
│   │   └── Pricing.tsx            # Page tarifs
│   ├── 📁 components/             # Composants
│   │   ├── 📁 admin/             # Interface admin
│   │   ├── 📁 dashboard/         # Dashboard client
│   │   └── 📁 ui/                # Composants UI (shadcn)
│   └── 📁 integrations/            # Intégrations
│       └── 📁 supabase/           # Client Supabase + types
├── 📁 supabase/                   # Backend Supabase
│   ├── 📁 functions/             # Edge Functions
│   └── 📁 migrations/            # Migrations SQL
└── 📁 docs/                      # Documentation
```

## Pages Principales

### 🏠 Landing Page (`/`)
- Présentation du produit
- Formules tarifaires (Starter 97€, Pro 297€)
- CTA vers inscription

### 🔐 Authentification (`/auth`)
- Connexion/Inscription
- Gestion des sessions
- Redirection vers dashboard

### 📊 Dashboard Client (`/dashboard`)
- Vue d'ensemble workflows actifs
- Métriques temps réel
- Actions rapides (Test run, Logs)

### ⚙️ Interface Admin (`/admin`)
- Gestion des organisations
- Approbation des clients
- Monitoring global

### 🔧 Provisioning Workflows (`/admin/workflows`)
- Sélection client
- Catalogue templates par pack
- Formulaire variables/credentials
- Bouton "Provisionner"

## Workflows n8n Disponibles

### Pack START (97€/mois)
1. **Lead Capture Basic** : Webhook → Validation → Supabase → Métriques
2. **Email Auto Reply** : Gmail/IMAP → Template → SMTP → Métriques

### Pack PRO (297€/mois)
3. **Lead Capture Enrich** : Webhook → Enrichissement API → IF Score → DB
4. **CRM Sync Supabase** : Cron → Supabase Select → Map → HTTP CRM
5. **Notify Slack Errors** : Event Error → Format → Slack Webhook

### Pack ELITE (997-2,997€/mois)
6. **Omni Intake Orchestrator** : Webhook → Router → Normalize → Fan-out
7. **NPS Collector** : Cron → Fetch Recipients → Send → Collect → Aggregate
8. **KPI Daily Report** : Cron → Compute KPIs → Render → Email/Slack

## Commandes Utiles

### Développement
```bash
# Démarrer le serveur de dev
npm run dev

# Build de production
npm run build

# Tests
npm run test

# Linting
npm run lint
```

### Supabase
```bash
# Démarrer Supabase local
supabase start

# Arrêter Supabase local
supabase stop

# Appliquer les migrations
supabase db push

# Déployer les Edge Functions
supabase functions deploy
```

### Git
```bash
# Nouvelle feature
git checkout -b feature/nom-feature

# Commit
git add .
git commit -m "feat: description"

# Push
git push origin feature/nom-feature
```

## Variables d'Environnement

### Frontend (.env.local)
```bash
VITE_SUPABASE_URL=https://ijybwfdkiteebytdwhyu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_N8N_API_URL=https://n8n.railway.app
VITE_N8N_API_KEY=your_n8n_api_key
```

### Edge Functions
```bash
SUPABASE_URL=https://ijybwfdkiteebytdwhyu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
N8N_API_URL=https://n8n.railway.app
N8N_API_KEY=your_n8n_api_key
TWILIO_API_KEY=sk_...
SENDGRID_API_KEY=SG...
OPENAI_API_KEY=sk-...
```

## Base de Données

### Tables Principales
- `organizations` : Clients/entreprises
- `organization_members` : Membres par organisation
- `organization_subscriptions` : Abonnements Stripe
- `workflow_templates` : Catalogue de templates
- `workflows` : Workflows configurés par client
- `workflow_execution_logs` : Logs d'exécution
- `workflow_metrics` : Métriques agrégées

### Clé Multi-Tenant
Toutes les tables utilisent `org_id` (UUID) pour l'isolation des données.

## API Endpoints

### Edge Functions
- `POST /functions/v1/manage-client-workflows` : CRUD workflows
- `POST /functions/v1/provision-workflow-pack` : Provisioning pack
- `POST /functions/v1/configure-workflow-credentials` : Config credentials
- `POST /functions/v1/track-workflow-execution` : Tracking métriques

### n8n API
- `GET /api/v1/workflows` : Lister workflows
- `POST /api/v1/workflows` : Créer workflow
- `PUT /api/v1/workflows/:id` : Modifier workflow
- `DELETE /api/v1/workflows/:id` : Supprimer workflow
- `POST /api/v1/workflows/:id/activate` : Activer workflow
- `POST /api/v1/workflows/:id/deactivate` : Désactiver workflow

## Tests

### Tests E2E Manuels
1. **Duplication** : Template → Client (3 workflows minimum)
2. **Injection** : Variables lues dans les nœuds
3. **Activation** : ON/OFF + cron/webhook fonctionnent
4. **Métriques** : JSON émis en fin de run
5. **UI** : Provisioning en un écran

### Tests Automatisés
```bash
# Tests unitaires
npm run test

# Tests d'intégration
npm run test:integration

# Tests E2E
npm run test:e2e
```

## Déploiement

### Frontend (Vercel)
1. Connecter le repo GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Backend (Supabase)
1. Déployer les Edge Functions
2. Appliquer les migrations
3. Configurer les variables d'environnement

### n8n (Railway)
1. Connecter le repo GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

## Debugging

### Logs Frontend
- Console du navigateur
- React DevTools
- Network tab pour les API calls

### Logs Backend
- Supabase Dashboard → Edge Functions → Logs
- Console Supabase pour les requêtes SQL

### Logs n8n
- Railway Dashboard → Logs
- n8n UI → Executions → Logs

## Ressources

### Documentation
- [Architecture Technique](./ARCHITECTURE-TECHNIQUE.md)
- [Guide Partenaire](./README-PARTENAIRE.md)
- [API Reference](../docs/API.md)
- [Déploiement](../docs/DEPLOYMENT.md)

### Outils
- **GitHub** : https://github.com/KarmaDirect/client-n8n-dash
- **Supabase** : https://supabase.com/dashboard
- **Vercel** : https://vercel.com/dashboard
- **Railway** : https://railway.app/dashboard

### Support
- **Yasmine Moro** : Founder & Tech Lead
- **Équipe** : Partenaires techniques

---

**Prêt à contribuer ? Commencez par explorer le code et tester le système de provisioning ! 🚀**

---

*Guide créé le 27 janvier 2025 - Version 1.0*




