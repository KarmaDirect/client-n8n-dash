# 🔥 Référence Rapide - Toutes les Commandes n8n MCP

> **40+ commandes** pour contrôler n8n depuis Cursor

## 🚀 Format d'utilisation

```
@n8n-complete COMMANDE {paramètres JSON}
```

---

## 📋 WORKFLOWS (7 commandes)

| Commande | Description | Paramètres |
|----------|-------------|------------|
| `workflow_list` | Liste tous les workflows | - |
| `workflow_read` | Détails d'un workflow | `{"id": "123"}` |
| `workflow_create` | Crée un workflow | `{"name": "...", "nodes": [...], "connections": {...}}` |
| `workflow_update` | Met à jour un workflow | `{"id": "123", "data": {...}}` |
| `workflow_delete` | Supprime un workflow | `{"id": "123"}` |
| `workflow_activate` | Active un workflow | `{"id": "123"}` |
| `workflow_deactivate` | Désactive un workflow | `{"id": "123"}` |

### Exemples rapides
```
@n8n-complete workflow_list
@n8n-complete workflow_read {"id": "123"}
@n8n-complete workflow_activate {"id": "123"}
@n8n-complete workflow_deactivate {"id": "123"}
```

---

## ▶️ EXECUTIONS (4 commandes)

| Commande | Description | Paramètres |
|----------|-------------|------------|
| `execution_list` | Liste les exécutions | `{"workflowId": "123", "limit": 10}` (optionnel) |
| `execution_read` | Détails d'une exécution | `{"id": "456"}` |
| `execution_delete` | Supprime une exécution | `{"id": "456"}` |
| `execution_retry` | Relance une exécution | `{"id": "456"}` |

### Exemples rapides
```
@n8n-complete execution_list
@n8n-complete execution_list {"workflowId": "123", "limit": 10}
@n8n-complete execution_read {"id": "456"}
@n8n-complete execution_retry {"id": "456"}
```

---

## 🔑 CREDENTIALS (3 commandes)

| Commande | Description | Paramètres |
|----------|-------------|------------|
| `credential_list` | Liste les credentials | - |
| `credential_create` | Crée un credential | `{"name": "...", "type": "...", "data": {...}}` |
| `credential_delete` | Supprime un credential | `{"id": "789"}` |

### Exemples rapides
```
@n8n-complete credential_list
@n8n-complete credential_create {"name": "Gmail", "type": "gmailOAuth2", "data": {...}}
@n8n-complete credential_delete {"id": "789"}
```

---

## 🏷️ TAGS (5 commandes)

| Commande | Description | Paramètres |
|----------|-------------|------------|
| `tag_list` | Liste tous les tags | - |
| `tag_read` | Détails d'un tag | `{"id": "1"}` |
| `tag_create` | Crée un tag | `{"name": "Production"}` |
| `tag_update` | Met à jour un tag | `{"id": "1", "name": "Prod"}` |
| `tag_delete` | Supprime un tag | `{"id": "1"}` |

### Exemples rapides
```
@n8n-complete tag_list
@n8n-complete tag_create {"name": "Production"}
@n8n-complete tag_update {"id": "1", "name": "Prod"}
@n8n-complete tag_delete {"id": "1"}
```

---

## 🏷️ WORKFLOW TAGS (2 commandes)

| Commande | Description | Paramètres |
|----------|-------------|------------|
| `workflowTags_list` | Tags d'un workflow | `{"workflowId": "123"}` |
| `workflowTags_update` | Met à jour les tags | `{"workflowId": "123", "tagIds": ["1", "2"]}` |

### Exemples rapides
```
@n8n-complete workflowTags_list {"workflowId": "123"}
@n8n-complete workflowTags_update {"workflowId": "123", "tagIds": ["1", "2", "3"]}
```

---

## 📦 VARIABLES (4 commandes)

| Commande | Description | Paramètres |
|----------|-------------|------------|
| `variable_list` | Liste les variables | - |
| `variable_create` | Crée une variable | `{"key": "API_KEY", "value": "xxx"}` |
| `variable_update` | Met à jour une variable | `{"id": "1", "value": "yyy"}` |
| `variable_delete` | Supprime une variable | `{"id": "1"}` |

### Exemples rapides
```
@n8n-complete variable_list
@n8n-complete variable_create {"key": "STRIPE_KEY", "value": "sk_test_xxx"}
@n8n-complete variable_update {"id": "1", "value": "nouvelle_valeur"}
@n8n-complete variable_delete {"id": "1"}
```

---

## 👥 USERS (5 commandes)

| Commande | Description | Paramètres |
|----------|-------------|------------|
| `user_list` | Liste les utilisateurs | - |
| `user_read` | Détails d'un utilisateur | `{"id": "1"}` |
| `user_create` | Crée un utilisateur | `{"email": "...", "password": "...", "role": "user"}` |
| `user_delete` | Supprime un utilisateur | `{"id": "1"}` |
| `user_changeRole` | Change le rôle | `{"id": "1", "role": "admin"}` |

### Rôles disponibles
- `user` - Utilisateur standard
- `admin` - Administrateur
- `owner` - Propriétaire

### Exemples rapides
```
@n8n-complete user_list
@n8n-complete user_create {"email": "user@test.com", "password": "Pass123!", "role": "user"}
@n8n-complete user_changeRole {"id": "1", "role": "admin"}
@n8n-complete user_delete {"id": "1"}
```

---

## 📁 PROJECTS (4 commandes)

| Commande | Description | Paramètres |
|----------|-------------|------------|
| `project_list` | Liste les projets | - |
| `project_create` | Crée un projet | `{"name": "Client A"}` |
| `project_update` | Met à jour un projet | `{"id": "1", "name": "Client A Pro"}` |
| `project_delete` | Supprime un projet | `{"id": "1"}` |

### Exemples rapides
```
@n8n-complete project_list
@n8n-complete project_create {"name": "Client Premium"}
@n8n-complete project_update {"id": "1", "name": "Client Premium Plus"}
@n8n-complete project_delete {"id": "1"}
```

---

## 🔒 ADMIN (2 commandes)

| Commande | Description | Paramètres |
|----------|-------------|------------|
| `sourceControl_pull` | Pull depuis Git | - |
| `securityAudit_generate` | Génère un audit | - |

### Exemples rapides
```
@n8n-complete sourceControl_pull
@n8n-complete securityAudit_generate
```

---

## 🛠️ UTILITIES (4 commandes)

| Commande | Description | Paramètres |
|----------|-------------|------------|
| `search_workflows` | Recherche workflows | `{"query": "client"}` |
| `duplicate_workflow` | Duplique un workflow | `{"id": "123", "newName": "Copie"}` |
| `export_workflow` | Exporte en JSON | `{"id": "123"}` |
| `import_workflow` | Importe depuis JSON | `{"data": {...}}` |

### Exemples rapides
```
@n8n-complete search_workflows {"query": "email"}
@n8n-complete duplicate_workflow {"id": "123", "newName": "Workflow V2"}
@n8n-complete export_workflow {"id": "123"}
@n8n-complete import_workflow {"data": {...JSON...}}
```

---

## 🎯 TOP 10 Commandes les Plus Utiles

```bash
1. workflow_list                    # Vue d'ensemble
2. workflow_activate {"id": "123"}  # Activer
3. execution_list {"limit": 10}     # Monitoring
4. search_workflows {"query": "x"}  # Recherche
5. duplicate_workflow {...}         # Copier
6. tag_create {"name": "Prod"}      # Organiser
7. variable_list                    # Config
8. credential_list                  # Credentials
9. export_workflow {"id": "123"}    # Backup
10. user_list                       # Admin
```

---

## 📝 Templates de Commandes Complètes

### Créer un workflow simple
```json
@n8n-complete workflow_create {
  "name": "Mon Workflow",
  "nodes": [
    {
      "id": "webhook-1",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "parameters": {
        "path": "mon-hook",
        "httpMethod": "POST"
      }
    }
  ],
  "connections": {}
}
```

### Mettre à jour un workflow
```json
@n8n-complete workflow_update {
  "id": "123",
  "data": {
    "name": "Nouveau nom",
    "active": true,
    "settings": {
      "executionOrder": "v1"
    }
  }
}
```

### Créer un credential Gmail
```json
@n8n-complete credential_create {
  "name": "Gmail Account",
  "type": "gmailOAuth2",
  "data": {
    "oauthTokenData": {
      "access_token": "...",
      "refresh_token": "..."
    }
  }
}
```

---

## 🔍 Filtres et Options

### Executions
```bash
# Toutes les exécutions
@n8n-complete execution_list

# Par workflow
@n8n-complete execution_list {"workflowId": "123"}

# Limitées
@n8n-complete execution_list {"limit": 20}

# Combiné
@n8n-complete execution_list {"workflowId": "123", "limit": 10}
```

---

## ⚡ Raccourcis Pratiques

### Workflow rapide
```bash
# Lister → Activer → Vérifier
@n8n-complete workflow_list
@n8n-complete workflow_activate {"id": "ID"}
@n8n-complete execution_list {"workflowId": "ID", "limit": 5}
```

### Debug rapide
```bash
# Executions récentes → Détails → Retry
@n8n-complete execution_list {"limit": 5}
@n8n-complete execution_read {"id": "EXEC_ID"}
@n8n-complete execution_retry {"id": "EXEC_ID"}
```

### Organisation rapide
```bash
# Créer tag → Appliquer
@n8n-complete tag_create {"name": "Production"}
@n8n-complete workflowTags_update {"workflowId": "123", "tagIds": ["TAG_ID"]}
```

---

## 📊 Codes de Réponse

### Succès ✅
```
✅ Message de confirmation
[Données JSON formatées]
```

### Erreur ❌
```
❌ Error: Message d'erreur
[Détails si disponibles]
```

---

## 🎓 Apprentissage Progressif

### Niveau 1 - Débutant
```
workflow_list
workflow_read
execution_list
tag_list
```

### Niveau 2 - Intermédiaire
```
workflow_activate/deactivate
execution_retry
tag_create
search_workflows
duplicate_workflow
```

### Niveau 3 - Avancé
```
workflow_create/update
credential_create
variable_create
user_create
project_create
```

### Niveau 4 - Expert
```
import_workflow
export_workflow
sourceControl_pull
securityAudit_generate
```

---

## 🆘 Aide Rapide

Pour plus d'informations :
- **Guide complet** : `N8N-MCP-GUIDE-COMPLET.md`
- **README** : `custom-mcp-servers/n8n-complete/README.md`
- **Doc API n8n** : https://docs.n8n.io/api/

---

**🔥 40+ Commandes - Contrôle Total sur n8n ! 🚀**

