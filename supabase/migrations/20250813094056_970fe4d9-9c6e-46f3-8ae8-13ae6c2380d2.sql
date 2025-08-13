-- Fix security vulnerability in organization_subscriptions table
-- Restrict access to payment information and ensure proper authorization

-- Drop existing potentially overpermissive policies
DROP POLICY IF EXISTS "org_sub_select_members" ON public.organization_subscriptions;

-- Create more restrictive policies for payment information access

-- Only organization owners can view subscription details (not all members)
CREATE POLICY "org_sub_select_owners_only" 
ON public.organization_subscriptions 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = organization_subscriptions.org_id 
    AND o.owner_id = auth.uid()
  )
);

-- Only organization owners can update subscription details
CREATE POLICY "org_sub_update_owners_only" 
ON public.organization_subscriptions 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = organization_subscriptions.org_id 
    AND o.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = organization_subscriptions.org_id 
    AND o.owner_id = auth.uid()
  )
);

-- Only organization owners can insert subscription records
CREATE POLICY "org_sub_insert_owners_only" 
ON public.organization_subscriptions 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = organization_subscriptions.org_id 
    AND o.owner_id = auth.uid()
  )
);

-- Special policy for service role (Stripe webhooks and system operations)
CREATE POLICY "org_sub_service_role_all" 
ON public.organization_subscriptions 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Admin policy remains for administrative oversight
-- (admin_select_all_organization_subscriptions already exists)

-- Add security documentation
COMMENT ON TABLE public.organization_subscriptions IS 
'SECURITY CRITICAL: Contains payment information (Stripe customer IDs, subscription data).
Access restricted to:
- Organization owners only (not regular members)
- Admins for oversight
- Service role for Stripe webhook operations
Regular organization members CANNOT access payment information.';

-- Ensure critical payment fields are properly protected
COMMENT ON COLUMN public.organization_subscriptions.stripe_customer_id IS 
'SENSITIVE: Stripe customer ID - access restricted to owners and admins only';
COMMENT ON COLUMN public.organization_subscriptions.subscription_tier IS 
'SENSITIVE: Subscription plan information - business intelligence risk if exposed';
COMMENT ON COLUMN public.organization_subscriptions.subscription_end IS 
'SENSITIVE: Subscription expiry - competitive intelligence if exposed';