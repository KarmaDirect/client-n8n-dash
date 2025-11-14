# ✅ Tester un Workflow depuis l'Espace Admin

**Date** : 29 octobre 2025  
**Workflow de test** : `Test Workflow MCP - Dashboard Sync` (CZsleIAuc6TpDBWG)

---

## 🎯 Guide Pas-à-Pas

### 1. Accéder à l'espace Admin

**URL** : `/admin/workflows`

**Ou via** : `/admin` → Onglet "Gestion Workflows"

---

### 2. Sélectionner l'Organisation

Dans le dropdown **"Client"** :
1. Sélectionner **"Webstate (Agence)"**
2. Le workflow `Test Workflow MCP - Dashboard Sync` apparaîtra dans le tableau des workflows

---

### 3. Actions Disponibles dans le Tableau

Le workflow créé via MCP apparaît avec :

| Colonne | Valeur |
|---------|--------|
| **Nom** | Test Workflow MCP - Dashboard Sync |
| **ID n8n** | CZsleIAuc6TpDBWG |
| **Statut** | ⏸️ Inactif / ▶️ Actif |
| **Dernière exécution** | - (jamais exécuté) |
| **Erreurs 24h** | 0 |

**Actions disponibles** :

#### ▶️ **Activer/Désactiver**
- Cliquer sur le bouton **Play** (▶️) pour activer
- Cliquer sur le bouton **Pause** (⏸️) pour désactiver
- Appelle l'Edge Function `manage-client-workflows` avec action `activate`/`deactivate`

#### 🧪 **Test Run** (Bouton avec icône FileText)
- Cliquer sur le bouton de test (📄)
- Déclenche le workflow via l'Edge Function avec action `trigger`
- Variables envoyées :
  ```json
  {
    "test_mode": "true",
    "triggered_by": "admin_ui"
  }
  ```

#### 🗑️ **Supprimer**
- Cliquer sur le bouton **Trash** (🗑️) pour supprimer
- Supprime le workflow de n8n ET de Supabase

---

### 4. Flux d'Exécution

**Quand vous cliquez sur "Test Run"** :

```
Admin UI (/admin/workflows)
    ↓
Edge Function: manage-client-workflows (action: trigger)
    ↓
n8n API: /api/v1/workflows/CZsleIAuc6TpDBWG/execute
    ↓
Workflow n8n s'exécute:
  - Webhook reçoit les données
  - Code Node génère les métriques
  - HTTP Request envoie à Supabase
    ↓
Supabase Edge Function: track-workflow-execution
    ↓
Stockage dans:
  - workflow_execution_logs (détails)
  - workflow_metrics (agrégations quotidiennes)
    ↓
Dashboard se met à jour automatiquement (après 3 secondes)
```

---

### 5. Vérifier les Métriques

**Après l'exécution du test** :

#### Dans l'Admin (`/admin/workflows`) :
- Section **"Métriques"** (cartes en haut)
  - Total exécutions
  - Items traités
  - Erreurs
  - ROI estimé

- Tableau **"Workflows Client"**
  - Colonne "Dernière exécution" → Affiche la date/heure
  - Colonne "Runs 24h" → Incrémenté
  - Badge d'état (✅ Succès / ❌ Erreur)

#### Dans Supabase :
```sql
-- Vérifier les logs d'exécution
SELECT * FROM workflow_execution_logs 
WHERE workflow_id = '8f1a1e70-7725-46dc-a9fa-b5b74d5cf634'
ORDER BY created_at DESC
LIMIT 5;

-- Vérifier les métriques agrégées
SELECT * FROM workflow_metrics 
WHERE workflow_id = '8f1a1e70-7725-46dc-a9fa-b5b74d5cf634'
ORDER BY date DESC;
```

#### Dans le Dashboard Client (`/app`) :
- Widget **"Activité ce mois"** → Exécutions incrémentées
- Widget **"Efficacité"** → Performance mise à jour
- Page **`/app/automations`** → Détails du workflow avec métriques

---

## 🔍 Détails Techniques

### Edge Function `manage-client-workflows`

**Action** : `trigger`

**Body** :
```json
{
  "action": "trigger",
  "workflow_id": "8f1a1e70-7725-46dc-a9fa-b5b74d5cf634",
  "variables": {
    "test_mode": "true",
    "triggered_by": "admin_ui"
  }
}
```

**Réponse** :
```json
{
  "success": true,
  "execution_id": "exec_123456",
  "workflow_id": "8f1a1e70-7725-46dc-a9fa-b5b74d5cf634",
  "workflow_name": "Test Workflow MCP - Dashboard Sync",
  "message": "Workflow déclenché avec succès"
}
```

### Webhook n8n

Une fois activé, le workflow écoute sur :
```
POST https://primary-production-bdba.up.railway.app/webhook/test-mcp-workflow
```

**Test direct** (si workflow activé) :
```bash
curl -X POST https://primary-production-bdba.up.railway.app/webhook/test-mcp-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "test": "direct_webhook_test",
    "source": "curl"
  }'
```

---

## ✅ Checklist Complète de Test

- [ ] Accéder à `/admin/workflows`
- [ ] Sélectionner "Webstate (Agence)" dans le dropdown
- [ ] Vérifier que "Test Workflow MCP - Dashboard Sync" apparaît dans le tableau
- [ ] Activer le workflow (bouton Play ▶️)
- [ ] Exécuter le test (bouton Test Run 🧪)
- [ ] Vérifier le toast "✅ Workflow déclenché" avec execution_id
- [ ] Attendre 3 secondes pour le refresh automatique
- [ ] Vérifier que "Dernière exécution" est mise à jour
- [ ] Vérifier que "Runs 24h" est incrémenté
- [ ] Vérifier les métriques dans les cartes en haut
- [ ] Vérifier dans Supabase (`workflow_execution_logs`)
- [ ] Vérifier dans le dashboard client (`/app`)

---

## 🐛 Dépannage

### Le workflow n'apparaît pas dans l'admin
**Solution** : Vérifier que l'organisation est bien sélectionnée et que le workflow appartient à cette organisation.

```sql
SELECT w.*, o.name as org_name 
FROM workflows w 
JOIN organizations o ON w.org_id = o.id 
WHERE w.n8n_workflow_id = 'CZsleIAuc6TpDBWG';
```

### Le test run échoue
**Solution** : 
1. Vérifier que le workflow est activé dans n8n
2. Vérifier les logs de l'Edge Function dans Supabase Dashboard
3. Vérifier que `N8N_API_URL` et `N8N_API_KEY` sont bien configurés

### Les métriques ne s'affichent pas
**Solution** :
1. Vérifier que le node "Send Metrics to Supabase" dans n8n est bien configuré
2. Vérifier l'Authorization header (clé anon Supabase)
3. Vérifier que l'Edge Function `track-workflow-execution` est déployée

---

## 🎉 Résultat Attendu

Après un test run réussi :
- ✅ Toast de succès avec execution_id
- ✅ Métriques mises à jour (visible après 3s)
- ✅ Logs dans Supabase
- ✅ Dashboard client mis à jour automatiquement

**Le workflow est complètement opérationnel depuis l'admin ! 🚀**






