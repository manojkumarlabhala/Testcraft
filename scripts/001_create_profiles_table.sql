-- Create the public.profiles table for Supabase user metadata
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text,
  role text,
  subscription_plan text,
  created_at timestamp with time zone DEFAULT now()
);
