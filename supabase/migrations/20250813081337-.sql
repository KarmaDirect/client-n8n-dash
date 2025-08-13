-- Add manual approval system to subscribers table
ALTER TABLE public.subscribers 
ADD COLUMN manually_approved BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN approval_notes TEXT,
ADD COLUMN approved_by UUID REFERENCES auth.users(id),
ADD COLUMN approved_at TIMESTAMPTZ;

-- Create index for better performance on approval queries
CREATE INDEX idx_subscribers_manually_approved ON public.subscribers(manually_approved);

-- Add a computed column or view that considers both subscription and approval
CREATE OR REPLACE VIEW public.active_subscribers AS
SELECT 
  s.*,
  (s.subscribed AND s.manually_approved) AS is_fully_active
FROM public.subscribers s;