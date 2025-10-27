# 🏗️ Architecture Technique

**Documentation de l'architecture du projet Client n8n Dashboard**

---

## 📊 Vue d'ensemble

### **Architecture globale**

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   React     │  │  Tailwind   │  │  Shadcn/UI  │         │
│  │   Router    │  │     CSS     │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     SUPABASE (BaaS)                          │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Auth     │  │  PostgreSQL │  │    Edge     │         │
│  │    (JWT)    │  │  + RLS      │  │  Functions  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  SERVICES EXTERNES                           │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Stripe    │  │     n8n     │  │   Cursor    │         │
│  │  (Payment)  │  │  (Railway)  │  │    MCPs     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend

### **Stack**

- **React 18** : Framework UI
- **TypeScript** : Typage statique
- **Vite** : Build tool & dev server
- **React Router v6** : Routing
- **TanStack Query** : State management & caching
- **Tailwind CSS** : Styling utility-first
- **Shadcn/UI** : Composants UI (Radix UI)
- **Framer Motion** : Animations
- **Sonner** : Notifications toast
- **Zod** : Validation de schémas

### **Structure des composants**

```
src/
├── components/
│   ├── ui/                    # Composants UI de base (Shadcn)
│   ├── admin/                 # Composants admin
│   ├── dashboard/             # Composants dashboard client
│   ├── magicui/               # Composants animations
│   ├── navbar.tsx             # Navigation principale
│   ├── footer.tsx             # Footer
│   └── ProtectedRoute.tsx     # Route protégée
├── pages/
│   ├── Auth.tsx               # Authentification
│   ├── Dashboard.tsx          # Dashboard client
│   ├── AdminApprovals.tsx     # Approbation des comptes
│   ├── PendingApproval.tsx    # Page d'attente
│   └── [autres pages]
├── context/
│   └── AuthContext.tsx        # Contexte d'authentification
├── hooks/
│   ├── use-mobile.tsx         # Hook responsive
│   └── use-toast.ts           # Hook notifications
└── integrations/
    └── supabase/
        ├── client.ts          # Client Supabase
        └── types.ts           # Types TypeScript générés
```

### **Routing**

| Route | Page | Protection | Rôle |
|-------|------|-----------|------|
| `/` | Index | Public | Landing |
| `/auth` | Auth | Public | Login/Signup |
| `/app` | Dashboard | Auth | Client |
| `/pending-approval` | PendingApproval | Auth | Client (non approuvé) |
| `/admin` | Admin | Auth + Admin | Admin |
| `/admin/approvals` | AdminApprovals | Auth + Admin | Admin |
| `/pricing` | Pricing | Public | Marketing |
| `/contact` | Contact | Public | Support |

---

## 🗄️ Base de données

### **Supabase PostgreSQL**

#### **Tables principales**

```sql
-- Multi-tenancy
organizations (id, name, owner_id, approved)
organization_members (id, org_id, user_id, role)
organization_subscriptions (id, org_id, stripe_customer_id, subscribed)

-- Workflows n8n
workflows (id, org_id, name, n8n_workflow_id, is_active)
workflow_runs (id, workflow_id, status, started_at, finished_at)
workflow_executions (id, workflow_id, org_id, status, response_data)

-- Utilisateurs
user_roles (id, user_id, role) -- admin, moderator, user
subscribers (id, user_id, email, subscribed, stripe_customer_id)

-- Support
support_messages (id, org_id, author, user_id, message)
webhooks (id, org_id, name, webhook_url, is_active)

-- Paiements
payment_history (id, customer_email, invoice_id, amount_paid)

-- Obsolètes (à nettoyer)
sites, pages, documents, events, leads
```

#### **RLS (Row Level Security)**

Toutes les tables principales ont des policies RLS :

```sql
-- Exemple : organizations
CREATE POLICY "orgs_select_approved_members"
ON organizations FOR SELECT
USING (
  approved = true AND (
    owner_id = auth.uid() 
    OR user_is_org_member(auth.uid(), id)
    OR has_role(auth.uid(), 'admin')
  )
);
```

**Principes RLS** :
- ✅ Isolation par organisation
- ✅ Admins voient tout
- ✅ Clients voient seulement leur org
- ✅ Organisations non approuvées = accès bloqué

#### **Vues SQL**

```sql
-- Vue pour AdminApprovals (sécurisée)
pending_organizations_with_emails
  → Joint organizations + auth.users
  → Accessible admin seulement
  → security_invoker = true
```

#### **Fonctions RPC**

```sql
-- Système d'approbation
approve_organization(org_id UUID) → JSONB
reject_organization(org_id UUID) → JSONB
handle_new_user() → TRIGGER

-- Helpers
user_is_org_member(user_id UUID, org_id UUID) → BOOLEAN
has_role(user_id UUID, role TEXT) → BOOLEAN
```

---

## 🔐 Authentification & Autorisation

### **Supabase Auth**

- **Provider** : Email/Password
- **JWT** : Access token + Refresh token
- **Session** : Gérée automatiquement
- **MFA** : Non activé (à implémenter)

### **Flow d'authentification**

```
1. User sign up → Supabase Auth
2. Trigger on_auth_user_created → Crée organization (approved=false)
3. User redirected → /pending-approval
4. Admin approves → approve_organization()
5. User redirected → /app (dashboard)
```

### **Rôles**

| Rôle | Permissions |
|------|-------------|
| **admin** | Accès complet, gestion des organisations, approbations |
| **moderator** | Support client (non implémenté) |
| **user** | Accès à son organisation seulement |

---

## ⚡ Edge Functions Supabase

### **Functions disponibles**

| Function | Description | Sécurité |
|----------|-------------|----------|
| `bootstrap-admin` | Créer le premier admin | `verify_jwt: false` |
| `execute-webhook` | Exécuter webhook n8n | `verify_jwt: true` |
| `check-subscription` | Vérifier abonnement Stripe | `verify_jwt: true` |
| `create-checkout` | Créer session Stripe | `verify_jwt: true` |
| `customer-portal` | Accès portail Stripe | `verify_jwt: true` |
| ~~`approve-subscriber`~~ | (Obsolète, remplacé par RPC) | - |
| ~~`revoke-subscriber-approval`~~ | (Obsolète, remplacé par RPC) | - |

---

## 🔄 Intégrations

### **n8n (Workflows)**

- **Hosting** : Railway
- **API** : REST API v1
- **Auth** : API Key
- **MCP** : `@leonardsellem/n8n-mcp-server`

**Workflows disponibles** :
1. Hello World Webhook
2. SMS Rappels RDV - Artisan
3. LinkedIn Content Creation (GPT-4 + DALL-E)
4. Interview Scheduling Automation
5. Generate Leads with Google Maps

### **Stripe (Payments)**

- **Mode** : Test (pour dev)
- **Plans** :
  - Starter : 97€/mois (930€/an)
  - Pro : 297€/mois (2850€/an)
- **Webhooks** : Configurés via Edge Functions
- **Customer Portal** : Activé

### **MCPs (Model Context Protocol)**

#### **MCP n8n**

```json
{
  "command": "n8n-mcp-server",
  "env": {
    "N8N_API_URL": "https://primary-production-bdba.up.railway.app/api/v1",
    "N8N_API_KEY": "..."
  }
}
```

**Commandes** : `workflow_list`, `workflow_create`, `execution_list`, etc.

#### **MCP Supabase**

```json
{
  "command": "npx",
  "args": ["-y", "@supabase/mcp-server-supabase@latest", "--access-token", "..."]
}
```

**Commandes** : `list_tables`, `execute_sql`, `apply_migration`, etc.

---

## 📦 Build & Déploiement

### **Build de production**

```bash
npm run build
# → Output: dist/
# → index.html + assets/
# → Bundle size: ~1.3MB (à optimiser)
```

### **Optimisations recommandées**

- [ ] Lazy loading des routes
- [ ] Code splitting par page
- [ ] Tree shaking des composants UI inutilisés
- [ ] Optimisation des images
- [ ] Cache agressif (TanStack Query)

### **Environnements**

| Env | URL | Database |
|-----|-----|----------|
| **Dev** | localhost:5173 | Supabase (prod) |
| **Staging** | staging.webstate.com | Supabase (prod) |
| **Production** | app.webstate.com | Supabase (prod) |

---

## 🔍 Monitoring & Logs

### **Frontend**

- **Sentry** : À implémenter
- **Google Analytics** : À implémenter
- **Console logs** : Mode dev uniquement

### **Backend (Supabase)**

- **Logs** : Dashboard Supabase > Logs
- **Metrics** : Dashboard Supabase > Observability
- **RLS audit** : Logs des policies appliquées

### **n8n**

- **Execution history** : Via n8n dashboard
- **Webhooks logs** : Via workflow_executions table

---

## 🧪 Tests

### **État actuel**

- ❌ **Aucun test** unitaire/intégration
- ✅ Linting via ESLint
- ✅ TypeScript strict mode

### **À implémenter**

```bash
# Installer Vitest
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Tests unitaires
src/__tests__/components/
src/__tests__/hooks/

# Tests d'intégration
src/__tests__/flows/
```

---

## 🚨 Problèmes connus & Solutions

### **1. Bundle size important (1.3MB)**

**Cause** : motion@12.23 + 28 packages @radix-ui

**Solution** :
- Remplacer motion par framer-motion-lite
- Analyser l'utilisation des composants Radix UI
- Lazy loading des pages

### **2. Migrations SQL mal nommées**

**Cause** : 23 migrations sans nom descriptif

**Solution** : Voir `docs/MIGRATIONS.md` (à créer)

### **3. Pages obsolètes**

**Cause** : 9 pages marketing inutilisées

**Solution** :
- Supprimer : Blog, Careers, About, Use-Cases
- Garder : Home, Features, Pricing, Contact

---

## 📊 Performances

### **Métriques actuelles**

- **Bundle size** : 1.27 MB (gzip: 362 KB)
- **Initial load** : ~2s (à mesurer)
- **Time to interactive** : ~3s (à mesurer)

### **Optimisations appliquées**

- ✅ Vite (build rapide)
- ✅ React Query (cache)
- ✅ Code minifié
- ⚠️ Lazy loading (à implémenter)

---

## 🔄 Migrations

**Nombre total** : 24 migrations

**Migrations importantes** :
- `20250127000001_org_approval_system.sql` : Système d'approbation
- `20250127000002_create_pending_orgs_view.sql` : Vue sécurisée admin

**Voir** : `docs/MIGRATIONS.md` pour la liste complète

---

## 📅 Historique des changements

- **27/01/2025** : Correction faille AdminApprovals.tsx
- **27/01/2025** : Système d'approbation implémenté
- **27/01/2025** : MCPs n8n + Supabase configurés
- **27/01/2025** : Audit complet du projet

---

**📅 Dernière mise à jour** : 27 janvier 2025  
**✅ Status** : Production Ready


