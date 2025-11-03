#!/bin/bash

# Script de test direct de l'API n8n avec curl
# Utilisation: ./scripts/test-n8n-api-curl.sh VOTRE_CLE_API

echo "🧪 Test de l'API n8n avec curl"
echo "==============================="
echo ""

# Vérifier si la clé API est fournie
if [ -z "$1" ]; then
    echo "❌ Erreur: Veuillez fournir votre clé API n8n"
    echo ""
    echo "Usage:"
    echo "  ./scripts/test-n8n-api-curl.sh VOTRE_CLE_API"
    echo ""
    echo "Pour obtenir votre clé API:"
    echo "  1. Allez sur: https://primary-production-bdba.up.railway.app"
    echo "  2. Settings → API"
    echo "  3. Copiez votre clé API (ou créez-en une nouvelle)"
    exit 1
fi

N8N_API_KEY="$1"
N8N_BASE_URL="https://primary-production-bdba.up.railway.app"
WORKFLOW_ID="DcbL3KktSssdT3Es"

echo "📍 URL de base: $N8N_BASE_URL"
echo "🔑 Clé API: ${N8N_API_KEY:0:30}..."
echo "📋 Workflow ID: $WORKFLOW_ID"
echo ""
echo "Test en cours..."
echo ""

# Test 1: Récupérer le workflow "Hello World Test"
echo "Test 1: Récupération du workflow 'Hello World Test'"
echo "----------------------------------------------------"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}\nCONTENT_TYPE:%{content_type}" \
  -X GET \
  "${N8N_BASE_URL}/api/v1/workflows/${WORKFLOW_ID}" \
  -H "X-N8N-API-KEY: ${N8N_API_KEY}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json")

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
CONTENT_TYPE=$(echo "$RESPONSE" | grep "CONTENT_TYPE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d' | sed '/CONTENT_TYPE:/d')

echo "Status HTTP: $HTTP_CODE"
echo "Content-Type: $CONTENT_TYPE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    if echo "$CONTENT_TYPE" | grep -q "application/json"; then
        echo "✅ SUCCÈS! L'API retourne du JSON"
        echo ""
        echo "Réponse (premiers 200 caractères):"
        echo "$BODY" | head -c 200
        echo "..."
        echo ""
        echo "✅ Votre clé API fonctionne correctement!"
        echo ""
        echo "Vérifiez maintenant que la même clé est configurée dans Supabase:"
        echo "  - Supabase Dashboard → Functions → manage-client-workflows"
        echo "  - Settings → Environment variables"
        echo "  - N8N_API_KEY doit être exactement: ${N8N_API_KEY:0:30}..."
    else
        echo "❌ PROBLÈME: HTTP 200 mais Content-Type = $CONTENT_TYPE (attendu: application/json)"
        echo ""
        echo "Cela signifie que n8n retourne du HTML au lieu de JSON."
        echo "Réponse HTML (premiers 300 caractères):"
        echo "$BODY" | head -c 300
        echo ""
        echo ""
        echo "🔧 Solutions possibles:"
        echo "  1. Vérifiez que la clé API est valide dans n8n Settings → API"
        echo "  2. Vérifiez que l'API publique est activée dans n8n"
        echo "  3. Recréez une nouvelle clé API dans n8n"
    fi
elif [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
    echo "❌ ERREUR: Authentification échouée (HTTP $HTTP_CODE)"
    echo ""
    echo "La clé API est invalide ou n'a pas les bonnes permissions."
    echo ""
    echo "🔧 Solutions:"
    echo "  1. Vérifiez que la clé API correspond exactement à celle dans n8n"
    echo "  2. Créez une nouvelle clé API dans n8n Settings → API"
    echo "  3. Vérifiez que l'API publique est activée"
elif [ "$HTTP_CODE" = "404" ]; then
    echo "❌ ERREUR: Workflow non trouvé (HTTP 404)"
    echo ""
    echo "Le workflow avec l'ID $WORKFLOW_ID n'existe pas dans n8n."
    echo ""
    echo "Vérifiez que le workflow 'Hello World Test' existe bien."
else
    echo "❌ ERREUR: HTTP $HTTP_CODE"
    echo ""
    echo "Réponse:"
    echo "$BODY" | head -c 500
fi

echo ""
echo "Test terminé."




