# 🧪 Tests E2E Manuels – Système Workflows n8n

**Date**: 27 Octobre 2025  
**Version**: 1.0  
**Prérequis**: n8n accessible, Supabase Edge Functions déployées, Frontend running

---

## 📋 Setup Initial

### 1. Vérifier Configuration

```bash
# Terminal 1: Frontend
cd /Users/yasminemoro/Documents/client-n8n-dash
npm run dev
# ✅ Doit être accessible sur http://127.0.0.1:8080/

# Terminal 2: Supabase Status
supabase status
# ✅ Vérifier que Edge Functions sont déployées
```

### 2. Variables d'Environnement n8n

```bash
# Vérifier secrets Supabase
supabase secrets list

# Requis:
# - N8N_API_URL=https://n8n.webstate.io/api/v1
# - N8N_API_KEY=n8n_api_xxxxx
```

### 3. Créer Organisation Test

```sql
-- Dans Supabase SQL Editor
INSERT INTO organizations (name, email, approved)
VALUES ('Test Client E2E', 'test@webstate.io', true)
RETURNING id, name;
-- Noter l'ID retourné
```

---

## ✅ Test 1: Workflows Templates Existent dans n8n

**Objectif**: Vérifier que les 8 workflows MVP sont bien créés

### Étapes

1. Ouvrir n8n : `https://n8n.webstate.io/`
2. Aller dans **Workflows**
3. Filtrer par nom : `[START]`
4. **Attendu** : 2 workflows visibles
   - `[START] Lead Capture Basic`
   - `[START] Email Auto Reply`

5. Répéter pour `[PRO]` → **Attendu** : 3 workflows
6. Répéter pour `[ELITE]` → **Attendu** : 3 workflows

### ✅ Critères de Succès

- [ ] 8 workflows visibles au total
- [ ] Chaque workflow a ≥5 nodes
- [ ] Tags présents (cliquer sur workflow → voir tags)

---

## ✅ Test 2: Tags Template Présents

**Objectif**: Vérifier l'organisation par tags

### Étapes

1. Dans n8n, cliquer sur un workflow `[START] Lead Capture Basic`
2. Regarder les **Tags** en haut
3. **Attendu** :
   - `template-start`
   - `client-communication`

4. Répéter pour workflows PRO :
   - `template-pro`
   - Module tag (`lead-management`, `crm-sync`, `monitoring`)

5. Répéter pour workflows ELITE :
   - `template-elite`
   - Module tag (`orchestration`, `analytics`, `reporting`)

### ✅ Critères de Succès

- [ ] Tous workflows ont tag `template-{level}`
- [ ] Tous workflows ont tag module

---

## ✅ Test 3: Variables Placeholders Présentes

**Objectif**: Vérifier que les placeholders `{{$json.env.VAR}}` sont bien dans les workflows

### Étapes

1. Dans n8n, ouvrir `[START] Lead Capture Basic`
2. Cliquer sur node **"Validate Input"** (Code node)
3. Regarder le code JavaScript
4. **Attendu** : Voir des lignes comme :
   ```javascript
   client_id: '{{$json.env.CLIENT_ID}}'
   ```

5. Cliquer sur node **"Write to Supabase"** (HTTP Request)
6. Regarder l'URL et Headers
7. **Attendu** : Voir :
   ```
   URL: ={{$json.env.SUPABASE_URL}}/rest/v1/leads
   Header Authorization: =Bearer {{$json.env.SUPABASE_SERVICE_ROLE}}
   ```

### ✅ Critères de Succès

- [ ] Variables `{{$json.env.XXX}}` présentes dans Code nodes
- [ ] Variables `={{$json.env.XXX}}` présentes dans HTTP Request nodes

---

## ✅ Test 4: Page Admin Accessible

**Objectif**: Vérifier que la page `/admin/workflows` est accessible

### Étapes

1. Naviguer vers `http://127.0.0.1:8080/admin/workflows`
2. Se connecter si nécessaire (utilisateur admin)
3. **Attendu** :
   - Page affichée avec sections :
     - Sélection Client (dropdown)
     - Métriques (4 cards)
     - Catalogue Templates (tabs Start/Pro/Elite)
     - Table workflows client (vide initialement)

### ✅ Critères de Succès

- [ ] Page se charge sans erreur
- [ ] Dropdown "Client" visible
- [ ] Tabs Start/Pro/Elite affichent workflows
- [ ] Bouton "Provisionner (0)" disabled par défaut

---

## ✅ Test 5: Provisioning – Sélection Templates

**Objectif**: Sélectionner des workflows et ouvrir le formulaire

### Étapes

1. Dans `/admin/workflows`, sélectionner **"Test Client E2E"** dans dropdown
2. Aller dans tab **"Start"**
3. Cocher les 2 workflows :
   - `[START] Lead Capture Basic`
   - `[START] Email Auto Reply`
4. **Attendu** : Bouton devient **"Provisionner (2)"** (enabled)
5. Cliquer sur **"Provisionner (2)"**
6. **Attendu** : Sheet s'ouvre à droite avec formulaire variables

### Variables Attendues dans Formulaire

**Lead Capture Basic** :
- `CLIENT_ID`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE`

**Email Auto Reply** :
- `CLIENT_ID`
- `IMAP_HOST`
- `IMAP_PORT`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `FROM_EMAIL`
- `REPLY_TEMPLATE`

### ✅ Critères de Succès

- [ ] Sélection workflows fonctionne
- [ ] Bouton "Provisionner" devient enabled
- [ ] Sheet s'ouvre avec tous les champs requis
- [ ] Bouton "Provisionner & Activer" est disabled si champs vides

---

## ✅ Test 6: Injection Variables & Activation

**Objectif**: Remplir les variables et provisionner les workflows

### Étapes

1. Dans le formulaire, remplir **toutes** les variables :
   ```
   CLIENT_ID: test-client-e2e
   SUPABASE_URL: https://xyzproject.supabase.co
   SUPABASE_SERVICE_ROLE: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx
   IMAP_HOST: imap.gmail.com
   IMAP_PORT: 993
   SMTP_HOST: smtp.gmail.com
   SMTP_PORT: 587
   SMTP_USER: test@webstate.io
   SMTP_PASS: password123
   FROM_EMAIL: test@webstate.io
   REPLY_TEMPLATE: Merci, nous revenons vers vous rapidement.
   ```

2. Cliquer **"Provisionner & Activer"**
3. **Attendu** :
   - Loading spinner
   - Toast success : "✅ 2 workflows copiés, 2 activés"
   - Sheet se ferme
   - Table workflows client se rafraîchit

### Vérifications Post-Provisioning

#### Dans l'admin UI :
- [ ] Table affiche 2 lignes
- [ ] Noms : `[Test Client E2E] Lead Capture Basic` et `[Test Client E2E] Email Auto Reply`
- [ ] Statut : Badge "ON" (vert)
- [ ] Dernier run : "Jamais"
- [ ] Erreurs 24h : 0 ✅

#### Dans n8n :
1. Ouvrir n8n workflows
2. Filtrer par nom : `[Test Client E2E]`
3. **Attendu** : 2 workflows créés
4. Vérifier tags :
   - `client-test-client-e2e`
   - `template-{uuid}`
   - `pack-start`
5. Ouvrir `[Test Client E2E] Lead Capture Basic`
6. Cliquer sur node **"Validate Input"**
7. **CRITIQUE** : Vérifier que variables sont **INJECTÉES** :
   ```javascript
   client_id: 'test-client-e2e' // PAS {{$json.env.CLIENT_ID}}
   ```
8. Vérifier node "Write to Supabase" :
   ```
   URL: https://xyzproject.supabase.co/rest/v1/leads
   Header Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx
   ```

#### Dans Supabase :
```sql
SELECT * FROM workflows WHERE organization_id = 'UUID_TEST_CLIENT';
```
**Attendu** : 2 rows avec :
- `is_active = true`
- `status = 'active'`
- `n8n_workflow_id` rempli

### ✅ Critères de Succès

- [ ] Edge Function retourne `{copied: 2, enabled: 2}`
- [ ] Workflows visibles dans n8n avec bon nom
- [ ] Variables réellement injectées (pas de placeholders)
- [ ] Workflows `active: true` dans n8n
- [ ] DB Supabase contient 2 rows

---

## ✅ Test 7: Métriques Émises

**Objectif**: Vérifier que les workflows émettent bien des métriques au format standard

### Étapes

1. Dans n8n, ouvrir `[Test Client E2E] Lead Capture Basic`
2. Cliquer sur node **"Emit Metrics"** (Code node)
3. Vérifier le code :
   ```javascript
   return {
     status: 'ok',
     runs: 1,
     itemsProcessed: 1,
     errors: 0,
     message: 'Lead captured successfully',
     clientId: 'test-client-e2e', // Injecté
     workflowId: '{{$workflow.id}}',
     ts: Date.now()
   };
   ```

4. Faire un **Test Run** manuel :
   - Cliquer sur bouton "Execute Workflow" en bas à droite
   - **Note** : Cela va échouer car pas de données réelles, mais on peut voir la structure
   - Regarder l'output du dernier node
   - **Attendu** : Objet JSON avec structure ci-dessus

### ✅ Critères de Succès

- [ ] Node "Emit Metrics" existe dans tous workflows
- [ ] Format JSON standard respecté
- [ ] `clientId` contient la valeur injectée (pas placeholder)

---

## ✅ Test 8: Toggle ON/OFF

**Objectif**: Activer/Désactiver un workflow depuis l'admin

### Étapes

1. Dans `/admin/workflows`, table workflows client
2. Cliquer sur bouton **Pause** (⏸️) pour `[Test Client E2E] Lead Capture Basic`
3. **Attendu** :
   - Toast : "✅ Workflow désactivé"
   - Badge devient "OFF" (gris)
   - Dans n8n, workflow `active: false`

4. Cliquer à nouveau sur bouton **Play** (▶️)
5. **Attendu** :
   - Toast : "✅ Workflow activé"
   - Badge devient "ON" (vert)
   - Dans n8n, workflow `active: true`

### ✅ Critères de Succès

- [ ] Badge change visuellement
- [ ] État synchronisé entre admin UI et n8n
- [ ] DB `is_active` mis à jour

---

## ✅ Test 9: Suppression Workflow

**Objectif**: Supprimer un workflow depuis l'admin

### Étapes

1. Dans `/admin/workflows`, table workflows client
2. Cliquer sur bouton **Poubelle** (🗑️) pour `[Test Client E2E] Email Auto Reply`
3. **Attendu** : Popup confirmation "Êtes-vous sûr ?"
4. Cliquer **OK**
5. **Attendu** :
   - Toast : "✅ Workflow supprimé"
   - Ligne disparaît de la table
   - Métriques se rafraîchissent

### Vérifications Post-Suppression

#### Dans l'admin UI :
- [ ] Table n'affiche plus que 1 workflow

#### Dans n8n :
- [ ] Workflow `[Test Client E2E] Email Auto Reply` n'existe plus

#### Dans Supabase :
```sql
SELECT * FROM workflows WHERE organization_id = 'UUID_TEST_CLIENT';
```
**Attendu** : 1 row (Lead Capture Basic seulement)

### ✅ Critères de Succès

- [ ] Workflow supprimé de n8n
- [ ] Row supprimé de DB
- [ ] Pas de workflow orphelin

---

## ✅ Test 10: Provisioning Workflows Déjà Provisionnés

**Objectif**: Vérifier qu'on ne peut pas dupliquer un workflow déjà provisionné

### Étapes

1. Dans `/admin/workflows`, aller dans tab **"Start"**
2. **Attendu** :
   - `[START] Lead Capture Basic` affiche badge "Déjà provisionné" (opacité réduite)
   - Checkbox disabled
   - `[START] Email Auto Reply` est coché normalement (car on l'a supprimé)

3. Essayer de cocher `[START] Lead Capture Basic`
4. **Attendu** : Impossible de cocher (disabled)

### ✅ Critères de Succès

- [ ] Workflows déjà provisionnés sont grisés
- [ ] Badge "Déjà provisionné" visible
- [ ] Checkbox disabled

---

## 🎯 Résumé Checklist Complète

| Test | Statut | Notes |
|------|--------|-------|
| 1. Workflows templates existent | ⏳ | 8 workflows visibles dans n8n |
| 2. Tags template présents | ⏳ | template-start/pro/elite |
| 3. Variables placeholders présentes | ⏳ | `{{$json.env.XXX}}` dans Code/HTTP nodes |
| 4. Page admin accessible | ⏳ | `/admin/workflows` se charge |
| 5. Sélection templates | ⏳ | Checkbox + bouton Provisionner |
| 6. Injection variables & activation | ⏳ | Variables réellement injectées + active: true |
| 7. Métriques émises | ⏳ | Format JSON standard |
| 8. Toggle ON/OFF | ⏳ | Synchro admin UI ↔ n8n |
| 9. Suppression workflow | ⏳ | Suppression n8n + DB |
| 10. Workflows déjà provisionnés | ⏳ | Badge + disabled checkbox |

---

## 🐛 Bugs à Signaler

Si un test échoue, noter ici :

### Bug Template

```
**Test**: #6 - Injection variables
**Erreur**: Variables pas injectées, placeholders toujours présents
**Logs**:
[Copier logs Edge Function depuis Supabase]

**Steps to Reproduce**:
1. ...
2. ...

**Expected**: Variables injectées
**Actual**: Placeholders restent
```

---

## 📊 Résultats Finaux

- **Tests Réussis** : ___/10
- **Tests Échoués** : ___/10
- **Bloquants** : Oui / Non
- **Date Tests** : ___________
- **Testeur** : ___________

---

## 🚀 Prochaines Étapes Si Tests OK

1. Créer les 42 workflows supplémentaires (50 total)
2. Implémenter Test Run button (trigger manuel via n8n API)
3. Ajouter visualization logs (lire executions n8n)
4. Optimiser calcul ROI avec vraies métriques
5. Documenter API provisioning pour clients

---

**Dernière mise à jour** : 27 Octobre 2025, 21:15  
**Contact Support** : Hatim Moro – Founder WebState


