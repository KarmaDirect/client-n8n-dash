# 🔧 Fix : Variables d'Environnement Edge Function

## ❌ Problème Actuel

Erreur : `Failed to fetch template: {"message":"not found"}`

**Cause probable** : Les variables `N8N_API_URL` et `N8N_API_KEY` ne sont pas configurées dans Supabase Edge Functions.

---

## ✅ Solution : Configurer les Variables

### **Étape 1 : Aller sur Supabase Dashboard**

1. Ouvrez : https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/functions
2. Cliquez sur **`manage-client-workflows`**

### **Étape 2 : Ajouter les Variables d'Environnement**

1. Dans la page de la fonction, cliquez sur **"Settings"** (paramètres)
2. Scroll jusqu'à **"Environment variables"**
3. Cliquez sur **"Add new secret"** pour chaque variable :

#### **Variable 1 : N8N_API_URL**
- **Name** : `N8N_API_URL`
- **Value** : `https://primary-production-bdba.up.railway.app`
  - ⚠️ **Important** : SANS `/api/v1` à la fin (je l'ai corrigé dans le code)

#### **Variable 2 : N8N_API_KEY**
- **Name** : `N8N_API_KEY`
- **Value** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YTg2Y2Q4ZC1jMTU2LTQxMTktOThlNy0wNDhkOTkyMjI5NjAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxNTcwMzkzfQ.WASEs8nkVKJaq-wERh8g3t4ri5HJoRvrOw_swZP9kl4`

### **Étape 3 : Redéployer la Fonction (Important !)**

Après avoir ajouté les variables, vous devez redéployer :

1. Cliquez sur **"Redeploy"** ou **"Deploy"**
2. Ou allez dans l'onglet **"Code"** et cliquez sur **"Deploy"**

**⚠️ Sans redéploiement, les nouvelles variables ne seront pas disponibles !**

---

## 🧪 Vérification

### **Test 1 : Vérifier que les variables sont là**

Dans Supabase Dashboard → Settings → Environment variables :
- ✅ `N8N_API_URL` = `https://primary-production-bdba.up.railway.app`
- ✅ `N8N_API_KEY` = `eyJhbGc...` (masqué)

### **Test 2 : Tester le Provisioning**

1. Allez sur http://127.0.0.1:8081/admin/workflows
2. Sélectionnez un client
3. Cochez "Hello World Test"
4. Cliquez "Provisionner"

**Résultat attendu** :
- ✅ Toast : "✅ Provisioning réussi - 1 workflows copiés, 1 activés"
- ❌ Plus d'erreur "Failed to fetch template"

---

## 🔍 Si Ça Ne Marche Toujours Pas

### **Vérifier les Logs**

1. Supabase Dashboard → Edge Functions → `manage-client-workflows`
2. Onglet **"Logs"**
3. Regardez les erreurs récentes

**Erreurs possibles** :
- `N8N_API_URL or N8N_API_KEY not configured` → Variables pas configurées
- `Failed to fetch template: 404` → URL incorrecte ou clé API invalide
- `Failed to fetch template: 401` → Clé API invalide

### **Tester l'API n8n Directement**

Je peux tester pour vous avec MCP n8n pour confirmer que l'API fonctionne.

---

## 📝 Résumé

**Action requise** :
1. ✅ Configurer `N8N_API_URL` dans Supabase (SANS `/api/v1`)
2. ✅ Configurer `N8N_API_KEY` dans Supabase
3. ✅ Redéployer l'Edge Function
4. ✅ Réessayer le provisioning

**Code corrigé** : J'ai déjà corrigé l'Edge Function pour normaliser l'URL (enlever `/api/v1` si présent).

---

**Document créé le 29 janvier 2025**







