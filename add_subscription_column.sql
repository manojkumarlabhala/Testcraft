-- Add subscription_expires_at column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- Update existing Student Elite users with a future expiry date
UPDATE public.profiles
SET subscription_expires_at = (CURRENT_TIMESTAMP + INTERVAL '1 year')
WHERE subscription_plan = 'Student Elite' AND subscription_expires_at IS NULL;
