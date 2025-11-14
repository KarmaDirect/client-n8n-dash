# ✅ Workflow "Webhook Test → Send Metrics to SaaS" - PRÊT

## 🎯 **CE QUI A ÉTÉ FAIT PAR L'ASSISTANT**

✅ **Workflow créé dans n8n** : `VqlDtuCWSztdPCVY`
- Nom : "Webhook Test → Send Metrics to SaaS"
- 4 nodes configurés correctement
- Webhook path : `webstate/test`

✅ **Template ajouté dans Supabase**
- ID : `e6c9483f-4a16-43a6-b300-5cedb9e4fdcf`
- Pack : start
- Actif : Oui

✅ **Edge Function déployée**
- Nom : `receive-n8n-metrics`
- Endpoint : `https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/receive-n8n-metrics`
- Version : 1

✅ **Documentation créée**
- `docs/CONFIGURATION-RAPIDE-WORKFLOW-TEST.md`
- `docs/SETUP-COMPLET-WORKFLOW-TEST.md`
- `docs/VARIABLES-N8N-ENV-VS-VARS.md`

---

## ⚠️ **ACTIONS RESTANTES (2 minutes)**

### **1. Configurer les variables dans Railway**

1. Va sur **Railway Dashboard** → Ton projet n8n
2. Onglet **Variables**
3. Ajoute ces 2 variables :

```
N8N_METRICS_URL=https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/receive-n8n-metrics
N8N_API_KEY=webstate-test-secret-2025-xyz123
```

4. **Redémarre le service n8n** (clique "Redeploy" dans Railway)

### **2. Configurer le secret dans Supabase**

1. Va dans **Supabase Dashboard** → **Edge Functions** → `receive-n8n-metrics`
2. Clique **Settings** (⚙️)
3. Section **Secrets**
4. Clique **Add secret** :
   - **Nom** : `N8N_METRICS_API_KEY`
   - **Valeur** : `webstate-test-secret-2025-xyz123` ⚠️ **MÊME VALEUR QUE N8N_API_KEY !**
5. Clique **Save**

### **3. Activer le workflow dans n8n**

**Option A : Via l'interface n8n**
1. Va dans n8n → Workflows
2. Ouvre "Webhook Test → Send Metrics to SaaS"
3. Clique sur le toggle **Active** (en haut à droite)

**Option B : Via API (script)**
```bash
# Utilise le script fourni
cd scripts
chmod +x activate-workflow-test.sh
export N8N_API_KEY="ta-cle-api"
./activate-workflow-test.sh
```

---

## 🧪 **TEST RAPIDE**

Une fois les 3 actions ci-dessus faites :

### **1. Récupérer l'UUID de l'organisation**

Dans Supabase SQL Editor :
```sql
SELECT id, name FROM organizations LIMIT 1;
```

### **2. Tester le webhook**

```bash
curl -X POST 'https://primary-production-bdba.up.railway.app/webhook/webstate/test' \
  -H 'Content-Type: application/json' \
  -d '{
    "orgId": "UUID-ORG-ICI",
    "workflowKey": "Webhook Test"
  }'
```

**Réponse attendue** :
```json
{
  "message": "✅ Workflow exécuté et métriques envoyées à WebState.",
  "payloadSent": { ... }
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

### ❌ Si erreur 401 :
- Le secret n'est pas configuré dans Supabase
- Vérifie que `N8N_METRICS_API_KEY` = `N8N_API_KEY`

### ❌ Si "Workflow not found" :
- Vérifie que `orgId` = UUID réel de l'organisation
- Vérifie que le workflow a été provisionné pour cette organisation

---

## 📝 **PROVISIONNER POUR UN CLIENT**

Pour provisionner le workflow pour un client depuis le SaaS :

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

---

## ✅ **CHECKLIST FINALE**

- [ ] Variables configurées dans Railway (`N8N_METRICS_URL`, `N8N_API_KEY`)
- [ ] Secret configuré dans Supabase (`N8N_METRICS_API_KEY`)
- [ ] Service n8n redémarré
- [ ] Workflow activé dans n8n (toggle ON)
- [ ] Test curl retourne le JSON attendu
- [ ] Log visible dans `workflow_execution_logs`

**Si tout est coché → Le système fonctionne ! 🎉**

---

## 🚀 **STATUT**

Le workflow est **PRÊT** côté code. Il reste juste à :
1. Configurer les variables (Railway + Supabase)
2. Activer le workflow dans n8n

**C'est tout ! 2 minutes et c'est bon.** ⏱️






