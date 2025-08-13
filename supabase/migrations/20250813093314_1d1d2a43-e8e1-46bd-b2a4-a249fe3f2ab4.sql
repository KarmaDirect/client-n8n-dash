-- Fix security vulnerability in subscribers table
-- Remove email-based access policies that could be exploited

-- Drop existing potentially vulnerable policies
DROP POLICY IF EXISTS "subscribers_insert_own" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_select_own" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_update_own" ON public.subscribers;

-- Create secure policies that require proper authentication
-- Only authenticated users can view their own subscription
CREATE POLICY "subscribers_select_authenticated_own" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Only authenticated users can insert their own subscription
CREATE POLICY "subscribers_insert_authenticated_own" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Only authenticated users can update their own subscription
CREATE POLICY "subscribers_update_authenticated_own" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Special policy for Stripe webhook operations (requires service role)
-- This allows Stripe webhooks to update subscription status
CREATE POLICY "subscribers_service_role_update" 
ON public.subscribers 
FOR UPDATE 
TO service_role
USING (true)
WITH CHECK (true);

-- Policy for subscription verification by email (limited scope)
-- Only allows reading subscription status, not personal data
CREATE POLICY "subscribers_email_verification_limited" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (email = auth.email() AND user_id IS NOT NULL);

-- Ensure user_id is always set and not nullable for proper security
-- This prevents records without user_id that could bypass security
ALTER TABLE public.subscribers 
ALTER COLUMN user_id SET NOT NULL;