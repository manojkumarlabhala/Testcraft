-- Create analytics table for tracking user events
CREATE TABLE IF NOT EXISTS public.analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at);

-- Enable RLS
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create policy for users to insert their own analytics
CREATE POLICY "Users can insert their own analytics" ON public.analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to view their own analytics
CREATE POLICY "Users can view their own analytics" ON public.analytics
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for super admins to view all analytics
CREATE POLICY "Super admins can view all analytics" ON public.analytics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND email = ANY(ARRAY['superadmin@testcraft.in'])
    )
  );
