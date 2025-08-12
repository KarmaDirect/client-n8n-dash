-- Create admin impersonation function
CREATE OR REPLACE FUNCTION public.admin_impersonate_user(_target_user_id uuid)
RETURNS TABLE(user_id uuid, email text, organization_id uuid, organization_name text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    _target_user_id as user_id,
    au.email,
    o.id as organization_id,
    o.name as organization_name
  FROM auth.users au
  JOIN public.organizations o ON o.owner_id = au.id
  WHERE au.id = _target_user_id
    AND public.has_role(auth.uid(), 'admin'::app_role);
$$;