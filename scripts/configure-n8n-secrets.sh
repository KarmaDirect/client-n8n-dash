#!/bin/bash

# Script pour configurer les secrets de l'Edge Function n8n-health-check
# Utilise l'API Supabase Management pour configurer les variables d'environnement

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_REF="ijybwfdkiteebytdwhyu"
FUNCTION_NAME="n8n-health-check"

# Valeurs à configurer
N8N_API_URL="https://primary-production-bdba.up.railway.app/api/v1"
N8N_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YTg2Y2Q4ZC1jMTU2LTQxMTktOThlNy0wNDhkOTkyMjI5NjAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxNTcwMzkzfQ.WASEs8nkVKJaq-wERh8g3t4ri5HJoRvrOw_swZP9kl4"

echo -e "${GREEN}🔧 Configuration des secrets pour ${FUNCTION_NAME}...${NC}"

# Méthode 1: Essayer avec Supabase CLI
if command -v supabase &> /dev/null; then
    echo -e "${BLUE}Méthode 1: Utilisation de Supabase CLI...${NC}"
    
    # Vérifier si l'utilisateur est connecté
    if supabase projects list &> /dev/null 2>&1; then
        echo -e "${GREEN}✅ Supabase CLI détecté et connecté${NC}"
        
        echo -e "\n${GREEN}Configuration de N8N_API_URL...${NC}"
        supabase secrets set N8N_API_URL="${N8N_API_URL}" --project-ref "${PROJECT_REF}" && echo -e "${GREEN}✅ N8N_API_URL configuré${NC}" || echo -e "${YELLOW}⚠️  N8N_API_URL peut déjà être configuré${NC}"

        echo -e "\n${GREEN}Configuration de N8N_API_KEY...${NC}"
        supabase secrets set N8N_API_KEY="${N8N_API_KEY}" --project-ref "${PROJECT_REF}" && echo -e "${GREEN}✅ N8N_API_KEY configuré${NC}" || echo -e "${YELLOW}⚠️  N8N_API_KEY peut déjà être configuré${NC}"
        
        echo -e "\n${GREEN}✅ Secrets configurés avec succès!${NC}"
        echo -e "${YELLOW}Note: Les secrets sont partagés entre toutes les Edge Functions du projet.${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠️  Vous devez vous connecter avec: supabase login${NC}"
    fi
fi

# Méthode 2: Instructions manuelles
echo -e "\n${BLUE}Méthode 2: Configuration manuelle via Dashboard${NC}"
echo -e "${YELLOW}Si la CLI ne fonctionne pas, configurez manuellement:${NC}"
echo ""
echo -e "${GREEN}1. Allez sur: https://supabase.com/dashboard/project/${PROJECT_REF}/functions${NC}"
echo -e "${GREEN}2. Cliquez sur la fonction: ${FUNCTION_NAME}${NC}"
echo -e "${GREEN}3. Cliquez sur 'Settings' → 'Environment variables'${NC}"
echo -e "${GREEN}4. Ajoutez les secrets suivants:${NC}"
echo ""
echo -e "${BLUE}Secret 1:${NC}"
echo -e "  Nom: ${GREEN}N8N_API_URL${NC}"
echo -e "  Valeur: ${GREEN}${N8N_API_URL}${NC}"
echo ""
echo -e "${BLUE}Secret 2:${NC}"
echo -e "  Nom: ${GREEN}N8N_API_KEY${NC}"
echo -e "  Valeur: ${GREEN}${N8N_API_KEY}${NC}"
echo ""
echo -e "${YELLOW}Note: Ces secrets sont partagés entre toutes les Edge Functions.${NC}"
echo -e "${YELLOW}Si vous les avez déjà configurés pour d'autres fonctions, ils sont déjà disponibles.${NC}"
