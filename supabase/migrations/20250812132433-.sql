-- Multi-tenant core + workflows + runs + subscriptions scaffolding
-- Create reusable updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Organization roles enum
DO $$ BEGIN
  CREATE TYPE public.org_role AS ENUM ('owner','admin','member','viewer');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Organizations (tenants)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Members in organizations
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.org_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- Workflows registered per organization (maps to n8n workflows)
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  n8n_workflow_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workflow runs with basic status and JSON logs
CREATE TABLE IF NOT EXISTS public.workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('queued','running','success','failed')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  logs JSONB
);

-- Subscribers table (user-level) following guide for future Stripe integration
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Optional organization-level subscription snapshot
CREATE TABLE IF NOT EXISTS public.organization_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id)
);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Organizations: members and owners can SELECT
CREATE POLICY "orgs_select_members"
ON public.organizations FOR SELECT
USING (
  owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.organization_members m
    WHERE m.org_id = organizations.id AND m.user_id = auth.uid()
  )
);

-- Organizations: any authenticated user may create orgs only for themselves as owner
CREATE POLICY "orgs_insert_self_owner"
ON public.organizations FOR INSERT TO authenticated
WITH CHECK (owner_id = auth.uid());

-- Organizations: owner can UPDATE and DELETE
CREATE POLICY "orgs_owner_update"
ON public.organizations FOR UPDATE
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "orgs_owner_delete"
ON public.organizations FOR DELETE
USING (owner_id = auth.uid());

-- Organization members: only visible to org members and owner
CREATE POLICY "org_members_select"
ON public.organization_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = organization_members.org_id
      AND (o.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.organization_members m
        WHERE m.org_id = o.id AND m.user_id = auth.uid()
      ))
  )
);

-- Organization members: only owner can insert/update/delete membership rows
CREATE POLICY "org_members_owner_insert"
ON public.organization_members FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = org_id AND o.owner_id = auth.uid()
  )
);

CREATE POLICY "org_members_owner_update"
ON public.organization_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = org_id AND o.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = org_id AND o.owner_id = auth.uid()
  )
);

CREATE POLICY "org_members_owner_delete"
ON public.organization_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = org_id AND o.owner_id = auth.uid()
  )
);

-- Workflows: members can CRUD within their org
CREATE POLICY "workflows_select_members"
ON public.workflows FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = workflows.org_id
      AND (o.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.organization_members m
        WHERE m.org_id = o.id AND m.user_id = auth.uid()
      ))
  )
);

CREATE POLICY "workflows_insert_members"
ON public.workflows FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = org_id
      AND (o.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.organization_members m
        WHERE m.org_id = o.id AND m.user_id = auth.uid()
      ))
  )
);

CREATE POLICY "workflows_update_members"
ON public.workflows FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = workflows.org_id
      AND (o.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.organization_members m
        WHERE m.org_id = o.id AND m.user_id = auth.uid()
      ))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = workflows.org_id
      AND (o.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.organization_members m
        WHERE m.org_id = o.id AND m.user_id = auth.uid()
      ))
  )
);

CREATE POLICY "workflows_delete_members"
ON public.workflows FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = workflows.org_id
      AND (o.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.organization_members m
        WHERE m.org_id = o.id AND m.user_id = auth.uid()
      ))
  )
);

-- Workflow runs: members can read/insert runs for workflows they can access
CREATE POLICY "runs_select_members"
ON public.workflow_runs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workflows w
    JOIN public.organizations o ON o.id = w.org_id
    WHERE w.id = workflow_runs.workflow_id
      AND (o.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.organization_members m
        WHERE m.org_id = o.id AND m.user_id = auth.uid()
      ))
  )
);

CREATE POLICY "runs_insert_members"
ON public.workflow_runs FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workflows w
    JOIN public.organizations o ON o.id = w.org_id
    WHERE w.id = workflow_id
      AND (o.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.organization_members m
        WHERE m.org_id = o.id AND m.user_id = auth.uid()
      ))
  )
);

-- Subscribers: users can view/update/insert only their own email/user_id
CREATE POLICY "subscribers_select_own" ON public.subscribers FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "subscribers_update_own" ON public.subscribers FOR UPDATE
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "subscribers_insert_own" ON public.subscribers FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() OR email = auth.email());

-- Organization subscriptions visible to org members
CREATE POLICY "org_sub_select_members"
ON public.organization_subscriptions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = organization_subscriptions.org_id
      AND (o.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.organization_members m
        WHERE m.org_id = o.id AND m.user_id = auth.uid()
      ))
  )
);

-- Triggers for updated_at
DO $$ BEGIN
  CREATE TRIGGER set_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER set_workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER set_subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER set_org_subscriptions_updated_at
  BEFORE UPDATE ON public.organization_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Enable realtime for workflow_runs
ALTER TABLE public.workflow_runs REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.workflow_runs;
EXCEPTION WHEN undefined_object THEN NULL; END $$;