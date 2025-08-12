-- Create webhooks table for N8N integration
CREATE TABLE public.webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  name TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Admin can see all webhooks
CREATE POLICY "admin_select_all_webhooks" 
ON public.webhooks 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can insert/update/delete webhooks
CREATE POLICY "admin_manage_webhooks" 
ON public.webhooks 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Organization members can view their webhooks
CREATE POLICY "webhooks_select_members" 
ON public.webhooks 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM organizations o 
  WHERE o.id = webhooks.org_id 
  AND (o.owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM organization_members m 
    WHERE m.org_id = o.id AND m.user_id = auth.uid()
  ))
));

-- Update workflows table to add usage limits
ALTER TABLE public.workflows ADD COLUMN IF NOT EXISTS webhook_id UUID;
ALTER TABLE public.workflows ADD COLUMN IF NOT EXISTS usage_limit_per_hour INTEGER;
ALTER TABLE public.workflows ADD COLUMN IF NOT EXISTS usage_limit_per_day INTEGER;
ALTER TABLE public.workflows ADD COLUMN IF NOT EXISTS last_executed_at TIMESTAMP WITH TIME ZONE;

-- Create workflow_executions table to track usage
CREATE TABLE public.workflow_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL,
  org_id UUID NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'success',
  response_data JSONB,
  user_id UUID
);

-- Enable RLS on workflow_executions
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;

-- Admin can see all executions
CREATE POLICY "admin_select_all_executions" 
ON public.workflow_executions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Members can see their org's executions
CREATE POLICY "executions_select_members" 
ON public.workflow_executions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM organizations o 
  WHERE o.id = workflow_executions.org_id 
  AND (o.owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM organization_members m 
    WHERE m.org_id = o.id AND m.user_id = auth.uid()
  ))
));

-- Members can insert executions
CREATE POLICY "executions_insert_members" 
ON public.workflow_executions 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM organizations o 
  WHERE o.id = workflow_executions.org_id 
  AND (o.owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM organization_members m 
    WHERE m.org_id = o.id AND m.user_id = auth.uid()
  ))
));

-- Create trigger for updated_at on webhooks
CREATE TRIGGER update_webhooks_updated_at
BEFORE UPDATE ON public.webhooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check workflow usage limits
CREATE OR REPLACE FUNCTION public.check_workflow_usage_limit(_workflow_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  workflow_record workflows%ROWTYPE;
  executions_hour INTEGER;
  executions_day INTEGER;
BEGIN
  -- Get workflow info
  SELECT * INTO workflow_record FROM workflows WHERE id = _workflow_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check hourly limit
  IF workflow_record.usage_limit_per_hour IS NOT NULL THEN
    SELECT COUNT(*) INTO executions_hour
    FROM workflow_executions
    WHERE workflow_id = _workflow_id
    AND executed_at >= (NOW() - INTERVAL '1 hour');
    
    IF executions_hour >= workflow_record.usage_limit_per_hour THEN
      RETURN FALSE;
    END IF;
  END IF;
  
  -- Check daily limit
  IF workflow_record.usage_limit_per_day IS NOT NULL THEN
    SELECT COUNT(*) INTO executions_day
    FROM workflow_executions
    WHERE workflow_id = _workflow_id
    AND executed_at >= (NOW() - INTERVAL '1 day');
    
    IF executions_day >= workflow_record.usage_limit_per_day THEN
      RETURN FALSE;
    END IF;
  END IF;
  
  RETURN TRUE;
END;
$$;