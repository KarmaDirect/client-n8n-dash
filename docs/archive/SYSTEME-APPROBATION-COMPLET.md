# 🎯 SYSTÈME D'APPROBATION DES COMPTES - DOCUMENTATION COMPLÈTE

## 📋 **VUE D'ENSEMBLE**

J'ai créé un **système complet d'approbation manuelle** pour ton SaaS Webstate. Voici comment ça fonctionne :

```
┌─────────────────────────────────────────────────────────────────┐
│  1. CLIENT S'INSCRIT                                            │
│     ↓                                                           │
│     • Crée un compte via /auth                                  │
│     • Email + mot de passe                                      │
│     • Confirmation par email                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. ORGANISATION CRÉÉE AUTOMATIQUEMENT                          │
│     ↓                                                           │
│     • Trigger SQL s'exécute automatiquement                     │
│     • Organisation créée avec approved = FALSE                  │
│     • Client ajouté comme "owner"                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. CLIENT SE CONNECTE                                          │
│     ↓                                                           │
│     • Redirigé vers /pending-approval                           │
│     • Message : "Compte en attente de validation"               │
│     • Accès bloqué au dashboard                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. TOI (ADMIN) TU APPROUVES                                    │
│     ↓                                                           │
│     • Tu vas sur /admin/approvals                               │
│     • Tu vois la liste des comptes en attente                   │
│     • Tu cliques sur "Approuver" ou "Rejeter"                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. CLIENT ACCÈDE AU DASHBOARD                                  │
│     ↓                                                           │
│     • approved = TRUE dans la DB                                │
│     • Client se reconnecte                                      │
│     • Accès complet au dashboard /app                           │
│     • Peut utiliser toutes les fonctionnalités                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ **FICHIERS CRÉÉS**

### 1. **Migration SQL**
📄 `supabase/migrations/20250127000001_org_approval_system.sql`

**Contenu :**
- ✅ Ajoute colonne `approved` (boolean) à `organizations`
- ✅ Crée fonction `handle_new_user()` (trigger auto-création org)
- ✅ Crée trigger `on_auth_user_created` sur `auth.users`
- ✅ Crée fonction RPC `approve_organization(org_id)`
- ✅ Crée fonction RPC `reject_organization(org_id)`
- ✅ Modifie policies RLS pour bloquer si `approved = false`
- ✅ Crée vue `pending_organizations` (liste des orgs en attente)

### 2. **Page "En attente de validation"**
📄 `src/pages/PendingApproval.tsx`

**Fonctionnalités :**
- ✅ Affiche message d'attente
- ✅ Montre l'email et le nom de l'organisation
- ✅ Liste les prochaines étapes
- ✅ Bouton de déconnexion
- ✅ Design moderne avec animations

### 3. **Dashboard Admin d'Approbation**
📄 `src/pages/AdminApprovals.tsx`

**Fonctionnalités :**
- ✅ Liste toutes les organisations en attente
- ✅ Affiche email, nom org, date d'inscription
- ✅ Bouton "Approuver" (vert)
- ✅ Bouton "Rejeter" (rouge)
- ✅ Statistiques (nombre en attente)
- ✅ Accessible uniquement aux admins
- ✅ Design moderne avec animations

### 4. **Routes ajoutées**
📄 `src/App.tsx`

```tsx
<Route path="/pending-approval" element={<ProtectedRoute><PendingApproval /></ProtectedRoute>} />
<Route path="/admin/approvals" element={<ProtectedRoute><AdminApprovals /></ProtectedRoute>} />
```

### 5. **Vérification dans Dashboard**
📄 `src/pages/Dashboard.tsx`

**Ajout :**
- ✅ Fonction `checkApprovalStatus()` au chargement
- ✅ Redirige vers `/pending-approval` si `approved = false`
- ✅ Bypass pour les admins (ils voient tout)

### 6. **Documentation**
📄 `INSTRUCTIONS-MIGRATION-APPROBATION.md`
📄 `SYSTEME-APPROBATION-COMPLET.md` (ce fichier)

---

## 🔐 **SÉCURITÉ & PERMISSIONS**

### **Admins (toi)**
```
✅ Accès à TOUTES les organisations (approved ou non)
✅ Accès à /admin/approvals
✅ Peut approuver/rejeter les comptes
✅ Bypass toutes les restrictions RLS
✅ Organisations créées par admin → approved = TRUE automatiquement
```

### **Clients (users normaux)**
```
❌ Accès bloqué si approved = FALSE
❌ Ne peut pas voir /admin/approvals
❌ Redirigé vers /pending-approval
✅ Accès complet si approved = TRUE
✅ Organisation créée automatiquement à l'inscription
```

---

## 🗄️ **BASE DE DONNÉES**

### **Table `organizations`**
```sql
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  approved BOOLEAN NOT NULL DEFAULT false,  -- ✅ NOUVEAU
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### **Trigger automatique**
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**Effet :** Quand un user s'inscrit → organisation créée automatiquement

### **Fonctions RPC**
```sql
-- Approuver une organisation (admin seulement)
SELECT approve_organization('org-uuid-here');

-- Rejeter une organisation (admin seulement)
SELECT reject_organization('org-uuid-here');
```

### **Policies RLS modifiées**
```sql
-- Exemple : workflows
CREATE POLICY workflows_select_members
ON public.workflows FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = workflows.org_id
      AND o.approved = true  -- ✅ NOUVELLE CONDITION
      AND (user_is_org_member(auth.uid(), o.id) OR has_role(auth.uid(), 'admin'))
  )
  OR has_role(auth.uid(), 'admin')  -- Admin voit tout
);
```

---

## 🎨 **DESIGN & UX**

### **Page `/pending-approval`**
- 🎨 Design moderne avec Framer Motion
- 🟡 Icône horloge (Clock) jaune
- 📧 Affiche l'email du user
- 📋 Liste des prochaines étapes
- 🔓 Bouton de déconnexion
- 📞 Lien vers le support

### **Page `/admin/approvals`**
- 🎨 Design moderne avec animations
- 📊 Statistiques (nombre en attente)
- 📋 Liste des organisations en attente
- ✅ Bouton vert "Approuver"
- ❌ Bouton rouge "Rejeter"
- 📅 Date d'inscription formatée
- ⬅️ Bouton retour au dashboard

---

## 🚀 **COMMENT UTILISER**

### **Pour toi (Admin)**

#### 1. Créer ton compte admin
```
1. Va sur http://localhost:8080/auth
2. Clique sur "Configurer l'admin Webstate"
3. Entre ton email : hatim.moro.2002@gmail.com
4. Entre un mot de passe
5. → Compte créé avec rôle admin + org approuvée automatiquement
```

#### 2. Approuver les comptes clients
```
1. Va sur http://localhost:8080/admin/approvals
2. Tu vois la liste des comptes en attente
3. Clique sur "Approuver" pour valider
4. Ou "Rejeter" pour supprimer
```

### **Pour les clients**

#### 1. S'inscrire
```
1. Va sur http://localhost:8080/auth
2. Clique sur "Créer un compte"
3. Entre email + mot de passe
4. Confirme l'email
5. → Organisation créée automatiquement (approved = false)
```

#### 2. Attendre l'approbation
```
1. Se connecte
2. Redirigé vers /pending-approval
3. Voit le message "En attente de validation"
4. Attend que toi tu approuves
```

#### 3. Accéder au dashboard
```
1. Une fois approuvé par toi
2. Se reconnecte
3. Accès complet au dashboard /app
4. Peut utiliser toutes les fonctionnalités
```

---

## ⚙️ **CONFIGURATION REQUISE**

### **1. Appliquer la migration**
⚠️ **IMPORTANT** : La migration SQL DOIT être appliquée manuellement sur Supabase

Voir le fichier : `INSTRUCTIONS-MIGRATION-APPROBATION.md`

### **2. Vérifier les variables d'environnement**
```env
VITE_SUPABASE_URL=https://ijybwfdkiteebytdwhyu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **3. Vérifier que ton email admin existe**
```sql
SELECT id, email FROM auth.users WHERE email = 'hatim.moro.2002@gmail.com';
SELECT * FROM public.user_roles WHERE role = 'admin';
```

---

## 🧪 **TESTS À FAIRE**

### **Test 1 : Inscription normale**
```
1. Créer un compte test (ex: test@example.com)
2. Vérifier que l'org est créée avec approved = false
3. Vérifier la redirection vers /pending-approval
4. Vérifier que le dashboard est inaccessible
```

### **Test 2 : Approbation admin**
```
1. Se connecter en tant qu'admin
2. Aller sur /admin/approvals
3. Voir le compte test@example.com en attente
4. Cliquer sur "Approuver"
5. Vérifier que approved = true dans la DB
```

### **Test 3 : Accès après approbation**
```
1. Se reconnecter avec test@example.com
2. Vérifier la redirection vers /app
3. Vérifier l'accès complet au dashboard
4. Vérifier que /pending-approval n'est plus accessible
```

### **Test 4 : Rejet**
```
1. Créer un autre compte test2@example.com
2. Se connecter en tant qu'admin
3. Aller sur /admin/approvals
4. Cliquer sur "Rejeter"
5. Vérifier que l'org est supprimée de la DB
```

---

## 📊 **STATISTIQUES & MONITORING**

### **Requêtes utiles**

#### Compter les orgs en attente
```sql
SELECT COUNT(*) FROM public.organizations WHERE approved = false;
```

#### Lister toutes les orgs en attente
```sql
SELECT 
  o.id,
  o.name,
  u.email as owner_email,
  o.created_at
FROM public.organizations o
JOIN auth.users u ON u.id = o.owner_id
WHERE o.approved = false
ORDER BY o.created_at DESC;
```

#### Compter les orgs approuvées
```sql
SELECT COUNT(*) FROM public.organizations WHERE approved = true;
```

#### Historique des approbations (dernières 24h)
```sql
SELECT 
  o.id,
  o.name,
  u.email as owner_email,
  o.updated_at as approved_at
FROM public.organizations o
JOIN auth.users u ON u.id = o.owner_id
WHERE o.approved = true
  AND o.updated_at > now() - interval '24 hours'
ORDER BY o.updated_at DESC;
```

---

## 🔧 **MAINTENANCE**

### **Approuver manuellement via SQL**
```sql
UPDATE public.organizations 
SET approved = true, updated_at = now()
WHERE owner_id = (SELECT id FROM auth.users WHERE email = 'client@example.com');
```

### **Rejeter manuellement via SQL**
```sql
DELETE FROM public.organizations 
WHERE owner_id = (SELECT id FROM auth.users WHERE email = 'spam@example.com');
```

### **Désactiver le système d'approbation temporairement**
```sql
-- Approuver toutes les orgs en attente
UPDATE public.organizations SET approved = true WHERE approved = false;
```

---

## ✅ **CHECKLIST FINALE**

Avant de considérer le système comme opérationnel :

- [ ] Migration SQL appliquée sur Supabase
- [ ] Colonne `approved` existe dans `organizations`
- [ ] Trigger `on_auth_user_created` actif
- [ ] Fonctions RPC `approve_organization` et `reject_organization` créées
- [ ] Page `/pending-approval` accessible
- [ ] Page `/admin/approvals` accessible (admin seulement)
- [ ] Test d'inscription d'un nouveau compte réussi
- [ ] Test d'approbation réussi
- [ ] Test de rejet réussi
- [ ] Vérification que les admins bypassent les restrictions

---

## 🎯 **RÉSUMÉ EN 3 POINTS**

1. **Clients s'inscrivent** → Organisation créée automatiquement (approved = false)
2. **Toi tu approuves** → Via /admin/approvals
3. **Clients accèdent** → Dashboard complet une fois approuvés

---

**Tout est prêt ! Il ne reste plus qu'à appliquer la migration SQL sur Supabase.** 🚀

Voir : `INSTRUCTIONS-MIGRATION-APPROBATION.md`




