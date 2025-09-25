"use client"
import React, { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SponsoredAd {
  id: string
  title: string
  description: string
  imageUrl: string
  targetUrl: string
  isActive: boolean
  placement: string
  priority: number
}

interface AdBannerProps {
  placement?: string
  size?: "banner" | "square" | "leaderboard" | "skyscraper"
  className?: string
}

export function AdBanner({ placement = "home", size = "leaderboard", className = "" }: AdBannerProps) {
  const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || process.env.ADSENSE_CLIENT_ID || "ca-pub-xxxxxxxxxxxxxxxx"
  const [isClient, setIsClient] = useState(false)
  const [sponsoredAds, setSponsoredAds] = useState<SponsoredAd[]>([])
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [adSettings, setAdSettings] = useState<any>({
    adsEnabled: true,
    adRefreshRate: 30,
    adSizes: {
      banner: { width: 728, height: 90 },
      square: { width: 300, height: 250 },
      leaderboard: { width: 728, height: 90 },
      skyscraper: { width: 160, height: 600 }
    }
  })
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setIsClient(true)
    fetchSponsoredAds()
    fetchAdSettings()
  }, [])

  const fetchSponsoredAds = async () => {
    try {
      const response = await fetch('/api/sponsored-ads/public')
      if (response.ok) {
        const data = await response.json()
        const filteredAds = data.ads.filter((ad: SponsoredAd) => ad.placement === placement && ad.isActive)
        setSponsoredAds(filteredAds)
      }
    } catch (error) {
      console.error('Failed to fetch sponsored ads:', error)
    }
  }

  const fetchAdSettings = async () => {
    try {
      const response = await fetch('/api/ad-settings/public')
      if (response.ok) {
        const data = await response.json()
        setAdSettings((prevSettings: any) => ({
          ...prevSettings,
          ...data,
          adSizes: {
            ...prevSettings.adSizes,
            ...(data.adSizes || {})
          }
        }))
      }
    } catch (error) {
      console.error('Failed to fetch ad settings:', error)
      // Keep default settings on error
    }
  }

  useEffect(() => {
    if (sponsoredAds.length > 1 && adSettings?.adRefreshRate) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % sponsoredAds.length)
      }, adSettings.adRefreshRate * 1000)
      return () => clearInterval(interval)
    }
  }, [sponsoredAds, adSettings])

  useEffect(() => {
    if (isClient && ADSENSE_CLIENT_ID !== "ca-pub-xxxxxxxxxxxxxxxx") {
      if (!document.querySelector("script[data-adsbygoogle]")) {
        const script = document.createElement("script")
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        script.async = true
        script.setAttribute("data-adsbygoogle", "true")
        document.body.appendChild(script)
      }
      // @ts-ignore
      window.adsbygoogle = window.adsbygoogle || []
      // @ts-ignore
      window.adsbygoogle.push({})
    }
  }, [isClient, ADSENSE_CLIENT_ID])

  const getSizeStyle = () => {
    if (!adSettings?.adSizes || !adSettings.adSizes[size]) {
      // Default sizes based on the size prop
      const defaultSizes = {
        banner: { width: 728, height: 90 },
        square: { width: 300, height: 250 },
        leaderboard: { width: 728, height: 90 },
        skyscraper: { width: 160, height: 600 }
      }
      const defaultSize = defaultSizes[size] || defaultSizes.leaderboard
      return {
        width: `${defaultSize.width}px`,
        height: `${defaultSize.height}px`,
        maxWidth: '100%'
      }
    }
    
    const sizeConfig = adSettings.adSizes[size]
    if (!sizeConfig || !sizeConfig.width || !sizeConfig.height) {
      // Fallback to default if config is incomplete
      return { width: '100%', height: '250px' }
    }
    
    return {
      width: `${sizeConfig.width}px`,
      height: `${sizeConfig.height}px`,
      maxWidth: '100%'
    }
  }

  const handleAdClick = (ad: SponsoredAd) => {
    // Track click
    fetch('/api/sponsored-ads/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId: ad.id, action: 'click' })
    })
    
    window.open(ad.targetUrl, '_blank')
  }

  const handleAdImpression = (ad: SponsoredAd) => {
    // Track impression
    fetch('/api/sponsored-ads/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId: ad.id, action: 'impression' })
    })
  }

  useEffect(() => {
    if (sponsoredAds.length > 0 && currentAdIndex < sponsoredAds.length) {
      handleAdImpression(sponsoredAds[currentAdIndex])
    }
  }, [currentAdIndex, sponsoredAds])

  if (!isVisible || (!adSettings?.adsEnabled && sponsoredAds.length === 0)) {
    return null
  }

  const currentAd = sponsoredAds[currentAdIndex]

  return (
    <div className={`relative w-full bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}>
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 p-0 hover:bg-gray-200"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex items-center justify-center p-4" style={getSizeStyle()}>
        {isClient && currentAd ? (
          <div 
            className="cursor-pointer w-full h-full flex items-center justify-center bg-white rounded-lg shadow-sm border overflow-hidden group hover:shadow-md transition-shadow"
            onClick={() => handleAdClick(currentAd)}
          >
            {currentAd.imageUrl ? (
              <div className="relative w-full h-full">
                <img 
                  src={currentAd.imageUrl} 
                  alt={currentAd.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-lg mb-1">{currentAd.title}</h3>
                  <p className="text-sm opacity-90">{currentAd.description}</p>
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <h3 className="font-bold text-xl mb-2 text-gray-800">{currentAd.title}</h3>
                <p className="text-gray-600 mb-4">{currentAd.description}</p>
                <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Learn More
                </div>
              </div>
            )}
          </div>
        ) : isClient && ADSENSE_CLIENT_ID !== "ca-pub-xxxxxxxxxxxxxxxx" ? (
          <ins
            className="adsbygoogle"
            style={{ display: "block", textAlign: "center", width: "100%", height: "100%" }}
            data-ad-client={ADSENSE_CLIENT_ID}
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className="text-center p-6 bg-gradient-to-r from-yellow-100 to-orange-100 w-full h-full flex items-center justify-center">
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                🚀 Upgrade to TestCraft Pro
              </h3>
              <p className="text-gray-600 text-sm">
                Get an ad-free experience with premium features!
              </p>
            </div>
          </div>
        )}
      </div>

      {sponsoredAds.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {sponsoredAds.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentAdIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      <div className="absolute top-2 left-2">
        <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
          Sponsored
        </span>
      </div>
    </div>
  )
}
