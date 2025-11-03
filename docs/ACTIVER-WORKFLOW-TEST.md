# ✅ Activer le Workflow Test

## 🎯 **ÉTAPE 3 : Activer le Workflow (30 secondes)**

### **Option A : Via l'interface n8n (recommandé)**

1. Va dans **n8n** → **Workflows**
2. Ouvre **"Webhook Test → Send Metrics to SaaS"**
3. Clique sur le toggle **"Active"** (en haut à droite)
4. ✅ Le workflow devient vert et est activé

### **Option B : Via l'API n8n**

Si tu préfères via API, utilise ce curl :

```bash
curl -X PATCH \
  'https://primary-production-bdba.up.railway.app/api/v1/workflows/VqlDtuCWSztdPCVY' \
  -H 'X-N8N-API-KEY: ta-cle-api-n8n' \
  -H 'Content-Type: application/json' \
  -d '{"active": true}'
```

---

## 🧪 **TESTER LE WORKFLOW**

Une fois activé, teste-le :

### **1. Récupérer l'UUID d'une organisation**

Dans Supabase SQL Editor :
```sql
SELECT id, name FROM organizations LIMIT 1;
```

Note l'`id` (UUID).

### **2. Tester avec curl**

Remplace `UUID-ORG` par l'UUID réel :

```bash
curl -X POST 'https://primary-production-bdba.up.railway.app/webhook/webstate/test' \
  -H 'Content-Type: application/json' \
  -d '{
    "orgId": "UUID-ORG",
    "workflowKey": "Webhook Test"
  }'
```

**Réponse attendue** :
```json
{
  "message": "✅ Workflow exécuté et métriques envoyées à WebState.",
  "payloadSent": {
    "orgId": "UUID-ORG",
    "workflowKey": "Webhook Test",
    "status": "ok",
    "itemsProcessed": 5,
    "durationMs": 342,
    "errorMessage": null,
    "n8nExecutionId": "...",
    "ts": "2025-10-31T..."
  }
}
```

### **3. Vérifier dans Supabase**

Va dans **Table Editor** → `workflow_execution_logs`
- Tu devrais voir une nouvelle entrée avec les métriques

---

## 🔍 **VÉRIFICATIONS**

### ✅ Si tout fonctionne :
- ✅ curl retourne le JSON avec `message: "✅ Workflow exécuté..."`
- ✅ Log créé dans `workflow_execution_logs`
- ✅ Pas d'erreur 401 dans les logs Supabase

### ❌ Si erreur :
- Vérifie que le workflow est bien **Active** (vert dans n8n)
- Vérifie que `orgId` = UUID réel de l'organisation
- Regarde les logs Supabase Edge Function pour plus de détails

---

## ✅ **CHECKLIST FINALE**

- [x] Variables configurées dans Railway ✅
- [x] Secret configuré dans Supabase ✅
- [ ] Workflow activé dans n8n ⏳
- [ ] Test curl retourne le JSON attendu
- [ ] Log visible dans `workflow_execution_logs`

**Il reste juste à activer le workflow et tester ! 🚀**




