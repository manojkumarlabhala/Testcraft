-- Create mock_tests table
CREATE TABLE IF NOT EXISTS public.mock_tests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  topic text,
  difficulty text DEFAULT 'medium',
  total_questions integer NOT NULL DEFAULT 0,
  duration integer, -- in minutes
  questions jsonb DEFAULT '[]',
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_adaptive boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create test_attempts table
CREATE TABLE IF NOT EXISTS public.test_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  mock_test_id uuid REFERENCES public.mock_tests(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  answers jsonb DEFAULT '{}',
  score numeric(5,2),
  percentage numeric(5,2),
  time_taken integer, -- in seconds
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  is_completed boolean DEFAULT false,
  total_questions integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mock_tests_subject ON public.mock_tests(subject);
CREATE INDEX IF NOT EXISTS idx_mock_tests_creator_id ON public.mock_tests(creator_id);
CREATE INDEX IF NOT EXISTS idx_mock_tests_created_at ON public.mock_tests(created_at);

CREATE INDEX IF NOT EXISTS idx_test_attempts_mock_test_id ON public.test_attempts(mock_test_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_user_id ON public.test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_completed_at ON public.test_attempts(completed_at);
CREATE INDEX IF NOT EXISTS idx_test_attempts_is_completed ON public.test_attempts(is_completed);

-- Enable RLS
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

-- RLS policies for mock_tests
CREATE POLICY "Anyone can view mock tests" ON public.mock_tests FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create mock tests" ON public.mock_tests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own mock tests" ON public.mock_tests FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete their own mock tests" ON public.mock_tests FOR DELETE USING (auth.uid() = creator_id);

-- RLS policies for test_attempts
CREATE POLICY "Users can view their own test attempts" ON public.test_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own test attempts" ON public.test_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own test attempts" ON public.test_attempts FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_mock_tests_updated_at BEFORE UPDATE ON public.mock_tests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_attempts_updated_at BEFORE UPDATE ON public.test_attempts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
