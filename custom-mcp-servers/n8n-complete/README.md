# 🔥 MCP N8N ULTRA-COMPLET v3.0

> Serveur MCP n8n avec **40+ commandes** - Toutes les API n8n disponibles dans Cursor !

## ✨ Fonctionnalités

Ce serveur MCP personnalisé vous donne un **contrôle total** sur votre instance n8n directement depuis Cursor :

- ✅ **7 commandes Workflows** - CRUD complet + activation
- ✅ **4 commandes Executions** - Liste, lecture, suppression, retry
- ✅ **3 commandes Credentials** - Gestion complète des identifiants
- ✅ **5 commandes Tags** - Organisation avec tags
- ✅ **2 commandes Workflow Tags** - Association workflow-tags
- ✅ **4 commandes Variables** - Gestion des variables d'environnement
- ✅ **5 commandes Users** - Administration des utilisateurs
- ✅ **4 commandes Projects** - Gestion des projets
- ✅ **2 commandes Admin** - Source control + audit de sécurité
- ✅ **4 utilitaires** - Recherche, duplication, import/export

**Total : 40+ commandes** pour gérer ABSOLUMENT TOUT ! 🚀

## 🔧 Installation

Le serveur est déjà installé et configuré ! Les dépendances ont été installées automatiquement.

### Configuration

Le serveur est configuré dans `~/.cursor/mcp.json` :

```json
{
  "mcpServers": {
    "n8n-complete": {
      "command": "node",
      "args": [
        "/Users/yasminemoro/Documents/client-n8n-dash/custom-mcp-servers/n8n-complete/index.js"
      ]
    }
  }
}
```

## 🎯 Utilisation dans Cursor

Après avoir redémarré Cursor, utilisez `@n8n-complete` suivi du nom de la commande :

### 📋 WORKFLOWS (7 commandes)

```
@n8n-complete workflow_list
Liste tous vos workflows

@n8n-complete workflow_read {"id": "123"}
Affiche les détails d'un workflow

@n8n-complete workflow_create {"name": "Mon Workflow", "nodes": [...]}
Crée un nouveau workflow

@n8n-complete workflow_update {"id": "123", "data": {...}}
Met à jour un workflow existant

@n8n-complete workflow_delete {"id": "123"}
Supprime un workflow

@n8n-complete workflow_activate {"id": "123"}
Active un workflow

@n8n-complete workflow_deactivate {"id": "123"}
Désactive un workflow
```

### ▶️ EXECUTIONS (4 commandes)

```
@n8n-complete execution_list
Liste toutes les exécutions

@n8n-complete execution_list {"workflowId": "123", "limit": 10}
Liste les exécutions d'un workflow spécifique

@n8n-complete execution_read {"id": "456"}
Affiche les détails d'une exécution

@n8n-complete execution_delete {"id": "456"}
Supprime une exécution

@n8n-complete execution_retry {"id": "456"}
Relance une exécution
```

### 🔑 CREDENTIALS (3 commandes)

```
@n8n-complete credential_list
Liste tous les credentials

@n8n-complete credential_create {"name": "Gmail API", "type": "gmailOAuth2", "data": {...}}
Crée un nouveau credential

@n8n-complete credential_delete {"id": "789"}
Supprime un credential
```

### 🏷️ TAGS (5 commandes)

```
@n8n-complete tag_list
Liste tous les tags

@n8n-complete tag_read {"id": "1"}
Affiche un tag spécifique

@n8n-complete tag_create {"name": "Production"}
Crée un nouveau tag

@n8n-complete tag_update {"id": "1", "name": "Prod"}
Met à jour un tag

@n8n-complete tag_delete {"id": "1"}
Supprime un tag
```

### 🏷️ WORKFLOW TAGS (2 commandes)

```
@n8n-complete workflowTags_list {"workflowId": "123"}
Liste les tags d'un workflow

@n8n-complete workflowTags_update {"workflowId": "123", "tagIds": ["1", "2"]}
Met à jour les tags d'un workflow
```

### 📦 VARIABLES (4 commandes)

```
@n8n-complete variable_list
Liste toutes les variables

@n8n-complete variable_create {"key": "API_KEY", "value": "secret123"}
Crée une nouvelle variable

@n8n-complete variable_update {"id": "1", "value": "newsecret456"}
Met à jour une variable

@n8n-complete variable_delete {"id": "1"}
Supprime une variable
```

### 👥 USERS (5 commandes)

```
@n8n-complete user_list
Liste tous les utilisateurs

@n8n-complete user_read {"id": "1"}
Affiche un utilisateur spécifique

@n8n-complete user_create {"email": "user@example.com", "password": "pass123", "role": "user"}
Crée un nouvel utilisateur

@n8n-complete user_delete {"id": "1"}
Supprime un utilisateur

@n8n-complete user_changeRole {"id": "1", "role": "admin"}
Change le rôle d'un utilisateur
```

### 📁 PROJECTS (4 commandes)

```
@n8n-complete project_list
Liste tous les projets

@n8n-complete project_create {"name": "Client A"}
Crée un nouveau projet

@n8n-complete project_update {"id": "1", "name": "Client A Premium"}
Met à jour un projet

@n8n-complete project_delete {"id": "1"}
Supprime un projet
```

### 🔒 ADMIN (2 commandes)

```
@n8n-complete sourceControl_pull
Effectue un git pull depuis le repository configuré

@n8n-complete securityAudit_generate
Génère un audit de sécurité de l'instance n8n
```

### 🛠️ UTILITIES (4 commandes)

```
@n8n-complete search_workflows {"query": "client"}
Recherche des workflows par nom

@n8n-complete duplicate_workflow {"id": "123", "newName": "Copie du workflow"}
Duplique un workflow existant

@n8n-complete export_workflow {"id": "123"}
Exporte un workflow au format JSON

@n8n-complete import_workflow {"data": {...}}
Importe un workflow depuis JSON
```

## 🎯 Exemples d'Utilisation Pratiques

### Exemple 1 : Créer un workflow simple

```
@n8n-complete workflow_create {
  "name": "Test Webhook",
  "nodes": [
    {
      "id": "webhook-1",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "parameters": {
        "path": "test-hook",
        "httpMethod": "POST"
      }
    }
  ],
  "connections": {}
}
```

### Exemple 2 : Lister et activer un workflow

```
1. @n8n-complete workflow_list
2. (Copier l'ID du workflow)
3. @n8n-complete workflow_activate {"id": "WORKFLOW_ID"}
```

### Exemple 3 : Rechercher et dupliquer

```
1. @n8n-complete search_workflows {"query": "email"}
2. @n8n-complete duplicate_workflow {"id": "123", "newName": "Email Campaign V2"}
```

### Exemple 4 : Gérer les tags

```
1. @n8n-complete tag_create {"name": "Production"}
2. @n8n-complete tag_list
3. @n8n-complete workflowTags_update {"workflowId": "123", "tagIds": ["1"]}
```

## 🔌 Configuration de l'API n8n

Le serveur est préconfiguré avec :

- **API URL** : `https://primary-production-bdba.up.railway.app/api/v1`
- **API Key** : Déjà configurée dans le code

### Modifier la configuration

Pour changer l'instance n8n, éditez `index.js` :

```javascript
const N8N_API_KEY = 'VOTRE_CLE_API';
const N8N_BASE_URL = 'https://votre-instance.n8n.cloud/api/v1';
```

## 📊 Structure des Réponses

Toutes les commandes retournent des réponses formatées :

- ✅ **Succès** : Message de confirmation + données JSON
- ❌ **Erreur** : Message d'erreur détaillé

Exemple de succès :
```
✅ 5 workflows:

[
  {
    "id": "1",
    "name": "Email Campaign",
    "active": true
  },
  ...
]
```

## 🐛 Dépannage

### Le serveur ne démarre pas

1. Vérifiez que les dépendances sont installées :
   ```bash
   cd custom-mcp-servers/n8n-complete
   npm install
   ```

2. Vérifiez que le fichier est exécutable :
   ```bash
   chmod +x index.js
   ```

### Erreur d'authentification

Vérifiez que votre API Key n8n est valide et que l'URL est correcte.

### Commande non reconnue

Assurez-vous d'avoir redémarré Cursor après la configuration.

## 📝 Notes Techniques

- **SDK MCP** : @modelcontextprotocol/sdk v1.20.2
- **HTTP Client** : axios v1.7.9
- **Node.js** : >= 16.x requis
- **Type** : ESM (modules ES6)

## 🔐 Sécurité

⚠️ **IMPORTANT** :

- L'API Key n8n est stockée en clair dans le code
- Ne commitez JAMAIS ce fichier avec votre vraie clé API
- Utilisez des variables d'environnement en production

Pour utiliser des variables d'environnement :

```javascript
const N8N_API_KEY = process.env.N8N_API_KEY || 'fallback_key';
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://default-url.com';
```

## 🚀 Prochaines Étapes

1. **Redémarrez Cursor** pour charger le serveur MCP
2. **Testez** avec `@n8n-complete workflow_list`
3. **Explorez** toutes les 40+ commandes disponibles
4. **Automatisez** votre workflow n8n depuis Cursor !

## 📚 Ressources

- [Documentation n8n API](https://docs.n8n.io/api/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [n8n Community](https://community.n8n.io/)

## 📦 Version

**v3.0.0** - Serveur MCP n8n Ultra-Complet

---

**Créé avec ❤️ pour une automatisation maximale** 🚀

