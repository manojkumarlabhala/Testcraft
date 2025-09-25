"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PlusCircle, Edit, Trash2, Eye, EyeOff, BarChart3, DollarSign } from "lucide-react"

interface SponsoredAd {
  id: string
  title: string
  description: string
  imageUrl: string
  targetUrl: string
  isActive: boolean
  placement: string
  priority: number
  startDate: string
  endDate: string
  budget: number
  clicks: number
  impressions: number
  ctr: number
  cost: number
  createdAt: string
  updatedAt: string
}

interface AdSettings {
  adsEnabled: boolean
  adNetwork: string
  maxAdsPerPage: number
  adRefreshRate: number
  showAdsToEliteUsers: boolean
  adSizes: {
    banner: { width: number; height: number }
    square: { width: number; height: number }
    leaderboard: { width: number; height: number }
    skyscraper: { width: number; height: number }
  }
}

export function SponsoredAdsManagement() {
  const [ads, setAds] = useState<SponsoredAd[]>([])
  const [adSettings, setAdSettings] = useState<AdSettings>({
    adsEnabled: true,
    adNetwork: "Google AdSense",
    maxAdsPerPage: 3,
    adRefreshRate: 30,
    showAdsToEliteUsers: false,
    adSizes: {
      banner: { width: 728, height: 120 },
      square: { width: 350, height: 350 },
      leaderboard: { width: 970, height: 250 },
      skyscraper: { width: 300, height: 800 }
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [editingAd, setEditingAd] = useState<SponsoredAd | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalClicks, setTotalClicks] = useState(0)
  const [totalImpressions, setTotalImpressions] = useState(0)

  const [newAd, setNewAd] = useState<Partial<SponsoredAd>>({
    title: "",
    description: "",
    imageUrl: "",
    targetUrl: "",
    isActive: true,
    placement: "home",
    priority: 1,
    startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: 50000
  })

  useEffect(() => {
    fetchAds()
    fetchAdSettings()
  }, [])

  const fetchAds = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/sponsored-ads')
      if (response.ok) {
        const data = await response.json()
        setAds(data.ads || [])
        setTotalRevenue(data.totalRevenue || 0)
        setTotalClicks(data.totalClicks || 0)
        setTotalImpressions(data.totalImpressions || 0)
      }
    } catch (error) {
      console.error('Failed to fetch ads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAdSettings = async () => {
    try {
      const response = await fetch('/api/admin/ad-settings')
      if (response.ok) {
        const data = await response.json()
        setAdSettings(data)
      }
    } catch (error) {
      console.error('Failed to fetch ad settings:', error)
    }
  }

  const handleCreateAd = async () => {
    try {
      const response = await fetch('/api/admin/sponsored-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAd)
      })
      if (response.ok) {
        await fetchAds()
        setNewAd({
          title: "",
          description: "",
          imageUrl: "",
          targetUrl: "",
          isActive: true,
          placement: "home",
          priority: 1,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          budget: 50000
        })
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error('Failed to create ad:', error)
    }
  }

  const handleUpdateAd = async (ad: SponsoredAd) => {
    try {
      const response = await fetch(`/api/admin/sponsored-ads/${ad.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ad)
      })
      if (response.ok) {
        await fetchAds()
        setEditingAd(null)
      }
    } catch (error) {
      console.error('Failed to update ad:', error)
    }
  }

  const handleDeleteAd = async (id: string) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      try {
        const response = await fetch(`/api/admin/sponsored-ads/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          await fetchAds()
        }
      } catch (error) {
        console.error('Failed to delete ad:', error)
      }
    }
  }

  const handleToggleAdStatus = async (ad: SponsoredAd) => {
    const updatedAd = { ...ad, isActive: !ad.isActive }
    await handleUpdateAd(updatedAd)
  }

  const handleUpdateSettings = async () => {
    try {
      const response = await fetch('/api/admin/ad-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adSettings)
      })
      if (response.ok) {
        alert('Settings updated successfully!')
      }
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  }

  const getStatusBadge = (ad: SponsoredAd) => {
    const now = new Date()
    const startDate = new Date(ad.startDate)
    const endDate = new Date(ad.endDate)
    
    if (!ad.isActive) return <Badge variant="secondary">Inactive</Badge>
    if (now < startDate) return <Badge variant="outline">Scheduled</Badge>
    if (now > endDate) return <Badge variant="destructive">Expired</Badge>
    return <Badge variant="default">Active</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ads" className="w-full">
        <TabsList>
          <TabsTrigger value="ads">Manage Ads</TabsTrigger>
          <TabsTrigger value="settings">Ad Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="ads" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sponsored Ads</h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create New Ad
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Sponsored Ad</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new sponsored advertisement.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newAd.title}
                        onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                        placeholder="Ad title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="placement">Placement</Label>
                      <Select value={newAd.placement} onValueChange={(value) => setNewAd({ ...newAd, placement: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home Page</SelectItem>
                          <SelectItem value="dashboard">Dashboard</SelectItem>
                          <SelectItem value="tests">Mock Tests</SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                          <SelectItem value="sidebar">Sidebar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newAd.description}
                      onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                      placeholder="Ad description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={newAd.imageUrl}
                        onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetUrl">Target URL</Label>
                      <Input
                        id="targetUrl"
                        value={newAd.targetUrl}
                        onChange={(e) => setNewAd({ ...newAd, targetUrl: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={newAd.priority}
                        onChange={(e) => setNewAd({ ...newAd, priority: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newAd.startDate}
                        onChange={(e) => setNewAd({ ...newAd, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newAd.endDate}
                        onChange={(e) => setNewAd({ ...newAd, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget (₹)</Label>
                    <Input
                      id="budget"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newAd.budget}
                      onChange={(e) => setNewAd({ ...newAd, budget: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateAd}>Create Ad</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {ads.map((ad) => (
              <Card key={ad.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {ad.title}
                        {getStatusBadge(ad)}
                      </CardTitle>
                      <CardDescription>{ad.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAdStatus(ad)}
                      >
                        {ad.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAd(ad)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAd(ad.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Placement</p>
                      <p className="text-muted-foreground capitalize">{ad.placement}</p>
                    </div>
                    <div>
                      <p className="font-medium">Budget</p>
                      <p className="text-muted-foreground">₹{ad.budget.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="font-medium">Clicks</p>
                      <p className="text-muted-foreground">{ad.clicks}</p>
                    </div>
                    <div>
                      <p className="font-medium">Impressions</p>
                      <p className="text-muted-foreground">{ad.impressions}</p>
                    </div>
                    <div>
                      <p className="font-medium">CTR</p>
                      <p className="text-muted-foreground">{ad.ctr.toFixed(2)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ad Configuration Settings</CardTitle>
              <CardDescription>
                Configure global advertisement settings for your platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ads-enabled">Enable Advertisements</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn on/off all advertisements across the platform
                  </p>
                </div>
                <Switch
                  id="ads-enabled"
                  checked={adSettings.adsEnabled}
                  onCheckedChange={(checked) => setAdSettings({ ...adSettings, adsEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="elite-ads">Show Ads to Elite Users</Label>
                  <p className="text-sm text-muted-foreground">
                    Display ads to users with premium subscriptions
                  </p>
                </div>
                <Switch
                  id="elite-ads"
                  checked={adSettings.showAdsToEliteUsers}
                  onCheckedChange={(checked) => setAdSettings({ ...adSettings, showAdsToEliteUsers: checked })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-ads">Max Ads Per Page</Label>
                  <Input
                    id="max-ads"
                    type="number"
                    min="1"
                    max="10"
                    value={adSettings.maxAdsPerPage}
                    onChange={(e) => setAdSettings({ ...adSettings, maxAdsPerPage: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="refresh-rate">Ad Refresh Rate (seconds)</Label>
                  <Input
                    id="refresh-rate"
                    type="number"
                    min="10"
                    max="300"
                    value={adSettings.adRefreshRate}
                    onChange={(e) => setAdSettings({ ...adSettings, adRefreshRate: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label>Ad Network</Label>
                <Select value={adSettings.adNetwork} onValueChange={(value) => setAdSettings({ ...adSettings, adNetwork: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Google AdSense">Google AdSense</SelectItem>
                    <SelectItem value="Custom Network">Custom Network</SelectItem>
                    <SelectItem value="Direct Sales">Direct Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Ad Sizes Configuration</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-sm">Banner (W x H)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Width"
                        value={adSettings.adSizes.banner.width}
                        onChange={(e) => setAdSettings({
                          ...adSettings,
                          adSizes: {
                            ...adSettings.adSizes,
                            banner: { ...adSettings.adSizes.banner, width: parseInt(e.target.value) }
                          }
                        })}
                      />
                      <Input
                        type="number"
                        placeholder="Height"
                        value={adSettings.adSizes.banner.height}
                        onChange={(e) => setAdSettings({
                          ...adSettings,
                          adSizes: {
                            ...adSettings.adSizes,
                            banner: { ...adSettings.adSizes.banner, height: parseInt(e.target.value) }
                          }
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Square (W x H)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Width"
                        value={adSettings.adSizes.square.width}
                        onChange={(e) => setAdSettings({
                          ...adSettings,
                          adSizes: {
                            ...adSettings.adSizes,
                            square: { ...adSettings.adSizes.square, width: parseInt(e.target.value) }
                          }
                        })}
                      />
                      <Input
                        type="number"
                        placeholder="Height"
                        value={adSettings.adSizes.square.height}
                        onChange={(e) => setAdSettings({
                          ...adSettings,
                          adSizes: {
                            ...adSettings.adSizes,
                            square: { ...adSettings.adSizes.square, height: parseInt(e.target.value) }
                          }
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Leaderboard (W x H)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Width"
                        value={adSettings.adSizes.leaderboard.width}
                        onChange={(e) => setAdSettings({
                          ...adSettings,
                          adSizes: {
                            ...adSettings.adSizes,
                            leaderboard: { ...adSettings.adSizes.leaderboard, width: parseInt(e.target.value) }
                          }
                        })}
                      />
                      <Input
                        type="number"
                        placeholder="Height"
                        value={adSettings.adSizes.leaderboard.height}
                        onChange={(e) => setAdSettings({
                          ...adSettings,
                          adSizes: {
                            ...adSettings.adSizes,
                            leaderboard: { ...adSettings.adSizes.leaderboard, height: parseInt(e.target.value) }
                          }
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Skyscraper (W x H)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Width"
                        value={adSettings.adSizes.skyscraper.width}
                        onChange={(e) => setAdSettings({
                          ...adSettings,
                          adSizes: {
                            ...adSettings.adSizes,
                            skyscraper: { ...adSettings.adSizes.skyscraper, width: parseInt(e.target.value) }
                          }
                        })}
                      />
                      <Input
                        type="number"
                        placeholder="Height"
                        value={adSettings.adSizes.skyscraper.height}
                        onChange={(e) => setAdSettings({
                          ...adSettings,
                          adSizes: {
                            ...adSettings.adSizes,
                            skyscraper: { ...adSettings.adSizes.skyscraper, height: parseInt(e.target.value) }
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleUpdateSettings} className="w-full">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Ad Dialog */}
      {editingAd && (
        <Dialog open={!!editingAd} onOpenChange={() => setEditingAd(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Sponsored Ad</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingAd.title}
                    onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-placement">Placement</Label>
                  <Select value={editingAd.placement} onValueChange={(value) => setEditingAd({ ...editingAd, placement: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home Page</SelectItem>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="tests">Mock Tests</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingAd.description}
                  onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-budget">Budget (₹)</Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingAd.budget}
                    onChange={(e) => setEditingAd({ ...editingAd, budget: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Input
                    id="edit-priority"
                    type="number"
                    min="1"
                    max="10"
                    value={editingAd.priority}
                    onChange={(e) => setEditingAd({ ...editingAd, priority: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => handleUpdateAd(editingAd)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}