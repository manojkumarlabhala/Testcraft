-- Function to increment download count atomically
CREATE OR REPLACE FUNCTION increment_download_count(paper_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE exam_papers 
  SET download_count = download_count + 1 
  WHERE id = paper_id;
END;
$$;

-- Function to get user analytics data
CREATE OR REPLACE FUNCTION get_user_analytics(user_uuid UUID)
RETURNS TABLE(
  total_downloads INTEGER,
  total_attempts INTEGER,
  avg_score NUMERIC,
  favorite_subjects TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM user_downloads WHERE user_id = user_uuid),
    (SELECT COUNT(*)::INTEGER FROM user_test_attempts WHERE user_id = user_uuid AND is_completed = true),
    (SELECT COALESCE(AVG(percentage), 0) FROM user_test_attempts WHERE user_id = user_uuid AND is_completed = true),
    (SELECT ARRAY_AGG(DISTINCT s.name) 
     FROM user_downloads ud 
     JOIN exam_papers ep ON ud.exam_paper_id = ep.id 
     JOIN subjects s ON ep.subject_id = s.id 
     WHERE ud.user_id = user_uuid
     LIMIT 5);
END;
$$;

-- Function to get popular papers
CREATE OR REPLACE FUNCTION get_popular_papers(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  id UUID,
  title TEXT,
  download_count INTEGER,
  subject_name TEXT,
  exam_board_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ep.id,
    ep.title,
    ep.download_count,
    s.name as subject_name,
    eb.name as exam_board_name
  FROM exam_papers ep
  JOIN subjects s ON ep.subject_id = s.id
  JOIN exam_boards eb ON ep.exam_board_id = eb.id
  ORDER BY ep.download_count DESC
  LIMIT limit_count;
END;
$$;
