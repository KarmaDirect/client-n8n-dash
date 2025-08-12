-- Phase 1: Multi-tenant schema for client dashboard
-- 1) Create core tables tied to organizations with strict RLS

-- Helper function already exists: public.update_updated_at_column

-- SITES
CREATE TABLE IF NOT EXISTS public.sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'en_construction', -- en_construction | en_ligne
  site_url text,
  screenshot_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY sites_select_members ON public.sites
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = sites.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY sites_insert_members ON public.sites
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY sites_update_members ON public.sites
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = sites.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = sites.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY sites_delete_members ON public.sites
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = sites.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Trigger for updated_at
DO $$ BEGIN
  CREATE TRIGGER trg_sites_updated_at
  BEFORE UPDATE ON public.sites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- PAGES
CREATE TABLE IF NOT EXISTS public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  title text NOT NULL,
  slug text,
  status text NOT NULL DEFAULT 'brouillon', -- brouillon | publie
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY pages_select_members ON public.pages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = pages.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY pages_insert_members ON public.pages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY pages_update_members ON public.pages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = pages.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = pages.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY pages_delete_members ON public.pages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = pages.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- EVENTS (timeline)
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  type text NOT NULL,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY events_select_members ON public.events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = events.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY events_insert_members ON public.events
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- LEADS (KPIs)
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  source text,
  status text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY leads_select_members ON public.leads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = leads.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY leads_insert_members ON public.leads
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY leads_update_members ON public.leads
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = leads.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = leads.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- SUPPORT MESSAGES (chat/history)
CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  author text NOT NULL DEFAULT 'client', -- client | support
  user_id uuid, -- optional trace to auth user
  message text NOT NULL,
  attachments jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY support_msgs_select_members ON public.support_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = support_messages.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY support_msgs_insert_members ON public.support_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- DOCUMENTS (metadata)
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  doc_type text,
  file_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY documents_select_members ON public.documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = documents.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY documents_insert_members ON public.documents
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY documents_update_members ON public.documents
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = documents.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = documents.org_id
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- 2) Extend existing table: workflows add description
DO $$ BEGIN
  ALTER TABLE public.workflows ADD COLUMN description text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;


-- 3) Storage bucket for documents with secure policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Policies on storage.objects for the 'documents' bucket using org folder in path: {org_id}/.../filename
DO $$ BEGIN
  CREATE POLICY "documents_select_members" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'documents' AND EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id::text = (storage.foldername(name))[1]
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "documents_insert_members" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id::text = (storage.foldername(name))[1]
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "documents_update_members" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'documents' AND EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id::text = (storage.foldername(name))[1]
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  )
  WITH CHECK (
    bucket_id = 'documents' AND EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id::text = (storage.foldername(name))[1]
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "documents_delete_members" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'documents' AND EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id::text = (storage.foldername(name))[1]
        AND (
          o.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.organization_members m
            WHERE m.org_id = o.id AND m.user_id = auth.uid()
          )
        )
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
