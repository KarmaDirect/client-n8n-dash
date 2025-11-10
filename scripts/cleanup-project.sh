#!/bin/bash
# Script de nettoyage et archivage des fichiers obsolètes
# Ne supprime rien, déplace seulement dans les archives

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARCHIVE_ROOT="$ROOT_DIR/docs/archive/root-files"
ARCHIVE_TEMP="$ROOT_DIR/.archive"

echo "🧹 Nettoyage et archivage des fichiers..."

# Créer les dossiers d'archive
mkdir -p "$ARCHIVE_ROOT"
mkdir -p "$ARCHIVE_TEMP"

# Fichiers de debug/fix temporaires à archiver
FIX_FILES=(
  "FIX-UI-DISPARUE.md"
  "FIX-CACHE.md"
  "FIX-VARIABLES-ENV-EDGE-FUNCTION.md"
  "REDEMARRER-SERVEUR.md"
  "COMMENT-VOIR-QUE-CA-MARCHE.md"
  "CREATION-HELLO-WORLD-COMPLETE.md"
  "TEST-HELLO-WORLD.md"
  "EXPLICATION-SIMPLE-FLUX.md"
  "SCHEMA-SAAS-N8N-SIMPLE.md"
  "SCHEMA-DECLENCHEMENT-N8N.md"
  "CORRECTIONS-APPLIQUEES.md"
  "VERIFICATION-SUPABASE-EDGE-FUNCTIONS.md"
  "APPLY-MIGRATION-CHAT.sql"
  "check-tailwind-setup.js"
)

# Fichiers de documentation obsolète
DOC_FILES=(
  "ANALYSE-COMPLETE-PROJET.md"
  "ANALYSE-SYSTEMES-CRITIQUES.md"
  "PLAN-INTEGRATION-TAILARK.md"
  "DOCUMENTATION-NETTOYEE.md"
  "NETTOYAGE-TABLES-OBSOLETES.md"
  "LIVRAISON-FINALE.md"
  "TESTS-E2E-MANUEL.md"
  "ARCHITECTURE-N8N-FINALE.md"
  "WORKFLOWS-50-TEMPLATES-CREES.md"
  "SYSTEME-N8N-COMPLET-OPERATIONNEL.md"
  "DEPLOY-EDGE-FUNCTIONS.md"
  "WORKFLOW-TEMPLATES-SYSTEM-IMPLEMENTED.md"
  "REFONTE-WORKFLOWS-ADMIN.md"
  "RAPPORT-MODIFICATIONS-COMPLET.md"
  "COMMENT-FONCTIONNE-GIT.md"
  "GUIDE-CONFIGURATION-GIT-CURSOR.md"
  "ETAT-AVANCEMENT-ULTRA-DETAILLE.md"
  "AUDIT-HOMOGENEITE-DESIGN.md"
)

# Fichiers suspects (probablement vides ou temporaires)
SUSPECT_FILES=(
  "#onboarding-client"
  "#plan-daction-immédiat"
  "#plan-dinvestissement"
  "#roadmap-scale"
  "#stratégie-prix"
  "~/"
)

# Déplacer les fichiers de fix
echo "📦 Archivage des fichiers de fix..."
for file in "${FIX_FILES[@]}"; do
  if [ -f "$ROOT_DIR/$file" ]; then
    mv "$ROOT_DIR/$file" "$ARCHIVE_ROOT/"
    echo "  ✅ $file → archive"
  fi
done

# Déplacer les fichiers de documentation obsolète
echo "📚 Archivage de la documentation obsolète..."
for file in "${DOC_FILES[@]}"; do
  if [ -f "$ROOT_DIR/$file" ]; then
    mv "$ROOT_DIR/$file" "$ARCHIVE_ROOT/"
    echo "  ✅ $file → archive"
  fi
done

# Déplacer les fichiers suspects
echo "🔍 Archivage des fichiers suspects..."
for file in "${SUSPECT_FILES[@]}"; do
  if [ -e "$ROOT_DIR/$file" ]; then
    mv "$ROOT_DIR/$file" "$ARCHIVE_TEMP/" 2>/dev/null || true
    echo "  ✅ $file → archive temporaire"
  fi
done

# Déplacer le dossier POUR-REPLIT si présent
if [ -d "$ROOT_DIR/POUR-REPLIT" ]; then
  mv "$ROOT_DIR/POUR-REPLIT" "$ARCHIVE_ROOT/"
  echo "  ✅ POUR-REPLIT/ → archive"
fi

echo ""
echo "✅ Nettoyage terminé !"
echo "📁 Fichiers archivés dans :"
echo "   - $ARCHIVE_ROOT (documentation)"
echo "   - $ARCHIVE_TEMP (fichiers temporaires)"
echo ""
echo "💡 Pour restaurer un fichier :"
echo "   mv docs/archive/root-files/FICHIER.md ."
