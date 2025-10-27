# 🔧 INSTRUCTIONS : Appliquer la Migration du Système d'Approbation

## ⚠️ IMPORTANT

La migration SQL a été créée mais **DOIT être appliquée manuellement** sur Supabase.

---

## 📍 **ÉTAPE 1 : Accéder à Supabase**

1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet : **ijybwfdkiteebytdwhyu**
3. Clique sur **SQL Editor** dans le menu de gauche

---

## 📍 **ÉTAPE 2 : Exécuter la Migration**

1. Copie TOUT le contenu du fichier :
   ```
   supabase/migrations/20250127000001_org_approval_system.sql
   ```

2. Colle-le dans le SQL Editor de Supabase

3. Clique sur **"Run"** (en bas à droite)

4. Attends que l'exécution se termine (tu verras "Success" en vert)

---

## ✅ **ÉTAPE 3 : Vérifier que ça fonctionne**

### Test 1 : Vérifier la colonne `approved`
```sql
SELECT id, name, owner_id, approved, created_at 
FROM public.organizations 
LIMIT 5;
```
✅ Tu dois voir une colonne `approved` avec des valeurs `true` ou `false`

### Test 2 : Vérifier les fonctions RPC
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('approve_organization', 'reject_organization', 'handle_new_user');
```
✅ Tu dois voir les 3 fonctions listées

### Test 3 : Vérifier le trigger
```sql
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```
✅ Tu dois voir le trigger `on_auth_user_created` sur la table `auth.users`

---

## 🚀 **ÉTAPE 4 : Tester le Système**

### Test A : Créer un nouveau compte (mode client)
1. Va sur http://localhost:8080/auth
2. Clique sur "Créer un compte"
3. Inscris-toi avec un nouvel email (ex: `test@example.com`)
4. Confirme l'email si nécessaire
5. Connecte-toi

**Résultat attendu :**
- ✅ Tu es redirigé vers `/pending-approval`
- ✅ Message "Compte en attente de validation"
- ✅ L'organisation a été créée automatiquement avec `approved = false`

### Test B : Approuver un compte (mode admin)
1. Connecte-toi avec ton compte admin : `hatim.moro.2002@gmail.com`
2. Va sur http://localhost:8080/admin/approvals
3. Tu dois voir le compte `test@example.com` en attente
4. Clique sur "Approuver"

**Résultat attendu :**
- ✅ Toast "Organisation approuvée !"
- ✅ Le compte disparaît de la liste
- ✅ Dans la DB : `approved = true`

### Test C : Le client peut maintenant accéder au dashboard
1. Déconnecte-toi
2. Reconnecte-toi avec `test@example.com`
3. Tu dois être redirigé vers `/app` (dashboard)

**Résultat attendu :**
- ✅ Accès complet au dashboard
- ✅ Plus de message "En attente de validation"

---

## 🗄️ **CE QUE LA MIGRATION FAIT**

### 1. Ajoute la colonne `approved`
```sql
ALTER TABLE public.organizations 
ADD COLUMN approved BOOLEAN NOT NULL DEFAULT false;
```

### 2. Crée le trigger automatique
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```
**Effet :** Quand un user s'inscrit → organisation créée automatiquement

### 3. Crée les fonctions RPC
- `approve_organization(org_id)` → Approuve une org (admin seulement)
- `reject_organization(org_id)` → Rejette et supprime une org (admin seulement)

### 4. Modifie les policies RLS
- Bloque l'accès aux workflows, sites, leads si `approved = false`
- Les admins bypassent toutes les restrictions

---

## 📊 **VÉRIFICATIONS FINALES**

### Dans Supabase (Table Editor)
1. Va dans **Table Editor** → `organizations`
2. Tu dois voir la colonne `approved` (boolean)
3. Toutes les orgs existantes doivent avoir `approved = true`

### Dans l'App
1. Page `/auth` → Inscription fonctionne
2. Page `/pending-approval` → Affiche le message d'attente
3. Page `/admin/approvals` → Liste les comptes en attente
4. Dashboard → Redirige si non approuvé

---

## ⚠️ **EN CAS DE PROBLÈME**

### Erreur : "column 'approved' does not exist"
→ La migration n'a pas été appliquée. Retourne à l'ÉTAPE 2.

### Erreur : "function approve_organization does not exist"
→ Les fonctions RPC n'ont pas été créées. Retourne à l'ÉTAPE 2.

### Le trigger ne fonctionne pas
```sql
-- Vérifier que le trigger existe
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Si absent, le recréer manuellement
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## 🎯 **RÉSUMÉ**

1. ✅ Copie le fichier SQL
2. ✅ Exécute dans Supabase SQL Editor
3. ✅ Vérifie que `approved` existe
4. ✅ Teste l'inscription d'un nouveau compte
5. ✅ Teste l'approbation depuis `/admin/approvals`

---

**Une fois la migration appliquée, tout fonctionnera automatiquement !** 🚀




