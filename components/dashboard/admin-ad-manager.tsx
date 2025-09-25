"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminAdManager() {
  const [ads, setAds] = useState<string[]>([])
  const [newAd, setNewAd] = useState("")

  useEffect(() => {
    // TODO: Fetch ads from backend
    setAds(["Sponsored: Upgrade to Testcraft.in Pro for an ad-free experience!"])
  }, [])

  const handleAddAd = () => {
    if (newAd.trim()) {
      setAds([...ads, newAd.trim()])
      setNewAd("")
      // TODO: Save to backend
    }
  }

  const handleRemoveAd = (idx: number) => {
    setAds(ads.filter((_, i) => i !== idx))
    // TODO: Remove from backend
  }

  return (
    <section className="py-8">
      <Card>
        <CardHeader>
          <CardTitle>Ad Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newAd}
              onChange={e => setNewAd(e.target.value)}
              placeholder="Enter ad text..."
              className="border rounded px-2 py-1 w-full"
            />
            <Button size="sm" onClick={handleAddAd}>Add Ad</Button>
          </div>
          <ul className="space-y-2">
            {ads.map((ad, idx) => (
              <li key={idx} className="flex justify-between items-center bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
                <span>{ad}</span>
                <Button size="sm" variant="destructive" onClick={() => handleRemoveAd(idx)}>Remove</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
