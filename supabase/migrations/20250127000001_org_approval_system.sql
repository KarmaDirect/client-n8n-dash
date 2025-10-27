-- Migration: Système d'approbation des organisations + auto-création à l'inscription
-- Cette migration ajoute:
-- 1. Champ "approved" pour valider manuellement les comptes
-- 2. Trigger pour créer automatiquement l'organisation à l'inscription
-- 3. Policies RLS pour bloquer l'accès si non approuvé

-- ============================================================================
-- 1. AJOUTER LE CHAMP "approved" À LA TABLE organizations
-- ============================================================================

ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT false;

-- Mettre à jour les organisations existantes (les approuver automatiquement)
UPDATE public.organizations 
SET approved = true 
WHERE approved = false;

-- ============================================================================
-- 2. FONCTION POUR AUTO-CRÉER L'ORGANISATION À L'INSCRIPTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  org_name TEXT;
  new_org_id UUID;
  is_admin BOOLEAN;
BEGIN
  -- Vérifier si l'utilisateur a le rôle admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = NEW.id AND role = 'admin'
  ) INTO is_admin;
  
  -- Extraire le nom de l'organisation depuis l'email
  org_name := 'Organisation de ' || split_part(NEW.email, '@', 1);
  
  -- Créer l'organisation
  -- Si admin → approved = true automatiquement
  -- Si user normal → approved = false (nécessite validation manuelle)
  INSERT INTO public.organizations (name, owner_id, approved)
  VALUES (org_name, NEW.id, is_admin)
  RETURNING id INTO new_org_id;
  
  -- Ajouter l'utilisateur comme owner dans organization_members
  INSERT INTO public.organization_members (org_id, user_id, role)
  VALUES (new_org_id, NEW.id, 'owner');
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, logger mais ne pas bloquer la création du user
    RAISE WARNING 'Erreur lors de la création de l''organisation pour %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. CRÉER LE TRIGGER SUR auth.users
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 4. MODIFIER LES POLICIES RLS POUR BLOQUER SI NON APPROUVÉ
-- ============================================================================

-- Policy pour workflows: bloquer si org non approuvée (sauf admins)
DROP POLICY IF EXISTS workflows_select_members ON public.workflows;
CREATE POLICY workflows_select_members
ON public.workflows FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = workflows.org_id
      AND o.approved = true  -- ✅ Nouvelle condition
      AND (
        public.user_is_org_member(auth.uid(), o.id)
        OR public.has_role(auth.uid(), 'admin')
      )
  )
  OR public.has_role(auth.uid(), 'admin')  -- Admin voit tout
);

-- Policy pour workflow_runs: bloquer si org non approuvée (sauf admins)
DROP POLICY IF EXISTS runs_select_members ON public.workflow_runs;
CREATE POLICY runs_select_members
ON public.workflow_runs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workflows w
    JOIN public.organizations o ON o.id = w.org_id
    WHERE w.id = workflow_runs.workflow_id
      AND o.approved = true  -- ✅ Nouvelle condition
      AND (
        public.user_is_org_member(auth.uid(), o.id)
        OR public.has_role(auth.uid(), 'admin')
      )
  )
  OR public.has_role(auth.uid(), 'admin')  -- Admin voit tout
);

-- Policy pour sites: bloquer si org non approuvée (sauf admins)
DROP POLICY IF EXISTS sites_select_members ON public.sites;
CREATE POLICY sites_select_members
ON public.sites FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = sites.org_id
      AND o.approved = true  -- ✅ Nouvelle condition
      AND (
        public.user_is_org_member(auth.uid(), o.id)
        OR public.has_role(auth.uid(), 'admin')
      )
  )
  OR public.has_role(auth.uid(), 'admin')  -- Admin voit tout
);

-- Policy pour leads: bloquer si org non approuvée (sauf admins)
DROP POLICY IF EXISTS leads_select_members ON public.leads;
CREATE POLICY leads_select_members
ON public.leads FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = leads.org_id
      AND o.approved = true  -- ✅ Nouvelle condition
      AND (
        public.user_is_org_member(auth.uid(), o.id)
        OR public.has_role(auth.uid(), 'admin')
      )
  )
  OR public.has_role(auth.uid(), 'admin')  -- Admin voit tout
);

-- ============================================================================
-- 5. FONCTION RPC POUR APPROUVER UNE ORGANISATION (ADMIN SEULEMENT)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.approve_organization(org_id_param UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Unauthorized: Admin role required'
    );
  END IF;
  
  -- Approuver l'organisation
  UPDATE public.organizations
  SET approved = true, updated_at = now()
  WHERE id = org_id_param;
  
  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Organisation approuvée avec succès',
      'org_id', org_id_param
    );
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Organisation non trouvée'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. FONCTION RPC POUR REJETER UNE ORGANISATION (ADMIN SEULEMENT)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.reject_organization(org_id_param UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Unauthorized: Admin role required'
    );
  END IF;
  
  -- Supprimer l'organisation (cascade sur organization_members, workflows, etc.)
  DELETE FROM public.organizations
  WHERE id = org_id_param;
  
  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Organisation rejetée et supprimée',
      'org_id', org_id_param
    );
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Organisation non trouvée'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. VUE POUR LISTER LES ORGANISATIONS EN ATTENTE (ADMIN SEULEMENT)
-- ============================================================================

CREATE OR REPLACE VIEW public.pending_organizations AS
SELECT 
  o.id,
  o.name,
  o.owner_id,
  u.email as owner_email,
  o.created_at,
  o.approved
FROM public.organizations o
JOIN auth.users u ON u.id = o.owner_id
WHERE o.approved = false
ORDER BY o.created_at DESC;

-- Grant access to authenticated users (RLS will filter)
GRANT SELECT ON public.pending_organizations TO authenticated;

-- RLS sur la vue (admin seulement)
ALTER VIEW public.pending_organizations SET (security_invoker = true);

-- ============================================================================
-- COMMENTAIRES
-- ============================================================================

COMMENT ON COLUMN public.organizations.approved IS 'Indique si l''organisation a été approuvée par un admin. false = en attente de validation.';
COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger automatique: crée une organisation lors de l''inscription d''un nouvel utilisateur.';
COMMENT ON FUNCTION public.approve_organization(UUID) IS 'Fonction RPC (admin seulement): approuve une organisation en attente.';
COMMENT ON FUNCTION public.reject_organization(UUID) IS 'Fonction RPC (admin seulement): rejette et supprime une organisation en attente.';
COMMENT ON VIEW public.pending_organizations IS 'Vue (admin seulement): liste toutes les organisations en attente d''approbation.';




