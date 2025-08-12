-- 1) Function to check membership without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.user_is_org_member(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members m
    WHERE m.user_id = _user_id AND m.org_id = _org_id
  );
$$;

-- 2) Fix recursive policy on organization_members (SELECT)
DROP POLICY IF EXISTS org_members_select ON public.organization_members;
CREATE POLICY org_members_select
ON public.organization_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = organization_members.org_id
      AND (o.owner_id = auth.uid() OR public.user_is_org_member(auth.uid(), o.id))
  )
);

-- Keep existing admin-wide select policy as-is
-- 3) Update organizations select policy to avoid referencing org_members directly
DROP POLICY IF EXISTS orgs_select_members ON public.organizations;
CREATE POLICY orgs_select_members
ON public.organizations
FOR SELECT
USING (
  owner_id = auth.uid() OR public.user_is_org_member(auth.uid(), id)
);

-- Admins already have a global select policy on organizations (admin_select_all_organizations)

-- 4) Allow admins to reply to clients (insert support messages)
CREATE POLICY IF NOT EXISTS admin_insert_support_messages
ON public.support_messages
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));