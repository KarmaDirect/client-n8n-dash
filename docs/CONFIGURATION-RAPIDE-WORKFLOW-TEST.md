# ⚡ Configuration Rapide - Workflow Test

## ✅ **CE QUI EST DÉJÀ FAIT**

- ✅ Workflow créé dans n8n : `VqlDtuCWSztdPCVY`
- ✅ Edge Function déployée : `receive-n8n-metrics`
- ✅ Template ajouté dans Supabase

---

## 🔑 **ÉTAPE 1 : Configurer les Secrets (2 minutes)**

### **1.1 Générer un secret API**

Génère un secret fort (ex: `webstate-metrics-secret-2025`)

```bash
# Ou utilise un générateur en ligne
# Exemple : https://randomkeygen.com/
```

### **1.2 Ajouter dans n8n (Variables d'environnement système)**

⚠️ **IMPORTANT** : Le workflow utilise `$env` (variables d'environnement système), pas `$vars` (qui nécessitent Enterprise).

**Si tu utilises Railway (comme actuellement) :**

1. Va dans **Railway → Ton projet n8n → Variables**
2. Ajoute 2 variables d'environnement :
   - **Nom** : `N8N_METRICS_URL`
     - **Valeur** : `https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/receive-n8n-metrics`
   - **Nom** : `N8N_API_KEY`
     - **Valeur** : `[TON_SECRET_GÉNÉRÉ]` (ex: `webstate-metrics-secret-2025`)
3. **Redémarre le service n8n** pour que les variables soient chargées

**Alternative : Si tu as un `.env` file local :**

Ajoute dans ton fichier `.env` n8n :
```
N8N_METRICS_URL=https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/receive-n8n-metrics
N8N_API_KEY=webstate-metrics-secret-2025
```

### **1.3 Ajouter dans Supabase**

1. Va dans Supabase → **Edge Functions → receive-n8n-metrics**
2. Clique **Settings** (⚙️)
3. Section **Secrets**
4. Clique **Add secret**
5. **Nom** : `N8N_METRICS_API_KEY`
6. **Valeur** : `[MÊME_SECRET_QUE_N8N]` ⚠️ **MÊME VALEUR !**
7. Clique **Save**

---

## 🧪 **ÉTAPE 2 : Tester (5 minutes)**

### **2.1 Activer le workflow dans n8n**

1. Va dans n8n → Workflows
2. Ouvre "Webhook Test → Send Metrics to SaaS"
3. Active le workflow (toggle ON en haut à droite)
4. Note l'URL du webhook (Production) :
   ```
   https://primary-production-bdba.up.railway.app/webhook/webstate/test
   ```

### **2.2 Provisionner pour un client test**

1. Va sur `/app/admin/workflows`
2. Sélectionne un client
3. Onglet **Start**
4. Coche **"Webhook Test → Send Metrics to SaaS"**
5. Clique **Provisionner (1)**
6. ✅ Vérifie le badge orange "🟠 En attente validation"

### **2.3 Valider le workflow**

1. Dans n8n, ouvre le workflow du client (il devrait avoir le préfixe du client)
2. Active-le dans n8n
3. Retourne sur `/app/admin/workflows`
4. Clique **Valider** (bouton vert)
5. ✅ Le badge passe à "🟢 ON"

### **2.4 Tester l'exécution**

**Récupère l'UUID de l'organisation** :
```sql
-- Dans Supabase SQL Editor
SELECT id, name FROM organizations LIMIT 1;
```

**Test avec curl** :
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
    "orgId": "...",
    "workflowKey": "Webhook Test",
    "status": "ok",
    "itemsProcessed": 5,
    "durationMs": 342,
    ...
  }
}
```

### **2.5 Vérifier dans Supabase**

Va dans **Table Editor → workflow_execution_logs** :
- Tu devrais voir une nouvelle entrée avec les métriques

---

## 🐛 **DÉPANNAGE**

### **Erreur 401 Unauthorized**

- Vérifie que `N8N_METRICS_API_KEY` (Supabase) = `N8N_API_KEY` (n8n)
- Vérifie que les secrets sont bien sauvegardés

### **Workflow not found**

- Vérifie que `orgId` dans le curl = UUID réel de l'organisation
- Vérifie que le nom du workflow dans Supabase contient "Webhook Test"

### **Edge Function error**

1. Va dans **Supabase → Edge Functions → receive-n8n-metrics → Logs**
2. Regarde les erreurs détaillées

---

## ✅ **CHECKLIST FINALE**

- [ ] Variables n8n configurées (`N8N_METRICS_URL`, `N8N_API_KEY`)
- [ ] Secret Supabase configuré (`N8N_METRICS_API_KEY`)
- [ ] Workflow activé dans n8n
- [ ] Template provisionné pour un client
- [ ] Workflow validé depuis `/app/admin/workflows`
- [ ] Test curl retourne un JSON avec `message: "✅ Workflow exécuté..."`
- [ ] Log visible dans `workflow_execution_logs`

**Si tout est coché → Le système fonctionne ! 🎉**

