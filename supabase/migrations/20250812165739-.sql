-- Add admin role to the current user session
INSERT INTO user_roles (user_id, role) 
VALUES ('78091125-0429-4440-a57f-04d14cc12f4f', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;