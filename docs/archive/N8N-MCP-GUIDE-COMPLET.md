# 🚀 Guide Complet - Serveur MCP n8n Ultra-Complet

## 📦 Installation Terminée ! ✅

Votre serveur MCP n8n personnalisé avec **40+ commandes** est maintenant installé et prêt à l'emploi !

### Ce qui a été fait :

1. ✅ Création du serveur MCP personnalisé dans `custom-mcp-servers/n8n-complete/`
2. ✅ Installation des dépendances (@modelcontextprotocol/sdk, axios)
3. ✅ Configuration dans `~/.cursor/mcp.json`
4. ✅ Connexion à votre instance n8n Railway

## 🎯 Démarrage Rapide

### Étape 1 : Redémarrer Cursor

**Fermez complètement Cursor et relancez-le** pour charger le nouveau serveur MCP.

### Étape 2 : Tester la connexion

Dans le chat Cursor, tapez :

```
@n8n-complete workflow_list
```

Vous devriez voir la liste de vos workflows n8n ! 🎉

## 📋 Toutes les Commandes (40+)

### 🔥 TOP 10 Commandes les Plus Utiles

```
1. @n8n-complete workflow_list
   📋 Liste tous vos workflows

2. @n8n-complete workflow_activate {"id": "WORKFLOW_ID"}
   ✅ Active un workflow

3. @n8n-complete execution_list {"limit": 10}
   📊 Voir les dernières exécutions

4. @n8n-complete search_workflows {"query": "client"}
   🔎 Rechercher des workflows

5. @n8n-complete duplicate_workflow {"id": "123", "newName": "Copie"}
   📋 Dupliquer un workflow

6. @n8n-complete tag_create {"name": "Production"}
   🏷️ Créer un tag

7. @n8n-complete variable_list
   📦 Voir les variables d'environnement

8. @n8n-complete credential_list
   🔑 Voir les credentials

9. @n8n-complete export_workflow {"id": "123"}
   💾 Exporter un workflow

10. @n8n-complete user_list
    👥 Voir les utilisateurs
```

### 📋 WORKFLOWS - 7 commandes

#### 1. Lister tous les workflows
```
@n8n-complete workflow_list
```

**Résultat** : Liste avec ID, nom et statut actif/inactif

#### 2. Lire un workflow spécifique
```
@n8n-complete workflow_read {"id": "123"}
```

**Résultat** : Tous les détails du workflow (nodes, connections, settings)

#### 3. Créer un workflow
```
@n8n-complete workflow_create {
  "name": "Mon Nouveau Workflow",
  "nodes": [
    {
      "id": "webhook-1",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "parameters": {
        "path": "mon-webhook",
        "httpMethod": "POST"
      }
    }
  ],
  "connections": {}
}
```

#### 4. Mettre à jour un workflow
```
@n8n-complete workflow_update {
  "id": "123",
  "data": {
    "name": "Nouveau nom",
    "active": true
  }
}
```

#### 5. Supprimer un workflow
```
@n8n-complete workflow_delete {"id": "123"}
```

⚠️ **Attention** : Suppression définitive !

#### 6. Activer un workflow
```
@n8n-complete workflow_activate {"id": "123"}
```

#### 7. Désactiver un workflow
```
@n8n-complete workflow_deactivate {"id": "123"}
```

### ▶️ EXECUTIONS - 4 commandes

#### 1. Lister toutes les exécutions
```
@n8n-complete execution_list
```

**Avec filtres** :
```
@n8n-complete execution_list {"workflowId": "123", "limit": 20}
```

#### 2. Lire une exécution
```
@n8n-complete execution_read {"id": "456"}
```

**Résultat** : Données complètes de l'exécution, statut, temps d'exécution

#### 3. Supprimer une exécution
```
@n8n-complete execution_delete {"id": "456"}
```

#### 4. Relancer une exécution
```
@n8n-complete execution_retry {"id": "456"}
```

**Résultat** : Nouvelle exécution avec nouvel ID

### 🔑 CREDENTIALS - 3 commandes

#### 1. Lister les credentials
```
@n8n-complete credential_list
```

#### 2. Créer un credential
```
@n8n-complete credential_create {
  "name": "Gmail Account",
  "type": "gmailOAuth2",
  "data": {
    "oauthTokenData": {...}
  }
}
```

#### 3. Supprimer un credential
```
@n8n-complete credential_delete {"id": "789"}
```

### 🏷️ TAGS - 5 commandes

#### 1. Lister tous les tags
```
@n8n-complete tag_list
```

#### 2. Lire un tag
```
@n8n-complete tag_read {"id": "1"}
```

#### 3. Créer un tag
```
@n8n-complete tag_create {"name": "Production"}
```

#### 4. Mettre à jour un tag
```
@n8n-complete tag_update {"id": "1", "name": "Prod"}
```

#### 5. Supprimer un tag
```
@n8n-complete tag_delete {"id": "1"}
```

### 🏷️ WORKFLOW TAGS - 2 commandes

#### 1. Lister les tags d'un workflow
```
@n8n-complete workflowTags_list {"workflowId": "123"}
```

#### 2. Mettre à jour les tags d'un workflow
```
@n8n-complete workflowTags_update {
  "workflowId": "123",
  "tagIds": ["1", "2", "3"]
}
```

### 📦 VARIABLES - 4 commandes

#### 1. Lister les variables
```
@n8n-complete variable_list
```

#### 2. Créer une variable
```
@n8n-complete variable_create {
  "key": "STRIPE_API_KEY",
  "value": "sk_test_xxxxx"
}
```

#### 3. Mettre à jour une variable
```
@n8n-complete variable_update {
  "id": "1",
  "value": "nouvelle_valeur"
}
```

#### 4. Supprimer une variable
```
@n8n-complete variable_delete {"id": "1"}
```

### 👥 USERS - 5 commandes

#### 1. Lister les utilisateurs
```
@n8n-complete user_list
```

#### 2. Lire un utilisateur
```
@n8n-complete user_read {"id": "1"}
```

#### 3. Créer un utilisateur
```
@n8n-complete user_create {
  "email": "nouvel.user@example.com",
  "password": "SecurePass123!",
  "role": "user"
}
```

**Rôles disponibles** : `user`, `admin`, `owner`

#### 4. Supprimer un utilisateur
```
@n8n-complete user_delete {"id": "1"}
```

#### 5. Changer le rôle d'un utilisateur
```
@n8n-complete user_changeRole {
  "id": "1",
  "role": "admin"
}
```

### 📁 PROJECTS - 4 commandes

#### 1. Lister les projets
```
@n8n-complete project_list
```

#### 2. Créer un projet
```
@n8n-complete project_create {"name": "Client A"}
```

#### 3. Mettre à jour un projet
```
@n8n-complete project_update {
  "id": "1",
  "name": "Client A Premium"
}
```

#### 4. Supprimer un projet
```
@n8n-complete project_delete {"id": "1"}
```

### 🔒 ADMIN - 2 commandes

#### 1. Git Pull (Source Control)
```
@n8n-complete sourceControl_pull
```

**Utilité** : Synchroniser avec votre repository Git

#### 2. Audit de sécurité
```
@n8n-complete securityAudit_generate
```

**Utilité** : Génère un rapport de sécurité de votre instance

### 🛠️ UTILITIES - 4 commandes

#### 1. Rechercher des workflows
```
@n8n-complete search_workflows {"query": "email"}
```

**Recherche** : Dans les noms de workflows (insensible à la casse)

#### 2. Dupliquer un workflow
```
@n8n-complete duplicate_workflow {
  "id": "123",
  "newName": "Copie - Email Campaign"
}
```

**Résultat** : Nouveau workflow créé, désactivé par défaut

#### 3. Exporter un workflow
```
@n8n-complete export_workflow {"id": "123"}
```

**Résultat** : JSON complet du workflow (prêt à être sauvegardé)

#### 4. Importer un workflow
```
@n8n-complete import_workflow {
  "data": {
    "name": "Workflow Importé",
    "nodes": [...],
    "connections": {...}
  }
}
```

## 🎯 Scénarios d'Utilisation Pratiques

### Scénario 1 : Déploiement d'un nouveau client

```bash
# 1. Créer un projet
@n8n-complete project_create {"name": "Client Nouveau"}

# 2. Créer un tag
@n8n-complete tag_create {"name": "Client-Nouveau"}

# 3. Dupliquer un workflow template
@n8n-complete duplicate_workflow {"id": "TEMPLATE_ID", "newName": "Client Nouveau - Workflow"}

# 4. Associer les tags
@n8n-complete workflowTags_update {"workflowId": "NEW_WORKFLOW_ID", "tagIds": ["TAG_ID"]}

# 5. Activer le workflow
@n8n-complete workflow_activate {"id": "NEW_WORKFLOW_ID"}
```

### Scénario 2 : Debugging d'un workflow qui échoue

```bash
# 1. Lister les exécutions du workflow
@n8n-complete execution_list {"workflowId": "123", "limit": 10}

# 2. Voir les détails de l'exécution qui a échoué
@n8n-complete execution_read {"id": "FAILED_EXECUTION_ID"}

# 3. Relancer l'exécution
@n8n-complete execution_retry {"id": "FAILED_EXECUTION_ID"}
```

### Scénario 3 : Migration de workflows

```bash
# 1. Exporter le workflow source
@n8n-complete export_workflow {"id": "SOURCE_ID"}

# 2. (Copier le JSON)

# 3. Importer dans nouvelle instance
@n8n-complete import_workflow {"data": {...JSON_COPIÉ...}}
```

### Scénario 4 : Gestion des credentials

```bash
# 1. Lister les credentials existants
@n8n-complete credential_list

# 2. Créer un nouveau credential
@n8n-complete credential_create {
  "name": "Stripe Prod",
  "type": "stripeApi",
  "data": {"apiKey": "sk_live_xxx"}
}
```

### Scénario 5 : Administration des utilisateurs

```bash
# 1. Créer un nouvel utilisateur
@n8n-complete user_create {
  "email": "nouveau@client.com",
  "password": "TempPass123!",
  "role": "user"
}

# 2. Promouvoir en admin si nécessaire
@n8n-complete user_changeRole {"id": "USER_ID", "role": "admin"}
```

## 💡 Astuces & Best Practices

### 1. Toujours tester d'abord

Avant de modifier un workflow en production :
```bash
@n8n-complete workflow_deactivate {"id": "PROD_ID"}
# Faire vos modifications
@n8n-complete workflow_activate {"id": "PROD_ID"}
```

### 2. Sauvegardes régulières

Exportez régulièrement vos workflows importants :
```bash
@n8n-complete export_workflow {"id": "IMPORTANT_ID"}
```

### 3. Organisation avec tags

Créez des tags pour organiser :
- Par client : `Client-A`, `Client-B`
- Par environnement : `Production`, `Staging`, `Dev`
- Par type : `Email`, `CRM`, `Analytics`

### 4. Surveillance des exécutions

Vérifiez régulièrement les exécutions :
```bash
@n8n-complete execution_list {"limit": 20}
```

### 5. Variables pour les secrets

Utilisez des variables pour les clés API :
```bash
@n8n-complete variable_create {"key": "API_SECRET", "value": "xxx"}
```

## 🔐 Sécurité

### ⚠️ IMPORTANT

1. **API Key** : Votre clé API n8n est stockée dans `index.js`
   - Ne commitez JAMAIS ce fichier avec la vraie clé
   - Utilisez `.gitignore` pour exclure ce fichier

2. **Credentials** : Les credentials sont sensibles
   - Ne les affichez jamais dans les logs
   - Utilisez toujours HTTPS

3. **Permissions** : Vérifiez les permissions utilisateur
   - Donnez le minimum de droits nécessaires
   - Auditez régulièrement

## 🐛 Dépannage

### Problème : Commandes non reconnues

**Solution** :
1. Redémarrez Cursor complètement
2. Vérifiez `~/.cursor/mcp.json`
3. Vérifiez que les dépendances sont installées

### Problème : Erreur d'authentification

**Solution** :
1. Vérifiez votre API Key dans `index.js`
2. Vérifiez que l'URL de l'API est correcte
3. Testez la connexion depuis le terminal :
   ```bash
   curl -H "X-N8N-API-KEY: YOUR_KEY" https://your-instance.n8n.cloud/api/v1/workflows
   ```

### Problème : Timeout

**Solution** :
- L'instance n8n peut être lente ou indisponible
- Vérifiez l'état de votre instance n8n

## 📊 Statistiques

Avec ce serveur MCP, vous pouvez gérer :

- ✅ Workflows (CRUD complet)
- ✅ Executions (monitoring & retry)
- ✅ Credentials (gestion sécurisée)
- ✅ Tags (organisation)
- ✅ Variables (configuration)
- ✅ Users (administration)
- ✅ Projects (multi-tenancy)
- ✅ Source Control (Git)
- ✅ Security Audit (monitoring)

**Total : 40+ commandes pour un contrôle TOTAL** ! 🚀

## 🎉 Prochaines Étapes

1. **Redémarrez Cursor**
2. **Testez** : `@n8n-complete workflow_list`
3. **Explorez** toutes les commandes
4. **Automatisez** vos workflows depuis Cursor !

## 📚 Ressources Utiles

- [Documentation n8n API](https://docs.n8n.io/api/)
- [n8n Community](https://community.n8n.io/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Votre instance n8n](https://primary-production-bdba.up.railway.app)

---

**🔥 Vous avez maintenant le CONTRÔLE TOTAL sur n8n depuis Cursor !** 🚀

**Bonne automatisation** ! ⚡

