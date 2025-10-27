# 📦 Installation MCP - Résumé Rapide

## ✅ Ce qui a été fait

1. **Installation des packages MCP** ✓
   - `@supabase/mcp-server-supabase` (v0.5.7)
   - `n8n-mcp` (v2.22.7)

2. **Création du fichier de configuration** ✓
   - Fichier : `~/.cursor/mcp.json`
   - Configuration de base créée

3. **Documentation créée** ✓
   - `GUIDE-INSTALLATION-MCP.md` - Guide complet
   - `configure-mcp.sh` - Script de configuration interactif

## 🔧 Ce qu'il reste à faire

### Étape 1 : Obtenir votre Service Role Key Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez le projet : `ijybwfdkiteebytdwhyu`
3. **Settings** → **API**
4. Copiez la clé **service_role** (secret)

### Étape 2 : Configurer n8n (optionnel)

Si vous avez n8n :
1. Obtenez l'URL de votre instance
2. Créez une clé API dans n8n

Si vous n'avez pas n8n, vous pouvez :
- Utiliser n8n Cloud : https://n8n.io/cloud
- Ou l'ignorer pour l'instant

### Étape 3 : Mettre à jour la configuration

**Option A - Script automatique** (Recommandé) :
```bash
./configure-mcp.sh
```

**Option B - Manuellement** :
Éditez `~/.cursor/mcp.json` et remplacez :
- `VOTRE_SERVICE_ROLE_KEY_ICI` par votre vraie clé Supabase
- `VOTRE_URL_N8N_ICI` et `VOTRE_CLE_API_N8N_ICI` (si vous utilisez n8n)

### Étape 4 : Redémarrer Cursor

Fermez et rouvrez Cursor complètement.

## 🧪 Test

Une fois Cursor redémarré, testez avec :
- "Liste les tables de ma base de données Supabase"
- "Montre-moi mes workflows n8n" (si configuré)

## 📚 Documentation

- **Guide complet** : `GUIDE-INSTALLATION-MCP.md`
- **Configuration actuelle** : `~/.cursor/mcp.json`

## 🆘 Besoin d'aide ?

Consultez le fichier `GUIDE-INSTALLATION-MCP.md` pour :
- Instructions détaillées
- Dépannage
- Exemples de configuration
- Ressources utiles

---

**Note** : Seul Supabase est obligatoire. n8n est optionnel.

