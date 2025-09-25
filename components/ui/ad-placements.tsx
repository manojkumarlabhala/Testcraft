"use client"
import React from "react"
import { AdBanner } from "./ad-banner"

interface SidebarAdProps {
  className?: string
}

export function SidebarAd({ className = "" }: SidebarAdProps) {
  return (
    <div className={`w-full ${className}`}>
      <AdBanner 
        placement="sidebar" 
        size="skyscraper" 
        className="sticky top-4"
      />
    </div>
  )
}

interface DashboardAdProps {
  className?: string
}

export function DashboardAd({ className = "" }: DashboardAdProps) {
  return (
    <div className={`w-full ${className}`}>
      <AdBanner 
        placement="dashboard" 
        size="banner" 
        className="mb-6"
      />
    </div>
  )
}

interface CommunityAdProps {
  className?: string
}

export function CommunityAd({ className = "" }: CommunityAdProps) {
  return (
    <div className={`w-full ${className}`}>
      <AdBanner 
        placement="community" 
        size="square" 
        className="mb-4"
      />
    </div>
  )
}

interface TestAdProps {
  className?: string
}

export function TestAd({ className = "" }: TestAdProps) {
  return (
    <div className={`w-full ${className}`}>
      <AdBanner 
        placement="tests" 
        size="leaderboard" 
        className="my-4"
      />
    </div>
  )
}