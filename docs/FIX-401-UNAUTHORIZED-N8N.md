# 🔧 Résolution : Erreur 401 Unauthorized avec n8n API

## ❌ **Problème Identifié**

Le test curl retourne :
```
HTTP/2 401 
Content-Type: application/json
{"message":"unauthorized"}
```

**Signification** : La clé API est invalide ou n'a pas les bonnes permissions.

---

## ✅ **Solution : Créer/Obtenir une Clé API Valide**

### **Étape 1 : Accéder aux Paramètres API de n8n**

1. **Ouvrez** : https://primary-production-bdba.up.railway.app
2. **Connectez-vous** à votre compte n8n
3. **Allez dans** : **Settings** → **API** (ou **API Keys**)

### **Étape 2 : Vérifier que l'API Publique est Activée**

1. Dans la page **Settings → API**, vérifiez que :
   - ✅ **"Public API"** ou **"Enable Public API"** est activé
   - ✅ Vous voyez une section pour créer/gérer les clés API

### **Étape 3 : Créer une Nouvelle Clé API**

1. **Cliquez sur** **"Create API Key"** ou **"New API Key"**
2. **Nommez-la** (ex: "Supabase Integration")
3. **Copiez la clé générée** (⚠️ **IMPORTANT** : C'est la seule fois où vous pouvez la voir!)
   - La clé ressemble à : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YTg2Y2Q4ZC1jMTU2LTQxMTktOThlNy0wNDhkOTkyMjI5NjAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxNTcwMzkzfQ.WASEs8nkVKJaq-wERh8g3t4ri5HJoRvrOw_swZP9kl4`
   - C'est un JWT très long (150+ caractères)

### **Étape 4 : Tester la Nouvelle Clé**

```bash
curl -X GET \
  'https://primary-production-bdba.up.railway.app/api/v1/workflows/DcbL3KktSssdT3Es' \
  -H 'X-N8N-API-KEY: NOUVELLE_CLE_API' \
  -H 'Accept: application/json' \
  -v
```

**Résultat attendu** :
- ✅ HTTP 200
- ✅ Content-Type: application/json
- ✅ Réponse JSON avec les détails du workflow

### **Étape 5 : Configurer dans Supabase**

1. **Aller sur** : https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/functions
2. **Cliquer sur** : `manage-client-workflows`
3. **Settings** → **Environment variables**
4. **Modifier** `N8N_API_KEY` :
   - Supprimer l'ancienne valeur
   - Coller la **nouvelle clé API complète**
   - ⚠️ Pas d'espaces, pas de saut de ligne
5. **Redéployer** la fonction

---

## 🔍 **Vérifications Supplémentaires**

### **Vérifier les Permissions de la Clé API**

Dans n8n Settings → API, vérifiez que votre clé API a :
- ✅ Accès aux workflows (read/write)
- ✅ Pas de restrictions de scope

### **Si l'API Publique n'est pas Activée**

Si vous ne voyez pas l'option pour créer une clé API :

1. **Vérifiez la version de n8n** : L'API publique nécessite n8n version 0.198.0 ou supérieure
2. **Vérifiez les variables d'environnement** de votre instance n8n :
   - `N8N_PUBLIC_API_DISABLED` ne doit **pas** être défini à `true`
   - Ou définissez `N8N_PUBLIC_API_ENABLED=true`

---

## 📝 **Checklist de Résolution**

- [ ] Créé une nouvelle clé API dans n8n Settings → API
- [ ] Testé avec curl → HTTP 200 + JSON (pas 401)
- [ ] Copié la clé complète (150+ caractères)
- [ ] Collé dans Supabase → Environment variables → N8N_API_KEY
- [ ] Vérifié qu'il n'y a pas d'espaces avant/après
- [ ] Redéployé l'Edge Function dans Supabase
- [ ] Testé le provisioning à nouveau

---

## 🧪 **Commande de Test Finale**

Une fois la clé configurée dans Supabase, testez à nouveau :

```bash
# Avec votre nouvelle clé
curl -X GET \
  'https://primary-production-bdba.up.railway.app/api/v1/workflows/DcbL3KktSssdT3Es' \
  -H 'X-N8N-API-KEY: VOTRE_NOUVELLE_CLE' \
  -H 'Accept: application/json' \
  -i
```

Si vous obtenez **HTTP 200 + JSON**, alors :
1. ✅ La clé fonctionne
2. Configurez la **même clé** dans Supabase
3. Redéployez la fonction
4. Le provisioning devrait fonctionner !

---

**Document créé le 31 janvier 2025**




