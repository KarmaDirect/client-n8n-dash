# 🚀 WebState - Guide Partenaire Technique

**Bienvenue dans l'équipe WebState !** Ce guide vous explique l'architecture complète du projet pour que vous puissiez contribuer efficacement.

---

## 📋 Table des matières

1. [Vue d'ensemble du produit](#vue-densemble-du-produit)
2. [Architecture technique](#architecture-technique)
3. [Structure du projet](#structure-du-projet)
4. [Système de workflows n8n](#système-de-workflows-n8n)
5. [Base de données](#base-de-données)
6. [Frontend](#frontend)
7. [Backend (Edge Functions)](#backend-edge-functions)
8. [Déploiement](#déploiement)
9. [Workflows de développement](#workflows-de-développement)
10. [Points d'attention](#points-dattention)

---

## 🎯 Vue d'ensemble du produit

### **WebState** = Plateforme SaaS d'automatisation pour PME françaises

**Mission** : Automatiser les processus métier des PME via des workflows n8n pré-configurés.

**Formules commerciales** :
- **Starter** (97€/mois) : 3 agents n8n, workflows de base
- **Pro** (297€/mois) : Agents illimités, workflows avancés, support prioritaire
- **Elite** (997-2,997€/mois) : Écosystème IA complet, multi-agents

**Cible** : PME 10-250 employés, CA 500k-5M€/an

---

## 🏗️ Architecture technique

### **Stack principal**

```
Frontend: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
Backend: Supabase (PostgreSQL + Edge Functions + Auth + RLS)
Workflows: n8n (open-source workflow automation)
Payments: Stripe
Email: SendGrid
SMS: Twilio
IA: OpenAI (GPT-4, Claude)
```

### **Architecture multi-tenant**

```
┌─────────────────────────────────────────┐
│                Frontend                 │
│  React + TypeScript + Tailwind CSS     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│              Supabase                    │
│  • PostgreSQL (multi-tenant)            │
│  • Edge Functions (Deno)                │
│  • Auth + RLS                           │
│  • Real-time subscriptions              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│                n8n                      │
│  • Workflow automation                  │
│  • API REST                             │
│  • Webhooks                             │
│  • Cron jobs                            │
└─────────────────────────────────────────┘
```

---

## 📁 Structure du projet

```
client-n8n-dash/
├── 📁 src/                          # Frontend React
│   ├── 📁 components/               # Composants réutilisables
│   │   ├── 📁 admin/               # Interface admin
│   │   ├── 📁 dashboard/           # Dashboard client
│   │   ├── 📁 ui/                  # Composants UI (shadcn)
│   │   └── 📁 magicui/             # Composants avancés
│   ├── 📁 pages/                   # Pages de l'application
│   ├── 📁 context/                 # Context React (Auth)
│   ├── 📁 hooks/                   # Hooks personnalisés
│   ├── 📁 integrations/             # Intégrations externes
│   │   └── 📁 supabase/            # Client Supabase + types
│   └── 📁 lib/                      # Utilitaires
├── 📁 supabase/                     # Backend Supabase
│   ├── 📁 functions/               # Edge Functions (Deno)
│   │   ├── 📁 manage-client-workflows/
│   │   ├── 📁 provision-workflow-pack/
│   │   ├── 📁 configure-workflow-credentials/
│   │   └── 📁 track-workflow-execution/
│   ├── 📁 migrations/              # Migrations SQL
│   └── config.toml                 # Configuration Supabase
├── 📁 docs/                         # Documentation technique
├── 📁 POUR-REPLIT/                 # Guide partenaire (ce dossier)
└── 📄 Configuration files          # package.json, vite.config.ts, etc.
```

---

## ⚙️ Système de workflows n8n

### **Architecture n8n**

```
n8n Instance (Railway)
├── 📁 /templates/                    # Templates de workflows
│   ├── 📁 /start/                  # Pack Starter (5 workflows)
│   ├── 📁 /pro/                    # Pack Pro (5 workflows)
│   └── 📁 /elite/                  # Pack Elite (5 workflows)
└── 📁 /clients/                    # Workflows client spécifiques
    └── 📁 /{clientId}/            # Dossier par client
```

### **Workflows MVP (8 workflows fonctionnels)**

#### **Pack START**
1. **Lead Capture Basic** : Webhook → Validation → Supabase → Métriques
2. **Email Auto Reply** : Gmail/IMAP → Template → SMTP → Métriques

#### **Pack PRO**
3. **Lead Capture Enrich** : Webhook → Enrichissement API → IF Score → DB
4. **CRM Sync Supabase** : Cron → Supabase Select → Map → HTTP CRM
5. **Notify Slack Errors** : Event Error → Format → Slack Webhook

#### **Pack ELITE**
6. **Omni Intake Orchestrator** : Webhook → Router → Normalize → Fan-out
7. **NPS Collector** : Cron → Fetch Recipients → Send → Collect → Aggregate
8. **KPI Daily Report** : Cron → Compute KPIs → Render → Email/Slack

### **Variables d'environnement n8n**

```javascript
// Variables toujours présentes
{{ $json.env.CLIENT_ID }}        // UUID du client
{{ $json.env.ORG_ID }}           // Alias de CLIENT_ID

// Variables par service
{{ $json.env.SUPABASE_URL }}
{{ $json.env.SUPABASE_SERVICE_ROLE }}
{{ $json.env.TWILIO_API_KEY }}
{{ $json.env.SENDGRID_API_KEY }}
{{ $json.env.OPENAI_API_KEY }}
```

### **Métriques standard**

Chaque workflow émet un JSON standard :

```json
{
  "status": "ok|error",
  "runs": 1,
  "itemsProcessed": 12,
  "errors": 0,
  "message": "Description du résultat",
  "clientId": "{{ $json.env.CLIENT_ID }}",
  "workflowId": "{{ $workflow.id }}",
  "ts": 1730000000
}
```

---

## 🗄️ Base de données

### **Tables principales**

#### **Multi-tenant (clé : `org_id`)**
- `organizations` : Clients/entreprises
- `organization_members` : Membres par organisation
- `organization_subscriptions` : Abonnements Stripe

#### **Workflows**
- `workflow_templates` : Catalogue de templates (15 workflows)
- `workflows` : Workflows configurés par client
- `workflow_execution_logs` : Logs d'exécution détaillés
- `workflow_metrics` : Métriques agrégées par jour

#### **Support**
- `support_messages` : Messages de support
- `webhooks` : Webhooks configurés par client

### **RLS (Row Level Security)**

```sql
-- Policy standard pour toutes les tables
CREATE POLICY "user_is_org_member"
ON table_name FOR ALL
USING (
  public.user_is_org_member(auth.uid(), org_id)
  OR public.has_role(auth.uid(), 'admin')
);
```

### **Fonctions utiles**

```sql
-- Vérifier si utilisateur est membre d'une org
SELECT public.user_is_org_member(user_id, org_id);

-- Vérifier le rôle utilisateur
SELECT public.has_role(user_id, 'admin');

-- Incrémenter métriques workflow
SELECT public.increment_workflow_metrics(workflow_id, date, success, failed, custom_metrics);
```

---

## 🎨 Frontend

### **Architecture React**

```
src/
├── 📁 pages/                    # Routes principales
│   ├── Index.tsx               # Landing page
│   ├── Dashboard.tsx           # Dashboard client
│   ├── Admin.tsx               # Interface admin
│   ├── AdminWorkflows.tsx      # Provisioning workflows
│   ├── Pricing.tsx             # Page tarifs
│   └── Auth.tsx                # Authentification
├── 📁 components/              # Composants
│   ├── 📁 admin/              # Interface admin
│   │   ├── WorkflowManager.tsx # Gestion workflows
│   │   └── AdminOrgDetails.tsx # Détails organisation
│   ├── 📁 dashboard/          # Dashboard client
│   │   ├── WorkflowPanel.tsx  # Panneau workflows
│   │   └── WorkflowCard.tsx   # Carte workflow
│   └── 📁 ui/                 # Composants UI (shadcn)
└── 📁 context/                # Context React
    └── AuthContext.tsx        # Gestion authentification
```

### **Technologies UI**

- **Tailwind CSS** : Styling
- **shadcn/ui** : Composants UI (Button, Card, Dialog, etc.)
- **MagicUI** : Composants avancés (animations, effets)
- **React Router** : Navigation
- **React Hook Form** : Formulaires
- **Zustand** : État global (si nécessaire)

### **Pages importantes**

#### **`/admin/workflows`** - Interface de provisioning
- Sélection client
- Catalogue templates par pack (Start/Pro/Elite)
- Formulaire variables/credentials
- Bouton "Provisionner"
- Tableau workflows client (ON/OFF, logs, métriques)

#### **`/dashboard`** - Dashboard client
- Vue d'ensemble workflows actifs
- Métriques temps réel
- Actions rapides (Test run, Logs)

---

## 🔧 Backend (Edge Functions)

### **Architecture Edge Functions**

```
supabase/functions/
├── 📁 manage-client-workflows/     # CRUD workflows client
├── 📁 provision-workflow-pack/      # Provisioning pack complet
├── 📁 configure-workflow-credentials/ # Configuration credentials
└── 📁 track-workflow-execution/    # Tracking métriques
```

### **Edge Function principale : `manage-client-workflows`**

```typescript
// Actions disponibles
POST /functions/v1/manage-client-workflows
{
  "action": "provision",           // Dupliquer template → client
  "organization_id": "uuid",        // Client cible
  "workflowIds": ["id1", "id2"],   // Templates à dupliquer
  "variables": {                    // Variables à injecter
    "TWILIO_API_KEY": "sk_...",
    "SENDGRID_API_KEY": "SG..."
  }
}
```

### **Pipeline de provisioning**

1. **Fetch template** depuis n8n
2. **Inject variables** dans les nœuds (Code, HTTP Request)
3. **Create workflow** dans n8n avec tags client
4. **Activate workflow** si toutes les variables sont fournies
5. **Insert** dans table `workflows` Supabase
6. **Return** `{ copied: 2, enabled: 1, errors: [] }`

### **Variables d'environnement Edge Functions**

```bash
# Supabase
SUPABASE_URL=https://ijybwfdkiteebytdwhyu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# n8n
N8N_API_URL=https://n8n.railway.app
N8N_API_KEY=your_n8n_api_key

# Services externes
TWILIO_API_KEY=sk_...
SENDGRID_API_KEY=SG...
OPENAI_API_KEY=sk-...
```

---

## 🚀 Déploiement

### **Environnements**

#### **Frontend (Vercel)**
- **URL** : `https://webstate.vercel.app`
- **Build** : `npm run build`
- **Variables** : Configurées dans Vercel Dashboard

#### **Backend (Supabase)**
- **URL** : `https://ijybwfdkiteebytdwhyu.supabase.co`
- **Edge Functions** : Déployées via CLI ou Dashboard
- **Migrations** : Appliquées automatiquement

#### **n8n (Railway)**
- **URL** : `https://n8n.railway.app`
- **Database** : PostgreSQL Railway
- **Variables** : Configurées dans Railway Dashboard

### **Commandes de déploiement**

```bash
# Déployer Edge Functions
supabase functions deploy

# Appliquer migrations
supabase db push

# Build frontend
npm run build

# Tests locaux
npm run dev
supabase start
```

---

## 🔄 Workflows de développement

### **Setup initial**

```bash
# Clone du projet
git clone https://github.com/KarmaDirect/client-n8n-dash.git
cd client-n8n-dash

# Install dependencies
npm install

# Setup Supabase local
supabase start

# Variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés
```

### **Développement quotidien**

```bash
# Frontend
npm run dev                    # http://localhost:8080

# Supabase local
supabase start                 # http://localhost:54321

# Tests
npm run test
npm run lint
```

### **Git workflow**

```bash
# Nouvelle feature
git checkout -b feature/nom-feature

# Commit
git add .
git commit -m "feat: description"

# Push
git push origin feature/nom-feature

# Pull Request vers main
```

---

## ⚠️ Points d'attention

### **Sécurité**

1. **RLS activé** sur toutes les tables
2. **Variables d'environnement** jamais en dur
3. **Validation** côté Edge Functions
4. **Rate limiting** sur les APIs

### **Performance**

1. **Index** sur `org_id` dans toutes les tables
2. **Pagination** pour les listes importantes
3. **Cache** des templates n8n
4. **Optimisation** des requêtes Supabase

### **Monitoring**

1. **Logs** détaillés dans `workflow_execution_logs`
2. **Métriques** agrégées dans `workflow_metrics`
3. **Alertes** sur les erreurs critiques
4. **Dashboard** temps réel des KPIs

### **Évolutivité**

1. **Multi-tenant** architecture scalable
2. **Templates** facilement extensibles
3. **Variables** injectables dynamiquement
4. **Packs** modulaires (Start/Pro/Elite)

---

## 📞 Contacts & Ressources

### **Équipe**
- **Yasmine Moro** : Founder & Tech Lead
- **Vous** : Partenaire technique

### **Documentation**
- **Architecture** : `docs/ARCHITECTURE.md`
- **API** : `docs/API.md`
- **Déploiement** : `docs/DEPLOYMENT.md`
- **Sécurité** : `docs/SECURITY.md`

### **Outils**
- **GitHub** : https://github.com/KarmaDirect/client-n8n-dash
- **Supabase** : https://supabase.com/dashboard
- **Vercel** : https://vercel.com/dashboard
- **Railway** : https://railway.app/dashboard

---

## 🎯 Prochaines étapes

1. **Familiarisez-vous** avec l'architecture
2. **Testez** le système de provisioning
3. **Explorez** les workflows n8n existants
4. **Contribuez** aux améliorations
5. **Proposez** de nouveaux workflows

**Bienvenue dans l'équipe WebState ! 🚀**

---

*Document créé le 27 janvier 2025 - Version 1.0*




