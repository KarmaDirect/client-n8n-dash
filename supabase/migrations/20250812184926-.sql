-- Fix CREATE POLICY syntax: drop then create
DROP POLICY IF EXISTS admin_insert_support_messages ON public.support_messages;
CREATE POLICY admin_insert_support_messages
ON public.support_messages
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));