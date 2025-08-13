-- Fix the remaining security vulnerability in subscribers table
-- Remove the email-based verification policy that could still be exploited

-- Drop the problematic email-based policy
DROP POLICY IF EXISTS "subscribers_email_verification_limited" ON public.subscribers;

-- Ensure only secure, user_id-based policies remain
-- These policies are already in place and secure:
-- - subscribers_select_authenticated_own: USING (user_id = auth.uid())
-- - subscribers_insert_authenticated_own: WITH CHECK (user_id = auth.uid())
-- - subscribers_update_authenticated_own: USING/WITH CHECK (user_id = auth.uid())
-- - subscribers_service_role_update: FOR service_role (for Stripe webhooks)

-- Add a comment to document the security decision
COMMENT ON TABLE public.subscribers IS 
'Security: Access strictly limited to authenticated users via user_id matching auth.uid(). 
No email-based access policies to prevent email enumeration attacks.
Service role access for Stripe webhook operations only.';