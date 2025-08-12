-- Create app_role enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
  END IF;
END$$;

-- Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check roles (security definer)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id AND ur.role = _role
  );
$$;

-- Policies for user_roles (user can see own roles)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' AND policyname='user_roles_select_own'
  ) THEN
    CREATE POLICY user_roles_select_own ON public.user_roles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());
  END IF;
END$$;

-- Add admin SELECT policies across key tables
-- Helper: create policy only if it doesn't exist
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'organizations',
    'organization_members',
    'organization_subscriptions',
    'sites',
    'pages',
    'workflows',
    'workflow_runs',
    'events',
    'leads',
    'support_messages',
    'documents',
    'subscribers'
  ]
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname='admin_select_all_' || t
    ) THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.has_role(auth.uid(), ''admin''));', 'admin_select_all_'||t, t);
    END IF;
  END LOOP;
END$$;

-- Seed admin role for the provided email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'hatim.moro.2002@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
