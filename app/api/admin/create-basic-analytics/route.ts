import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function POST() {
  try {
    const supabase = createServerClient()

    console.log("Creating analytics functions...")

    // Create the functions one by one
    const functions = [
      {
        name: "get_user_stats",
        sql: `
          CREATE OR REPLACE FUNCTION get_user_stats(start_date timestamp, end_date timestamp)
          RETURNS TABLE (total_users bigint, active_users bigint, new_users bigint, premium_users bigint) AS $$
          BEGIN
            RETURN QUERY
            SELECT
              (SELECT COUNT(*) FROM auth.users)::bigint as total_users,
              (SELECT COUNT(DISTINCT user_id) FROM analytics WHERE created_at BETWEEN start_date AND end_date)::bigint as active_users,
              (SELECT COUNT(*) FROM auth.users WHERE created_at BETWEEN start_date AND end_date)::bigint as new_users,
              (SELECT COUNT(*) FROM profiles WHERE subscription_plan IN ('premium', 'elite', 'Student Elite'))::bigint as premium_users;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      },
      {
        name: "get_test_stats",
        sql: `
          CREATE OR REPLACE FUNCTION get_test_stats(start_date timestamp, end_date timestamp)
          RETURNS TABLE (total_tests bigint, tests_completed bigint, average_score numeric, total_questions bigint) AS $$
          BEGIN
            RETURN QUERY
            SELECT
              (SELECT COUNT(*) FROM mock_tests)::bigint as total_tests,
              (SELECT COUNT(*) FROM test_attempts WHERE completed_at BETWEEN start_date AND end_date AND is_completed = true)::bigint as tests_completed,
              (SELECT COALESCE(AVG(percentage), 0) FROM test_attempts WHERE completed_at BETWEEN start_date AND end_date AND is_completed = true)::numeric as average_score,
              (SELECT COALESCE(SUM(total_questions), 0) FROM test_attempts WHERE completed_at BETWEEN start_date AND end_date AND is_completed = true)::bigint as total_questions;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      },
      {
        name: "get_performance_data",
        sql: `
          CREATE OR REPLACE FUNCTION get_performance_data(start_date timestamp, end_date timestamp, user_id uuid)
          RETURNS TABLE (date text, score numeric, tests_completed bigint) AS $$
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
        `
      },
      {
        name: "get_subject_performance",
        sql: `
          CREATE OR REPLACE FUNCTION get_subject_performance(start_date timestamp, end_date timestamp, user_id uuid)
          RETURNS TABLE (subject text, average_score numeric, tests_completed bigint, color text) AS $$
          BEGIN
            RETURN QUERY
            SELECT
              mt.subject,
              AVG(ta.percentage)::numeric as average_score,
              COUNT(*)::bigint as tests_completed,
              '#0088FE' as color
            FROM test_attempts ta
            JOIN mock_tests mt ON ta.mock_test_id = mt.id
            WHERE ta.completed_at BETWEEN start_date AND end_date
              AND ta.user_id = get_subject_performance.user_id
              AND ta.is_completed = true
            GROUP BY mt.subject
            ORDER BY average_score DESC;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      }
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const func of functions) {
      try {
        console.log(`Creating function: ${func.name}`);
        const { error } = await supabase.rpc('exec_sql', { sql: func.sql });

        if (error) {
          console.error(`Error creating ${func.name}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Created ${func.name}`);
          successCount++;
        }
      } catch (err) {
        console.error(`Exception creating ${func.name}:`, err);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: errorCount === 0,
      message: `Created ${successCount} functions, ${errorCount} errors`,
      stats: { successCount, errorCount, total: functions.length }
    });

  } catch (error) {
    console.error("Error in create functions API:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to create analytics functions",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
