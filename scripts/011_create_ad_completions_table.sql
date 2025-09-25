-- Create ad_completions table for tracking ad watches by free users
CREATE TABLE IF NOT EXISTS ad_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_ad_completions_user_id_completed_at
ON ad_completions(user_id, completed_at DESC);

-- Enable RLS
ALTER TABLE ad_completions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own ad completions
CREATE POLICY "Users can view their own ad completions"
ON ad_completions FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for users to insert their own ad completions
CREATE POLICY "Users can insert their own ad completions"
ON ad_completions FOR INSERT
WITH CHECK (auth.uid() = user_id);
