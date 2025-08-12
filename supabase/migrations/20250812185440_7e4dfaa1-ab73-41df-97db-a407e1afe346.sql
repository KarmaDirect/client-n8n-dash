
-- 1) Fonction pour tester l'appartenance à une organisation sans déclencher de récursion RLS
create or replace function public.user_is_org_member(_user_id uuid, _org_id uuid)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select
    exists (
      select 1
      from public.organizations o
      where o.id = _org_id
        and o.owner_id = _user_id
    )
    or exists (
      select 1
      from public.organization_members m
      where m.org_id = _org_id
        and m.user_id = _user_id
    );
$$;

-- 2) Corriger la récursion sur organization_members: politique SELECT basée sur la fonction
drop policy if exists org_members_select on public.organization_members;
create policy org_members_select
on public.organization_members
for select
using (
  public.user_is_org_member(auth.uid(), organization_members.org_id)
  or public.has_role(auth.uid(), 'admin'::app_role)
);

-- 3) Simplifier et durcir la policy de lecture sur organizations (utilise la même fonction + admin)
drop policy if exists orgs_select_members on public.organizations;
create policy orgs_select_members
on public.organizations
for select
using (
  public.user_is_org_member(auth.uid(), organizations.id)
  or public.has_role(auth.uid(), 'admin'::app_role)
);

-- 4) S'assurer que l'admin peut insérer des messages support (au cas où la policy n'est pas en place)
drop policy if exists admin_insert_support_messages on public.support_messages;
create policy admin_insert_support_messages
on public.support_messages
for insert
with check (public.has_role(auth.uid(), 'admin'::app_role));

-- 5) Liste blanche des comptes admin: ne garder l'admin que pour ces emails,
--    et retirer le rôle admin à tous les autres (sécurisation immédiate).
do $$
declare
  allowed_ids uuid[];
begin
  select array_agg(id) into allowed_ids
  from auth.users
  where email in ('contact@webstate.fr', 'contact@webstate.com');

  if allowed_ids is not null then
    -- Retirer "admin" à quiconque n'est pas dans la liste blanche
    delete from public.user_roles
    where role = 'admin'::app_role
      and not (user_id = any(allowed_ids));

    -- Ajouter "admin" pour les comptes autorisés s'il manque
    insert into public.user_roles (user_id, role)
    select u.id, 'admin'::app_role
    from auth.users u
    where u.id = any(allowed_ids)
      and not exists (
        select 1
        from public.user_roles ur
        where ur.user_id = u.id and ur.role = 'admin'::app_role
      );
  end if;
end $$;
