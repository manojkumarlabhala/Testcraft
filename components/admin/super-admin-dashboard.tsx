"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSuperAdminEmails } from "@/lib/admin/super-admin-emails"
import { SponsoredAdsManagement } from "./sponsored-ads-management"
import { PaymentLinksManagement } from "./payment-links-management"
import { PaymentLinksManagementTest } from "./payment-links-management-test"
import { PaymentGatewayManagement } from "./payment-gateway-management"
import { AdPerformanceWidget } from "@/components/admin/ad-performance-widget"
import { SubscriptionPlansManagement } from "./subscription-plans-management"
import { 
  Shield, 
  Users, 
  Settings, 
  CreditCard, 
  BarChart3, 
  Globe, 
  Database, 
  MessageSquare, 
  FileText, 
  DollarSign,
  UserCog,
  Building,
  Zap,
  Eye,
  Lock,
  Activity,
  Copy,
  ExternalLink,
  Plus,
  Home
} from "lucide-react"

export function SuperAdminDashboard({ userEmail }: { userEmail: string }) {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null)
  const [showPayments, setShowPayments] = useState(false)
  const [showPaymentGateways, setShowPaymentGateways] = useState(false)
  const [showSponsoredAds, setShowSponsoredAds] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [paymentLinks, setPaymentLinks] = useState<any[]>([])
  const [showCreatePaymentLink, setShowCreatePaymentLink] = useState(false)
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalInstitutions: 0,
    totalRevenue: 0,
    activeTests: 0,
    communityPosts: 0,
    premiumUsers: 0
  })

  // Platform control states
  const [communityEnabled, setCommunityEnabled] = useState(true)
  const [registrationEnabled, setRegistrationEnabled] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [adsEnabled, setAdsEnabled] = useState(true)

  useEffect(() => {
    setIsSuperAdmin(getSuperAdminEmails().includes(userEmail))
    if (getSuperAdminEmails().includes(userEmail)) {
      fetchPlatformStats()
      fetchPaymentLinks()
    }
  }, [userEmail])

  const fetchPlatformStats = async () => {
    try {
      const response = await fetch('/api/admin/platform-stats')
      if (response.ok) {
        const data = await response.json()
        setPlatformStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch platform stats:', error)
      // Set mock data for demo
      setPlatformStats({
        totalUsers: 15420,
        totalInstitutions: 234,
        totalRevenue: 3456789.50, // Updated to Indian Rupees
        activeTests: 1567,
        communityPosts: 8943,
        premiumUsers: 2876
      })
    }
  }

  const fetchPaymentLinks = async () => {
    try {
      const response = await fetch('/api/admin/payment-links')
      if (response.ok) {
        const data = await response.json()
        setPaymentLinks(data.links || [])
      }
    } catch (error) {
      console.error('Failed to fetch payment links:', error)
      // Set mock data for demo
      setPaymentLinks([
        {
          id: '1',
          title: 'Student Elite Monthly',
          amount: 299,
          currency: 'INR',
          url: 'https://testcraft.in/pay/student-elite-monthly',
          isActive: true,
          clicks: 156,
          conversions: 43,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Student Premium Annual',
          amount: 1999,
          currency: 'INR',
          url: 'https://testcraft.in/pay/student-premium-annual',
          isActive: true,
          clicks: 89,
          conversions: 24,
          createdAt: '2024-01-20T14:20:00Z'
        }
      ])
    }
  }

  const createPaymentLink = async (linkData: any) => {
    try {
      const response = await fetch('/api/admin/payment-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(linkData)
      })
      if (response.ok) {
        await fetchPaymentLinks()
        setShowCreatePaymentLink(false)
      }
    } catch (error) {
      console.error('Failed to create payment link:', error)
    }
  }

  const copyPaymentLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      alert('Payment link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  if (isSuperAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-red-700">Access Denied</CardTitle>
            <CardDescription className="text-red-600">
              You do not have super admin privileges to access this dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600">Complete platform control and management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <Badge variant="secondary">
                Admin: {userEmail.split('@')[0]}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Institutions</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.totalInstitutions}</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{platformStats.totalRevenue.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.activeTests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+156 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.communityPosts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+234 today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.premiumUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">18.7% conversion</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 lg:w-fit lg:grid-cols-none lg:flex">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="platform" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Platform
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Users & Admins
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Advertisements
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdPerformanceWidget />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Platform Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Server Status</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Payment Gateway</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ad Network</span>
                    <Badge variant="default" className="bg-yellow-100 text-yellow-800">Syncing</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Globe className="h-4 w-4" />
              <AlertDescription>
                All systems are operating normally. Last maintenance window: 3 days ago.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Platform Controls Tab */}
          <TabsContent value="platform" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Platform Controls
                  </CardTitle>
                  <CardDescription>
                    Manage global platform features and access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Community Features</p>
                      <p className="text-sm text-muted-foreground">Allow users to create posts and interact</p>
                    </div>
                    <Button 
                      variant={communityEnabled ? "default" : "outline"}
                      onClick={() => setCommunityEnabled(!communityEnabled)}
                    >
                      {communityEnabled ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">User Registration</p>
                      <p className="text-sm text-muted-foreground">Allow new user signups</p>
                    </div>
                    <Button 
                      variant={registrationEnabled ? "default" : "outline"}
                      onClick={() => setRegistrationEnabled(!registrationEnabled)}
                    >
                      {registrationEnabled ? "Open" : "Closed"}
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Maintenance Mode</p>
                      <p className="text-sm text-muted-foreground">Show maintenance page to users</p>
                    </div>
                    <Button 
                      variant={maintenanceMode ? "destructive" : "outline"}
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                    >
                      {maintenanceMode ? "Active" : "Inactive"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Content Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Test Papers
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Moderate Community Posts
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("subscriptions")}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Manage Plans & Pricing
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Globe className="h-4 w-4 mr-2" />
                    Platform Announcements
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscriptions Management Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                Comprehensive subscription plans management with SEO optimization. Manage pricing, features, and marketing content for all plans.
              </AlertDescription>
            </Alert>
            <SubscriptionPlansManagement />
          </TabsContent>

          {/* Users & Admins Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCog className="h-5 w-5" />
                    Admin Management
                  </CardTitle>
                  <CardDescription>
                    Assign and manage admin roles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Manage User Admins
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Building className="h-4 w-4 mr-2" />
                    Manage Institution Admins
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Super Admin Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{((platformStats.premiumUsers / platformStats.totalUsers) * 100).toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Premium Rate</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">89.2%</p>
                      <p className="text-xs text-muted-foreground">Retention Rate</p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    View Detailed Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advertisements Tab */}
          <TabsContent value="ads" className="space-y-6">
            <div className="mb-6">
              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  Manage sponsored advertisements and monetization settings. Control ad placements, sizes, and targeting options.
                </AlertDescription>
              </Alert>
            </div>
            <SponsoredAdsManagement />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <PaymentLinksManagementTest />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Gateway Settings
                </CardTitle>
                <CardDescription>
                  Configure and manage payment processing systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full mb-4" 
                  onClick={() => setShowPaymentGateways(!showPaymentGateways)}
                >
                  {showPaymentGateways ? "Hide" : "Show"} Gateway Configuration
                </Button>
                {showPaymentGateways && <PaymentGatewayManagement />}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Gateway Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full mb-4" 
                    onClick={() => setShowPaymentGateways(!showPaymentGateways)}
                  >
                    {showPaymentGateways ? "Hide" : "Show"} Gateway Configuration
                  </Button>
                  {showPaymentGateways && <PaymentGatewayManagement />}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Payment Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => setShowPayments(!showPayments)}
                  >
                    {showPayments ? "Hide" : "Show"} Payment Dashboard
                  </Button>
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Legacy payment management has been moved</p>
                    <p className="text-sm text-muted-foreground">Use the Payments tab for full payment management</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Server Uptime</p>
                      <p className="text-muted-foreground">99.9% (30 days)</p>
                    </div>
                    <div>
                      <p className="font-medium">Database Size</p>
                      <p className="text-muted-foreground">2.4 GB</p>
                    </div>
                    <div>
                      <p className="font-medium">Active Sessions</p>
                      <p className="text-muted-foreground">1,247</p>
                    </div>
                    <div>
                      <p className="font-medium">API Requests</p>
                      <p className="text-muted-foreground">45.2K today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security & Backup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Database Backup
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Lock className="h-4 w-4 mr-2" />
                    Security Logs
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    System Health Check
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Payment Link Dialog */}
      {showCreatePaymentLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create Payment Link</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const linkData = {
                title: formData.get('title'),
                amount: parseFloat(formData.get('amount') as string),
                currency: 'INR',
                planType: formData.get('planType')
              }
              createPaymentLink(linkData)
            }} className="space-y-4">
              <div>
                <Label htmlFor="title">Payment Link Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Student Elite Monthly"
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="299"
                  required
                />
              </div>
              <div>
                <Label htmlFor="planType">Subscription Plan</Label>
                <select
                  id="planType"
                  name="planType"
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Plan Type</option>
                  <option value="student-elite-monthly">Student Elite Monthly</option>
                  <option value="student-elite-annual">Student Elite Annual</option>
                  <option value="student-premium-monthly">Student Premium Monthly</option>
                  <option value="student-premium-annual">Student Premium Annual</option>
                  <option value="institution-basic">Institution Basic</option>
                  <option value="institution-premium">Institution Premium</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Create Link
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreatePaymentLink(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
