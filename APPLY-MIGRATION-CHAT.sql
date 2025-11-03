-- Migration: Améliorer support_messages pour système de chat complet
-- Date: 2025-01-31
-- À exécuter dans le SQL Editor de Supabase Dashboard

-- Ajouter les colonnes pour le système de lecture
ALTER TABLE public.support_messages
ADD COLUMN IF NOT EXISTS read BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'archived'));

-- Créer un index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_support_messages_org_created ON public.support_messages(org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_messages_unread ON public.support_messages(org_id, read) WHERE read = false;

-- Fonction pour marquer les messages comme lus
CREATE OR REPLACE FUNCTION public.mark_support_messages_as_read(
  _org_id uuid,
  _author text DEFAULT 'client'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.support_messages
  SET read = true,
      read_at = now()
  WHERE org_id = _org_id
    AND author = _author
    AND read = false;
END;
$$;

-- Vue pour compter les messages non lus par organisation (pour les admins)
CREATE OR REPLACE VIEW public.support_unread_counts AS
SELECT 
  org_id,
  COUNT(*) FILTER (WHERE author = 'client' AND read = false) as unread_client_count,
  COUNT(*) FILTER (WHERE author = 'admin' AND read = false) as unread_admin_count,
  MAX(created_at) FILTER (WHERE read = false) as last_unread_at
FROM public.support_messages
GROUP BY org_id;

-- Grant permissions sur la vue
GRANT SELECT ON public.support_unread_counts TO authenticated;

-- Ajouter une politique UPDATE pour que les admins puissent marquer comme lu
DROP POLICY IF EXISTS admin_update_support_messages ON public.support_messages;
CREATE POLICY admin_update_support_messages
ON public.support_messages
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Permettre aux clients de marquer leurs propres messages comme lus
DROP POLICY IF EXISTS client_update_support_messages ON public.support_messages;
CREATE POLICY client_update_support_messages
ON public.support_messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = support_messages.org_id
      AND (o.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.organization_members m
        WHERE m.org_id = o.id AND m.user_id = auth.uid()
      ))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = support_messages.org_id
      AND (o.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.organization_members m
        WHERE m.org_id = o.id AND m.user_id = auth.uid()
      ))
  )
);

-- Note: Pour activer Realtime sur support_messages, exécuter dans le dashboard Supabase:
-- Aller dans Database > Replication > Ajouter la table "support_messages"

