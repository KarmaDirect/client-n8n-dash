# 🔧 Fix : Erreur "L'API n8n a retourné du text/html au lieu de JSON"

## ❌ **Problème**

Erreur lors du provisioning :
```
L'API n8n a retourné du text/html; charset=utf-8 au lieu de JSON. 
Vérifiez N8N_API_URL et N8N_API_KEY. 
Réponse: <!DOCTYPE html> <html lang="en"> ...
```

**Cause** : n8n retourne une page HTML au lieu d'une réponse JSON API. Cela signifie que :
- L'URL pointe vers l'interface web au lieu de l'API
- OU la clé API est invalide et n8n redirige vers l'interface web
- OU l'endpoint API n'existe pas

---

## ✅ **Solution : Vérifier la Configuration Supabase**

### **Étape 1 : Vérifier les Variables d'Environnement**

1. **Aller sur** : https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/functions
2. **Cliquer sur** : `manage-client-workflows`
3. **Aller dans** : **Settings** → **Environment variables**

### **Étape 2 : Vérifier `N8N_API_URL`**

⚠️ **IMPORTANT** : L'URL doit être configurée **SANS** `/api/v1` à la fin.

- ✅ **Correct** : `https://primary-production-bdba.up.railway.app`
- ❌ **Incorrect** : `https://primary-production-bdba.up.railway.app/api/v1`
- ❌ **Incorrect** : `https://primary-production-bdba.up.railway.app/`

**Le code ajoute automatiquement `/api/v1/workflows/...`**

### **Étape 3 : Vérifier `N8N_API_KEY`**

1. **Connectez-vous à n8n** : https://primary-production-bdba.up.railway.app
2. **Allez dans** : Settings → API
3. **Créez ou copiez** une clé API valide
4. **Collez-la dans** Supabase → Environment variables

### **Étape 4 : Redéployer l'Edge Function**

⚠️ **CRITIQUE** : Après avoir modifié les variables, **redéployez** :

1. Dans Supabase Dashboard → `manage-client-workflows`
2. Cliquez sur **"Redeploy"** ou allez dans l'onglet **"Code"** → **"Deploy"**

**Sans redéploiement, les nouvelles variables ne seront pas disponibles !**

---

## 🧪 **Test de Vérification**

### **Test 1 : Vérifier l'Accès API Directement**

Tester l'API n8n directement avec curl :

```bash
curl -X GET \
  'https://primary-production-bdba.up.railway.app/api/v1/workflows/DcbL3KktSssdT3Es' \
  -H 'X-N8N-API-KEY: VOTRE_CLE_API_ICI' \
  -H 'Content-Type: application/json'
```

**Résultat attendu** :
- ✅ **JSON** (objet workflow) → Configuration correcte
- ❌ **HTML** → Clé API invalide ou URL incorrecte

### **Test 2 : Tester le Provisioning**

1. Allez sur : `/app/admin/workflows`
2. Sélectionnez un client (ex: `hatim.moro.2002@gmail.com`)
3. Onglet **"Start"**
4. Cochez **"Hello World Test"**
5. Cliquez **"Provisionner (1)"**

**Résultat attendu** :
- ✅ Toast : "✅ Provisioning réussi - 1 workflows copiés, 1 activés"
- ❌ Erreur HTML → Continuer le diagnostic

---

## 🔍 **Diagnostic Avancé : Vérifier les Logs**

1. **Supabase Dashboard** → Edge Functions → `manage-client-workflows`
2. **Onglet "Logs"**
3. **Recherchez** les logs récents avec `[provision]`

**Logs utiles** :
```
[manage-client-workflows] n8n Base URL: https://primary-production-bdba.up.railway.app
[manage-client-workflows] n8n API Key configured: Yes
[provision] n8n URL: https://primary-production-bdba.up.railway.app/api/v1/workflows/DcbL3KktSssdT3Es
[provision] Response Content-Type: application/json, Status: 200
```

**Si vous voyez** :
```
[provision] Response Content-Type: text/html, Status: 200
```
→ Cela confirme que l'URL ou la clé API est incorrecte.

---

## 🎯 **Configuration Finale Correcte**

### **Dans Supabase Edge Functions** :

| Variable | Valeur |
|----------|--------|
| `N8N_API_URL` | `https://primary-production-bdba.up.railway.app` |
| `N8N_API_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (votre clé) |

### **URLs Générées par le Code** :

- **Fetch workflow** : `${N8N_API_URL}/api/v1/workflows/${id}` 
  → `https://primary-production-bdba.up.railway.app/api/v1/workflows/DcbL3KktSssdT3Es`
- **Create workflow** : `${N8N_API_URL}/api/v1/workflows`
  → `https://primary-production-bdba.up.railway.app/api/v1/workflows`

---

## 📝 **Checklist de Correction**

- [ ] Vérifier que `N8N_API_URL` est **SANS** `/api/v1`
- [ ] Vérifier que `N8N_API_KEY` est valide (créée depuis n8n Settings → API)
- [ ] Redéployer l'Edge Function après modification des variables
- [ ] Tester l'API directement avec curl
- [ ] Vérifier les logs Supabase si erreur persiste

---

**Document créé le 31 janvier 2025**




