"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, DollarSign, Eye, MousePointer } from "lucide-react"

interface AdPerformanceData {
  totalRevenue: number
  totalClicks: number
  totalImpressions: number
  averageCTR: number
  activeAds: number
  topPerformingAd: {
    title: string
    ctr: number
  } | null
}

export function AdPerformanceWidget() {
  const [performanceData, setPerformanceData] = useState<AdPerformanceData>({
    totalRevenue: 0,
    totalClicks: 0,
    totalImpressions: 0,
    averageCTR: 0,
    activeAds: 0,
    topPerformingAd: null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPerformanceData()
  }, [])

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('/api/admin/sponsored-ads')
      if (response.ok) {
        const data = await response.json()
        const activeAds = data.ads.filter((ad: any) => ad.isActive).length
        const averageCTR = data.totalImpressions > 0 ? (data.totalClicks / data.totalImpressions) * 100 : 0
        const topAd = data.ads.reduce((top: any, ad: any) => 
          !top || ad.ctr > top.ctr ? ad : top, null
        )

        setPerformanceData({
          totalRevenue: data.totalRevenue,
          totalClicks: data.totalClicks,
          totalImpressions: data.totalImpressions,
          averageCTR,
          activeAds,
          topPerformingAd: topAd ? { title: topAd.title, ctr: topAd.ctr } : null
        })
      }
    } catch (error) {
      console.error('Failed to fetch performance data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Ad Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Ad Performance Overview
        </CardTitle>
        <CardDescription>
          Real-time sponsored ads performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="font-semibold">₹{performanceData.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MousePointer className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Clicks</p>
              <p className="font-semibold">{performanceData.totalClicks.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Impressions</p>
              <p className="font-semibold">{performanceData.totalImpressions.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-sm text-muted-foreground">Avg CTR</p>
              <p className="font-semibold">{performanceData.averageCTR.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Active Ads</span>
            <Badge variant="default">{performanceData.activeAds}</Badge>
          </div>
          
          {performanceData.topPerformingAd && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Top Performer</span>
              <div className="text-right">
                <p className="text-sm font-medium">{performanceData.topPerformingAd.title}</p>
                <p className="text-xs text-muted-foreground">{performanceData.topPerformingAd.ctr.toFixed(2)}% CTR</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}