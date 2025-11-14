#!/bin/bash

# Script de test pour le workflow "Webhook Test → Send Metrics to SaaS"

N8N_URL="https://primary-production-bdba.up.railway.app"
WEBHOOK_PATH="webstate/test"

# UUIDs d'organisations disponibles (récupérés depuis Supabase)
ORG_IDS=(
  "c49f6419-a638-467e-9514-f2a4e3688190"  # Webstate (Agence)
  "c01db015-7268-40f7-93c5-9965bf2a6c10"  # hatim.moro.2002
  "50b1b60a-3055-4a80-8772-84bd15684b84"  # tesccct
)

echo "🧪 Test du workflow Webhook Test → Send Metrics to SaaS"
echo ""

# Utiliser la première organisation par défaut, ou permettre de choisir
ORG_ID="${1:-${ORG_IDS[0]}}"

echo "📋 Organisation utilisée: $ORG_ID"
echo ""

echo "🔄 Envoi de la requête POST..."
echo ""

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
  "${N8N_URL}/webhook/${WEBHOOK_PATH}" \
  -H 'Content-Type: application/json' \
  -d "{
    \"orgId\": \"${ORG_ID}\",
    \"workflowKey\": \"Webhook Test\"
  }")

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

echo "📥 Réponse HTTP: $HTTP_CODE"
echo ""
echo "📄 Body:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ SUCCÈS ! Le workflow a bien fonctionné."
  echo ""
  echo "🔍 Vérifie maintenant dans Supabase:"
  echo "   - Table: workflow_execution_logs"
  echo "   - Tu devrais voir une nouvelle entrée avec orgId = $ORG_ID"
else
  echo "❌ ERREUR HTTP $HTTP_CODE"
  echo ""
  echo "💡 Vérifie:"
  echo "   - Le workflow est-il activé dans n8n ?"
  echo "   - Les variables Railway sont-elles configurées ?"
  echo "   - Le secret Supabase est-il configuré ?"
fi






