# 🧪 Workflow Test - Setup Complet

## ✅ **CE QUI A ÉTÉ FAIT**

### 1. Workflow créé dans n8n
- **Nom** : "Webhook Test → Send Metrics to SaaS"
- **ID n8n** : `VqlDtuCWSztdPCVY`
- **Statut** : Créé (inactif par défaut)

### 2. Edge Function créée
- **Nom** : `receive-n8n-metrics`
- **Endpoint** : `https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/receive-n8n-metrics`
- **Fonction** : Reçoit les métriques depuis n8n et les enregistre dans Supabase

### 3. Template ajouté dans Supabase
- **Nom** : "Webhook Test → Send Metrics to SaaS"
- **n8n_template_id** : `VqlDtuCWSztdPCVY`
- **Category** : Automation
- **Pack** : start

---

## ⚙️ **CONFIGURATION REQUISE**

### **1. Variables d'environnement n8n**

Dans n8n → **Settings → Variables**, ajouter :

```
N8N_METRICS_URL = https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/receive-n8n-metrics
N8N_API_KEY = [GÉNÈRE UN SECRET] (ex: "webstate-metrics-secret-2025")
```

### **2. Secret Supabase Edge Function**

Dans Supabase → **Edge Functions → receive-n8n-metrics → Settings → Secrets**, ajouter :

```
N8N_METRICS_API_KEY = [MÊME VALEUR QUE N8N_API_KEY]
```

**Important** : Utilise le même secret dans n8n ET Supabase !

---

## 🧪 **TEST COMPLET**

### **Étape 1 : Activer le workflow dans n8n**

1. Va dans n8n
2. Ouvre "Webhook Test → Send Metrics to SaaS"
3. Active le workflow (toggle ON)

### **Étape 2 : Récupérer l'URL du webhook**

Dans le node "Webhook Start", copie l'URL Production, par exemple :
```
https://primary-production-bdba.up.railway.app/webhook/webstate/test
```

### **Étape 3 : Provisionner pour un client (depuis SaaS)**

1. Va sur `/app/admin/workflows`
2. Sélectionne un client
3. Onglet "Start"
4. Coche "Webhook Test → Send Metrics to SaaS"
5. Clique "Provisionner (1)"
6. Vérifie le badge orange "🟠 En attente validation"

### **Étape 4 : Configurer le workflow dans n8n**

1. Dans n8n, ouvre le workflow `[NomClient] Webhook Test → Send Metrics to SaaS`
2. Dans le node "Send to SaaS" :
   - Vérifie que `URL` = `={{ $env.N8N_METRICS_URL }}`
   - Vérifie que `X-API-Key` header = `{{$env.N8N_API_KEY}}`
3. Active le workflow dans n8n (toggle ON)

### **Étape 5 : Valider depuis le SaaS**

1. Retourne sur `/app/admin/workflows`
2. Clique sur le bouton "Valider" (vert)
3. Le badge doit passer à "🟢 ON"

### **Étape 6 : Tester le workflow**

**Via curl** :
```bash
curl -X POST 'https://primary-production-bdba.up.railway.app/webhook/webstate/test' \
  -H 'Content-Type: application/json' \
  -d '{
    "orgId": "UUID-DE-L-ORGANISATION",
    "workflowKey": "Webhook Test"
  }'
```

**Réponse attendue** :
```json
{
  "message": "✅ Workflow exécuté et métriques envoyées à WebState.",
  "payloadSent": {
    "orgId": "UUID-DE-L-ORGANISATION",
    "workflowKey": "Webhook Test",
    "status": "ok",
    "itemsProcessed": 5,
    "durationMs": 342,
    "errorMessage": null,
    "n8nExecutionId": "abc-123",
    "ts": "2025-10-31T22:10:00.000Z"
  }
}
```

### **Étape 7 : Vérifier dans Supabase**

1. Va dans Supabase → **Table Editor → workflow_execution_logs**
2. Tu devrais voir une nouvelle entrée avec :
   - `n8n_execution_id` = l'ID de l'exécution n8n
   - `status` = "success"
   - `metrics` = `{"itemsProcessed": 5, "durationMs": 342}`

---

## 🔍 **VÉRIFICATIONS**

### ✅ **Si tout fonctionne** :
- ✅ Webhook répond avec le JSON attendu
- ✅ Edge Function `receive-n8n-metrics` reçoit les données
- ✅ Log créé dans `workflow_execution_logs`
- ✅ Métriques mises à jour dans `workflow_metrics`

### ❌ **Si ça ne fonctionne pas** :

**Erreur 401 Unauthorized** :
- Vérifie que `N8N_METRICS_API_KEY` dans Supabase = `N8N_API_KEY` dans n8n

**Workflow not found** :
- Vérifie que `orgId` dans le curl = UUID de l'organisation
- Vérifie que `workflowKey` correspond au nom du workflow (recherche partielle)

**Edge Function error** :
- Va dans Supabase → **Edge Functions → receive-n8n-metrics → Logs**
- Regarde les erreurs détaillées

---

## 📝 **NOTES IMPORTANTES**

1. **Matching workflow** : La fonction cherche le workflow par `org_id` + `name` contenant `workflowKey`. Si plusieurs workflows matchent, elle prend le premier.

2. **API Key** : Utilise un secret fort (ex: `webstate-metrics-` + random string)

3. **Variables n8n** : Le workflow utilise `={{ $env.N8N_METRICS_URL }}` et `{{$env.N8N_API_KEY}}` dans les expressions n8n.

4. **Format des métriques** : Le workflow envoie un format simple, et `receive-n8n-metrics` le transforme pour `track-workflow-execution`.

---

## 🎯 **PROCHAINES ÉTAPES**

Une fois que ça fonctionne :
1. Tu peux créer des workflows plus complexes
2. Modifier le payload dans "Prepare Metrics" selon tes besoins
3. Étendre `receive-n8n-metrics` pour gérer d'autres formats de métriques

**Le système est prêt pour la production !** 🚀






