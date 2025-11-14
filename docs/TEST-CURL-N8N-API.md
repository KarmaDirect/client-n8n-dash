# 🧪 Comment Tester l'API n8n avec curl

## 🎯 **But**

Vérifier que votre clé API n8n fonctionne correctement avant de l'utiliser dans Supabase.

---

## 📋 **Méthode 1 : Utiliser le Script Automatique**

J'ai créé un script qui fait tout pour vous :

```bash
# Dans votre terminal, depuis le dossier du projet
./scripts/test-n8n-api-curl.sh VOTRE_CLE_API_COMPLETE
```

**Exemple** :
```bash
./scripts/test-n8n-api-curl.sh eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YTg2Y2Q4ZC1jMTU2LTQxMTktOThlNy0wNDhkOTkyMjI5NjAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxNTcwMzkzfQ.WASEs8nkVKJaq-wERh8g3t4ri5HJoRvrOw_swZP9kl4
```

---

## 📋 **Méthode 2 : Commande curl Manuelle**

### **Étape 1 : Obtenir votre Clé API**

1. **Allez sur** : https://primary-production-bdba.up.railway.app
2. **Settings** → **API**
3. **Copiez votre clé API** complète (ou créez-en une nouvelle)

### **Étape 2 : Exécuter la Commande curl**

**Ouvrez votre terminal** et tapez :

```bash
curl -X GET \
  'https://primary-production-bdba.up.railway.app/api/v1/workflows/DcbL3KktSssdT3Es' \
  -H 'X-N8N-API-KEY: VOTRE_CLE_API_COMPLETE' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -v
```

**Remplacez `VOTRE_CLE_API_COMPLETE`** par votre vraie clé API.

### **Étape 3 : Interpréter le Résultat**

#### ✅ **Si ça fonctionne** :

Vous verrez quelque chose comme :
```
HTTP/1.1 200 OK
Content-Type: application/json

{"id":"DcbL3KktSssdT3Es","name":"Hello World Test",...}
```

**Cela signifie** :
- ✅ Votre clé API fonctionne
- ✅ L'URL est correcte
- ✅ Le problème est dans Supabase (probablement la clé n'est pas la même)

#### ❌ **Si ça ne fonctionne pas** :

**HTML au lieu de JSON** :
```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<!DOCTYPE html> <html lang="en">...
```

**Causes possibles** :
- La clé API est invalide
- L'API publique n'est pas activée dans n8n
- La clé a expiré

**Erreur 401/403** :
```
HTTP/1.1 401 Unauthorized
```

**Causes possibles** :
- La clé API est incorrecte
- La clé n'a pas les bonnes permissions

**Erreur 404** :
```
HTTP/1.1 404 Not Found
```

**Causes possibles** :
- Le workflow n'existe pas
- L'URL est incorrecte

---

## 🔍 **Test avec Affichage Détaillé**

Pour voir tous les détails (recommandé pour le diagnostic) :

```bash
curl -X GET \
  'https://primary-production-bdba.up.railway.app/api/v1/workflows/DcbL3KktSssdT3Es' \
  -H 'X-N8N-API-KEY: VOTRE_CLE_API_COMPLETE' \
  -H 'Accept: application/json' \
  -i
```

Le flag `-i` affiche tous les headers de réponse.

---

## 🔧 **Si le Test curl Fonctionne mais pas Supabase**

Si curl retourne du JSON mais Supabase retourne du HTML :

1. **Vérifiez que la clé dans Supabase est identique** :
   - Comparez caractère par caractère
   - Pas d'espaces en début/fin
   - Pas de saut de ligne

2. **Vérifiez dans les logs Supabase** :
   - Le préfixe de la clé affiché
   - L'URL exacte utilisée

3. **Redéployez l'Edge Function** après avoir modifié la clé

---

## 📝 **Exemple Complet**

```bash
# 1. Obtenir la clé API depuis n8n
# Settings → API → Copier la clé

# 2. Tester (remplacer YOUR_KEY par votre clé)
curl -X GET \
  'https://primary-production-bdba.up.railway.app/api/v1/workflows/DcbL3KktSssdT3Es' \
  -H 'X-N8N-API-KEY: YOUR_KEY' \
  -H 'Accept: application/json' \
  -i

# 3. Si ça fonctionne, copier la MÊME clé dans Supabase
# Supabase → Functions → manage-client-workflows → Settings → Environment variables
```

---

**Document créé le 31 janvier 2025**






