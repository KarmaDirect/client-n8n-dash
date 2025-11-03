# 📚 Explication : Documentation API n8n

## 🎯 **Qu'est-ce que cette page ?**

La page que vous avez consultée est la **documentation de l'API publique n8n** (OpenAPI/Swagger).

### **Utilité**

Cette documentation liste **toutes les opérations disponibles** via l'API n8n :

| Opération | Description | Exemple |
|-----------|-------------|---------|
| **Workflow** | Créer, lister, récupérer, modifier, supprimer des workflows | `GET /workflows/{id}` |
| **Execution** | Voir l'historique des exécutions, les relancer | `GET /executions` |
| **Credentials** | Gérer les credentials (tokens, clés API, etc.) | `POST /credentials` |
| **Tags** | Organiser les workflows avec des tags | `GET /tags` |
| **Users** | Gérer les utilisateurs (pour les admins) | `GET /users` |

### **Endpoints utilisés dans notre Edge Function**

Notre fonction `manage-client-workflows` utilise principalement :

1. **`GET /api/v1/workflows/{id}`** 
   - Récupère un workflow existant (pour le dupliquer)
   
2. **`POST /api/v1/workflows`**
   - Crée un nouveau workflow
   
3. **`PATCH /api/v1/workflows/{id}`**
   - Active/désactive un workflow (`{ active: true/false }`)
   
4. **`POST /api/v1/workflows/{id}/execute`**
   - Déclenche une exécution manuelle d'un workflow

---

## ✅ **Ce que vous avez fait**

Vous avez créé le secret `N8N_API_KEY` dans Supabase et redéployé. C'est **exactement** ce qu'il fallait faire !

### **Configuration maintenant**

Dans Supabase Edge Functions → `manage-client-workflows` → Environment variables :

- ✅ `N8N_API_URL` = `https://primary-production-bdba.up.railway.app`
- ✅ `N8N_API_KEY` = Votre clé API n8n (créée depuis n8n Settings → API)

---

## 🧪 **Test Maintenant**

1. **Allez sur** : `/app/admin/workflows`
2. **Sélectionnez un client** (ex: `hatim.moro.2002@gmail.com`)
3. **Onglet "Start"**
4. **Cochez "Hello World Test"**
5. **Cliquez "Provisionner (1)"**

**Résultat attendu** :
- ✅ Toast : "✅ Provisioning réussi - 1 workflows copiés, 1 activés"
- ❌ Plus d'erreur "L'API n8n a retourné du text/html..."

---

## 📖 **Documentation Complète**

Pour voir la documentation complète de l'API n8n :
- Allez sur : https://primary-production-bdba.up.railway.app/api-docs
- Ou consultez : https://docs.n8n.io/api/

Cette documentation vous permet de :
- Comprendre toutes les opérations possibles
- Tester directement depuis le navigateur (bouton "Try it out")
- Voir les formats de requêtes/réponses

---

**Document créé le 31 janvier 2025**




