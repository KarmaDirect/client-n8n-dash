# 🔍 Vérification Connexion Workflow "Hello World Test"

## Objectif
Vérifier que le workflow "Hello World Test" est bien connecté entre n8n et Supabase, et que le SaaS peut le contrôler (activer/désactiver).

---

## 📋 Checklist de Vérification

### ✅ 1. Vérifier dans n8n
**URL** : https://primary-production-bdba.up.railway.app

- [ ] Workflow "Hello World Test" existe (ID: `DcbL3KktSssdT3Es`)
- [ ] Webhook configuré avec path: `/webhook/hello-world-test`
- [ ] Workflow inactif par défaut (active: false)

### ✅ 2. Vérifier dans Supabase
**Requête SQL** :
```sql
-- Vérifier le template
SELECT id, name, n8n_template_id, pack_level 
FROM workflow_templates 
WHERE name = 'Hello World Test';

-- Vérifier les workflows provisionnés
SELECT id, name, n8n_workflow_id, is_active, org_id 
FROM workflows 
WHERE name LIKE '%Hello World%';
```

**Attendu** :
- Template existe avec `n8n_template_id = 'DcbL3KktSssdT3Es'`
- Workflows provisionnés pour les clients (optionnel)

### ✅ 3. Tester l'API Webhook n8n
```bash
# Test du webhook
curl -X POST https://primary-production-bdba.up.railway.app/webhook/hello-world-test \
  -H "Content-Type: application/json" \
  -d '{"test": "Hello World"}'
```

**Réponse attendue** :
```json
{
  "message": "Hello World from n8n! 🚀",
  "client_id": "unknown",
  "triggered_at": "2025-01-29T...",
  "status": "ok",
  "itemsProcessed": 1,
  "workflow_executed": true,
  "execution_time": "2025-01-29T..."
}
```

### ✅ 4. Vérifier la synchronisation Supabase → n8n
**Dans le dashboard client (`/app/automations`)** :
- [ ] Le workflow "Hello World Test" apparaît dans la liste
- [ ] L'ID n8n est visible (`n8n_workflow_id`)
- [ ] Bouton "Activer/Désactiver" fonctionne

**Test d'activation** :
1. Cliquer sur "Activer" le workflow
2. Vérifier dans n8n que le workflow devient actif
3. Vérifier dans Supabase que `is_active = true`

**Test de désactivation** :
1. Cliquer sur "Désactiver" le workflow
2. Vérifier dans n8n que le workflow devient inactif
3. Vérifier dans Supabase que `is_active = false`

### ✅ 5. Vérifier les métriques
**Requête SQL** :
```sql
-- Vérifier les exécutions trackées
SELECT * FROM workflow_execution_logs 
WHERE workflow_id = (SELECT id FROM workflows WHERE name LIKE '%Hello World%' LIMIT 1)
ORDER BY created_at DESC 
LIMIT 5;

-- Vérifier les métriques agrégées
SELECT * FROM workflow_metrics 
WHERE workflow_id = (SELECT id FROM workflows WHERE name LIKE '%Hello World%' LIMIT 1)
ORDER BY date DESC 
LIMIT 5;
```

**Attendu après exécution** :
- Logs dans `workflow_execution_logs`
- Métriques agrégées dans `workflow_metrics`

---

## 🛠️ Corrections à Apporter

### Si le workflow n'apparaît pas dans Supabase :
1. **Provisionner le workflow** via Admin → `/admin/workflows`
2. Sélectionner un client
3. Cocher "Hello World Test" dans l'onglet Start
4. Cliquer sur "Provisionner"

### Si l'activation/désactivation ne fonctionne pas :
1. Vérifier les variables d'environnement de l'Edge Function :
   - `N8N_API_URL`
   - `N8N_API_KEY`
2. Vérifier que l'Edge Function `manage-client-workflows` est déployée
3. Tester l'Edge Function manuellement :
```bash
curl -X POST https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/manage-client-workflows \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "activate",
    "workflow_id": "WORKFLOW_ID",
    "n8n_workflow_id": "DcbL3KktSssdT3Es"
  }'
```

### Si les métriques ne sont pas trackées :
1. Vérifier que le workflow n8n a bien le node "Track Execution"
2. Vérifier l'URL dans le node : `https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/track-workflow-execution`
3. Vérifier l'Authorization header avec la clé anon Supabase

---

## 📊 Résultat Attendu

Après vérification complète :
- ✅ Workflow visible dans `/app/automations`
- ✅ Activation/désactivation fonctionnelle
- ✅ Métriques trackées après exécution
- ✅ Webhook accessible depuis le dashboard
- ✅ Documents générés visibles dans `/app/documents` (si le workflow génère des fichiers)






