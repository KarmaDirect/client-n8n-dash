-- Grant admin role to the real user account observed in auth logs
INSERT INTO public.user_roles (user_id, role)
VALUES ('78e76dd2-3aa2-4ad5-802d-81870838202a', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;