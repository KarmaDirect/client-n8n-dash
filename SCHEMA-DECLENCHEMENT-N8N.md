# 🔄 Schéma de Déclenchement d'une Automatisation n8n

## Vue d'ensemble

Dans n8n, une **automatisation** = un **"Workflow"**. Il existe plusieurs façons de déclencher un workflow n8n.

---

## 📋 Types de Déclencheurs n8n

### 1. **Webhook** (déclenchement manuel via HTTP)
### 2. **Cron/Schedule** (déclenchement automatique)
### 3. **API n8n** (déclenchement programmatique)
### 4. **Trigger manuel** (depuis l'interface n8n)

---

## 🌐 Méthode 1 : Webhook (Recommandé pour déclenchements externes)

### **Principe**
Le workflow n8n expose une URL webhook unique. Vous faites un POST HTTP vers cette URL pour déclencher le workflow.

### **Étape 1 : Récupérer l'URL webhook du workflow**

```typescript
// Via n8n API
GET https://n8n.railway.app/api/v1/workflows/{workflow_id}

Response:
{
  "data": {
    "id": "abc123",
    "name": "Mon Workflow",
    "active": true,
    "nodes": [
      {
        "type": "n8n-nodes-base.webhook",
        "parameters": {
          "path": "mon-webhook",
          "httpMethod": "POST"
        },
        "webhookId": "xyz789"
      }
    ],
    "settings": {
      "webhookPath": "mon-webhook"
    }
  }
}
```

**URL webhook complète** :
```
https://n8n.railway.app/webhook/{webhook_path}
ou
https://n8n.railway.app/webhook/{webhook_id}
```

### **Étape 2 : Déclencher le workflow**

```typescript
// Déclencher via webhook
POST https://n8n.railway.app/webhook/mon-webhook
Content-Type: application/json

{
  "data": {
    "key": "value",
    "client_id": "c_123",
    "message": "Hello n8n!"
  }
}
```

**Exemple en JavaScript/TypeScript** :
```typescript
const response = await fetch('https://n8n.railway.app/webhook/mon-webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    data: {
      client_id: 'c_123',
      action: 'process_lead',
      lead_data: { name: 'John', email: 'john@example.com' }
    }
  })
});

const result = await response.json();
```

---

## ⏰ Méthode 2 : Cron/Schedule (Déclenchement automatique)

### **Principe**
Le workflow se déclenche automatiquement selon un schedule (ex. toutes les heures, tous les jours à 9h).

### **Configuration dans n8n**
Dans le workflow n8n, le premier node est un **"Schedule Trigger"** :
- **Cron Expression** : `0 9 * * *` (tous les jours à 9h)
- **Cron Expression** : `0 * * * *` (toutes les heures)
- **Cron Expression** : `*/15 * * * *` (toutes les 15 minutes)

**Pas besoin d'appel API** : Le workflow se déclenche automatiquement quand le schedule arrive.

---

## 🔧 Méthode 3 : API n8n (Déclenchement manuel via API)

### **Authentification**
```http
X-N8N-API-KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### **Déclencher un workflow via API**

```typescript
// Méthode 3.1 : POST vers /workflows/{id}/execute
POST https://n8n.railway.app/api/v1/workflows/{workflow_id}/execute
X-N8N-API-KEY: {api_key}
Content-Type: application/json

{
  "data": {
    "input": {
      "key": "value"
    }
  }
}
```

**Réponse** :
```json
{
  "data": {
    "execution_id": "exec_123",
    "status": "running",
    "started_at": "2025-01-27T10:00:00Z"
  }
}
```

### **Vérifier le statut d'une exécution**

```typescript
GET https://n8n.railway.app/api/v1/executions/{execution_id}
X-N8N-API-KEY: {api_key}

Response:
{
  "data": {
    "id": "exec_123",
    "status": "success",
    "started_at": "2025-01-27T10:00:00Z",
    "finished_at": "2025-01-27T10:00:15Z",
    "data": {
      "result": { ... }
    }
  }
}
```

---

## 🔄 Méthode 4 : Edge Function Supabase (Notre système)

### **Principe**
On utilise notre Edge Function `execute-webhook` qui gère les permissions et appelle n8n.

### **Schéma de notre système**

```
┌─────────────────┐
│   Frontend      │
│  Admin UI       │
└────────┬────────┘
         │ POST /functions/v1/execute-webhook
         ▼
┌─────────────────┐
│ Edge Function   │
│ execute-webhook │
│  • Vérifie RLS  │
│  • Rate limiting│
│  • Call n8n     │
└────────┬────────┘
         │ POST /webhook/{webhook_path}
         ▼
┌─────────────────┐
│   n8n Workflow  │
│  • Déclenché    │
│  • Exécuté      │
│  • Retour       │
└────────┬────────┘
         │ POST /functions/v1/track-workflow-execution
         ▼
┌─────────────────┐
│ Edge Function   │
│ track-execution │
│  • Logs         │
│  • Métriques    │
└─────────────────┘
```

### **Code TypeScript pour déclencher via notre système**

```typescript
// Depuis le frontend
const response = await supabase.functions.invoke('execute-webhook', {
  body: {
    webhook_id: 'uuid-du-webhook',
    data: {
      client_id: 'c_123',
      action: 'process_lead',
      lead_data: { name: 'John', email: 'john@example.com' }
    }
  }
});

// Réponse
{
  success: true,
  execution_id: "exec_123",
  result: { ... }
}
```

---

## 📊 Comparaison des Méthodes

| Méthode | Quand utiliser | Avantages | Inconvénients |
|---------|---------------|-----------|---------------|
| **Webhook** | Déclenchement externe | Simple, direct | Nécessite que le workflow soit actif |
| **Cron** | Tâches récurrentes | Automatique, fiable | Pas de contrôle immédiat |
| **API n8n** | Déclenchement programmatique | Contrôle total | Nécessite API key, plus complexe |
| **Edge Function** | Via notre système | Gestion permissions, tracking | Couche supplémentaire |

---

## 🔑 Exemple Complet : Déclencher un Workflow "Lead Capture"

### **1. Récupérer le webhook ID du workflow**

```typescript
// Via n8n API
const workflow = await fetch(
  'https://n8n.railway.app/api/v1/workflows/{workflow_id}',
  {
    headers: {
      'X-N8N-API-KEY': process.env.N8N_API_KEY
    }
  }
);

const webhookId = workflow.data.nodes[0].webhookId;
```

### **2. Déclencher le workflow (via webhook)**

```typescript
const response = await fetch(
  `https://n8n.railway.app/webhook/${webhookId}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+33612345678',
        source: 'website',
        client_id: 'c_123'
      }
    })
  }
);
```

### **3. Le workflow n8n traite les données**

Le workflow n8n :
1. Reçoit les données du webhook
2. Valide les données
3. Enrichit via API externe
4. Insère dans Supabase
5. Envoie un email/SMS
6. Appelle `track-workflow-execution` pour logger

---

## 🎯 Pour notre Projet WebState

### **Schéma actuel utilisé**

Dans `manage-client-workflows/index.ts` :

```typescript
// On ne déclenche PAS directement
// On provisionne le workflow (le créer dans n8n)
// Le workflow se déclenche ensuite selon son trigger (webhook/cron)

// Pour déclencher manuellement un workflow provisionné :
// 1. Via webhook (si workflow a un node webhook)
POST https://n8n.railway.app/webhook/{webhook_path}

// 2. Via API n8n (si workflow est actif)
POST https://n8n.railway.app/api/v1/workflows/{workflow_id}/execute
```

### **Test Run (Non implémenté actuellement)**

Pour implémenter le "Test Run" depuis `/admin/workflows` :

```typescript
// Dans AdminWorkflows.tsx
const testRun = async (workflowId: string) => {
  const { data: workflow } = await supabase
    .from('workflows')
    .select('n8n_workflow_id')
    .eq('id', workflowId)
    .single();

  // Option 1 : Via webhook (si workflow a un webhook)
  await fetch(`https://n8n.railway.app/webhook/${webhook_path}`, {
    method: 'POST',
    body: JSON.stringify({ test: true })
  });

  // Option 2 : Via API n8n
  await fetch(
    `https://n8n.railway.app/api/v1/workflows/${workflow.n8n_workflow_id}/execute`,
    {
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': process.env.N8N_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: { test: true }
      })
    }
  );
};
```

---

## 📚 Références

- **n8n API Docs** : https://docs.n8n.io/api/
- **Webhook Node** : https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
- **Schedule Trigger** : https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger/

---

**Document créé le 27 janvier 2025**







