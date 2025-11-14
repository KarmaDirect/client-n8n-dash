# 🔄 Schéma Simple : SaaS ↔ Supabase ↔ n8n

## Vue d'ensemble

Flux bidirectionnel simple entre votre SaaS, Supabase et n8n.

---

## 📤 Direction 1 : SaaS → Supabase → n8n (Déclencher workflow)

### **Schéma**
```
SaaS (Frontend)
    │
    │ POST /functions/v1/manage-client-workflows
    │ { action: "trigger", workflow_id: "..." }
    ▼
Supabase Edge Function
    │
    │ POST /api/v1/workflows/{id}/execute
    │ ou POST /webhook/{webhook_path}
    ▼
n8n Workflow
    └─ Exécution du workflow
```

### **Code dans votre SaaS (Frontend)**

```typescript
// Déclencher un workflow depuis le frontend
const triggerWorkflow = async (workflowId: string) => {
  const { data, error } = await supabase.functions.invoke('manage-client-workflows', {
    body: {
      action: 'trigger',
      workflow_id: workflowId,
      data: {
        client_id: 'c_123',
        // ... autres données
      }
    }
  });
  
  return data;
};
```

### **Edge Function Supabase** (`manage-client-workflows/index.ts`)

```typescript
// Action: TRIGGER
if (action === 'trigger') {
  const { data: workflow } = await supabaseClient
    .from('workflows')
    .select('n8n_workflow_id, webhook_path')
    .eq('id', workflow_id)
    .single();

  // Option 1 : Via webhook (si workflow a un webhook)
  if (workflow.webhook_path) {
    await fetch(`${N8N_API_URL}/webhook/${workflow.webhook_path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });
  }
  
  // Option 2 : Via API n8n execute
  else {
    await fetch(`${N8N_API_URL}/api/v1/workflows/${workflow.n8n_workflow_id}/execute`, {
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    });
  }
  
  return { success: true, message: 'Workflow déclenché' };
}
```

---

## 📥 Direction 2 : n8n → Supabase → SaaS (Retour résultat/métriques)

### **Schéma**
```
n8n Workflow (fin d'exécution)
    │
    │ POST /functions/v1/track-workflow-execution
    │ { workflow_id, status, metrics, ... }
    ▼
Supabase Edge Function
    │
    │ Insert dans workflow_execution_logs
    │ Update workflow_metrics
    ▼
Supabase Database
    │
    │ Real-time subscription
    ▼
SaaS (Frontend)
    └─ Affichage métriques en temps réel
```

### **Code dans n8n (Node HTTP Request final)**

Dans votre workflow n8n, ajoutez un **node HTTP Request** à la fin :

**Configuration du node** :
- **Method** : POST
- **URL** : `https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/track-workflow-execution`
- **Authentication** : Header
  - **Name** : `Authorization`
  - **Value** : `Bearer YOUR_SUPABASE_ANON_KEY`
- **Body** (JSON) :
```json
{
  "workflow_id": "{{ $json.env.WORKFLOW_ID }}",
  "n8n_execution_id": "{{ $execution.id }}",
  "status": "success",
  "started_at": "{{ $execution.startedAt }}",
  "finished_at": "{{ $execution.finishedAt }}",
  "duration_seconds": {{ $execution.duration }},
  "input_data": {{ $input.all() }},
  "output_data": {{ $json }},
  "metrics": {
    "itemsProcessed": {{ $input.all().length }},
    "sms_sent": 5,
    "emails_sent": 2
  }
}
```

### **Edge Function Supabase** (`track-workflow-execution/index.ts`)

Déjà implémenté ✅ - Insert dans :
- `workflow_execution_logs` (logs détaillés)
- `workflow_metrics` (métriques agrégées)
- `workflows` (update counters)

### **Affichage dans votre SaaS (Frontend)**

```typescript
// Dans votre composant Dashboard ou AdminWorkflows
useEffect(() => {
  // Subscribe aux métriques en temps réel
  const subscription = supabase
    .channel('workflow-metrics')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'workflow_execution_logs',
      filter: `org_id=eq.${orgId}`
    }, (payload) => {
      // Mettre à jour l'affichage
      loadMetrics(orgId);
      loadClientWorkflows(orgId);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [orgId]);
```

---

## 🔄 Schéma Complet Visual

```
┌─────────────────────────────────────────────────────────────┐
│                      SAAS (Frontend)                        │
│  • /admin/workflows                                         │
│  • Bouton "Test Run"                                        │
│  • Dashboard métriques                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ POST manage-client-workflows
                     │ { action: "trigger", workflow_id: "..." }
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE (Edge Functions)                      │
│                                                              │
│  manage-client-workflows                                    │
│  └─ Déclenche n8n workflow                                 │
│                                                              │
│  track-workflow-execution                                   │
│  └─ Reçoit métriques de n8n                                │
│  └─ Insert workflow_execution_logs                          │
│  └─ Update workflow_metrics                                │
└────────────────────┬───────────────────────────────────────┘
                     │
                     │ POST /api/v1/workflows/{id}/execute
                     │ ou POST /webhook/{path}
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    n8n Workflow                             │
│                                                              │
│  1. Trigger (Webhook/Cron)                                 │
│  2. Traitement des données                                  │
│  3. Appels API externes (Twilio, SendGrid, etc.)            │
│  4. Insert dans Supabase (si besoin)                        │
│  5. HTTP Request → track-workflow-execution                │
│     { workflow_id, status, metrics }                       │
└────────────────────┬───────────────────────────────────────┘
                     │
                     │ POST track-workflow-execution
                     │ { workflow_id, status, metrics }
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE (Database)                             │
│                                                              │
│  • workflow_execution_logs (logs détaillés)                │
│  • workflow_metrics (métriques agrégées)                    │
│  • workflows (counters updated)                            │
└────────────────────┬───────────────────────────────────────┘
                     │
                     │ Real-time subscription
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      SAAS (Frontend)                        │
│  • Métriques mises à jour en temps réel                      │
│  • Logs affichés                                            │
│  • Dashboard actualisé                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Implémentation Minimale

### **1. Ajouter action "trigger" dans Edge Function**

```typescript
// Dans manage-client-workflows/index.ts
if (action === 'trigger') {
  if (!workflow_id) throw new Error('workflow_id required');

  const { data: workflow } = await supabaseClient
    .from('workflows')
    .select('n8n_workflow_id, webhook_path')
    .eq('id', workflow_id)
    .single();

  if (!workflow) throw new Error('Workflow not found');

  // Déclencher via API n8n
  const triggerRes = await fetch(
    `${N8N_API_URL}/api/v1/workflows/${workflow.n8n_workflow_id}/execute`,
    {
      method: 'POST',
      headers: n8nHeaders,
      body: JSON.stringify({
        data: {
          ...data,
          client_id: orgId
        }
      })
    }
  );

  if (!triggerRes.ok) throw new Error('Failed to trigger workflow');

  const execution = await triggerRes.json();

  return new Response(
    JSON.stringify({
      success: true,
      execution_id: execution.data?.id,
      message: 'Workflow déclenché'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
```

### **2. Bouton "Test Run" dans AdminWorkflows.tsx**

```typescript
const testRun = async (workflowId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('manage-client-workflows', {
      body: {
        action: 'trigger',
        workflow_id: workflowId,
        data: {
          test: true,
          client_id: selectedOrgId
        }
      }
    });

    if (error) throw error;

    toast({
      title: "✅ Workflow déclenché",
      description: `Exécution ID: ${data.execution_id}`,
    });

    // Recharger les workflows après 2 secondes
    setTimeout(() => {
      loadClientWorkflows(selectedOrgId);
      loadMetrics(selectedOrgId);
    }, 2000);
  } catch (error: any) {
    toast({
      title: "❌ Erreur",
      description: error.message,
      variant: "destructive",
    });
  }
};
```

---

## ✅ C'est tout !

**Flux simple** :
1. **SaaS → Supabase → n8n** : Déclencher workflow
2. **n8n → Supabase → SaaS** : Recevoir métriques

**Pas de complexité supplémentaire.** 🎯

---

**Document créé le 27 janvier 2025**







