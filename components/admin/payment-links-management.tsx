"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Link, 
  Copy, 
  ExternalLink, 
  Plus, 
  Edit, 
  Trash2, 
  BarChart3, 
  DollarSign, 
  MousePointer, 
  TrendingUp,
  Eye,
  EyeOff
} from "lucide-react"

interface PaymentLink {
  id: string
  title: string
  amount: number
  currency: string
  planType: string
  url: string
  isActive: boolean
  clicks: number
  conversions: number
  conversionRate: number
  totalRevenue: number
  createdAt: string
  updatedAt: string
}

interface PaymentLinkStats {
  totalRevenue: number
  totalClicks: number
  totalConversions: number
  averageConversionRate: number
}

export function PaymentLinksManagement() {
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([])
  const [stats, setStats] = useState<PaymentLinkStats>({
    totalRevenue: 0,
    totalClicks: 0,
    totalConversions: 0,
    averageConversionRate: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingLink, setEditingLink] = useState<PaymentLink | null>(null)

  const [newLink, setNewLink] = useState({
    title: "",
    amount: 0,
    planType: "",
    currency: "INR"
  })

  useEffect(() => {
    fetchPaymentLinks()
  }, [])

  const fetchPaymentLinks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/payment-links')
      if (response.ok) {
        const data = await response.json()
        setPaymentLinks(data.links || [])
        setStats(data.stats || {
          totalRevenue: 0,
          totalClicks: 0,
          totalConversions: 0,
          averageConversionRate: 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch payment links:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateLink = async () => {
    try {
      const response = await fetch('/api/admin/payment-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLink)
      })
      if (response.ok) {
        await fetchPaymentLinks()
        setNewLink({
          title: "",
          amount: 0,
          planType: "",
          currency: "INR"
        })
        setShowCreateDialog(false)
      }
    } catch (error) {
      console.error('Failed to create payment link:', error)
    }
  }

  const handleUpdateLink = async (link: PaymentLink) => {
    try {
      const response = await fetch('/api/admin/payment-links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(link)
      })
      if (response.ok) {
        await fetchPaymentLinks()
        setEditingLink(null)
      }
    } catch (error) {
      console.error('Failed to update payment link:', error)
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (confirm('Are you sure you want to delete this payment link?')) {
      try {
        const response = await fetch(`/api/admin/payment-links?id=${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          await fetchPaymentLinks()
        }
      } catch (error) {
        console.error('Failed to delete payment link:', error)
      }
    }
  }

  const handleToggleStatus = async (link: PaymentLink) => {
    const updatedLink = { ...link, isActive: !link.isActive }
    await handleUpdateLink(updatedLink)
  }

  const copyPaymentLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      alert('Payment link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const getPlanTypeDisplay = (planType: string) => {
    const planMap: { [key: string]: string } = {
      'student-elite': 'Student Elite (Yearly)',
      'student-premium': 'Student Premium (Yearly)',
      'institution-basic': 'Institution Basic (Yearly)',
      'institution-premium': 'Institution Premium (Yearly)'
    }
    return planMap[planType] || planType
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageConversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Links Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Payment Links
              </CardTitle>
              <CardDescription>
                Manage subscription payment links and track their performance
              </CardDescription>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Payment Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Payment Link</DialogTitle>
                  <DialogDescription>
                    Create a new payment link for subscription plans
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="title">Link Title</Label>
                    <Input
                      id="title"
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      placeholder="e.g., Student Elite Yearly"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      value={newLink.amount}
                      onChange={(e) => setNewLink({ ...newLink, amount: parseFloat(e.target.value) })}
                      placeholder="299"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planType">Plan Type</Label>
                    <select
                      id="planType"
                      value={newLink.planType}
                      onChange={(e) => setNewLink({ ...newLink, planType: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Plan Type</option>
                      <option value="student-elite">Student Elite Yearly</option>
                      <option value="student-premium">Student Premium Yearly</option>
                      <option value="institution-basic">Institution Basic Yearly</option>
                      <option value="institution-premium">Institution Premium Yearly</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateLink}>Create Link</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentLinks.map((link) => (
              <div key={link.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{link.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {getPlanTypeDisplay(link.planType)} • ₹{link.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={link.isActive ? "default" : "secondary"}>
                      {link.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(link)}
                      >
                        {link.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingLink(link)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded p-3 flex items-center justify-between">
                  <code className="text-sm flex-1 truncate text-blue-600">{link.url}</code>
                  <div className="flex gap-2 ml-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyPaymentLink(link.url)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(link.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Clicks</p>
                    <p className="text-muted-foreground">{link.clicks}</p>
                  </div>
                  <div>
                    <p className="font-medium">Conversions</p>
                    <p className="text-muted-foreground">{link.conversions}</p>
                  </div>
                  <div>
                    <p className="font-medium">Conversion Rate</p>
                    <p className="text-muted-foreground">{link.conversionRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="font-medium">Revenue</p>
                    <p className="text-muted-foreground">₹{link.totalRevenue.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Link Dialog */}
      {editingLink && (
        <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Payment Link</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="edit-title">Link Title</Label>
                <Input
                  id="edit-title"
                  value={editingLink.title}
                  onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-amount">Amount (₹)</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={editingLink.amount}
                  onChange={(e) => setEditingLink({ ...editingLink, amount: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-planType">Plan Type</Label>
                <select
                  id="edit-planType"
                  value={editingLink.planType}
                  onChange={(e) => setEditingLink({ ...editingLink, planType: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="student-elite">Student Elite Yearly</option>
                  <option value="student-premium">Student Premium Yearly</option>
                  <option value="institution-basic">Institution Basic Yearly</option>
                  <option value="institution-premium">Institution Premium Yearly</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => handleUpdateLink(editingLink)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}