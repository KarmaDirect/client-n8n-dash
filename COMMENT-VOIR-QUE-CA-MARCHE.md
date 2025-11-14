# 👀 Comment Voir Que Ça Marche - Guide Visuel

## 🌐 Étape 1 : Accéder à l'Interface Admin

**URL** : http://127.0.0.1:8081/admin/workflows

**Ce que vous devez voir** :
- ✅ Page "Gestion Workflows Client"
- ✅ Section "Client" avec un dropdown
- ✅ Sections "Métriques" (4 cards : Exécutions, Items traités, Erreurs, € économisés)
- ✅ Section "Catalogue Templates" avec 3 onglets : Start / Pro / Elite

---

## 📋 Étape 2 : Vérifier Que le Template "Hello World" Apparaît

**Actions** :
1. Sélectionnez un **client approuvé** dans le dropdown
2. Cliquez sur l'onglet **"Start"** dans "Catalogue Templates"

**Ce que vous devez voir** :
- ✅ **"Hello World Test"** dans la liste
- ✅ Badge "Automation" 
- ✅ Description : "Workflow de test simple pour valider le système complet..."
- ✅ Case à cocher fonctionnelle

**Si vous ne voyez PAS "Hello World Test"** :
- Le template n'existe peut-être pas dans Supabase
- Vérifiez dans Supabase Dashboard → Table Editor → `workflow_templates`

---

## 🚀 Étape 3 : Provisionner le Workflow

**Actions** :
1. Cochez **"Hello World Test"**
2. Cliquez sur **"Provisionner (1)"** (le bouton en haut à droite)
3. Un panneau latéral s'ouvre avec "Variables & Credentials"
4. Le formulaire devrait être **vide** (pas de variables requises)
5. Cliquez sur **"Provisionner & Activer"**

**Ce que vous devez voir** :
- ✅ Toast de succès : "✅ Provisioning réussi - 1 workflows copiés, 1 activés"
- ✅ Le panneau latéral se ferme
- ✅ La case "Hello World Test" devient **grisée** avec badge "Déjà provisionné"

**Si vous voyez une erreur** :
- Vérifiez les logs dans la console du navigateur (F12)
- Vérifiez les logs Supabase Dashboard → Edge Functions → `manage-client-workflows`

---

## 📊 Étape 4 : Vérifier Que le Workflow Apparaît

**Actions** :
1. Faites défiler jusqu'à la section **"Workflows du client"**
2. Vous devriez voir un tableau

**Ce que vous devez voir** :
- ✅ **Une ligne** avec :
  - **Nom** : "[Nom Client] Hello World Test" (ou juste "Hello World Test")
  - **Statut** : Badge **"ON"** (vert) ou **"OFF"** (gris)
  - **Dernier run** : "Jamais" ou une date/heure
  - **Erreurs 24h** : ✓ (vert) avec "0"
  - **Actions** : 3 boutons (Play/Pause, 📄 Test Run, 🗑️ Supprimer)

**Si le workflow n'apparaît PAS** :
- Le provisioning a peut-être échoué
- Vérifiez les logs dans Supabase Edge Functions
- Vérifiez que le workflow existe dans n8n avec le tag client

---

## 🧪 Étape 5 : Tester le Workflow (LE PLUS IMPORTANT)

**Actions** :
1. Vérifiez que le workflow a le badge **"ON"** (actif)
2. Si **"OFF"**, cliquez sur le bouton **Play** (▶️) pour l'activer
3. Attendez que le badge passe à **"ON"**
4. Cliquez sur l'icône **📄** (Test Run) à côté

**Ce que vous devez voir** :

### **Immédiatement** :
- ✅ Toast : "⏳ Test run lancé... Déclenchement du workflow en cours..."

### **Après 1-2 secondes** :
- ✅ Toast : "✅ Workflow déclenché - Exécution ID: [un ID]"

### **Après 3 secondes** :
- ✅ Les métriques se rechargent automatiquement :
  - **Exécutions** : Au moins **1**
  - **Items traités** : Au moins **1**
  - **Erreurs** : **0** (si tout va bien)

### **Dans la colonne "Dernier run"** :
- ✅ Affiche maintenant une date/heure récente

**Si vous voyez une erreur** :
- ❌ "Workflow is not active" → Activez-le avec le bouton Play
- ❌ "Failed to trigger workflow" → Vérifiez que le workflow existe dans n8n
- ❌ "Workflow not found" → Le provisioning n'a peut-être pas créé le workflow dans n8n

---

## 🔍 Étape 6 : Vérifier dans n8n (Optionnel mais recommandé)

**Actions** :
1. Allez sur `https://primary-production-bdba.up.railway.app/workflows`
2. Cherchez un workflow avec le nom du client (ex. "[Nom Client] Hello World Test")

**Ce que vous devez voir** :
- ✅ Workflow visible dans la liste
- ✅ Status : **Actif** (toggle ON)
- ✅ Dans l'onglet **"Executions"** : Au moins 1 exécution récente
- ✅ Status de l'exécution : **Success** ✅

---

## 🔍 Étape 7 : Vérifier dans Supabase (Pour confirmer)

**Actions** :
1. Allez sur Supabase Dashboard → Table Editor
2. Table `workflow_execution_logs`

**Ce que vous devez voir** :
```sql
SELECT * FROM workflow_execution_logs 
ORDER BY created_at DESC 
LIMIT 5;
```

**Résultat attendu** :
- ✅ Au moins 1 ligne récente
- ✅ `status` = `'success'`
- ✅ `metrics` contient `{"itemsProcessed": 1, "status": "ok", ...}`
- ✅ `n8n_execution_id` présent

**Table `workflow_metrics`** :
```sql
SELECT * FROM workflow_metrics 
ORDER BY date DESC 
LIMIT 5;
```

**Résultat attendu** :
- ✅ Au moins 1 ligne avec `executions_count >= 1`
- ✅ `success_count >= 1`

---

## ✅ Checklist de Validation

Cochez quand vous voyez :

- [ ] Page `/admin/workflows` s'affiche correctement
- [ ] Dropdown client fonctionne
- [ ] Template "Hello World Test" visible dans l'onglet Start
- [ ] Provisioning réussit (toast de succès)
- [ ] Workflow visible dans "Workflows du client"
- [ ] Badge "ON" ou possibilité de l'activer
- [ ] Bouton "Test Run" fonctionne
- [ ] Toast "Workflow déclenché" avec Execution ID
- [ ] Métriques se mettent à jour (Exécutions >= 1)
- [ ] "Dernier run" affiche une date récente

**Si TOUS ces points sont cochés** ✅ → **Ça marche parfaitement !** 🎉

---

## 🐛 Si Ça Ne Marche Pas

### **Problème : "Hello World Test" n'apparaît pas**
**Solution** : 
- Vérifiez que le template existe dans Supabase :
```sql
SELECT * FROM workflow_templates WHERE name = 'Hello World Test';
```

### **Problème : Provisioning échoue**
**Solution** :
- Ouvrez la console du navigateur (F12) → onglet "Console"
- Vérifiez les erreurs détaillées
- Vérifiez Supabase Dashboard → Edge Functions → Logs

### **Problème : "Test Run" échoue**
**Solution** :
- Vérifiez que le workflow est **actif** (badge ON)
- Vérifiez dans n8n que le workflow existe et est actif
- Vérifiez les logs de l'Edge Function `manage-client-workflows`

---

## 📸 Screenshots de Référence

### **Ce que vous devez voir dans `/admin/workflows`** :

```
┌─────────────────────────────────────────┐
│ Gestion Workflows Client                │
├─────────────────────────────────────────┤
│ Client: [Dropdown avec clients]          │
│                                          │
│ Métriques:                               │
│ [Exécutions: 0] [Items: 0] [Erreurs: 0] │
│                                          │
│ Catalogue Templates                     │
│ [Start] [Pro] [Elite]                   │
│                                          │
│ ☑ Hello World Test                      │
│   Automation                             │
│   0 credentials requises                 │
│                                          │
│ [Provisionner (1)]                       │
│                                          │
│ Workflows du client                      │
│ ┌─────────────────────────────────┐    │
│ │ [Client] Hello World Test        │    │
│ │ ON | Jamais | ✓ 0 | [▶][📄][🗑]│    │
│ └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

**Document créé le 29 janvier 2025**







