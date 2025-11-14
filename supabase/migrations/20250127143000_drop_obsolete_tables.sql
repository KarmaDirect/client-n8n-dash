-- =============================================
-- Migration: Suppression des tables obsolètes
-- Date: 27 janvier 2025
-- Description: Suppression des 5 tables de l'ancienne architecture (mini-GoHighLevel)
--              Pivot vers architecture n8n pure
-- =============================================

-- Vérification: Toutes ces tables ont 0 lignes (vérifié le 27/01/2025)

-- =============================================
-- 1. SUPPRESSION DES TABLES OBSOLÈTES
-- =============================================

-- Table: sites (ancienne gestion de sites web)
-- Raison: Ancienne architecture abandonnée, 0 lignes
-- Utilisation frontend: src/components/dashboard/SiteSection.tsx (à supprimer)
DROP TABLE IF EXISTS public.sites CASCADE;

-- Table: pages (ancien page builder)
-- Raison: Ancienne architecture abandonnée, 0 lignes
-- Utilisation frontend: src/components/dashboard/SiteSection.tsx (à supprimer)
DROP TABLE IF EXISTS public.pages CASCADE;

-- Table: documents (ancien file storage)
-- Raison: Ancienne architecture abandonnée, 0 lignes
-- Utilisation frontend: Aucune
DROP TABLE IF EXISTS public.documents CASCADE;

-- Table: events (ancien analytics/tracking)
-- Raison: Ancienne architecture abandonnée, 0 lignes
-- Utilisation frontend: src/pages/Admin.tsx (à supprimer), src/components/dashboard/ActivitySection.tsx (à supprimer)
DROP TABLE IF EXISTS public.events CASCADE;

-- Table: leads (ancien CRM leads)
-- Raison: Ancienne architecture abandonnée, 0 lignes
-- Utilisation frontend: src/pages/Admin.tsx (à supprimer), src/components/dashboard/ActivitySection.tsx (à supprimer)
DROP TABLE IF EXISTS public.leads CASCADE;

-- =============================================
-- 2. NETTOYAGE DES POLICIES RLS (si elles existent)
-- =============================================

-- Les policies sont automatiquement supprimées avec CASCADE

-- =============================================
-- 3. VÉRIFICATION POST-SUPPRESSION
-- =============================================

-- Lister les tables restantes
DO $$
BEGIN
  RAISE NOTICE '✅ Tables supprimées: sites, pages, documents, events, leads';
  RAISE NOTICE '📊 Tables restantes: %', (
    SELECT COUNT(*) 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  );
END $$;

-- =============================================
-- 4. COMMENTAIRES
-- =============================================

COMMENT ON SCHEMA public IS 'Schéma principal - Architecture n8n pure (tables obsolètes supprimées le 27/01/2025)';

-- =============================================
-- 5. ACTIONS FRONTEND REQUISES
-- =============================================

-- FICHIERS À SUPPRIMER:
-- - src/components/dashboard/SiteSection.tsx
-- - src/components/dashboard/ActivitySection.tsx (ou refactoriser pour utiliser workflow_executions)
--
-- FICHIERS À MODIFIER:
-- - src/pages/Admin.tsx (supprimer les références à leads et events)
-- - src/pages/Dashboard.tsx (supprimer SiteSection et ActivitySection si utilisés)
-- - src/integrations/supabase/types.ts (supprimer les types Sites, Pages, Documents, Events, Leads)










