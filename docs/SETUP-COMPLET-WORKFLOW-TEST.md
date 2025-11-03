# ✅ Configuration Complète - Webhook Test Workflow

## 📋 **STATUT ACTUEL**

✅ **Workflow n8n** : `VqlDtuCWSztdPCVY` - **ACTIVÉ**
✅ **Template Supabase** : Présent et actif (pack: start)
✅ **Edge Function** : `receive-n8n-metrics` déployée
✅ **Webhook URL** : `https://primary-production-bdba.up.railway.app/webhook/webstate/test`

---

## 🔑 **ÉTAPE 1 : Configurer les Variables (2 minutes)**

### **1.1 Dans Railway (n8n)**

1. Va sur **Railway Dashboard** → Ton projet n8n
2. Onglet **Variables**
3. Ajoute ces 2 variables :

```
N8N_METRICS_URL=https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/receive-n8n-metrics
N8N_API_KEY=webstate-test-secret-2025-xyz123
```

4. **Redémarre le service n8n** (Railway redémarre souvent automatiquement)

### **1.2 Dans Supabase**

1. Va dans **Supabase Dashboard** → **Edge Functions** → `receive-n8n-metrics`
2. Clique **Settings** (⚙️)
3. Section **Secrets**
4. Clique **Add secret** :
   - **Nom** : `N8N_METRICS_API_KEY`
   - **Valeur** : `webstate-test-secret-2025-xyz123` ⚠️ **MÊME VALEUR QUE N8N_API_KEY !**
5. Clique **Save**

---

## 🧪 **ÉTAPE 2 : Tester le Workflow (3 minutes)**

### **2.1 Récupérer l'UUID de l'organisation**

Dans Supabase SQL Editor :
```sql
SELECT id, name FROM organizations LIMIT 1;
```

Note l'`id` (UUID).

### **2.2 Tester avec curl**

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

### **2.3 Vérifier dans Supabase**

1. Va dans **Table Editor** → `workflow_execution_logs`
2. Tu devrais voir une nouvelle entrée avec :
   - `n8n_execution_id`
   - `status` = "success"
   - `metrics` = `{"itemsProcessed": 5, "durationMs": ...}`

---

## 🔍 **VÉRIFICATIONS**

### ✅ Si tout fonctionne :
- ✅ curl retourne le JSON avec `message: "✅ Workflow exécuté..."`
- ✅ Log créé dans `workflow_execution_logs`
- ✅ Métriques mises à jour

### ❌ Si erreur 401 :
- Vérifie que `N8N_METRICS_API_KEY` (Supabase) = `N8N_API_KEY` (Railway)
- Vérifie que les variables sont sauvegardées

### ❌ Si "Workflow not found" :
- Vérifie que `orgId` = UUID réel de l'organisation
- Vérifie que le nom du workflow dans Supabase contient "Webhook Test"

### ❌ Si erreur Edge Function :
- Va dans **Supabase → Edge Functions → receive-n8n-metrics → Logs**
- Regarde les erreurs détaillées

---

## 📝 **PROVISIONNER POUR UN CLIENT**

Une fois que le test direct fonctionne :

1. Va sur `/app/admin/workflows`
2. Sélectionne un client
3. Onglet **Start**
4. Coche **"Webhook Test → Send Metrics to SaaS"**
5. Clique **Provisionner (1)**
6. ✅ Badge orange "🟠 En attente validation"
7. Ouvre le workflow dans n8n et active-le
8. Retourne sur `/app/admin/workflows`
9. Clique **Valider**
10. ✅ Badge vert "🟢 ON"
11. Teste depuis le client avec curl

---

## ✅ **CHECKLIST FINALE**

- [ ] Variables configurées dans Railway (`N8N_METRICS_URL`, `N8N_API_KEY`)
- [ ] Secret configuré dans Supabase (`N8N_METRICS_API_KEY`)
- [ ] Service n8n redémarré (variables chargées)
- [ ] Test curl retourne le JSON attendu
- [ ] Log visible dans `workflow_execution_logs`
- [ ] Workflow provisionné pour un client (optionnel)
- [ ] Workflow validé depuis admin (optionnel)

**Si tout est coché → Le système fonctionne ! 🎉**

---

## 🚀 **PROCHAINES ÉTAPES**

Une fois que ça fonctionne :
1. Crée des workflows plus complexes
2. Modifie le payload dans "Prepare Metrics"
3. Étends `receive-n8n-metrics` pour d'autres formats

**Le workflow est prêt et activé !** ✅




