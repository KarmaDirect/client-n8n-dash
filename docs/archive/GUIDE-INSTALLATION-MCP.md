# 🚀 Guide d'Installation des Serveurs MCP pour n8n et Supabase

## ✅ Étapes Complétées

Les packages MCP ont été installés avec succès :
- ✅ `@supabase/mcp-server-supabase` - Serveur MCP pour Supabase
- ✅ `n8n-mcp` - Serveur MCP pour n8n

Le fichier de configuration `~/.cursor/mcp.json` a été créé.

## 📋 Étapes Restantes

### 1. Configuration de Supabase MCP

Vous devez obtenir votre **Service Role Key** depuis Supabase :

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet : `ijybwfdkiteebytdwhyu`
3. Allez dans **Settings** → **API**
4. Copiez la clé **service_role** (⚠️ ATTENTION : Cette clé est secrète et donne un accès complet à votre base de données)

Ensuite, mettez à jour le fichier `~/.cursor/mcp.json` :

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase",
        "https://ijybwfdkiteebytdwhyu.supabase.co",
        "VOTRE_SERVICE_ROLE_KEY_ICI"
      ],
      "env": {
        "SUPABASE_URL": "https://ijybwfdkiteebytdwhyu.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "VOTRE_SERVICE_ROLE_KEY_ICI"
      }
    }
  }
}
```

Remplacez `VOTRE_SERVICE_ROLE_KEY_ICI` par votre vraie clé.

### 2. Configuration de n8n MCP

Pour configurer n8n, vous avez besoin de :

#### Option A : Si vous avez déjà une instance n8n

1. **Obtenir l'URL de votre instance n8n**
   - Exemple : `https://votre-instance.n8n.cloud` ou `http://localhost:5678`

2. **Créer une clé API n8n** :
   - Connectez-vous à votre instance n8n
   - Allez dans **Settings** → **API**
   - Créez une nouvelle clé API
   - Copiez la clé générée

3. **Mettre à jour le fichier `~/.cursor/mcp.json`** :

```json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": [
        "-y",
        "n8n-mcp"
      ],
      "env": {
        "N8N_API_URL": "https://votre-instance.n8n.cloud",
        "N8N_API_KEY": "votre_cle_api_n8n"
      }
    }
  }
}
```

#### Option B : Si vous n'avez pas encore d'instance n8n

Vous avez plusieurs options :

**1. n8n Cloud (Recommandé pour démarrer rapidement)**
- Créez un compte sur [https://n8n.io/cloud](https://n8n.io/cloud)
- Plan gratuit disponible avec 5000 exécutions/mois
- Configuration automatique

**2. Auto-hébergement avec Docker**

```bash
# Installation rapide avec Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

Ensuite, accédez à `http://localhost:5678` et créez votre compte.

**3. Installation globale avec npm**

```bash
npm install -g n8n
n8n start
```

### 3. Vérification de l'Installation

Une fois les configurations complétées :

1. **Redémarrez Cursor** pour que les changements prennent effet
2. Les serveurs MCP devraient maintenant être disponibles dans Cursor
3. Vous pourrez interagir avec Supabase et n8n directement depuis Cursor

### 4. Test de la Configuration

Pour tester si tout fonctionne :

1. Ouvrez Cursor
2. Dans le chat, essayez des commandes comme :
   - "Liste les tables de ma base de données Supabase"
   - "Montre-moi mes workflows n8n"

## 🔐 Sécurité

⚠️ **IMPORTANT** :
- Ne partagez JAMAIS votre `service_role_key` Supabase
- Ne commitez JAMAIS le fichier `~/.cursor/mcp.json` dans Git
- Gardez vos clés API secrètes

## 📚 Ressources Utiles

### Documentation Supabase MCP
- [Package npm](https://www.npmjs.com/package/@supabase/mcp-server-supabase)
- [Documentation Supabase](https://supabase.com/docs)

### Documentation n8n MCP
- [Package npm](https://www.npmjs.com/package/n8n-mcp)
- [Documentation n8n](https://docs.n8n.io/)

### Model Context Protocol (MCP)
- [Documentation officielle MCP](https://modelcontextprotocol.io/)
- [SDK TypeScript](https://www.npmjs.com/package/@modelcontextprotocol/sdk)

## 🆘 Dépannage

### Problème : Le serveur MCP ne démarre pas

**Solution** :
```bash
# Vérifier que les packages sont bien installés
npm list -g @supabase/mcp-server-supabase n8n-mcp

# Réinstaller si nécessaire
npm install -g @supabase/mcp-server-supabase n8n-mcp
```

### Problème : Erreur d'authentification Supabase

**Solution** :
- Vérifiez que votre `service_role_key` est correcte
- Vérifiez que l'URL Supabase est correcte
- Assurez-vous qu'il n'y a pas d'espaces dans les clés

### Problème : Impossible de se connecter à n8n

**Solution** :
- Vérifiez que votre instance n8n est en cours d'exécution
- Vérifiez l'URL (avec ou sans `/` à la fin)
- Vérifiez que la clé API est valide

## 📝 Configuration Finale

Voici un exemple de configuration complète :

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase",
        "https://ijybwfdkiteebytdwhyu.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example..."
      ],
      "env": {
        "SUPABASE_URL": "https://ijybwfdkiteebytdwhyu.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example..."
      }
    },
    "n8n": {
      "command": "npx",
      "args": [
        "-y",
        "n8n-mcp"
      ],
      "env": {
        "N8N_API_URL": "https://votre-instance.n8n.cloud",
        "N8N_API_KEY": "n8n_api_xxxxxxxxxxxxx"
      }
    }
  }
}
```

## ✨ Fonctionnalités Disponibles

### Avec Supabase MCP, vous pourrez :
- 📊 Lister et explorer vos tables
- ➕ Créer, lire, mettre à jour et supprimer des données
- 🔍 Exécuter des requêtes SQL
- 👥 Gérer les utilisateurs et l'authentification
- 📦 Interagir avec le stockage de fichiers

### Avec n8n MCP, vous pourrez :
- 🔄 Lister et gérer vos workflows
- ▶️ Exécuter des workflows
- 📈 Consulter l'historique des exécutions
- 🔧 Créer et modifier des workflows
- 🔗 Gérer les connexions et credentials

## 🎉 Prochaines Étapes

Une fois l'installation terminée, vous pourrez :
1. Automatiser des tâches entre Supabase et n8n
2. Créer des workflows directement depuis Cursor
3. Interroger votre base de données en langage naturel
4. Déboguer et optimiser vos workflows n8n

Bonne automatisation ! 🚀

