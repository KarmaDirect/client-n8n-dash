# 🔍 Diagnostic Complet : Erreur HTML au lieu de JSON

## 🎯 **Problème**

L'API n8n retourne du HTML (`text/html; charset=utf-8`) au lieu de JSON lors du provisioning. Cela signifie que **l'URL ou la clé API est incorrecte**.

---

## ✅ **Étapes de Diagnostic**

### **Étape 1 : Vérifier la Configuration dans Supabase**

1. **Aller sur** : https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/functions
2. **Cliquer sur** : `manage-client-workflows`
3. **Settings** → **Environment variables**
4. **Vérifier** :

| Variable | Valeur Attendu | ❌ Valeur Incorrecte |
|----------|---------------|---------------------|
| `N8N_API_URL` | `https://primary-production-bdba.up.railway.app` | `https://primary-production-bdba.up.railway.app/api/v1` |
| `N8N_API_KEY` | Votre clé API n8n valide | Clé invalide ou expirée |

### **Étape 2 : Tester la Connexion avec le Script**

Utilisez le script de test pour vérifier votre configuration :

```bash
# Définir votre clé API
export N8N_API_KEY='votre-cle-api-n8n'

# Exécuter le test
./scripts/test-n8n-connection.sh
```

**Résultats attendus** :
- ✅ **HTTP 200 + Content-Type: application/json** → Configuration correcte
- ❌ **HTTP 200 + Content-Type: text/html** → Clé API invalide ou URL incorrecte
- ❌ **HTTP 401/403** → Clé API invalide
- ❌ **HTTP 404** → URL incorrecte

### **Étape 3 : Vérifier les Logs Supabase**

1. **Supabase Dashboard** → Edge Functions → `manage-client-workflows`
2. **Onglet "Logs"**
3. **Rechercher** les logs récents avec `[provision]`

**Logs attendus** (avec configuration correcte) :
```
[manage-client-workflows] n8n Base URL: https://primary-production-bdba.up.railway.app
[manage-client-workflows] n8n API Key configured: Yes
[provision] n8n URL: https://primary-production-bdba.up.railway.app/api/v1/workflows/DcbL3KktSssdT3Es
[provision] Response Content-Type: application/json, Status: 200
```

**Logs avec erreur HTML** :
```
[provision] Response Content-Type: text/html; charset=utf-8, Status: 200
[provision] Response is not JSON! Content-Type: text/html; charset=utf-8
[provision] Response body (first 500 chars): <!DOCTYPE html>...
```

---

## 🔧 **Solutions selon le Problème**

### **Problème 1 : Clé API Invalide**

**Symptômes** :
- Content-Type: `text/html`
- HTTP Status: `200`
- Réponse contient du HTML (page de connexion n8n)

**Solution** :
1. **Aller sur n8n** : https://primary-production-bdba.up.railway.app
2. **Settings** → **API**
3. **Créer une nouvelle clé API** ou vérifier l'existante
4. **Copier la clé**
5. **Mettre à jour** dans Supabase → Environment variables
6. **Redéployer** l'Edge Function

### **Problème 2 : URL Incorrecte**

**Symptômes** :
- HTTP Status: `404`
- Ou HTML au lieu de JSON

**Solution** :
Vérifier que `N8N_API_URL` dans Supabase est **exactement** :
```
https://primary-production-bdba.up.railway.app
```

**SANS** :
- `/api/v1` à la fin
- `/` à la fin
- Espaces ou caractères spéciaux

### **Problème 3 : API n8n Non Activée**

**Symptômes** :
- HTTP Status: `401` ou `403`
- "API not enabled" ou similaire

**Solution** :
1. **Aller sur n8n** : https://primary-production-bdba.up.railway.app
2. **Settings** → **API**
3. **Vérifier** que "Enable API" est activé
4. Si nécessaire, activer l'API et créer une clé

---

## 🧪 **Test Direct avec curl**

Vous pouvez aussi tester directement avec curl :

```bash
# Remplacer YOUR_API_KEY par votre vraie clé API
curl -X GET \
  'https://primary-production-bdba.up.railway.app/api/v1/workflows/DcbL3KktSssdT3Es' \
  -H 'X-N8N-API-KEY: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -v
```

**Résultat attendu** :
- `Content-Type: application/json`
- HTTP 200
- Corps JSON avec les détails du workflow

---

## 📝 **Checklist de Résolution**

- [ ] `N8N_API_URL` = `https://primary-production-bdba.up.railway.app` (sans `/api/v1`)
- [ ] `N8N_API_KEY` = Clé API valide créée depuis n8n
- [ ] API n8n activée dans Settings → API
- [ ] Script de test (`./scripts/test-n8n-connection.sh`) retourne HTTP 200 + JSON
- [ ] Edge Function redéployée après modification des variables
- [ ] Logs Supabase montrent `Content-Type: application/json`

---

**Document créé le 31 janvier 2025**




