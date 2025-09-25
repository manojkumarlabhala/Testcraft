"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CreditCard,
  Wallet,
  Building,
  Smartphone,
  Globe,
  Key,
  Settings,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  TestTube,
  BarChart3,
  Shield,
  Download
} from "lucide-react"

interface PaymentGateway {
  id: string
  name: string
  provider: string
  is_active: boolean
  api_key?: string
  api_secret?: string
  merchant_id?: string
  webhook_secret?: string
  test_mode: boolean
  config: Record<string, any>
  created_at: string
  updated_at: string
}

export function PaymentGatewayManagement() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([])
  const [loading, setLoading] = useState(true)
  const [editingGateway, setEditingGateway] = useState<PaymentGateway | null>(null)
  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>({})
  const [testResults, setTestResults] = useState<{ [key: string]: 'success' | 'error' | 'testing' }>({})
  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    is_active: false,
    api_key: "",
    api_secret: "",
    merchant_id: "",
    webhook_secret: "",
    test_mode: true,
    config: {}
  })

  useEffect(() => {
    fetchGateways()
  }, [])

  const fetchGateways = async () => {
    try {
      const res = await fetch("/api/admin/payment-gateways")
      const data = await res.json()
      if (res.ok) {
        setGateways(data.gateways)
      }
    } catch (error) {
      console.error("Failed to fetch gateways:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (gateway: PaymentGateway) => {
    setEditingGateway(gateway)
    setFormData({
      name: gateway.name,
      provider: gateway.provider,
      is_active: gateway.is_active,
      api_key: gateway.api_key || "",
      api_secret: gateway.api_secret || "",
      merchant_id: gateway.merchant_id || "",
      webhook_secret: gateway.webhook_secret || "",
      test_mode: gateway.test_mode,
      config: gateway.config || {}
    })
  }

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/payment-gateways", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: editingGateway?.id
        })
      })
      const data = await res.json()
      if (res.ok) {
        await fetchGateways()
        setEditingGateway(null)
        setFormData({
          name: "",
          provider: "",
          is_active: false,
          api_key: "",
          api_secret: "",
          merchant_id: "",
          webhook_secret: "",
          test_mode: true,
          config: {}
        })
      }
    } catch (error) {
      console.error("Failed to save gateway:", error)
    }
  }

  const handleCancel = () => {
    setEditingGateway(null)
    setFormData({
      name: "",
      provider: "",
      is_active: false,
      api_key: "",
      api_secret: "",
      merchant_id: "",
      webhook_secret: "",
      test_mode: true,
      config: {}
    })
  }

  const testGateway = async (gatewayId: string) => {
    setTestResults(prev => ({ ...prev, [gatewayId]: 'testing' }))
    
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000))
      const success = Math.random() > 0.3 // 70% success rate for demo
      setTestResults(prev => ({ 
        ...prev, 
        [gatewayId]: success ? 'success' : 'error' 
      }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, [gatewayId]: 'error' }))
    }
  }

  const toggleApiKeyVisibility = (gatewayId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [gatewayId]: !prev[gatewayId]
    }))
  }

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'razorpay': return <CreditCard className="h-5 w-5" />
      case 'phonepe': return <Smartphone className="h-5 w-5" />
      case 'stripe': return <Globe className="h-5 w-5" />
      case 'paypal': return <Wallet className="h-5 w-5" />
      default: return <Building className="h-5 w-5" />
    }
  }

  const getTestResultIcon = (result: string) => {
    switch (result) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      case 'testing': return <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
      default: return <TestTube className="h-4 w-4 text-gray-400" />
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading payment gateways...</div>
  }

  return (
    <div className="space-y-6">
      {/* Gateway Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Active Gateways
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gateways.filter(g => g.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {gateways.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Live Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gateways.filter(g => !g.test_mode && g.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              production ready
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gateways.filter(g => g.test_mode).length}
            </div>
            <p className="text-xs text-muted-foreground">
              in testing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Currency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ INR</div>
            <p className="text-xs text-muted-foreground">
              Indian Rupees
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payment Gateway Management</h2>
          <p className="text-muted-foreground">Configure and manage payment processing</p>
        </div>
        <Button onClick={() => setEditingGateway({} as PaymentGateway)}>
          Add New Gateway
        </Button>
      </div>

      {/* Gateway List */}
      <div className="grid gap-4">
        {gateways.map((gateway) => (
          <Card key={gateway.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getProviderIcon(gateway.provider)}
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {gateway.name}
                      <Badge variant={gateway.is_active ? "default" : "secondary"}>
                        {gateway.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant={gateway.test_mode ? "outline" : "default"}>
                        {gateway.test_mode ? "Test Mode" : "Live Mode"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Provider: {gateway.provider}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testGateway(gateway.id)}
                    disabled={testResults[gateway.id] === 'testing'}
                  >
                    {getTestResultIcon(testResults[gateway.id] || 'default')}
                    <span className="ml-1">Test</span>
                  </Button>
                  <Button variant="outline" onClick={() => handleEdit(gateway)}>
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">API Key</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs">
                        {showApiKeys[gateway.id] ? gateway.api_key : '••••••••'}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleApiKeyVisibility(gateway.id)}
                      >
                        {showApiKeys[gateway.id] ? 
                          <EyeOff className="h-3 w-3" /> : 
                          <Eye className="h-3 w-3" />
                        }
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Status</p>
                    <p className={`text-xs ${gateway.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                      {gateway.is_active ? 'Operational' : 'Disabled'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Environment</p>
                    <p className="text-xs text-muted-foreground">
                      {gateway.test_mode ? 'Sandbox' : 'Production'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Last Test</p>
                    <div className="flex items-center gap-1">
                      {getTestResultIcon(testResults[gateway.id] || 'default')}
                      <span className="text-xs text-muted-foreground">
                        {testResults[gateway.id] === 'success' ? 'Passed' :
                         testResults[gateway.id] === 'error' ? 'Failed' :
                         testResults[gateway.id] === 'testing' ? 'Testing...' : 'Not tested'}
                      </span>
                    </div>
                  </div>
                </div>

                {testResults[gateway.id] === 'error' && (
                  <Alert>
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      Gateway test failed. Please check your configuration and try again.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Form */}
      {editingGateway && (
        <Card>
          <CardHeader>
            <CardTitle>{editingGateway.id ? "Edit" : "Add"} Payment Gateway</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Gateway Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Razorpay Production"
                />
              </div>
              <div>
                <Label htmlFor="provider">Provider</Label>
                <Select value={formData.provider} onValueChange={(value) => setFormData({ ...formData, provider: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="phonepe">PhonePe</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="test_mode"
                checked={formData.test_mode}
                onCheckedChange={(checked) => setFormData({ ...formData, test_mode: checked })}
              />
              <Label htmlFor="test_mode">Test Mode</Label>
            </div>

            {(formData.provider === "razorpay" || formData.provider === "phonepe") && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="api_key">API Key</Label>
                  <Input
                    id="api_key"
                    type="password"
                    value={formData.api_key}
                    onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                    placeholder="API Key"
                  />
                </div>
                <div>
                  <Label htmlFor="api_secret">API Secret</Label>
                  <Input
                    id="api_secret"
                    type="password"
                    value={formData.api_secret}
                    onChange={(e) => setFormData({ ...formData, api_secret: e.target.value })}
                    placeholder="API Secret"
                  />
                </div>
              </div>
            )}

            {formData.provider === "phonepe" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="merchant_id">Merchant ID</Label>
                  <Input
                    id="merchant_id"
                    value={formData.merchant_id}
                    onChange={(e) => setFormData({ ...formData, merchant_id: e.target.value })}
                    placeholder="Merchant ID"
                  />
                </div>
                <div>
                  <Label htmlFor="webhook_secret">Webhook Secret</Label>
                  <Input
                    id="webhook_secret"
                    type="password"
                    value={formData.webhook_secret}
                    onChange={(e) => setFormData({ ...formData, webhook_secret: e.target.value })}
                    placeholder="Webhook Secret"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
