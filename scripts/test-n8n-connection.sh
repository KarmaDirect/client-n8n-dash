#!/bin/bash

# Script de test de connexion à l'API n8n
# Ce script teste si l'URL et la clé API sont correctes

echo "🧪 Test de connexion à l'API n8n"
echo "================================="
echo ""

# Configuration
N8N_URL="${N8N_API_URL:-https://primary-production-bdba.up.railway.app}"
N8N_KEY="${N8N_API_KEY}"

if [ -z "$N8N_KEY" ]; then
    echo "❌ Erreur: N8N_API_KEY n'est pas définie"
    echo ""
    echo "Pour tester, définissez la variable:"
    echo "  export N8N_API_KEY='votre-cle-api'"
    exit 1
fi

# Normaliser l'URL (enlever /api/v1 si présent)
BASE_URL="${N8N_URL%/api/v1}"
BASE_URL="${BASE_URL%/}"

echo "📍 URL de base: $BASE_URL"
echo "🔑 Clé API: ${N8N_KEY:0:20}..."
echo ""

# Test 1: Récupérer la liste des workflows
echo "Test 1: Liste des workflows"
echo "---------------------------"
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X GET \
  "$BASE_URL/api/v1/workflows" \
  -H "X-N8N-API-KEY: $N8N_KEY" \
  -H "Content-Type: application/json")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Succès (HTTP $HTTP_CODE)"
    echo "Réponse (premiers 200 caractères):"
    echo "$BODY" | head -c 200
    echo "..."
else
    echo "❌ Erreur (HTTP $HTTP_CODE)"
    echo "Réponse:"
    echo "$BODY" | head -c 500
    echo ""
fi

echo ""
echo ""

# Test 2: Récupérer un workflow spécifique
echo "Test 2: Workflow 'Hello World Test' (ID: DcbL3KktSssdT3Es)"
echo "-----------------------------------------------------------"
RESPONSE=$(curl -s -w "\n%{http_code}\n%{content_type}" \
  -X GET \
  "$BASE_URL/api/v1/workflows/DcbL3KktSssdT3Es" \
  -H "X-N8N-API-KEY: $N8N_KEY" \
  -H "Content-Type: application/json")

CONTENT_TYPE=$(echo "$RESPONSE" | tail -n1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n2 | head -n1)
BODY=$(echo "$RESPONSE" | sed '$d' | sed '$d')

echo "Content-Type: $CONTENT_TYPE"
if [ "$HTTP_CODE" = "200" ]; then
    if echo "$CONTENT_TYPE" | grep -q "application/json"; then
        echo "✅ Succès (HTTP $HTTP_CODE, Content-Type: JSON)"
        echo "Nom du workflow:"
        echo "$BODY" | grep -o '"name":"[^"]*"' | head -1
    else
        echo "⚠️  HTTP 200 mais Content-Type non-JSON: $CONTENT_TYPE"
        echo "Cela indique un problème de configuration!"
        echo "Réponse (premiers 500 caractères):"
        echo "$BODY" | head -c 500
    fi
else
    echo "❌ Erreur (HTTP $HTTP_CODE)"
    echo "Réponse:"
    echo "$BODY" | head -c 500
fi

echo ""
echo ""

# Résumé
if [ "$HTTP_CODE" = "200" ] && echo "$CONTENT_TYPE" | grep -q "application/json"; then
    echo "✅ Tous les tests réussis!"
    echo ""
    echo "Configuration correcte pour Supabase:"
    echo "  N8N_API_URL = $BASE_URL"
    echo "  N8N_API_KEY = $N8N_KEY"
else
    echo "❌ Les tests ont échoué"
    echo ""
    echo "Vérifiez:"
    echo "  1. Que l'URL est correcte: $BASE_URL"
    echo "  2. Que la clé API est valide et autorise l'accès API"
    echo "  3. Que l'API n8n est activée dans Settings → API"
fi






