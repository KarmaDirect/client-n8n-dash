# 🧪 Test Hello World - Guide Complet

## 📋 Objectif

Tester le flux complet : **SaaS → Supabase → n8n → Supabase → SaaS**

Avec un workflow n8n ultra-simple qui dit juste "Hello World".

---

## 🚀 Étape 1 : Créer le Workflow dans n8n

### **Option A : Importer le JSON (Recommandé)**

1. Allez sur votre instance n8n : `https://n8n.railway.app`
2. Cliquez sur **"Workflows"** → **"Add workflow"**
3. Cliquez sur les **3 points** (menu) → **"Import from File"**
4. Sélectionnez le fichier `WORKFLOW-HELLO-WORLD.json`
5. Le workflow s'importe automatiquement

### **Option B : Créer manuellement (5 minutes)**

1. **Créer un nouveau workflow** dans n8n
2. **Nom** : "Hello World Test"
3. **Ajouter ces 5 nodes** :

#### **Node 1 : Webhook** (Trigger)
- Type : `Webhook`
- **Method** : POST
- **Path** : `hello-world-test`
- **Response Mode** : Last Node

#### **Node 2 : Set Data** (Préparer les données)
- Type : `Set`
- Ajouter ces champs :
  - `message` : `Hello World from n8n! 🚀`
  - `client_id` : `={{ $json.data.client_id || 'unknown' }}`
  - `triggered_at` : `={{ $now.toISO() }}`
  - `status` : `ok`
  - `itemsProcessed` : `1`

#### **Node 3 : Code** (Traitement simple)
- Type : `Code`
- Code JavaScript :
```javascript
const input = $input.all();
console.log('Hello World workflow executed!');
return input.map(item => ({
  ...item.json,
  workflow_executed: true,
  execution_time: new Date().toISOString(),
  itemsProcessed: input.length,
  status: 'ok'
}));
```

#### **Node 4 : Track Execution** (Envoyer à Supabase)
- Type : `HTTP Request`
- **Method** : POST
- **URL** : `https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/track-workflow-execution`
- **Headers** :
  - `Authorization` : `Bearer YOUR_SUPABASE_ANON_KEY`
  - `Content-Type` : `application/json`
- **Body** (JSON) :
```json
{
  "workflow_id": "{{ $json.env.WORKFLOW_ID }}",
  "n8n_execution_id": "{{ $execution.id }}",
  "status": "success",
  "started_at": "{{ $execution.startedAt }}",
  "finished_at": "{{ $execution.finishedAt || $now.toISO() }}",
  "duration_seconds": "{{ Math.round($execution.duration / 1000) }}",
  "input_data": {{ $input.all() }},
  "output_data": {{ $json }},
  "metrics": {
    "itemsProcessed": {{ $json.itemsProcessed || 1 }},
    "status": "ok",
    "message": "Hello World executed successfully"
  }
}
```

#### **Node 5 : Respond to Webhook** (Répondre)
- Type : `Respond to Webhook`
- **Mode** : Last Node

4. **Connecter les nodes** :
   - Webhook → Set Data → Code → Track Execution → Respond to Webhook

5. **Sauvegarder** le workflow (Ctrl+S ou Cmd+S)

---

## 📝 Étape 2 : Créer un Template dans Supabase

### **Via SQL Editor dans Supabase Dashboard**

```sql
INSERT INTO public.workflow_templates (
  name,
  description,
  category,
  n8n_template_id,
  pack_level,
  required_credentials,
  configurable_params,
  default_config,
  estimated_cost_per_exec,
  estimated_time_saved_minutes,
  metrics_tracked,
  is_active,
  display_order
) VALUES (
  'Hello World Test',
  'Workflow de test simple pour valider le système',
  'Automation',
  'VOTRE_WORKFLOW_N8N_ID',  -- ⚠️ REMPLACER par l'ID réel du workflow n8n
  'start',
  '[]'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  0.00,
  0,
  '["itemsProcessed"]'::jsonb,
  true,
  99
);
```

**⚠️ Important** : Remplacez `VOTRE_WORKFLOW_N8N_ID` par l'ID réel du workflow dans n8n (visible dans l'URL : `/workflow/ABC123` → `ABC123` est l'ID)

---

## 🔧 Étape 3 : Provisionner le Workflow pour un Client

### **Via l'interface `/admin/workflows`**

1. Allez sur `/admin/workflows`
2. Sélectionnez un client approuvé
3. Dans l'onglet **"Start"**, vous devriez voir **"Hello World Test"**
4. Cochez-le
5. Cliquez sur **"Provisionner"**
6. Les variables sont vides (pas de credentials requis)
7. Cliquez sur **"Provisionner & Activer"**

**Résultat attendu** :
- ✅ Workflow copié dans n8n
- ✅ Workflow activé automatiquement
- ✅ Workflow visible dans la section "Workflows du client"

---

## 🧪 Étape 4 : Tester le Workflow

### **Test 1 : Via le bouton "Test Run"**

1. Dans `/admin/workflows`, section "Workflows du client"
2. Trouvez "Hello World Test"
3. Cliquez sur l'icône **📄** (Test Run)
4. **Résultat attendu** :
   - ✅ Toast : "Workflow déclenché"
   - ✅ Execution ID affiché
   - ✅ Métriques mises à jour après 3 secondes

### **Test 2 : Via n8n directement**

1. Allez sur n8n → votre workflow "Hello World Test"
2. Cliquez sur **"Execute Workflow"** (bouton play)
3. **Résultat attendu** :
   - ✅ Workflow s'exécute
   - ✅ Appelle Supabase `track-workflow-execution`
   - ✅ Métriques mises à jour dans Supabase

### **Test 3 : Via Webhook direct (optionnel)**

```bash
curl -X POST https://n8n.railway.app/webhook/hello-world-test \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "client_id": "c_test",
      "test": true
    }
  }'
```

---

## ✅ Vérification des Résultats

### **1. Dans Supabase Dashboard**

Allez dans **Table Editor** → `workflow_execution_logs` :

```sql
SELECT 
  id,
  workflow_id,
  n8n_execution_id,
  status,
  started_at,
  finished_at,
  duration_seconds,
  metrics
FROM workflow_execution_logs
ORDER BY created_at DESC
LIMIT 5;
```

**Vous devriez voir** :
- ✅ Status : `success`
- ✅ Metrics : `{"itemsProcessed": 1, "status": "ok", "message": "Hello World executed successfully"}`
- ✅ Duration_seconds : > 0

### **2. Dans votre SaaS**

Allez sur `/admin/workflows` → Section "Métriques" :

- ✅ **Exécutions** : Au moins 1
- ✅ **Items traités** : Au moins 1
- ✅ **Erreurs** : 0

### **3. Dans n8n**

Allez sur votre workflow → Onglet **"Executions"** :

- ✅ Vous voyez l'exécution
- ✅ Status : `Success`
- ✅ Vous pouvez voir les données de sortie

---

## 🐛 Dépannage

### **Problème : "Workflow is not active"**

**Solution** :
1. Dans `/admin/workflows`, activez le workflow (bouton Play)
2. Ou dans n8n, activez le workflow (toggle ON/OFF)

### **Problème : "Failed to trigger workflow"**

**Vérifications** :
1. Le workflow est bien actif dans n8n ?
2. L'ID `n8n_workflow_id` est correct dans Supabase ?
3. Les variables d'environnement `N8N_API_URL` et `N8N_API_KEY` sont configurées ?

### **Problème : "Track Execution failed"**

**Vérifications** :
1. L'URL Supabase est correcte dans le node HTTP Request ?
2. Le token `SUPABASE_ANON_KEY` est correct ?
3. La table `workflow_execution_logs` existe bien ?

### **Problème : Métriques ne s'affichent pas**

**Solution** :
1. Attendre 3-5 secondes (refresh automatique)
2. Cliquer sur le bouton refresh dans `/admin/workflows`
3. Vérifier les logs dans Supabase Dashboard

---

## 🎉 Si tout fonctionne

Vous avez validé le flux complet :

✅ **SaaS → Supabase → n8n** : Déclenchement fonctionne  
✅ **n8n → Supabase → SaaS** : Tracking fonctionne  
✅ **Métriques** : S'affichent correctement  

**Vous pouvez maintenant créer des workflows plus complexes !** 🚀

---

**Guide créé le 27 janvier 2025**







