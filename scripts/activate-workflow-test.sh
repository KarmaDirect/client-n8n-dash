#!/bin/bash

# Script pour activer le workflow "Webhook Test → Send Metrics to SaaS"

WORKFLOW_ID="VqlDtuCWSztdPCVY"
N8N_API_URL="${N8N_API_URL:-https://primary-production-bdba.up.railway.app}"
N8N_API_KEY="${N8N_API_KEY}"

if [ -z "$N8N_API_KEY" ]; then
  echo "❌ Erreur: N8N_API_KEY n'est pas définie"
  echo "Configure-la avec: export N8N_API_KEY='ta-cle-api'"
  exit 1
fi

echo "🔄 Activation du workflow $WORKFLOW_ID..."

RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH \
  "${N8N_API_URL}/api/v1/workflows/${WORKFLOW_ID}" \
  -H "X-N8N-API-KEY: ${N8N_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"active": true}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Workflow activé avec succès !"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
  echo "❌ Erreur HTTP $HTTP_CODE"
  echo "$BODY"
  exit 1
fi




