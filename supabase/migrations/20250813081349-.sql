-- Fix the security definer view issue by recreating without SECURITY DEFINER
DROP VIEW IF EXISTS public.active_subscribers;

-- Create a simple view without SECURITY DEFINER
CREATE VIEW public.active_subscribers AS
SELECT 
  s.*,
  (s.subscribed AND s.manually_approved) AS is_fully_active
FROM public.subscribers s;

-- Add RLS policy for the view if needed
ALTER VIEW public.active_subscribers OWNER TO postgres;