# 🛠️ Commandes Utiles pour MCP

## 📋 Vérification de l'installation

### Vérifier les packages installés
```bash
npm list -g @supabase/mcp-server-supabase n8n-mcp
```

### Voir la configuration actuelle
```bash
cat ~/.cursor/mcp.json
```

### Éditer la configuration
```bash
nano ~/.cursor/mcp.json
# ou
code ~/.cursor/mcp.json
```

## 🔧 Configuration Rapide

### Script interactif (Recommandé)
```bash
./configure-mcp.sh
```

### Configuration manuelle Supabase uniquement
```bash
cat > ~/.cursor/mcp.json << 'EOF'
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase",
        "https://ijybwfdkiteebytdwhyu.supabase.co",
        "VOTRE_SERVICE_ROLE_KEY"
      ],
      "env": {
        "SUPABASE_URL": "https://ijybwfdkiteebytdwhyu.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "VOTRE_SERVICE_ROLE_KEY"
      }
    }
  }
}
EOF
```

N'oubliez pas de remplacer `VOTRE_SERVICE_ROLE_KEY` !

## 🔍 Obtenir vos clés

### Supabase Service Role Key
1. Ouvrir : https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/settings/api
2. Copier la clé **service_role**

### n8n API Key
1. Se connecter à votre instance n8n
2. Aller dans **Settings** → **API** 
3. Créer une nouvelle clé API

## 🧪 Tests

### Tester la connexion Supabase (depuis le terminal)
```bash
npx -y @supabase/mcp-server-supabase https://ijybwfdkiteebytdwhyu.supabase.co VOTRE_KEY
```

### Tester dans Cursor
Après le redémarrage de Cursor, essayez :
- "Quelles sont mes tables Supabase ?"
- "Liste les utilisateurs dans la table users"
- "Montre-moi la structure de la table organizations"

## 🔄 Réinstallation

### Si vous devez réinstaller
```bash
# Désinstaller
npm uninstall -g @supabase/mcp-server-supabase n8n-mcp

# Réinstaller
npm install -g @supabase/mcp-server-supabase n8n-mcp
```

### Mise à jour vers les dernières versions
```bash
npm update -g @supabase/mcp-server-supabase n8n-mcp
```

## 🗑️ Désinstallation

### Supprimer les packages
```bash
npm uninstall -g @supabase/mcp-server-supabase n8n-mcp
```

### Supprimer la configuration
```bash
rm ~/.cursor/mcp.json
```

## 🐛 Dépannage

### Vérifier les permissions du fichier de configuration
```bash
ls -la ~/.cursor/mcp.json
chmod 600 ~/.cursor/mcp.json  # Si nécessaire
```

### Voir les logs d'erreur de Cursor
Ouvrir Cursor → **Help** → **Toggle Developer Tools** → **Console**

### Vérifier que Node.js et npm fonctionnent
```bash
node --version
npm --version
```

### Nettoyer le cache npm
```bash
npm cache clean --force
```

## 📦 Versions installées

- `@supabase/mcp-server-supabase`: v0.5.7
- `n8n-mcp`: v2.22.7

Dernière mise à jour : 27 octobre 2025

## 🔗 Liens utiles

- [Supabase Dashboard](https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu)
- [Documentation MCP](https://modelcontextprotocol.io/)
- [n8n Cloud](https://n8n.io/cloud)

## ⚠️ Sécurité

**NE JAMAIS :**
- Committer `~/.cursor/mcp.json` dans Git
- Partager vos clés API
- Exposer votre service_role_key publiquement

**La service_role_key donne un accès COMPLET à votre base de données !**

