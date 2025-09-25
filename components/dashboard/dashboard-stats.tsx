import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { BookOpen, Download, Trophy, Clock, TrendingUp } from "lucide-react"

interface DashboardStatsProps {
  userId: string
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const supabase = await createClient()

  // Get user statistics
  const [downloadsResult, attemptsResult, favoritesResult, testHistoryResult] = await Promise.allSettled([
    supabase.from("user_downloads").select("id").eq("user_id", userId),
    supabase.from("user_test_attempts").select("id, percentage").eq("user_id", userId).eq("is_completed", true),
    supabase.from("user_favorites").select("id").eq("user_id", userId),
    supabase.from("test_attempts").select("score, completed_at").eq("user_id", userId).order("completed_at", { ascending: false }).limit(10),
  ])

  const totalDownloads = downloadsResult.status === 'fulfilled' ? downloadsResult.value.data?.length || 0 : 0
  const attemptsData = attemptsResult.status === 'fulfilled' ? attemptsResult.value.data || [] : []
  const totalFavorites = favoritesResult.status === 'fulfilled' ? favoritesResult.value.data?.length || 0 : 0
  const testHistoryData = testHistoryResult.status === 'fulfilled' ? testHistoryResult.value.data || [] : []

  const totalAttempts = attemptsData.length
  const avgScore = attemptsData.length
    ? Math.round(
        attemptsData.reduce((sum: number, attempt: any) => sum + (attempt.percentage || 0), 0) / attemptsData.length,
      )
    : 0

  const recentTestScore = testHistoryData.length > 0
    ? Math.round(testHistoryData.reduce((sum, test) => sum + test.score, 0) / testHistoryData.length)
    : 0

  const stats = [
    {
      title: "Papers Downloaded",
      value: totalDownloads,
      icon: Download,
      description: "Total exam papers downloaded",
    },
    {
      title: "Mock Tests Taken",
      value: totalAttempts,
      icon: Clock,
      description: "Completed mock test attempts",
    },
    {
      title: "Average Score",
      value: `${avgScore}%`,
      icon: Trophy,
      description: "Average performance across tests",
    },
    {
      title: "Recent Performance",
      value: testHistoryData.length > 0 ? `${recentTestScore}%` : "No tests",
      icon: TrendingUp,
      description: "Latest test performance",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
