-- Migration: Créer une vue sécurisée pour AdminApprovals.tsx
-- Cette vue remplace l'utilisation dangereuse de auth.admin.listUsers() côté client
-- Date: 27 janvier 2025

-- ============================================================================
-- VUE SÉCURISÉE: pending_organizations_with_emails
-- ============================================================================

-- Cette vue joint les organisations non approuvées avec les emails des propriétaires
-- Elle est accessible uniquement aux admins via security_invoker

CREATE OR REPLACE VIEW public.pending_organizations_with_emails AS
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

-- ============================================================================
-- PERMISSIONS ET SÉCURITÉ
-- ============================================================================

-- Accorder la permission SELECT aux utilisateurs authentifiés
GRANT SELECT ON public.pending_organizations_with_emails TO authenticated;

-- Activer security_invoker: la vue s'exécute avec les permissions de l'utilisateur
-- Cela permet au RLS de s'appliquer correctement
ALTER VIEW public.pending_organizations_with_emails SET (security_invoker = true);

-- ============================================================================
-- DOCUMENTATION
-- ============================================================================

COMMENT ON VIEW public.pending_organizations_with_emails IS 
'Vue sécurisée pour afficher les organisations en attente avec les emails des propriétaires.
Utilisée par AdminApprovals.tsx pour éviter auth.admin.listUsers() côté client.
Accessible uniquement aux admins grâce à security_invoker qui applique les RLS policies.
Le RLS vérifie que l''utilisateur a le rôle "admin" dans user_roles.';

-- ============================================================================
-- NOTES DE SÉCURITÉ
-- ============================================================================

-- ✅ AVANT (DANGEREUX):
-- const { data: users } = await supabase.auth.admin.listUsers();
-- Problème: Nécessite la Service Role Key côté client (faille de sécurité)

-- ✅ APRÈS (SÉCURISÉ):
-- const { data } = await supabase.from("pending_organizations_with_emails").select("*");
-- Solution: Vue SQL qui s'exécute côté serveur avec les bonnes permissions

-- Le RLS existant sur la table organizations garantit que seuls les admins
-- peuvent accéder aux données via cette vue.


