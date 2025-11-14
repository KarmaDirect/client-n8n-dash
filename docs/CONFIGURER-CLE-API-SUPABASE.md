# ✅ Configuration de la Clé API n8n dans Supabase

## 🎯 **Clé API à Configurer**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YTg2Y2Q4ZC1jMTU2LTQxMTktOThlNy0wNDhkOTkyMjI5NjAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxNzgyMTgwfQ.YdeKdFxqGDqo7gA2qxYNsTEMLrDm-0whk4UY0czeEMk
```

✅ **Testée et fonctionnelle** : Cette clé retourne bien du JSON avec l'API n8n.

---

## 📋 **Étapes pour Configurer dans Supabase**

### **Étape 1 : Accéder à la Fonction**

1. **Ouvrez** : https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/functions
2. **Cliquez sur** : `manage-client-workflows`

### **Étape 2 : Accéder aux Variables d'Environnement**

1. Dans la page de la fonction, **cliquez sur** : **"Settings"** (en haut)
2. **Scrollez jusqu'à** : **"Environment variables"**
3. **Cherchez** la variable `N8N_API_KEY`

### **Étape 3 : Mettre à Jour la Clé API**

#### **Option A : Si la variable existe déjà**

1. **Cliquez sur l'icône ✏️ (Edit)** à côté de `N8N_API_KEY`
2. **Remplacez** la valeur actuelle par :
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YTg2Y2Q4ZC1jMTU2LTQxMTktOThlNy0wNDhkOTkyMjI5NjAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxNzgyMTgwfQ.YdeKdFxqGDqo7gA2qxYNsTEMLrDm-0whk4UY0czeEMk
   ```
3. **Cliquez sur** : **"Save"** ou **"Update"**

#### **Option B : Si la variable n'existe pas**

1. **Cliquez sur** : **"Add new secret"**
2. **Nom** : `N8N_API_KEY`
3. **Valeur** : 
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YTg2Y2Q4ZC1jMTU2LTQxMTktOThlNy0wNDhkOTkyMjI5NjAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxNzgyMTgwfQ.YdeKdFxqGDqo7gA2qxYNsTEMLrDm-0whk4UY0czeEMk
   ```
4. **Cliquez sur** : **"Save"**

### **Étape 4 : Vérifier N8N_API_URL**

Assurez-vous que `N8N_API_URL` est configuré ainsi :

**✅ Correct** :
```
https://primary-production-bdba.up.railway.app
```

**❌ Incorrect** :
```
https://primary-production-bdba.up.railway.app/api/v1
https://primary-production-bdba.up.railway.app/
```

### **Étape 5 : Redéployer la Fonction (OBLIGATOIRE)**

⚠️ **CRITIQUE** : Après avoir modifié les variables, vous **DEVEZ** redéployer la fonction !

1. **Cliquez sur** : **"Redeploy"** (en haut de la page)
   - OU
2. Allez dans l'onglet **"Code"** → **"Deploy"**

**Sans redéploiement, les nouvelles variables ne seront pas disponibles !**

---

## ✅ **Vérification**

Une fois configuré et redéployé :

1. **Allez sur** : `/app/admin/workflows`
2. **Sélectionnez un client** (ex: `hatim.moro.2002@gmail.com`)
3. **Onglet "Start"**
4. **Cochez "Hello World Test"**
5. **Cliquez "Provisionner (1)"**

**Résultat attendu** :
- ✅ Toast : "✅ Provisioning réussi - 1 workflows copiés, 1 activés"
- ❌ Plus d'erreur "unauthorized" ou "HTML"

---

## 🔍 **Si ça Ne Marche Toujours Pas**

Vérifiez les logs Supabase :
1. **Supabase Dashboard** → Edge Functions → `manage-client-workflows`
2. **Onglet "Logs"**
3. **Cherchez** :
   ```
   [manage-client-workflows] API Key prefix: eyJhbGciOiJIUzI1NiIs...
   ```

Le préfixe devrait correspondre à celui de votre nouvelle clé.

---

**Document créé le 31 janvier 2025**






