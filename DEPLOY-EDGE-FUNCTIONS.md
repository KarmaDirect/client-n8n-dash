# 🚀 Guide de déploiement des Edge Functions

## **Méthode 1 : Via le Dashboard Supabase (RECOMMANDÉ - 5 min)**

### **Étape 1 : Créer la fonction `provision-workflow-pack`**

1. Aller sur https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/functions
2. Cliquer **"Create a new function"**
3. **Nom** : `provision-workflow-pack`
4. **Code** : Copier-coller le contenu de `supabase/functions/provision-workflow-pack/index.ts`
5. Cliquer **"Deploy"**

### **Étape 2 : Créer la fonction `configure-workflow-credentials`**

1. Cliquer **"Create a new function"**
2. **Nom** : `configure-workflow-credentials`
3. **Code** : Copier-coller le contenu de `supabase/functions/configure-workflow-credentials/index.ts`
4. Cliquer **"Deploy"**

### **Étape 3 : Créer la fonction `track-workflow-execution`**

1. Cliquer **"Create a new function"**
2. **Nom** : `track-workflow-execution`
3. **Code** : Copier-coller le contenu de `supabase/functions/track-workflow-execution/index.ts`
4. Cliquer **"Deploy"**

---

## **Méthode 2 : Via le CLI Supabase**

### **Prérequis**

```bash
# 1. Installer le Supabase CLI
npm install -g supabase

# 2. Se connecter
supabase login

# Tu vas recevoir un lien dans le terminal, le coller dans le navigateur
# Cela va authentifier le CLI
```

### **Déployer les fonctions**

```bash
cd /Users/yasminemoro/Documents/client-n8n-dash

# Déployer chaque fonction
supabase functions deploy provision-workflow-pack --project-ref ijybwfdkiteebytdwhyu
supabase functions deploy configure-workflow-credentials --project-ref ijybwfdkiteebytdwhyu
supabase functions deploy track-workflow-execution --project-ref ijybwfdkiteebytdwhyu
```

---

## ⚙️ **Variables d'environnement requises**

Chaque fonction a besoin de ces variables dans le dashboard Supabase :

### **Variables communes**
- `SUPABASE_URL` : `https://ijybwfdkiteebytdwhyu.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` : Trouvable dans Dashboard → Settings → API

### **Variables pour `provision-workflow-pack` et `configure-workflow-credentials`**
- `N8N_API_URL` : `https://primary-production-bdba.up.railway.app/api/v1`
- `N8N_API_KEY` : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YTg2Y2Q4ZC1jMTU2LTQxMTktOThlNy0wNDhkOTkyMjI5NjAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxNTcwMzkzfQ.WASEs8nkVKJaq-wERh8g3t4ri5HJoRvrOw_swZP9kl4`

### **Comment ajouter les variables**

1. Aller sur https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/functions
2. Cliquer sur une fonction (ex: `provision-workflow-pack`)
3. Cliquer sur **"Settings"** → **"Environment variables"**
4. Ajouter chaque variable :
   - Cliquer **"Add new secret"**
   - Nom : `N8N_API_URL`, Valeur : `https://primary-production-bdba.up.railway.app/api/v1`
   - Cliquer **"Add new secret"**
   - Nom : `N8N_API_KEY`, Valeur : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Répéter pour toutes les variables

---

## ✅ **Vérification**

Après déploiement, vérifier que les fonctions apparaissent dans :
https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/functions

Tu devrais voir :
- ✅ `provision-workflow-pack`
- ✅ `configure-workflow-credentials`
- ✅ `track-workflow-execution`

---

## 🧪 **Test rapide (optionnel)**

Une fois déployée, tester `track-workflow-execution` :

```bash
curl -X POST \
  'https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/track-workflow-execution' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "workflow_id": "test-uuid",
    "n8n_execution_id": "test-exec-123",
    "status": "success",
    "started_at": "2025-01-27T10:00:00Z",
    "finished_at": "2025-01-27T10:00:05Z"
  }'
```

Si tu reçois une erreur de `workflow_id` introuvable, c'est normal → la fonction fonctionne !

---

## 📝 **Résumé**

**Temps estimé** : 10-15 minutes

**Ordre** :
1. Copier-coller les 3 fichiers dans le dashboard Supabase
2. Ajouter les variables d'environnement
3. Vérifier que les fonctions sont actives
4. Tester le système dans l'interface admin

---

## 🎯 **Après le déploiement**

Tu pourras alors :
- ✅ Provisionner des workflows pour tes clients via `/admin/provision-workflow`
- ✅ Configurer automatiquement les credentials
- ✅ Track toutes les exécutions en temps réel
- ✅ Voir les métriques côté client sur `/app`

