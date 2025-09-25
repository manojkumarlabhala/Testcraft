-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  filename text NOT NULL,
  file_path text NOT NULL,
  file_url text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  category text NOT NULL,
  subject text,
  exam_board text,
  class text,
  description text,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create file downloads tracking table
CREATE TABLE IF NOT EXISTS file_downloads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id uuid REFERENCES files(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  downloaded_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_files_category ON files(category);
CREATE INDEX IF NOT EXISTS idx_files_subject ON files(subject);
CREATE INDEX IF NOT EXISTS idx_files_exam_board ON files(exam_board);
CREATE INDEX IF NOT EXISTS idx_files_class ON files(class);
CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);
CREATE INDEX IF NOT EXISTS idx_file_downloads_file_id ON file_downloads(file_id);
CREATE INDEX IF NOT EXISTS idx_file_downloads_user_id ON file_downloads(user_id);

-- Enable RLS
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_downloads ENABLE ROW LEVEL SECURITY;

-- RLS policies for files
CREATE POLICY "Users can view all files" ON files FOR SELECT USING (true);
CREATE POLICY "Users can insert their own files" ON files FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can update their own files" ON files FOR UPDATE USING (auth.uid() = uploaded_by);
CREATE POLICY "Users can delete their own files" ON files FOR DELETE USING (auth.uid() = uploaded_by);

-- RLS policies for file downloads
CREATE POLICY "Users can view all downloads" ON file_downloads FOR SELECT USING (true);
CREATE POLICY "Users can insert their own downloads" ON file_downloads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
