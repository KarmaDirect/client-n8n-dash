-- Migration: Ajouter le statut 'pending_validation' pour les workflows
-- Permet de marquer un workflow comme "en attente de validation manuelle par le tech"

-- Modifier le CHECK constraint pour inclure 'pending_validation'
ALTER TABLE public.workflows 
  DROP CONSTRAINT IF EXISTS valid_workflow_status;

ALTER TABLE public.workflows 
  ADD CONSTRAINT valid_workflow_status 
  CHECK (status IN ('active', 'pending_config', 'pending_validation', 'paused', 'error', 'archived'));

-- Mettre à jour les workflows existants en 'pending_config' vers 'pending_validation' si besoin
-- (optionnel, on peut laisser tel quel)

COMMENT ON COLUMN public.workflows.status IS 'Status: active (opérationnel), pending_config (attente config), pending_validation (attente validation tech), paused, error, archived';




