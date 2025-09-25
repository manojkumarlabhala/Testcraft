"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Stats {
  totalUsers: number;
  totalPapers: number;
  totalTests: number;
  totalDownloads: number;
}

export default function AdminAnalyticsOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const res = await fetch("/api/admin/stats")
        const data = await res.json()
        setStats(data.stats || null)
      } catch (err) {
        setStats(null)
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  return (
    <section className="py-8">
      <Card>
        <CardHeader>
          <CardTitle>Platform Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {loading || !stats ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-lg font-semibold">Users</div>
                <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
              </div>
              <div>
                <div className="text-lg font-semibold">Papers</div>
                <div className="text-2xl font-bold text-primary">{stats.totalPapers}</div>
              </div>
              <div>
                <div className="text-lg font-semibold">Mock Tests</div>
                <div className="text-2xl font-bold text-primary">{stats.totalTests}</div>
              </div>
              <div>
                <div className="text-lg font-semibold">Downloads</div>
                <div className="text-2xl font-bold text-primary">{stats.totalDownloads}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
