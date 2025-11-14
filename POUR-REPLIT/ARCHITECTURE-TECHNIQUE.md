# 🚀 WebState - Architecture Technique Détaillée

## Vue d'ensemble

WebState est une plateforme SaaS d'automatisation pour PME françaises utilisant n8n comme moteur de workflows. L'architecture est multi-tenant avec une séparation claire entre frontend React, backend Supabase, et moteur n8n.

## Stack Technique

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** + **MagicUI**
- **React Router** pour la navigation
- **React Hook Form** pour les formulaires
- **Zustand** pour l'état global (si nécessaire)

### Backend
- **Supabase** (PostgreSQL + Edge Functions + Auth + RLS)
- **Edge Functions** en **Deno** pour la logique métier
- **Row Level Security** pour l'isolation multi-tenant

### Workflows
- **n8n** (open-source workflow automation)
- **API REST** pour l'interaction programmatique
- **Webhooks** pour les déclenchements
- **Cron jobs** pour les tâches planifiées

### Services Externes
- **Stripe** pour les paiements
- **SendGrid** pour les emails
- **Twilio** pour les SMS
- **OpenAI** pour l'IA
- **Railway** pour l'hébergement n8n

## Architecture Multi-Tenant

```
┌─────────────────────────────────────────┐
│                Frontend                 │
│  React + TypeScript + Tailwind CSS     │
│  • Pages publiques (Landing, Pricing)  │
│  • Dashboard client (/dashboard)       │
│  • Interface admin (/admin)             │
└─────────────────┬───────────────────────┘
                  │ HTTPS/API Calls
┌─────────────────▼───────────────────────┐
│              Supabase                    │
│  • PostgreSQL (multi-tenant)            │
│  • Edge Functions (Deno)                │
│  • Auth + RLS                           │
│  • Real-time subscriptions              │
└─────────────────┬───────────────────────┘
                  │ API Calls
┌─────────────────▼───────────────────────┐
│                n8n                      │
│  • Workflow automation                  │
│  • API REST                             │
│  • Webhooks                             │
│  • Cron jobs                            │
└─────────────────────────────────────────┘
```

## Base de Données

### Tables Multi-Tenant (clé : `org_id`)

#### `organizations`
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `organization_members`
```sql
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role org_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);
```

#### `organization_subscriptions`
```sql
CREATE TABLE organization_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  stripe_customer_id TEXT,
  subscribed BOOLEAN DEFAULT false,
  subscription_tier TEXT, -- 'starter', 'pro', 'elite'
  subscription_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tables Workflows

#### `workflow_templates`
```sql
CREATE TABLE workflow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'SMS', 'Email', 'CRM', etc.
  n8n_template_id TEXT NOT NULL UNIQUE,
  pack_level TEXT NOT NULL, -- 'start', 'pro', 'elite'
  required_credentials JSONB DEFAULT '[]',
  configurable_params JSONB DEFAULT '{}',
  default_config JSONB DEFAULT '{}',
  estimated_cost_per_exec DECIMAL DEFAULT 0,
  estimated_time_saved_minutes INT DEFAULT 0,
  metrics_tracked JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `workflows`
```sql
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  last_executed_at TIMESTAMPTZ,
  n8n_workflow_id TEXT,
  template_id UUID REFERENCES workflow_templates(id),
  pack_level TEXT, -- 'start', 'pro', 'elite'
  status TEXT DEFAULT 'active', -- 'active', 'pending_config', 'paused', 'error'
  config_params JSONB DEFAULT '{}',
  credentials_status JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `workflow_execution_logs`
```sql
CREATE TABLE workflow_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id),
  org_id UUID NOT NULL REFERENCES organizations(id),
  n8n_execution_id TEXT,
  status TEXT NOT NULL, -- 'success', 'error', 'running', 'waiting'
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  duration_seconds INT,
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  error_stack TEXT,
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `workflow_metrics`
```sql
CREATE TABLE workflow_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id),
  org_id UUID NOT NULL REFERENCES organizations(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  executions_count INT DEFAULT 0,
  success_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  tokens_used INT DEFAULT 0,
  api_calls_made INT DEFAULT 0,
  cost_incurred DECIMAL DEFAULT 0,
  time_saved_minutes INT DEFAULT 0,
  money_saved DECIMAL DEFAULT 0,
  custom_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workflow_id, date)
);
```

## Row Level Security (RLS)

### Policy Standard
```sql
-- Policy pour toutes les tables multi-tenant
CREATE POLICY "user_is_org_member"
ON table_name FOR ALL
USING (
  public.user_is_org_member(auth.uid(), org_id)
  OR public.has_role(auth.uid(), 'admin')
);
```

### Fonctions Utilitaires
```sql
-- Vérifier si utilisateur est membre d'une organisation
CREATE FUNCTION user_is_org_member(user_id UUID, org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM organization_members 
    WHERE user_id = $1 AND org_id = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vérifier le rôle utilisateur
CREATE FUNCTION has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM user_roles 
    WHERE user_id = $1 AND role = role_name::app_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Edge Functions

### `manage-client-workflows`
**Endpoint** : `/functions/v1/manage-client-workflows`

**Actions disponibles** :
- `provision` : Dupliquer templates vers client
- `activate` : Activer workflow
- `deactivate` : Désactiver workflow
- `delete` : Supprimer workflow
- `list` : Lister workflows client

**Exemple d'utilisation** :
```typescript
const response = await fetch('/functions/v1/manage-client-workflows', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'provision',
    organization_id: 'uuid',
    workflowIds: ['template1', 'template2'],
    variables: {
      TWILIO_API_KEY: 'sk_...',
      SENDGRID_API_KEY: 'SG...'
    }
  })
});
```

### Pipeline de Provisioning

1. **Fetch template** depuis n8n API
2. **Inject variables** dans les nœuds (Code, HTTP Request)
3. **Create workflow** dans n8n avec tags client
4. **Activate workflow** si toutes les variables sont fournies
5. **Insert** dans table `workflows` Supabase
6. **Return** `{ copied: 2, enabled: 1, errors: [] }`

## Architecture n8n

### Structure des Dossiers
```
n8n Instance (Railway)
├── 📁 /templates/                    # Templates de workflows
│   ├── 📁 /start/                  # Pack Starter (5 workflows)
│   ├── 📁 /pro/                    # Pack Pro (5 workflows)
│   └── 📁 /elite/                  # Pack Elite (5 workflows)
└── 📁 /clients/                    # Workflows client spécifiques
    └── 📁 /{clientId}/            # Dossier par client
```

### Variables d'Environnement n8n

```javascript
// Variables toujours présentes
{{ $json.env.CLIENT_ID }}        // UUID du client
{{ $json.env.ORG_ID }}           // Alias de CLIENT_ID

// Variables par service
{{ $json.env.SUPABASE_URL }}
{{ $json.env.SUPABASE_SERVICE_ROLE }}
{{ $json.env.TWILIO_API_KEY }}
{{ $json.env.TWILIO_ACCOUNT_SID }}
{{ $json.env.TWILIO_FROM_NUMBER }}
{{ $json.env.SENDGRID_API_KEY }}
{{ $json.env.OPENAI_API_KEY }}
```

### Métriques Standard

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

## Frontend Architecture

### Structure des Composants
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

### Pages Importantes

#### `/admin/workflows` - Interface de Provisioning
- Sélection client via dropdown
- Catalogue templates par pack (Start/Pro/Elite)
- Formulaire dynamique variables/credentials
- Bouton "Provisionner" avec feedback
- Tableau workflows client (ON/OFF, logs, métriques)

#### `/dashboard` - Dashboard Client
- Vue d'ensemble workflows actifs
- Métriques temps réel
- Actions rapides (Test run, Logs)

## Déploiement

### Environnements

#### Frontend (Vercel)
- **URL** : `https://webstate.vercel.app`
- **Build** : `npm run build`
- **Variables** : Configurées dans Vercel Dashboard

#### Backend (Supabase)
- **URL** : `https://ijybwfdkiteebytdwhyu.supabase.co`
- **Edge Functions** : Déployées via CLI ou Dashboard
- **Migrations** : Appliquées automatiquement

#### n8n (Railway)
- **URL** : `https://n8n.railway.app`
- **Database** : PostgreSQL Railway
- **Variables** : Configurées dans Railway Dashboard

### Commandes de Déploiement

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

## Sécurité

### Points Clés
1. **RLS activé** sur toutes les tables
2. **Variables d'environnement** jamais en dur
3. **Validation** côté Edge Functions
4. **Rate limiting** sur les APIs
5. **Authentification** Supabase Auth
6. **Autorisation** basée sur les rôles

### Bonnes Pratiques
- Toujours utiliser `org_id` pour l'isolation
- Valider les inputs côté Edge Functions
- Utiliser les policies RLS appropriées
- Ne jamais exposer les clés API côté client

## Monitoring & Observabilité

### Logs
- **workflow_execution_logs** : Logs détaillés de chaque exécution
- **Edge Functions** : Logs dans Supabase Dashboard
- **n8n** : Logs dans Railway Dashboard

### Métriques
- **workflow_metrics** : Métriques agrégées par jour
- **KPIs** : Exécutions, succès, erreurs, coûts
- **Dashboard** : Vue temps réel des performances

### Alertes
- Erreurs critiques workflows
- Quotas dépassés
- Problèmes de connectivité n8n

## Évolutivité

### Architecture Scalable
- **Multi-tenant** : Isolation par `org_id`
- **Templates** : Facilement extensibles
- **Variables** : Injection dynamique
- **Packs** : Modulaires (Start/Pro/Elite)

### Optimisations
- **Index** sur `org_id` dans toutes les tables
- **Pagination** pour les listes importantes
- **Cache** des templates n8n
- **Optimisation** des requêtes Supabase

---

*Document technique créé le 27 janvier 2025 - Version 1.0*






