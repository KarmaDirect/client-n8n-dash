# 🚀 Installation MCP - Supabase & n8n

> Installation des serveurs MCP (Model Context Protocol) pour interagir avec Supabase et n8n directement depuis Cursor.

## ✅ Installation Terminée

Les packages suivants ont été installés avec succès :

- ✅ `@supabase/mcp-server-supabase` v0.5.7
- ✅ `n8n-mcp` v2.22.7
- ✅ Configuration de base créée dans `~/.cursor/mcp.json`

## 🎯 Prochaines Étapes

### Option 1 : Configuration Automatique (Recommandé)

Lancez le script de configuration interactif :

```bash
./configure-mcp.sh
```

### Option 2 : Configuration Manuelle

1. **Obtenez votre Service Role Key de Supabase** :
   - Allez sur https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/settings/api
   - Copiez la clé **service_role**

2. **Éditez le fichier de configuration** :
   ```bash
   nano ~/.cursor/mcp.json
   ```

3. **Remplacez** `VOTRE_SERVICE_ROLE_KEY_ICI` par votre vraie clé

4. **Redémarrez Cursor**

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| `README-MCP.md` | Ce fichier - Vue d'ensemble |
| `MCP-INSTALLATION-RESUME.md` | Résumé rapide de l'installation |
| `GUIDE-INSTALLATION-MCP.md` | Guide complet avec toutes les instructions |
| `COMMANDES-MCP.md` | Commandes utiles et dépannage |
| `configure-mcp.sh` | Script de configuration interactif |

## 🧪 Test Rapide

Après avoir configuré et redémarré Cursor, testez avec ces commandes :

```
Liste mes tables Supabase
```

```
Montre-moi la structure de la table organizations
```

```
Combien d'utilisateurs ai-je dans ma base ?
```

## 🔧 Configuration Actuelle

Votre projet Supabase :
- **URL** : `https://ijybwfdkiteebytdwhyu.supabase.co`
- **Project ID** : `ijybwfdkiteebytdwhyu`

## 🆘 Besoin d'Aide ?

1. **Problème de configuration** → Consultez `GUIDE-INSTALLATION-MCP.md`
2. **Commandes utiles** → Consultez `COMMANDES-MCP.md`
3. **Dépannage** → Section Dépannage dans `GUIDE-INSTALLATION-MCP.md`

## 🎉 Fonctionnalités Disponibles

Une fois configuré, vous pourrez :

### Avec Supabase MCP :
- 📊 Explorer et lister vos tables
- 🔍 Exécuter des requêtes SQL
- ➕ Créer, lire, mettre à jour, supprimer des données
- 👥 Gérer l'authentification
- 📦 Interagir avec le stockage

### Avec n8n MCP (optionnel) :
- 🔄 Gérer vos workflows
- ▶️ Exécuter des automatisations
- 📈 Consulter l'historique
- 🔧 Créer et modifier des workflows

## ⚠️ Important

**Sécurité** :
- Ne partagez JAMAIS votre `service_role_key`
- Ne commitez JAMAIS `~/.cursor/mcp.json` dans Git
- Cette clé donne un accès COMPLET à votre base de données

## 🔗 Liens Utiles

- [Votre Dashboard Supabase](https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu)
- [Documentation MCP](https://modelcontextprotocol.io/)
- [n8n Cloud](https://n8n.io/cloud)

## 📦 Versions

- Node.js requis : >= 16.x
- npm requis : >= 8.x
- Cursor : Dernière version recommandée

---

**Date d'installation** : 27 octobre 2025  
**Status** : ✅ Prêt à configurer

Pour commencer : `./configure-mcp.sh` ou lisez `MCP-INSTALLATION-RESUME.md`

