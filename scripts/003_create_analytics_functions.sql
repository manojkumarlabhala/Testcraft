-- Create analytics RPC functions for dashboard data

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(start_date timestamp, end_date timestamp)
RETURNS TABLE (
  total_users bigint,
  active_users bigint,
  new_users bigint,
  premium_users bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM auth.users)::bigint as total_users,
    (SELECT COUNT(DISTINCT user_id) FROM analytics WHERE created_at BETWEEN start_date AND end_date)::bigint as active_users,
    (SELECT COUNT(*) FROM auth.users WHERE created_at BETWEEN start_date AND end_date)::bigint as new_users,
    (SELECT COUNT(*) FROM profiles WHERE subscription_plan IN ('premium', 'elite'))::bigint as premium_users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get test statistics
CREATE OR REPLACE FUNCTION get_test_stats(start_date timestamp, end_date timestamp)
RETURNS TABLE (
  total_tests bigint,
  tests_completed bigint,
  average_score numeric,
  total_questions bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM mock_tests)::bigint as total_tests,
    (SELECT COUNT(*) FROM test_attempts WHERE completed_at BETWEEN start_date AND end_date AND is_completed = true)::bigint as tests_completed,
    (SELECT COALESCE(AVG(percentage), 0) FROM test_attempts WHERE completed_at BETWEEN start_date AND end_date AND is_completed = true)::numeric as average_score,
    (SELECT COALESCE(SUM(total_questions), 0) FROM test_attempts WHERE completed_at BETWEEN start_date AND end_date AND is_completed = true)::bigint as total_questions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get performance data over time
CREATE OR REPLACE FUNCTION get_performance_data(start_date timestamp, end_date timestamp, user_id uuid)
RETURNS TABLE (
  date text,
  score numeric,
  tests_completed bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(ta.completed_at)::text as date,
    AVG(ta.percentage)::numeric as score,
    COUNT(*)::bigint as tests_completed
  FROM test_attempts ta
  WHERE ta.completed_at BETWEEN start_date AND end_date
    AND ta.user_id = get_performance_data.user_id
    AND ta.is_completed = true
  GROUP BY DATE(ta.completed_at)
  ORDER BY DATE(ta.completed_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get subject performance
CREATE OR REPLACE FUNCTION get_subject_performance(start_date timestamp, end_date timestamp, user_id uuid)
RETURNS TABLE (
  subject text,
  average_score numeric,
  tests_completed bigint,
  color text
) AS $$
DECLARE
  colors text[] := ARRAY['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  color_index integer := 0;
BEGIN
  RETURN QUERY
  SELECT
    mt.subject,
    AVG(ta.percentage)::numeric as average_score,
    COUNT(*)::bigint as tests_completed,
    colors[1] as color
  FROM test_attempts ta
  JOIN mock_tests mt ON ta.mock_test_id = mt.id
  WHERE ta.completed_at BETWEEN start_date AND end_date
    AND ta.user_id = get_subject_performance.user_id
    AND ta.is_completed = true
  GROUP BY mt.subject
  ORDER BY average_score DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get monthly activity
CREATE OR REPLACE FUNCTION get_monthly_activity(start_date timestamp, end_date timestamp)
RETURNS TABLE (
  month text,
  users bigint,
  tests bigint,
  papers bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(date_trunc('month', generate_series), 'Mon YYYY') as month,
    COALESCE(user_counts.users, 0) as users,
    COALESCE(test_counts.tests, 0) as tests,
    COALESCE(paper_counts.papers, 0) as papers
  FROM generate_series(
    date_trunc('month', start_date),
    date_trunc('month', end_date),
    '1 month'::interval
  ) generate_series
  LEFT JOIN (
    SELECT 
      date_trunc('month', created_at) as month,
      COUNT(DISTINCT user_id)::bigint as users
    FROM analytics
    WHERE created_at BETWEEN start_date AND end_date
    GROUP BY date_trunc('month', created_at)
  ) user_counts ON date_trunc('month', generate_series) = user_counts.month
  LEFT JOIN (
    SELECT 
      date_trunc('month', completed_at) as month,
      COUNT(*)::bigint as tests
    FROM test_attempts
    WHERE completed_at BETWEEN start_date AND end_date
    GROUP BY date_trunc('month', completed_at)
  ) test_counts ON date_trunc('month', generate_series) = test_counts.month
  LEFT JOIN (
    SELECT 
      date_trunc('month', created_at) as month,
      COUNT(*)::bigint as papers
    FROM analytics
    WHERE created_at BETWEEN start_date AND end_date
      AND event_type = 'paper_download'
    GROUP BY date_trunc('month', created_at)
  ) paper_counts ON date_trunc('month', generate_series) = paper_counts.month
  ORDER BY generate_series;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top performers
CREATE OR REPLACE FUNCTION get_top_performers(start_date timestamp, end_date timestamp)
RETURNS TABLE (
  name text,
  score numeric,
  tests_completed bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(p.full_name, 'Anonymous User') as name,
    AVG(ta.percentage)::numeric as score,
    COUNT(*)::bigint as tests_completed
  FROM test_attempts ta
  JOIN profiles p ON ta.user_id = p.id
  WHERE ta.completed_at BETWEEN start_date AND end_date
    AND ta.is_completed = true
  GROUP BY p.id, p.full_name
  HAVING COUNT(*) >= 3  -- At least 3 tests completed
  ORDER BY AVG(ta.percentage) DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_user_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_test_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_performance_data TO authenticated;
GRANT EXECUTE ON FUNCTION get_subject_performance TO authenticated;
GRANT EXECUTE ON FUNCTION get_monthly_activity TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_performers TO authenticated;
