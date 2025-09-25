"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { TrendingUp, Target, Award, BookOpen } from "lucide-react"
import Link from "next/link"

interface AnalyticsWidgetData {
  recentPerformance: {
    averageScore: number
    testsCompleted: number
    improvement: number
  }
  subjectBreakdown: Array<{
    subject: string
    score: number
    color: string
  }>
  weeklyActivity: Array<{
    day: string
    tests: number
  }>
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function AnalyticsWidget() {
  const [data, setData] = useState<AnalyticsWidgetData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analytics?timeRange=7d", {
          credentials: 'include'
        })
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Please log in to view analytics")
          }
          throw new Error("Failed to fetch analytics")
        }

        const analyticsData = await response.json()

        // Transform data for widget display
        setData({
          recentPerformance: {
            averageScore: analyticsData.testStats?.averageScore || 0,
            testsCompleted: analyticsData.testStats?.testsCompleted || 0,
            improvement: 5.2, // Mock improvement percentage
          },
          subjectBreakdown: (analyticsData.subjectPerformance || []).slice(0, 4).map((item: any, index: number) => ({
            subject: item.subject || `Subject ${index + 1}`,
            score: item.score || 0,
            color: COLORS[index % COLORS.length]
          })),
          weeklyActivity: (analyticsData.performanceData || []).slice(-7).map((item: any, index: number) => ({
            day: item.day || `Day ${index + 1}`,
            tests: item.tests || 0
          })),
        })
      } catch (error) {
        console.error("Error fetching analytics:", error)
        // Don't set loading to false if it's an auth error, let user know they need to login
        if (error instanceof Error && error.message.includes("log in")) {
          setData(null) // This will show the "No analytics data available" message
        } else {
          // For other errors, still show the widget but with empty data
          setData({
            recentPerformance: {
              averageScore: 0,
              testsCompleted: 0,
              improvement: 0,
            },
            subjectBreakdown: [],
            weeklyActivity: [],
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading analytics...</div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">No analytics data available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recent Performance
          </CardTitle>
          <CardDescription>Your performance in the last 7 days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{Math.round(data.recentPerformance.averageScore)}%</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+{data.recentPerformance.improvement}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tests Completed</span>
              <span>{data.recentPerformance.testsCompleted}</span>
            </div>
            <Progress value={(data.recentPerformance.testsCompleted / 10) * 100} className="h-2" />
          </div>

          <Link href="/analytics" className="block">
            <Badge variant="outline" className="w-full justify-center hover:bg-muted">
              View Detailed Analytics
            </Badge>
          </Link>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subject Performance
          </CardTitle>
          <CardDescription>Your performance by subject</CardDescription>
        </CardHeader>
        <CardContent>
          {data.subjectBreakdown.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={data.subjectBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="score"
                  >
                    {data.subjectBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2">
                {data.subjectBreakdown.map((subject, index) => (
                  <div key={subject.subject} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{subject.subject}</span>
                    </div>
                    <Badge variant="outline">{Math.round(subject.score)}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Take some tests to see your subject performance</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Activity */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Number of tests taken each day</CardDescription>
        </CardHeader>
        <CardContent>
          {data.weeklyActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.weeklyActivity}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tests" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <BarChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No activity data available for this week</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
