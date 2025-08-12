-- Create a SECURITY DEFINER function for admins to list all organizations regardless of RLS
create or replace function public.admin_list_organizations()
returns setof public.organizations
language sql
stable
security definer
set search_path = public
as $$
  select o.*
  from public.organizations o
  where public.has_role(auth.uid(), 'admin'::app_role);
$$;

-- Optional: ensure execute permission for authenticated users (default is public)
grant execute on function public.admin_list_organizations() to authenticated;