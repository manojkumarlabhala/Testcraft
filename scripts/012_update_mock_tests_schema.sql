-- Update mock_tests table to add missing columns expected by the application
-- This adds columns that the API routes expect but weren't in the original schema

ALTER TABLE public.mock_tests 
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS exam_board text,
ADD COLUMN IF NOT EXISTS class text,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS question_type text,
ADD COLUMN IF NOT EXISTS language text,
ADD COLUMN IF NOT EXISTS is_ai_generated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing records to have title from name if title is null
UPDATE public.mock_tests 
SET title = name 
WHERE title IS NULL;

-- Update existing records to have created_by from creator_id if created_by is null
UPDATE public.mock_tests 
SET created_by = creator_id 
WHERE created_by IS NULL;

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_mock_tests_exam_board ON public.mock_tests(exam_board);
CREATE INDEX IF NOT EXISTS idx_mock_tests_class ON public.mock_tests(class);
CREATE INDEX IF NOT EXISTS idx_mock_tests_category ON public.mock_tests(category);
CREATE INDEX IF NOT EXISTS idx_mock_tests_created_by ON public.mock_tests(created_by);

-- Update RLS policies to use both creator_id and created_by for compatibility
DROP POLICY IF EXISTS "Users can update their own mock tests" ON public.mock_tests;
DROP POLICY IF EXISTS "Users can delete their own mock tests" ON public.mock_tests;

CREATE POLICY "Users can update their own mock tests" ON public.mock_tests 
FOR UPDATE USING (auth.uid() = creator_id OR auth.uid() = created_by);

CREATE POLICY "Users can delete their own mock tests" ON public.mock_tests 
FOR DELETE USING (auth.uid() = creator_id OR auth.uid() = created_by);