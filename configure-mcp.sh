#!/bin/bash

# Script de configuration des serveurs MCP pour Supabase et n8n
# Ce script vous aide à configurer facilement vos serveurs MCP

echo "🚀 Configuration des Serveurs MCP pour Supabase et n8n"
echo "========================================================"
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fichier de configuration MCP
MCP_CONFIG="$HOME/.cursor/mcp.json"

# Vérifier si le fichier existe
if [ ! -f "$MCP_CONFIG" ]; then
    echo -e "${RED}❌ Erreur: Le fichier $MCP_CONFIG n'existe pas${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Fichier de configuration trouvé: $MCP_CONFIG${NC}"
echo ""

# Configuration Supabase
echo "📦 Configuration de Supabase MCP"
echo "--------------------------------"
echo ""
echo "Votre URL Supabase: https://ijybwfdkiteebytdwhyu.supabase.co"
echo ""
echo -e "${YELLOW}Pour obtenir votre Service Role Key:${NC}"
echo "1. Allez sur https://supabase.com/dashboard"
echo "2. Sélectionnez votre projet"
echo "3. Allez dans Settings → API"
echo "4. Copiez la clé 'service_role'"
echo ""
read -p "Entrez votre Supabase Service Role Key: " SUPABASE_KEY
echo ""

# Configuration n8n
echo "⚙️  Configuration de n8n MCP"
echo "----------------------------"
echo ""
echo -e "${YELLOW}Avez-vous déjà une instance n8n? (o/n)${NC}"
read -p "> " HAS_N8N
echo ""

if [ "$HAS_N8N" = "o" ] || [ "$HAS_N8N" = "O" ]; then
    read -p "Entrez l'URL de votre instance n8n (ex: https://votre-instance.n8n.cloud): " N8N_URL
    echo ""
    echo -e "${YELLOW}Pour créer une clé API n8n:${NC}"
    echo "1. Connectez-vous à votre instance n8n"
    echo "2. Allez dans Settings → API"
    echo "3. Créez une nouvelle clé API"
    echo ""
    read -p "Entrez votre clé API n8n: " N8N_KEY
else
    echo -e "${YELLOW}Vous devez d'abord installer n8n. Options:${NC}"
    echo ""
    echo "1. n8n Cloud (Recommandé): https://n8n.io/cloud"
    echo "2. Docker: docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n"
    echo "3. npm: npm install -g n8n && n8n start"
    echo ""
    echo "Après l'installation, relancez ce script."
    exit 0
fi

echo ""
echo "💾 Mise à jour de la configuration..."

# Créer le nouveau fichier de configuration
cat > "$MCP_CONFIG" << EOF
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase",
        "https://ijybwfdkiteebytdwhyu.supabase.co",
        "$SUPABASE_KEY"
      ],
      "env": {
        "SUPABASE_URL": "https://ijybwfdkiteebytdwhyu.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "$SUPABASE_KEY"
      }
    },
    "n8n": {
      "command": "npx",
      "args": [
        "-y",
        "n8n-mcp"
      ],
      "env": {
        "N8N_API_URL": "$N8N_URL",
        "N8N_API_KEY": "$N8N_KEY"
      }
    }
  }
}
EOF

echo ""
echo -e "${GREEN}✅ Configuration terminée avec succès!${NC}"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Redémarrez Cursor pour appliquer les changements"
echo "2. Testez la configuration en demandant à Cursor:"
echo "   - 'Liste les tables de ma base de données Supabase'"
echo "   - 'Montre-moi mes workflows n8n'"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Ne partagez jamais vos clés API!${NC}"
echo ""
echo "🎉 Installation terminée! Bonne automatisation!"

