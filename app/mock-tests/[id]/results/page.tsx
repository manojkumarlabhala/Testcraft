"use client"

import { useState, useEffect, use } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, Target, TrendingUp, BookOpen } from "lucide-react"
import Link from "next/link"

interface TestResult {
  score: number
  correctAnswers: number
  totalQuestions: number
  detailedResults: Array<{
    question: string
    userAnswer: number
    correctAnswer: number
    isCorrect: boolean
    explanation: string
    topic: string
  }>
  analysis: string
  timeSpent: number
}

export default function MockTestResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const searchParams = useSearchParams()
  const attemptId = searchParams?.get("attemptId")
  const [results, setResults] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!attemptId) {
          console.error("No attemptId found in URL parameters")
          throw new Error("No attempt ID provided")
        }

        console.log("Fetching results for attemptId:", attemptId)
        const response = await fetch(`/api/test-attempts/${attemptId}`)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const errorMessage = errorData.error || "Failed to fetch results"
          console.error("API Error:", response.status, errorMessage)
          throw new Error(`${response.status}: ${errorMessage}`)
        }

        const data = await response.json()
        console.log("Results fetched successfully:", data)
        setResults(data)
      } catch (error) {
        console.error("Error fetching results:", error)
        // For local development, provide fallback synthetic results
        if (process.env.NODE_ENV === 'development' && !attemptId) {
          console.log("Using fallback synthetic results for development")
          setResults({
            score: 75,
            correctAnswers: 3,
            totalQuestions: 4,
            detailedResults: [],
            analysis: "Development mode - no real results available",
            timeSpent: 60000,
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [attemptId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading results...</div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Results not found</p>
          {!attemptId && (
            <p className="text-sm text-muted-foreground mb-4">
              No attempt ID found in URL. This might happen if you navigated directly to this page.
            </p>
          )}
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: "Excellent", color: "bg-green-100 text-green-800" }
    if (score >= 80) return { level: "Very Good", color: "bg-blue-100 text-blue-800" }
    if (score >= 70) return { level: "Good", color: "bg-yellow-100 text-yellow-800" }
    if (score >= 60) return { level: "Average", color: "bg-orange-100 text-orange-800" }
    return { level: "Needs Improvement", color: "bg-red-100 text-red-800" }
  }

  const performance = getPerformanceLevel(results.score)

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Test Results</h1>
          <p className="text-muted-foreground">Detailed analysis of your performance</p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className={`text-3xl font-bold ${getScoreColor(results.score)}`}>{results.score}%</div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-3xl font-bold text-green-600">{results.correctAnswers}</div>
              <p className="text-sm text-muted-foreground">Correct Answers</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-3xl font-bold text-blue-600">{Math.round(results.timeSpent / 60000)}m</div>
              <p className="text-sm text-muted-foreground">Time Taken</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <Badge className={performance.color}>{performance.level}</Badge>
              <p className="text-sm text-muted-foreground mt-2">Performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {results.correctAnswers} of {results.totalQuestions} correct
              </span>
            </div>
            <Progress value={(results.correctAnswers / results.totalQuestions) * 100} className="h-3" />
          </CardContent>
        </Card>

        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Review</TabsTrigger>
            <TabsTrigger value="topics">Topic Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  AI Performance Analysis
                </CardTitle>
                <CardDescription>Personalized insights and recommendations based on your performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {results.analysis.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-sm leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed">
            <div className="space-y-4">
              {results.detailedResults.map((result, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">Question {index + 1}</CardTitle>
                      {result.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {result.topic}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="font-medium">{result.question}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Your Answer: </span>
                        <span className={result.isCorrect ? "text-green-600" : "text-red-600"}>
                          Option {result.userAnswer + 1}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Correct Answer: </span>
                        <span className="text-green-600">Option {result.correctAnswer + 1}</span>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">Explanation:</p>
                      <p className="text-sm text-muted-foreground">{result.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="topics">
            <Card>
              <CardHeader>
                <CardTitle>Topic-wise Performance</CardTitle>
                <CardDescription>See how you performed in different topics</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const topicStats = results.detailedResults.reduce(
                    (acc, result) => {
                      if (!acc[result.topic]) {
                        acc[result.topic] = { correct: 0, total: 0 }
                      }
                      acc[result.topic].total++
                      if (result.isCorrect) acc[result.topic].correct++
                      return acc
                    },
                    {} as Record<string, { correct: number; total: number }>,
                  )

                  return (
                    <div className="space-y-4">
                      {Object.entries(topicStats).map(([topic, stats]) => {
                        const percentage = Math.round((stats.correct / stats.total) * 100)
                        return (
                          <div key={topic} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{topic}</span>
                              <span className="text-sm text-muted-foreground">
                                {stats.correct}/{stats.total} ({percentage}%)
                              </span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <Button asChild variant="outline">
            <Link href="/mock-tests/create">Back to Mock Tests</Link>
          </Button>
          <Button asChild>
            <Link href="/mock-tests/create">Create Another Test</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
