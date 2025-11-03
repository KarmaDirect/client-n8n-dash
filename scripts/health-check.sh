#!/bin/bash

# Script de vérification de santé du projet WebState
# Usage: ./scripts/health-check.sh

set -e

echo "🏥 Vérification de santé du projet WebState"
echo "=========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Fonction pour vérifier une condition
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅${NC} $1"
    else
        echo -e "${RED}❌${NC} $1"
        ERRORS=$((ERRORS + 1))
    fi
}

warn() {
    echo -e "${YELLOW}⚠️${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

echo "📦 Vérification des dépendances..."
echo ""

# Vérifier Node.js
node --version > /dev/null 2>&1 && check "Node.js installé" || warn "Node.js non installé"

# Vérifier npm
npm --version > /dev/null 2>&1 && check "npm installé" || warn "npm non installé"

# Vérifier les node_modules
[ -d "node_modules" ] && check "node_modules existe" || warn "node_modules manquant (exécuter: npm install)"

echo ""
echo "🗄️ Vérification des migrations SQL..."
echo ""

MIGRATION_COUNT=$(find supabase/migrations -name "*.sql" 2>/dev/null | wc -l | tr -d ' ')
[ "$MIGRATION_COUNT" -gt 0 ] && check "$MIGRATION_COUNT migrations SQL trouvées" || warn "Aucune migration SQL trouvée"

# Vérifier les migrations importantes
[ -f "supabase/migrations/20250127143000_drop_obsolete_tables.sql" ] && check "Migration nettoyage tables obsolètes existe" || warn "Migration nettoyage manquante"

echo ""
echo "⚡ Vérification des Edge Functions..."
echo ""

EDGE_FUNCTIONS=$(ls -1 supabase/functions/ 2>/dev/null | grep -v node_modules | wc -l | tr -d ' ')
[ "$EDGE_FUNCTIONS" -gt 0 ] && check "$EDGE_FUNCTIONS Edge Functions trouvées" || warn "Aucune Edge Function trouvée"

# Vérifier les fonctions importantes
[ -d "supabase/functions/manage-client-workflows" ] && check "Edge Function manage-client-workflows existe" || warn "Edge Function manage-client-workflows manquante"
[ -d "supabase/functions/provision-workflow-pack" ] && check "Edge Function provision-workflow-pack existe" || warn "Edge Function provision-workflow-pack manquante"

echo ""
echo "📁 Vérification de la structure du projet..."
echo ""

[ -f "src/App.tsx" ] && check "src/App.tsx existe" || warn "src/App.tsx manquant"
[ -f "package.json" ] && check "package.json existe" || warn "package.json manquant"
[ -f "vite.config.ts" ] && check "vite.config.ts existe" || warn "vite.config.ts manquant"
[ -f ".gitignore" ] && check ".gitignore existe" || warn ".gitignore manquant"

echo ""
echo "🔍 Vérification des fichiers de configuration..."
echo ""

[ -f "tsconfig.json" ] && check "tsconfig.json existe" || warn "tsconfig.json manquant"
[ -f "tailwind.config.ts" ] && check "tailwind.config.ts existe" || warn "tailwind.config.ts manquant"
[ -f "supabase/config.toml" ] && check "supabase/config.toml existe" || warn "supabase/config.toml manquant"

echo ""
echo "📚 Vérification de la documentation..."
echo ""

[ -f "README.md" ] && check "README.md existe" || warn "README.md manquant"
[ -f "docs/INDEX.md" ] && check "docs/INDEX.md existe" || warn "docs/INDEX.md manquant"
[ -f "docs/ARCHITECTURE.md" ] && check "docs/ARCHITECTURE.md existe" || warn "docs/ARCHITECTURE.md manquant"

echo ""
echo "🔐 Vérification des fichiers sensibles..."
echo ""

# Vérifier qu'il n'y a pas de fichiers sensibles commités
if git ls-files 2>/dev/null | grep -q "\.env"; then
    warn "Fichiers .env détectés dans git (ne devraient pas être commités)"
else
    echo -e "${GREEN}✅${NC} Aucun fichier .env sensible dans git (bonne pratique)"
fi

echo ""
echo "=========================================="
echo "📊 Résumé"
echo "=========================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Projet en bonne santé !${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️ $WARNINGS avertissement(s)${NC}"
    exit 0
else
    echo -e "${RED}❌ $ERRORS erreur(s), $WARNINGS avertissement(s)${NC}"
    exit 1
fi
