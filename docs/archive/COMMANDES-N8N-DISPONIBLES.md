# 🎯 Commandes n8n Disponibles avec le Serveur Custom

Votre serveur custom est configuré avec votre API key n8n. Voici **TOUTES** les actions disponibles :

## 📋 WORKFLOWS (7 commandes)

### 1. Lister tous les workflows
```
@n8n-complete workflow_list
```

### 2. Lire un workflow spécifique
```
@n8n-complete workflow_read {"id": "123"}
```

### 3. Créer un workflow
```
@n8n-complete workflow_create {"name": "Mon Workflow", "nodes": [...], "connections": {}}
```

### 4-7. Mettre à jour, supprimer, activer, désactiver
```
@n8n-complete workflow_update {"id": "123", "data": {...}}
@n8n-complete workflow_delete {"id": "123"}
@n8n-complete workflow_activate {"id": "123"}
@n8n-complete workflow_deactivate {"id": "123"}
```

## ▶️ EXECUTIONS (4 commandes)

```
@n8n-complete execution_list
@n8n-complete execution_read {"id": "456"}
@n8n-complete execution_delete {"id": "456"}
@n8n-complete execution_retry {"id": "456"}
```

## 🔑 CREDENTIALS, TAGS, VARIABLES (12 commandes)

### Credentials
```
@n8n-complete credential_list
@n8n-complete credential_create {...}
@n8n-complete credential_delete {"id": "789"}
```

### Tags
```
@n8n-complete tag_list
@n8n-complete tag_create {"name": "Production"}
@n8n-complete tag_update {"id": "1", "name": "Prod"}
@n8n-complete tag_delete {"id": "1"}
```

### Variables
```
@n8n-complete variable_list
@n8n-complete variable_create {"key": "API_KEY", "value": "secret"}
@n8n-complete variable_update {"id": "1", "value": "new"}
@n8n-complete variable_delete {"id": "1"}
```

## 👥 USERS, PROJECTS (9 commandes)

### Users
```
@n8n-complete user_list
@n8n-complete user_create {"email": "user@test.com", "password": "pass"}
@n8n-complete user_changeRole {"id": "1", "role": "admin"}
```

### Projects  
```
@n8n-complete project_list
@n8n-complete project_create {"name": "Client A"}
@n8n-complete project_update {"id": "1", "name": "Updated"}
@n8n-complete project_delete {"id": "1"}
```

## 🛠️ UTILITIES (4 commandes)

```
@n8n-complete search_workflows {"query": "client"}
@n8n-complete duplicate_workflow {"id": "123", "newName": "Copie"}
@n8n-complete export_workflow {"id": "123"}
@n8n-complete import_workflow {"data": {...}}
```

## 🎯 Top 5 Commandes Essentielles

```bash
@n8n-complete workflow_list
@n8n-complete workflow_activate {"id": "123"}
@n8n-complete execution_list {"limit": 10}
@n8n-complete search_workflows {"query": "email"}
@n8n-complete export_workflow {"id": "123"}
```

## 📊 Total : 40+ Commandes !

**Toutes les commandes sont détaillées dans :**
- `N8N-COMMANDES-REFERENCE.md`
- `N8N-MCP-GUIDE-COMPLET.md`

## ✅ Configuration

Votre API key n8n est **déjà configurée** dans le serveur custom. 

**Redémarrez Cursor et testez :**
```
@n8n-complete workflow_list
```

**🎉 Contrôle TOTAL sur n8n !** 🚀
