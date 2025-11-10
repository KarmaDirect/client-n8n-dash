# 📘 Guide Complet - Création de Workflows n8n pour WebState

> **Destinataire** : Perplexity (ou tout créateur de workflows)  
> **Objectif** : Créer des workflows n8n compatibles avec le système WebState SaaS

---

## 🏗️ Architecture du Système

### Vue d'ensemble
```
Client WebState SaaS → Supabase (PostgreSQL + Edge Functions) → n8n (Railway) → Supabase
```

### Flux de données
1. **Provisionnement** : SaaS → Supabase → n8n (création workflow)
2. **Exécution** : n8n → Webhook trigger → Traitement → Envoi métriques
3. **Métriques** : n8n → Edge Function `receive-n8n-metrics` → Supabase

---

## 📊 Base de Données Supabase

### Tables Principales

#### 1. `workflow_templates`
Stocke les templates de workflows disponibles pour les clients.

```sql
CREATE TABLE workflow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  n8n_template_id TEXT UNIQUE NOT NULL,  -- ID du workflow template dans n8n
  pack_level TEXT CHECK (pack_level IN ('start', 'pro', 'elite')),
  category TEXT,
  default_config JSONB DEFAULT '{}',
  required_credentials TEXT[],
  estimated_cost_per_exec NUMERIC DEFAULT 0,
  estimated_time_saved_minutes INTEGER DEFAULT 0,
  metrics_tracked TEXT[],  -- Ex: ['sms_sent', 'leads_generated', 'tokens_used']
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Exemple d'insertion :**
```sql
INSERT INTO workflow_templates (
  name, 
  description, 
  n8n_template_id, 
  pack_level, 
  category,
  metrics_tracked,
  estimated_time_saved_minutes
) VALUES (
  'SMS Rappels RDV',
  'Envoie des rappels SMS automatiques pour les rendez-vous',
  'tfQHM0pALAwtsKDZ',  -- ID du workflow dans n8n
  'start',
  'communication',
  ARRAY['sms_sent', 'appointments_confirmed'],
  30
);
```

#### 2. `workflows`
Stocke les workflows provisionnés pour chaque client.

```sql
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  template_id UUID REFERENCES workflow_templates(id),
  n8n_workflow_id TEXT NOT NULL,  -- ID du workflow dans n8n
  name TEXT NOT NULL,
  description TEXT,
  pack_level TEXT,
  status TEXT CHECK (status IN ('pending_validation', 'active', 'inactive', 'error')),
  config_params JSONB DEFAULT '{}',
  credentials_status TEXT DEFAULT 'not_configured',
  is_active BOOLEAN DEFAULT false,
  last_execution_at TIMESTAMPTZ,
  total_executions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `workflow_execution_logs`
Logs détaillés de chaque exécution.

```sql
CREATE TABLE workflow_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  n8n_execution_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('success', 'failed', 'running')),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  error_message TEXT,
  metrics JSONB DEFAULT '{}',  -- Métriques custom du workflow
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. `workflow_metrics`
Métriques agrégées par jour.

```sql
CREATE TABLE workflow_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  executions_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  api_calls_made INTEGER DEFAULT 0,
  cost_incurred NUMERIC DEFAULT 0,
  time_saved_minutes INTEGER DEFAULT 0,
  money_saved NUMERIC DEFAULT 0,
  custom_metrics JSONB DEFAULT '{}',  -- Ex: { "sms_sent": 42, "leads_generated": 15 }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workflow_id, date)
);
```

---

## 🔧 Structure d'un Workflow n8n Compatible

### Règles Obligatoires

#### 1. **Utiliser des Nodes Stables**
Toujours utiliser `typeVersion: 1` pour éviter les incompatibilités.

**Nodes recommandés :**
- `n8n-nodes-base.webhook` (typeVersion: 1)
- `n8n-nodes-base.function` (typeVersion: 1)
- `n8n-nodes-base.httpRequest` (typeVersion: 1) ⚠️ Éviter si possible (bug avec headers)
- `n8n-nodes-base.respondToWebhook` (typeVersion: 1)
- `n8n-nodes-base.switch` (typeVersion: 1)
- `n8n-nodes-base.set` (typeVersion: 1)

#### 2. **Webhook Trigger (Obligatoire)**
Chaque workflow doit commencer par un node `webhook` :

```json
{
  "id": "webhook-node-id",
  "name": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 1,
  "position": [250, 300],
  "webhookId": "unique-webhook-id",
  "parameters": {
    "path": "unique/path/here",
    "httpMethod": "POST",
    "responseMode": "lastNode",
    "options": {}
  }
}
```

**⚠️ Important** : Le `path` doit être unique pour chaque workflow.

#### 3. **Node de Préparation des Métriques**
Ajouter un node `function` pour préparer les métriques à envoyer :

```json
{
  "id": "prepare-metrics-id",
  "name": "Préparer Métriques",
  "type": "n8n-nodes-base.function",
  "typeVersion": 1,
  "position": [650, 300],
  "parameters": {
    "functionCode": "const body = ($json.body ?? {});\nreturn [{\n  json: {\n    orgId: body.orgId ?? \"unknown\",\n    workflowKey: \"nom-du-workflow\",\n    status: \"ok\",\n    itemsProcessed: Number(body.itemsProcessed ?? 0) || 0,\n    durationMs: Number(body.durationMs ?? 0) || 0,\n    errorMessage: null,\n    n8nExecutionId: $execution.id,\n    ts: new Date().toISOString(),\n    sms_sent: Number(body.sms_sent ?? 0) || 0,\n    leads_generated: Number(body.leads_generated ?? 0) || 0\n  }\n}];"
  }
}
```

**⚠️ Attention** : Les backslashes `\n` doivent être échappés correctement dans le JSON.

#### 4. **Node d'Envoi des Métriques**
Utiliser un node `function` avec `fetch` (pas `httpRequest`) :

```json
{
  "id": "send-metrics-id",
  "name": "Envoyer Métriques",
  "type": "n8n-nodes-base.function",
  "typeVersion": 1,
  "position": [850, 300],
  "parameters": {
    "functionCode": "const metricsUrl = $env.N8N_METRICS_URL;\nconst apiKey = $env.N8N_METRICS_API_KEY || $env.N8N_API_KEY;\nif (!metricsUrl) {\n  throw new Error('N8N_METRICS_URL is not defined');\n}\nconst payload = $json;\nconst response = await fetch(metricsUrl, {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'X-API-Key': apiKey ?? ''\n  },\n  body: JSON.stringify(payload)\n});\nif (!response.ok) {\n  const text = await response.text();\n  throw new Error(`HTTP ${response.status}: ${text}`);\n}\nconst data = await response.json().catch(() => ({}));\nreturn [{ json: { ...payload, metricsResponse: data } }];"
  }
}
```

#### 5. **Node de Réponse (Obligatoire)**
Terminer par un `respondToWebhook` :

```json
{
  "id": "respond-id",
  "name": "Respond to Webhook",
  "type": "n8n-nodes-base.respondToWebhook",
  "typeVersion": 1,
  "position": [1050, 300],
  "parameters": {
    "options": {}
  }
}
```

---

## 🔗 Connexions entre Nodes

```json
{
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Préparer Métriques",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Préparer Métriques": {
      "main": [
        [
          {
            "node": "Envoyer Métriques",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Envoyer Métriques": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

---

## 🌐 Variables d'Environnement n8n

Ces variables sont configurées sur Railway et accessibles via `$env` :

```bash
N8N_METRICS_URL=https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/receive-n8n-metrics
N8N_METRICS_API_KEY=48e30fc766eccda1acca6fb6dc7010c21b7b7494adca340252420e3a3959de03
N8N_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
WEBHOOK_URL=https://primary-production-bdba.up.railway.app
```

**Utilisation dans un node Function :**
```javascript
const metricsUrl = $env.N8N_METRICS_URL;
const apiKey = $env.N8N_METRICS_API_KEY;
```

---

## 📤 Format des Métriques à Envoyer

### Payload Obligatoire
```json
{
  "orgId": "uuid-de-lorganisation",
  "workflowKey": "nom-du-workflow",
  "status": "ok",  // ou "error"
  "itemsProcessed": 0,
  "durationMs": 0,
  "errorMessage": null,
  "n8nExecutionId": "execution-id-from-n8n",
  "ts": "2024-03-15T10:30:00.000Z"
}
```

### Métriques Custom (Optionnel)
Ajoutez des métriques spécifiques à votre workflow :

```json
{
  "orgId": "...",
  "workflowKey": "...",
  "status": "ok",
  "itemsProcessed": 5,
  "durationMs": 1234,
  "errorMessage": null,
  "n8nExecutionId": "...",
  "ts": "...",
  
  // Métriques custom
  "sms_sent": 42,
  "leads_generated": 15,
  "emails_sent": 30,
  "tokens_used": 1500,
  "api_calls_made": 8,
  "money_saved": 120.50
}
```

**⚠️ Important** : Les métriques custom doivent être listées dans `workflow_templates.metrics_tracked` pour être agrégées.

---

## 🎯 Exemple de Workflow Complet

### Workflow : "SMS Rappels RDV"

```json
{
  "name": "[Template] SMS Rappels RDV",
  "nodes": [
    {
      "id": "webhook-1",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "sms-rdv-webhook",
      "parameters": {
        "path": "sms/rappels",
        "httpMethod": "POST",
        "responseMode": "lastNode"
      }
    },
    {
      "id": "validate-1",
      "name": "Valider Input",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [450, 300],
      "parameters": {
        "functionCode": "const body = $json.body ?? {};\nif (!body.phone || !body.appointmentDate) {\n  throw new Error('phone and appointmentDate are required');\n}\nreturn [{ json: body }];"
      }
    },
    {
      "id": "send-sms-1",
      "name": "Envoyer SMS",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [650, 300],
      "parameters": {
        "functionCode": "// Simuler l'envoi de SMS\nconst phone = $json.phone;\nconst date = $json.appointmentDate;\nconst message = `Rappel: RDV le ${date}`;\n\n// TODO: Intégrer avec un vrai service SMS (Twilio, etc.)\nconsole.log(`SMS sent to ${phone}: ${message}`);\n\nreturn [{\n  json: {\n    success: true,\n    phone: phone,\n    message: message,\n    sms_sent: 1\n  }\n}];"
      }
    },
    {
      "id": "prepare-metrics-1",
      "name": "Préparer Métriques",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [850, 300],
      "parameters": {
        "functionCode": "const body = $json;\nreturn [{\n  json: {\n    orgId: body.orgId ?? \"unknown\",\n    workflowKey: \"sms-rappels-rdv\",\n    status: \"ok\",\n    itemsProcessed: 1,\n    durationMs: Date.now() - new Date($execution.startedAt).getTime(),\n    errorMessage: null,\n    n8nExecutionId: $execution.id,\n    ts: new Date().toISOString(),\n    sms_sent: body.sms_sent ?? 1\n  }\n}];"
      }
    },
    {
      "id": "send-metrics-1",
      "name": "Envoyer Métriques",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [1050, 300],
      "parameters": {
        "functionCode": "const metricsUrl = $env.N8N_METRICS_URL;\nconst apiKey = $env.N8N_METRICS_API_KEY || $env.N8N_API_KEY;\nif (!metricsUrl) {\n  throw new Error('N8N_METRICS_URL is not defined');\n}\nconst payload = $json;\nconst response = await fetch(metricsUrl, {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'X-API-Key': apiKey ?? ''\n  },\n  body: JSON.stringify(payload)\n});\nif (!response.ok) {\n  const text = await response.text();\n  throw new Error(`HTTP ${response.status}: ${text}`);\n}\nconst data = await response.json().catch(() => ({}));\nreturn [{ json: { ...payload, metricsResponse: data } }];"
      }
    },
    {
      "id": "respond-1",
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1250, 300],
      "parameters": {
        "options": {}
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "Valider Input", "type": "main", "index": 0 }]]
    },
    "Valider Input": {
      "main": [[{ "node": "Envoyer SMS", "type": "main", "index": 0 }]]
    },
    "Envoyer SMS": {
      "main": [[{ "node": "Préparer Métriques", "type": "main", "index": 0 }]]
    },
    "Préparer Métriques": {
      "main": [[{ "node": "Envoyer Métriques", "type": "main", "index": 0 }]]
    },
    "Envoyer Métriques": {
      "main": [[{ "node": "Respond to Webhook", "type": "main", "index": 0 }]]
    }
  },
  "settings": {
    "executionOrder": "v1"
  },
  "tags": []
}
```

---

## 🏷️ Système de Tags

### Tags Automatiques
Lors du provisionnement, le système ajoute automatiquement des tags :

```javascript
const tags = [
  { name: `org:${orgName}` },           // Ex: "org:Client Démo"
  { name: `client:${orgId}` },          // Ex: "client:uuid-123"
  { name: `pack:${template.pack_level}` } // Ex: "pack:pro"
];
```

**⚠️ Ne pas inclure ces tags dans le JSON du template**, ils sont ajoutés automatiquement.

---

## 📋 Checklist de Création de Workflow

### Avant de Créer
- [ ] Définir le nom du workflow (clair et descriptif)
- [ ] Définir le `path` du webhook (unique)
- [ ] Lister les métriques à tracker
- [ ] Identifier les credentials nécessaires
- [ ] Estimer le temps économisé par exécution

### Structure du Workflow
- [ ] Node `webhook` en premier
- [ ] Node(s) de logique métier
- [ ] Node `Préparer Métriques` avant la fin
- [ ] Node `Envoyer Métriques` (avec fetch)
- [ ] Node `respondToWebhook` en dernier
- [ ] Tous les nodes ont `typeVersion: 1`

### Métriques
- [ ] `orgId` récupéré depuis le webhook body
- [ ] `workflowKey` défini (nom unique du workflow)
- [ ] `status` : "ok" ou "error"
- [ ] `itemsProcessed` : nombre d'éléments traités
- [ ] `durationMs` : calculé avec `$execution.startedAt`
- [ ] `n8nExecutionId` : `$execution.id`
- [ ] Métriques custom ajoutées si nécessaire

### Après Création
- [ ] Créer le workflow dans n8n (via UI ou API)
- [ ] Récupérer le `n8n_workflow_id` (ID du workflow)
- [ ] Insérer dans `workflow_templates` avec cet ID
- [ ] Tester le provisionnement via l'Edge Function

---

## 🚀 Provisionnement d'un Workflow

### API Edge Function : `manage-client-workflows`

**Endpoint :**
```
POST https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/manage-client-workflows
```

**Headers :**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Body (action: provision) :**
```json
{
  "action": "provision",
  "org_id": "uuid-de-lorganisation",
  "template_id": "uuid-du-template"
}
```

**Réponse :**
```json
{
  "success": true,
  "workflow": {
    "id": "uuid-workflow-supabase",
    "n8n_workflow_id": "id-workflow-n8n",
    "name": "[Client Name] Workflow Name",
    "status": "pending_validation"
  }
}
```

---

## 🔄 Cycle de Vie d'un Workflow

### 1. Création du Template
```sql
INSERT INTO workflow_templates (...) VALUES (...);
```

### 2. Provisionnement
- SaaS appelle `manage-client-workflows` avec `action: provision`
- Edge Function duplique le workflow dans n8n
- Edge Function ajoute les tags
- Edge Function insère dans `workflows` avec `status: pending_validation`

### 3. Validation
- Admin valide via `action: validate`
- Workflow activé dans n8n
- Status passe à `active`

### 4. Exécution
- Client trigger le webhook
- n8n exécute le workflow
- Métriques envoyées à `receive-n8n-metrics`
- Edge Function `track-workflow-execution` log et agrège

### 5. Tracking
- `workflow_execution_logs` : log détaillé
- `workflow_metrics` : agrégation quotidienne
- Dashboard client : affichage des métriques

---

## ⚠️ Pièges à Éviter

### 1. **Node `httpRequest` avec Headers**
❌ **Ne pas utiliser** `headerParametersJson` dans `httpRequest` (bug n8n)
✅ **Utiliser** un node `function` avec `fetch` à la place

### 2. **Escaping dans Function Nodes**
❌ **Mauvais** :
```json
"functionCode": "const x = \"test\";\nreturn [{ json: x }];"
```

✅ **Bon** :
```json
"functionCode": "const x = \"test\";\\nreturn [{ json: x }];"
```

### 3. **Webhook Path Unique**
Chaque workflow doit avoir un `path` unique :
- ✅ `sms/rappels`
- ✅ `leads/qualification`
- ❌ `webhook` (trop générique)

### 4. **TypeVersion**
Toujours utiliser `typeVersion: 1` pour la compatibilité.

### 5. **Métriques Tracking**
Si vous ajoutez une métrique custom (ex: `sms_sent`), ajoutez-la dans `workflow_templates.metrics_tracked` :

```sql
UPDATE workflow_templates 
SET metrics_tracked = ARRAY['sms_sent', 'appointments_confirmed']
WHERE n8n_template_id = 'votre-id';
```

---

## 🧪 Test d'un Workflow

### 1. Créer le Workflow dans n8n
Via l'UI n8n ou l'API.

### 2. Récupérer l'ID
```bash
curl -X GET https://primary-production-bdba.up.railway.app/api/v1/workflows \
  -H "X-N8N-API-KEY: your-api-key"
```

### 3. Insérer dans Supabase
```sql
INSERT INTO workflow_templates (
  name, 
  n8n_template_id, 
  pack_level
) VALUES (
  'Mon Workflow Test',
  'id-du-workflow-n8n',
  'start'
);
```

### 4. Provisionner pour un Client
```bash
curl -X POST https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/manage-client-workflows \
  -H "Authorization: Bearer SERVICE_ROLE_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "provision",
    "org_id": "org-uuid",
    "template_id": "template-uuid"
  }'
```

### 5. Trigger le Webhook
```bash
curl -X POST https://primary-production-bdba.up.railway.app/webhook/sms/rappels \
  -H "Content-Type: application/json" \
  -d '{
    "orgId": "org-uuid",
    "phone": "+33612345678",
    "appointmentDate": "2024-03-20 14:00",
    "sms_sent": 1
  }'
```

### 6. Vérifier les Logs
```sql
-- Logs d'exécution
SELECT * FROM workflow_execution_logs 
WHERE workflow_id = 'workflow-uuid' 
ORDER BY created_at DESC LIMIT 10;

-- Métriques agrégées
SELECT * FROM workflow_metrics 
WHERE workflow_id = 'workflow-uuid' 
ORDER BY date DESC LIMIT 7;
```

---

## 🎨 Conventions de Nommage

### Templates
- Format : `[Template] Nom Descriptif`
- Exemple : `[Template] SMS Rappels RDV`

### Workflows Provisionnés
- Format : `[Nom Client] Nom Workflow`
- Exemple : `[Acme Corp] SMS Rappels RDV`
- Ajouté automatiquement par le système

### Webhook Paths
- Format : `categorie/action`
- Exemples :
  - `sms/rappels`
  - `leads/qualification`
  - `email/campaign`
  - `crm/sync`

### Métriques Custom
- Format : `snake_case`
- Exemples :
  - `sms_sent`
  - `leads_generated`
  - `emails_sent`
  - `tokens_used`
  - `api_calls_made`

---

## 🔐 Credentials & Secrets

### Gestion des Credentials
Les credentials sont gérés séparément dans n8n. Pour un workflow qui nécessite des credentials :

1. **Lister dans le Template**
```sql
UPDATE workflow_templates 
SET required_credentials = ARRAY['twilio', 'openai', 'google_sheets']
WHERE id = 'template-uuid';
```

2. **Le système marque le workflow**
Lors du provisionnement, `credentials_status` est défini :
- `not_configured` : Credentials manquants
- `configured` : Credentials OK

3. **Configuration Manuelle**
L'admin doit configurer les credentials dans n8n UI pour chaque client.

---

## 📊 Métriques Disponibles dans le Dashboard Client

Le client voit ces métriques dans son dashboard :

- **Exécutions totales** : Nombre d'exécutions
- **Taux de succès** : % de succès
- **Temps économisé** : En heures (calculé depuis `estimated_time_saved_minutes`)
- **Coût** : Coût total des exécutions
- **Métriques custom** : Affichées si définies dans `metrics_tracked`

**Exemple d'affichage :**
```
SMS Rappels RDV
├─ 142 exécutions (98% succès)
├─ 7h économisées ce mois
├─ 142 SMS envoyés
└─ Dernière exécution : il y a 2h
```

---

## 🛠️ Outils de Debug

### 1. Logs n8n
```bash
# Via Railway CLI
railway logs -s n8n-service
```

### 2. Logs Supabase Edge Functions
Dashboard Supabase → Edge Functions → Logs

### 3. Vérifier un Workflow
```sql
SELECT 
  w.name,
  w.status,
  w.is_active,
  w.total_executions,
  w.last_execution_at,
  wt.name as template_name
FROM workflows w
JOIN workflow_templates wt ON w.template_id = wt.id
WHERE w.org_id = 'org-uuid';
```

### 4. Vérifier les Métriques
```sql
SELECT 
  date,
  executions_count,
  success_count,
  failed_count,
  custom_metrics
FROM workflow_metrics
WHERE workflow_id = 'workflow-uuid'
ORDER BY date DESC
LIMIT 30;
```

---

## 📞 Contact & Support

Si vous avez des questions lors de la création des workflows :

1. **Vérifier la documentation** : Ce fichier
2. **Consulter les exemples** : Workflows existants dans n8n
3. **Tester progressivement** : Créer → Provisionner → Tester → Itérer

---

## 🎯 Résumé pour Perplexity

**Pour créer un workflow compatible WebState :**

1. ✅ Commencer par un node `webhook` (typeVersion: 1)
2. ✅ Ajouter votre logique métier (function, httpRequest, etc.)
3. ✅ Ajouter un node "Préparer Métriques" (function)
4. ✅ Ajouter un node "Envoyer Métriques" (function avec fetch)
5. ✅ Terminer par `respondToWebhook`
6. ✅ Utiliser `$env.N8N_METRICS_URL` et `$env.N8N_METRICS_API_KEY`
7. ✅ Envoyer les métriques au format JSON spécifié
8. ✅ Créer le workflow dans n8n, récupérer l'ID
9. ✅ Insérer dans `workflow_templates` avec cet ID

**Le système s'occupe de :**
- Dupliquer le workflow pour chaque client
- Ajouter les tags automatiquement
- Gérer l'activation/désactivation
- Agréger les métriques
- Afficher dans le dashboard client

---

Bonne création de workflows ! 🚀
