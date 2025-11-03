# 🔍 Guide Complet de Diagnostic : Erreur HTML au lieu de JSON

## ❌ **Problème Persistant**

n8n retourne toujours `text/html; charset=utf-8` au lieu de `application/json`, même après configuration de `N8N_API_KEY`.

---

## ✅ **Vérifications à Faire Maintenant**

### **1. Vérifier les Logs Supabase (CRUCIAL)**

Après avoir tenté le provisioning, allez dans :
- **Supabase Dashboard** → Edge Functions → `manage-client-workflows` → **Logs**

**Cherchez ces lignes** :
```
[manage-client-workflows] API Key prefix: eyJhbGciOiJIUzI1NiIs...
[provision] Making request to: https://primary-production-bdba.up.railway.app/api/v1/workflows/DcbL3KktSssdT3Es
[provision] Headers: X-N8N-API-KEY present: true
[provision] Response headers: { content-type: 'text/html; charset=utf-8', status: 200 }
```

**Comparez** :
- Le préfixe de la clé API dans les logs avec votre vraie clé API
- Si elles ne correspondent pas → La clé dans Supabase est différente !

---

### **2. Vérifier la Clé API dans Supabase**

1. **Aller sur** : https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/functions
2. **Cliquer** : `manage-client-workflows`
3. **Settings** → **Environment variables**
4. **Vérifier** que `N8N_API_KEY` correspond **exactement** à la clé créée dans n8n

**Comment obtenir la bonne clé** :
1. **Aller sur n8n** : https://primary-production-bdba.up.railway.app
2. **Settings** → **API**
3. **Créer une nouvelle clé API** (ou noter l'existante)
4. **Copier la clé COMPLÈTE**
5. **Coller dans Supabase** (sans espaces, sans saut de ligne)

---

### **3. Tester l'API n8n Directement avec curl**

**Dans votre terminal** :

```bash
# Remplacez YOUR_API_KEY par votre vraie clé API depuis n8n Settings → API
curl -X GET \
  'https://primary-production-bdba.up.railway.app/api/v1/workflows/DcbL3KktSssdT3Es' \
  -H 'X-N8N-API-KEY: YOUR_API_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -v
```

**Résultats possibles** :
- ✅ **JSON** → La clé fonctionne, problème dans Supabase
- ❌ **HTML** → La clé est invalide ou l'URL est incorrecte
- ❌ **401/403** → La clé n'a pas les bonnes permissions

---

### **4. Vérifier que l'API Publique est Activée dans n8n**

1. **Aller sur n8n** : https://primary-production-bdba.up.railway.app
2. **Settings** → **API**
3. **Vérifier** :
   - ✅ "Public API" est activé
   - ✅ Votre clé API existe et est active
   - ✅ La clé n'est pas expirée

---

### **5. Vérifier l'URL dans Supabase**

Dans Supabase → Environment variables → `N8N_API_URL` :

**✅ Correct** :
```
https://primary-production-bdba.up.railway.app
```

**❌ Incorrect** :
```
https://primary-production-bdba.up.railway.app/api/v1
https://primary-production-bdba.up.railway.app/
http://primary-production-bdba.up.railway.app
```

---

## 🔧 **Solution la Plus Probable**

Le problème est **très probablement** que la clé API dans Supabase ne correspond pas à celle créée dans n8n.

### **Étapes pour Corriger** :

1. **Dans n8n** : Settings → API → Créer une **nouvelle** clé API
2. **Copier la clé COMPLÈTE** (souvent un JWT très long)
3. **Dans Supabase** : 
   - Edge Functions → `manage-client-workflows`
   - Settings → Environment variables
   - **Supprimer** l'ancienne `N8N_API_KEY`
   - **Ajouter** la nouvelle avec le même nom
   - **Coller la clé COMPLÈTE** (sans espaces)
4. **Redéployer** la fonction
5. **Tester** à nouveau

---

## 🧪 **Test Rapide avec le Script**

Utilisez le script que j'ai créé :

```bash
export N8N_API_KEY='votre-cle-api-complete-depuis-n8n'
./scripts/test-n8n-connection.sh
```

Si ce script fonctionne mais pas Supabase → La clé dans Supabase est différente.

---

## 📝 **Checklist de Résolution**

- [ ] Clé API copiée **directement** depuis n8n Settings → API
- [ ] Clé API **collée complètement** dans Supabase (sans troncature)
- [ ] `N8N_API_URL` = `https://primary-production-bdba.up.railway.app` (sans `/api/v1`)
- [ ] Edge Function **redéployée** après modification
- [ ] Test curl direct retourne du JSON (pas du HTML)
- [ ] Logs Supabase montrent le même préfixe de clé que votre vraie clé

---

**Après avoir fait toutes ces vérifications, les logs Supabase vous donneront la réponse exacte !**

**Document créé le 31 janvier 2025**




