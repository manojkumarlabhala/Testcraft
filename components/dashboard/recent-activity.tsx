import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { Download, Heart, Target } from "lucide-react"

interface RecentActivityProps {
  userId: string
}

export async function RecentActivity({ userId }: RecentActivityProps) {
  const supabase = await createClient()

  // Get recent downloads
  const downloadsQuery = supabase
    .from("user_downloads")
    .select(
      `
      downloaded_at,
      exam_papers(title, subject_id, subjects(name))
    `,
    )
    .eq("user_id", userId)
    .order("downloaded_at", { ascending: false })
    .limit(5)

  // Get recent favorites
  const favoritesQuery = supabase
    .from("user_favorites")
    .select(
      `
      created_at,
      exam_papers(title, subject_id, subjects(name))
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get recent test attempts
  const testAttemptsQuery = supabase
    .from("user_test_attempts")
    .select(
      `
      started_at,
      completed_at,
      score,
      total_questions,
      mock_tests(title, subject_id, subjects(name))
    `,
    )
    .eq("user_id", userId)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(5)

  let recentDownloads: any[] = []
  let recentFavorites: any[] = []
  let recentTestAttempts: any[] = []

  try {
    const [downloadsResult, favoritesResult, testAttemptsResult] = await Promise.all([
      downloadsQuery,
      favoritesQuery,
      testAttemptsQuery,
    ])

    recentDownloads = downloadsResult.data || []
    recentFavorites = favoritesResult.data || []
    recentTestAttempts = testAttemptsResult.data || []
  } catch (err) {
    // If exam_papers table is missing or another DB error occurs, log and fall back to empty arrays
    // This prevents the whole dashboard from crashing when certain tables are unavailable.
    // Errors are intentionally not re-thrown to keep the UI resilient.
    // eslint-disable-next-line no-console
    console.error("Error fetching recent activity (exam_papers might be missing):", err)
    recentDownloads = []
    recentFavorites = []
    recentTestAttempts = []
  }

  const activities = [
    ...(recentDownloads.map((download: any) => ({
      type: "download" as const,
      title: download?.exam_papers?.title || "Unknown Paper",
      subject: download?.exam_papers?.subjects?.name || "Unknown Subject",
      timestamp: download?.downloaded_at || new Date().toISOString(),
      icon: Download,
    })) || []),
    ...(recentFavorites.map((favorite: any) => ({
      type: "favorite" as const,
      title: favorite?.exam_papers?.title || "Unknown Paper",
      subject: favorite?.exam_papers?.subjects?.name || "Unknown Subject",
      timestamp: favorite?.created_at || new Date().toISOString(),
      icon: Heart,
    })) || []),
    ...(recentTestAttempts.map((attempt: any) => {
      const mockTest = Array.isArray(attempt?.mock_tests) ? attempt.mock_tests[0] : attempt?.mock_tests
      return {
        type: "test" as const,
        title: mockTest?.title || "Mock Test",
        subject: mockTest?.subjects?.name || mockTest?.subject || "Unknown Subject",
        timestamp: attempt?.completed_at || attempt?.started_at || new Date().toISOString(),
        score: attempt?.score || 0,
        totalQuestions: attempt?.total_questions || 0,
        icon: Target,
      }
    }) || []),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.type === "download" ? "Downloaded" : 
                     activity.type === "favorite" ? "Added to favorites" :
                     activity.type === "test" ? `Completed test • ${activity.score}/${activity.totalQuestions} points` : ""}
                    {activity.type !== "test" && ` • ${activity.subject}`}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
