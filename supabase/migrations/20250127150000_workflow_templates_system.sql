-- =============================================
-- Migration: Système de templates de workflows
-- Date: 27 janvier 2025
-- Description: Système complet de gestion de templates n8n pour multi-tenant SaaS
--              - Catalogue de templates par pack (Start/Pro/Elite)
--              - Provisionnement automatique pour clients
--              - Tracking métriques détaillées
--              - Configuration credentials
-- =============================================

-- =============================================
-- 1. TABLE: workflow_templates
-- Catalogue de templates de workflows disponibles
-- =============================================

CREATE TABLE IF NOT EXISTS public.workflow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informations de base
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,                     -- "SMS", "Email", "CRM", "Marketing", "Facturation", "Support"
  
  -- Organisation n8n
  n8n_template_id TEXT NOT NULL UNIQUE,       -- ID du workflow master dans n8n
  pack_level TEXT NOT NULL,                   -- "start", "pro", "elite"
  
  -- Configuration
  required_credentials JSONB DEFAULT '[]'::jsonb,    -- ["twilio", "sendgrid", "openai"]
  configurable_params JSONB DEFAULT '{}'::jsonb,     -- Variables à personnaliser
  default_config JSONB DEFAULT '{}'::jsonb,          -- Valeurs par défaut
  
  -- Métriques & Coûts
  estimated_cost_per_exec DECIMAL DEFAULT 0,
  estimated_time_saved_minutes INT DEFAULT 0,
  metrics_tracked JSONB DEFAULT '[]'::jsonb,         -- ["sms_sent", "leads_generated", "emails_sent"]
  
  -- Metadata
  preview_image TEXT,
  video_tutorial_url TEXT,
  documentation_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_pack_level CHECK (pack_level IN ('start', 'pro', 'elite')),
  CONSTRAINT valid_category CHECK (category IN ('SMS', 'Email', 'CRM', 'Marketing', 'Facturation', 'Support', 'Analytics', 'Automation'))
);

-- Index pour performance
CREATE INDEX idx_templates_pack_level ON public.workflow_templates(pack_level);
CREATE INDEX idx_templates_category ON public.workflow_templates(category);
CREATE INDEX idx_templates_active ON public.workflow_templates(is_active);

-- RLS: Seuls les admins peuvent voir les templates
ALTER TABLE public.workflow_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "templates_select_admin"
ON public.workflow_templates FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "templates_insert_admin"
ON public.workflow_templates FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "templates_update_admin"
ON public.workflow_templates FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 2. MODIFIER TABLE: workflows (existante)
-- Ajouter colonnes pour système de templates
-- =============================================

ALTER TABLE public.workflows 
  ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.workflow_templates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS pack_level TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS config_params JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS credentials_status JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS last_execution_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS total_executions INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_successes INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_failures INT DEFAULT 0;

-- Constraints
ALTER TABLE public.workflows 
  ADD CONSTRAINT IF NOT EXISTS valid_workflow_status 
  CHECK (status IN ('active', 'pending_config', 'paused', 'error', 'archived'));

ALTER TABLE public.workflows 
  ADD CONSTRAINT IF NOT EXISTS valid_workflow_pack_level 
  CHECK (pack_level IS NULL OR pack_level IN ('start', 'pro', 'elite'));

-- Index
CREATE INDEX IF NOT EXISTS idx_workflows_template_id ON public.workflows(template_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON public.workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflows_pack_level ON public.workflows(pack_level);

-- =============================================
-- 3. TABLE: workflow_metrics
-- Métriques agrégées par jour par workflow
-- =============================================

CREATE TABLE IF NOT EXISTS public.workflow_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Période
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Compteurs d'exécutions
  executions_count INT DEFAULT 0,
  success_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  
  -- Coûts & Ressources
  tokens_used INT DEFAULT 0,
  api_calls_made INT DEFAULT 0,
  cost_incurred DECIMAL DEFAULT 0,
  
  -- Gains estimés
  time_saved_minutes INT DEFAULT 0,
  money_saved DECIMAL DEFAULT 0,
  
  -- Métriques custom par workflow (JSON flexible)
  custom_metrics JSONB DEFAULT '{}'::jsonb,
  -- Exemple: {"sms_sent": 142, "leads_generated": 23, "emails_sent": 450}
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Une seule entrée par jour par workflow
  UNIQUE(workflow_id, date)
);

-- Index pour performance
CREATE INDEX idx_metrics_workflow_id ON public.workflow_metrics(workflow_id);
CREATE INDEX idx_metrics_org_id ON public.workflow_metrics(org_id);
CREATE INDEX idx_metrics_date ON public.workflow_metrics(date);
CREATE INDEX idx_metrics_workflow_date ON public.workflow_metrics(workflow_id, date);

-- RLS: Utilisateurs voient seulement leurs métriques
ALTER TABLE public.workflow_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "metrics_select_org_members"
ON public.workflow_metrics FOR SELECT
USING (
  public.user_is_org_member(auth.uid(), org_id)
  OR public.has_role(auth.uid(), 'admin')
);

-- =============================================
-- 4. TABLE: workflow_execution_logs
-- Logs détaillés de chaque exécution
-- =============================================

CREATE TABLE IF NOT EXISTS public.workflow_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Identification n8n
  n8n_execution_id TEXT,
  
  -- Status & Timing
  status TEXT NOT NULL,                       -- "success", "error", "running", "waiting"
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  duration_seconds INT,
  
  -- Données
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  error_stack TEXT,
  
  -- Métriques de cette exécution
  metrics JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_execution_status CHECK (status IN ('success', 'error', 'running', 'waiting', 'cancelled'))
);

-- Index pour performance
CREATE INDEX idx_logs_workflow_id ON public.workflow_execution_logs(workflow_id);
CREATE INDEX idx_logs_org_id ON public.workflow_execution_logs(org_id);
CREATE INDEX idx_logs_status ON public.workflow_execution_logs(status);
CREATE INDEX idx_logs_started_at ON public.workflow_execution_logs(started_at DESC);
CREATE INDEX idx_logs_n8n_execution_id ON public.workflow_execution_logs(n8n_execution_id);

-- RLS: Utilisateurs voient seulement leurs logs
ALTER TABLE public.workflow_execution_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "logs_select_org_members"
ON public.workflow_execution_logs FOR SELECT
USING (
  public.user_is_org_member(auth.uid(), org_id)
  OR public.has_role(auth.uid(), 'admin')
);

-- =============================================
-- 5. FONCTION: increment_workflow_metrics
-- Incrémenter les métriques d'un workflow (appelé par webhook)
-- =============================================

CREATE OR REPLACE FUNCTION public.increment_workflow_metrics(
  p_workflow_id UUID,
  p_date DATE,
  p_success INT DEFAULT 0,
  p_failed INT DEFAULT 0,
  p_custom_metrics JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID AS $$
DECLARE
  v_org_id UUID;
BEGIN
  -- Récupérer l'org_id du workflow
  SELECT org_id INTO v_org_id
  FROM public.workflows
  WHERE id = p_workflow_id;
  
  -- Upsert les métriques
  INSERT INTO public.workflow_metrics (
    workflow_id,
    org_id,
    date,
    executions_count,
    success_count,
    failed_count,
    custom_metrics
  )
  VALUES (
    p_workflow_id,
    v_org_id,
    p_date,
    1,
    p_success,
    p_failed,
    p_custom_metrics
  )
  ON CONFLICT (workflow_id, date)
  DO UPDATE SET
    executions_count = workflow_metrics.executions_count + 1,
    success_count = workflow_metrics.success_count + p_success,
    failed_count = workflow_metrics.failed_count + p_failed,
    custom_metrics = workflow_metrics.custom_metrics || p_custom_metrics,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 6. FONCTION: get_workflow_stats
-- Récupérer les statistiques d'un workflow (7 derniers jours)
-- =============================================

CREATE OR REPLACE FUNCTION public.get_workflow_stats(p_workflow_id UUID)
RETURNS TABLE(
  total_executions BIGINT,
  success_rate NUMERIC,
  avg_duration_seconds NUMERIC,
  total_cost NUMERIC,
  time_saved_hours NUMERIC,
  custom_aggregates JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_executions,
    ROUND(
      (COUNT(*) FILTER (WHERE status = 'success')::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
      2
    ) as success_rate,
    ROUND(AVG(duration_seconds)::NUMERIC, 2) as avg_duration_seconds,
    COALESCE(SUM(m.cost_incurred), 0) as total_cost,
    ROUND(COALESCE(SUM(m.time_saved_minutes), 0)::NUMERIC / 60, 2) as time_saved_hours,
    jsonb_object_agg(
      'custom_metrics',
      m.custom_metrics
    ) as custom_aggregates
  FROM public.workflow_execution_logs l
  LEFT JOIN public.workflow_metrics m ON m.workflow_id = l.workflow_id
  WHERE l.workflow_id = p_workflow_id
    AND l.started_at >= NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 7. TRIGGER: update_workflow_on_execution
-- Mettre à jour le workflow après chaque exécution
-- =============================================

CREATE OR REPLACE FUNCTION public.update_workflow_on_execution()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.workflows
  SET
    last_execution_at = NEW.finished_at,
    total_executions = total_executions + 1,
    total_successes = CASE WHEN NEW.status = 'success' THEN total_successes + 1 ELSE total_successes END,
    total_failures = CASE WHEN NEW.status = 'error' THEN total_failures + 1 ELSE total_failures END
  WHERE id = NEW.workflow_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_workflow_on_execution
AFTER INSERT ON public.workflow_execution_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_workflow_on_execution();

-- =============================================
-- 8. COMMENTAIRES
-- =============================================

COMMENT ON TABLE public.workflow_templates IS 'Catalogue de templates de workflows n8n disponibles par pack (Start/Pro/Elite)';
COMMENT ON TABLE public.workflow_metrics IS 'Métriques agrégées par jour pour chaque workflow (exécutions, coûts, gains)';
COMMENT ON TABLE public.workflow_execution_logs IS 'Logs détaillés de chaque exécution de workflow';

COMMENT ON COLUMN public.workflows.template_id IS 'Référence au template dont ce workflow est issu';
COMMENT ON COLUMN public.workflows.status IS 'Status: active, pending_config, paused, error, archived';
COMMENT ON COLUMN public.workflows.config_params IS 'Paramètres configurés pour ce workflow (JSON)';
COMMENT ON COLUMN public.workflows.credentials_status IS 'Status des credentials: {"twilio": "configured", "sendgrid": "pending"}';

-- =============================================
-- FIN DE LA MIGRATION
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration workflow_templates_system terminée';
  RAISE NOTICE '📊 Tables créées: workflow_templates, workflow_metrics, workflow_execution_logs';
  RAISE NOTICE '🔄 Table modifiée: workflows (7 nouvelles colonnes)';
  RAISE NOTICE '⚡ Fonctions créées: increment_workflow_metrics, get_workflow_stats';
  RAISE NOTICE '🔔 Trigger créé: update_workflow_on_execution';
END $$;

