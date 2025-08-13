-- Enable leaked password protection for better security
-- This prevents users from using passwords that have been found in data breaches

-- Update auth configuration to enable leaked password protection
UPDATE auth.config 
SET password_min_length = 8,
    password_require_letters = true,
    password_require_numbers = true,
    password_require_symbols = false,
    password_require_uppercase = false,
    password_require_lowercase = false;

-- Note: HIBP (Have I Been Pwned) integration must be enabled in Supabase dashboard
-- Go to Authentication > Settings > Password Protection and enable "Check against common passwords"