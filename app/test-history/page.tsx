import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Target, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface TestHistoryPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

async function TestHistoryContent({ searchParams }: TestHistoryPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Please log in to view your test history.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const awaitedSearchParams = await searchParams
  const page = parseInt(awaitedSearchParams.page as string) || 1
  const limit = 10
  const offset = (page - 1) * limit

  // Get test attempts with pagination (defensive: catch and render friendly UI on failure)
  let testAttempts: any[] | null = null
  let count: number | null = 0
  try {
    const resp = await supabase
      .from("test_attempts")
      .select(
        `
      id,
      completed_at,
      score,
      correct_answers,
      total_questions,
      time_spent,
      mock_test_id
    `, { count: 'exact' }
      )
      .eq("user_id", user.id)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .range(offset, offset + limit - 1)

    testAttempts = resp.data || []
    count = resp.count ?? 0

    if (resp.error) {
      // Use warn and serialize error to avoid Next.js treating console.error as an unhandled client error
      console.warn("Warning fetching test history:", JSON.stringify(resp.error))
    }
  } catch (err: any) {
    console.warn("Exception fetching test history:", err?.message ?? String(err))
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Error loading test history. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If we have mock_test_id values, fetch titles separately (avoid relying on DB foreign-key relationships)
  let mockTestsMap: Record<string, { id: string; title?: string }> = {}
  try {
    const ids = Array.from(new Set((testAttempts || []).map(a => a.mock_test_id).filter(Boolean)))
    if (ids.length > 0) {
      const { data: mts, error: mtError } = await supabase
        .from('mock_tests')
        .select('id,title')
        .in('id', ids)

      if (!mtError && mts) {
        mockTestsMap = Object.fromEntries(mts.map((m: any) => [m.id, { id: m.id, title: m.title }]))
      }
    }
  } catch (e: any) {
    console.warn('Could not fetch mock test titles:', e?.message ?? String(e))
  }

  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Test History</h1>
        <p className="text-muted-foreground">View your completed mock tests and performance</p>
      </div>

  {testAttempts && testAttempts.length > 0 ? (
        <>
          <div className="grid gap-4 mb-8">
            {testAttempts.map((attempt: any) => {
              const percentage = attempt.score  // score is already percentage

              const getScoreColor = (score: number) => {
                if (score >= 80) return "bg-green-100 text-green-800"
                if (score >= 60) return "bg-yellow-100 text-yellow-800"
                return "bg-red-100 text-red-800"
              }

              return (
                <Card key={attempt.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {attempt.mock_tests?.title || "Mock Test"}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(attempt.completed_at), "MMM dd, yyyy")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {attempt.time_spent ? `${Math.round(attempt.time_spent / 60000)} min` : "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getScoreColor(percentage)}>
                          {percentage}%
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {attempt.correct_answers}/{attempt.total_questions}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {percentage >= 80 ? "Excellent" :
                           percentage >= 60 ? "Good" : "Needs Improvement"}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/mock-tests/${attempt.mock_tests?.id}/results`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                asChild={page > 1}
              >
                {page > 1 ? (
                  <Link href={`/test-history?page=${page - 1}`}>
                    Previous
                  </Link>
                ) : (
                  <span>Previous</span>
                )}
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page >= totalPages}
                asChild={page < totalPages}
              >
                {page < totalPages ? (
                  <Link href={`/test-history?page=${page + 1}`}>
                    Next
                  </Link>
                ) : (
                  <span>Next</span>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Tests Completed</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't completed any mock tests yet. Start practicing to see your progress here!
            </p>
            <Button asChild>
              <Link href="/mock-tests/create">
                Create Your First Test
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function TestHistoryPage({ searchParams }: TestHistoryPageProps) {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <TestHistoryContent searchParams={searchParams} />
    </Suspense>
  )
}