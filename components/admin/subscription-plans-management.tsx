"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  DollarSign, 
  Users, 
  Star, 
  Gift, 
  Crown,
  Building,
  Zap,
  CheckCircle,
  XCircle,
  Copy,
  ExternalLink,
  TrendingUp,
  Target,
  Globe,
  Search
} from "lucide-react"

interface SubscriptionPlan {
  id: string
  name: string
  displayName: string
  description: string
  shortDescription: string
  price: number
  originalPrice?: number
  currency: string
  billingCycle: 'monthly' | 'annual' | 'lifetime'
  category: 'student' | 'teacher' | 'institution' | 'enterprise'
  features: string[]
  limitations: string[]
  isPopular: boolean
  isActive: boolean
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  targetAudience: string[]
  testimonials: Array<{
    name: string
    role: string
    content: string
    rating: number
  }>
  stats: {
    totalSubscribers: number
    conversionRate: number
    churnRate: number
    averageRating: number
  }
  createdAt: string
  updatedAt: string
}

interface PlanFeature {
  id: string
  name: string
  description: string
  category: string
  isCore: boolean
  isActive: boolean
}

export function SubscriptionPlansManagement() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [features, setFeatures] = useState<PlanFeature[]>([])
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [showCreatePlan, setShowCreatePlan] = useState(false)
  const [showCreateFeature, setShowCreateFeature] = useState(false)
  const [editingFeature, setEditingFeature] = useState<PlanFeature | null>(null)
  const [activeTab, setActiveTab] = useState("plans")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // SEO and Analytics states
  const [seoSettings, setSeoSettings] = useState({
    pricingPageTitle: "Affordable Pricing Plans for Students & Teachers - TestCraft India",
    pricingPageDescription: "Choose from our flexible pricing plans designed for Indian students, teachers, and institutions. Start with free mock tests or upgrade to premium features.",
    pricingPageKeywords: ["pricing plans", "subscription", "mock tests", "NEET preparation", "JEE preparation", "affordable pricing", "student plans", "teacher plans"],
    enableSchemaMarkup: true,
    enableOpenGraph: true,
    enableTwitterCards: true
  })

  useEffect(() => {
    fetchPlans()
    fetchFeatures()
    fetchSeoSettings()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/subscription-plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans || [])
      } else {
        // Mock data for demo
        setPlans([
          {
            id: '1',
            name: 'free',
            displayName: 'Free Plan',
            description: 'Perfect for students starting their preparation journey with basic features and limited access.',
            shortDescription: 'Basic features for beginners',
            price: 0,
            currency: 'INR',
            billingCycle: 'monthly',
            category: 'student',
            features: [
              '10 Mock Tests per month',
              'Basic Performance Analytics',
              'Community Access',
              'Mobile App Access',
              'Email Support'
            ],
            limitations: [
              'Limited test history',
              'No detailed solutions',
              'No expert doubt solving',
              'Limited analytics'
            ],
            isPopular: false,
            isActive: true,
            seoTitle: 'Free Mock Tests for NEET & JEE - Start Your Preparation',
            seoDescription: 'Get started with free mock tests for NEET, JEE, and CBSE. Limited access with basic features perfect for beginners.',
            seoKeywords: ['free mock tests', 'free NEET preparation', 'free JEE tests', 'CBSE practice'],
            targetAudience: ['New students', 'Budget-conscious learners', 'Trial users'],
            testimonials: [
              {
                name: 'Priya Sharma',
                role: 'NEET Aspirant',
                content: 'Great way to start practicing without any cost!',
                rating: 4
              }
            ],
            stats: {
              totalSubscribers: 12450,
              conversionRate: 23.5,
              churnRate: 0,
              averageRating: 4.1
            },
            createdAt: '2024-01-01',
            updatedAt: '2024-01-15'
          },
          {
            id: '2',
            name: 'premium',
            displayName: 'Premium Plan',
            description: 'Comprehensive preparation package with unlimited tests, detailed analytics, and expert support for serious aspirants.',
            shortDescription: 'Complete preparation solution',
            price: 299,
            originalPrice: 399,
            currency: 'INR',
            billingCycle: 'monthly',
            category: 'student',
            features: [
              'Unlimited Mock Tests',
              'Detailed Performance Analytics',
              'Expert Doubt Solving',
              'Video Solutions',
              'Previous Year Papers',
              'Study Materials (PDF)',
              'Priority Support',
              'Mobile & Web Access'
            ],
            limitations: [
              'No 1-on-1 mentorship',
              'No live classes'
            ],
            isPopular: true,
            isActive: true,
            seoTitle: 'Premium Mock Tests ₹299/month - NEET, JEE, CBSE Preparation',
            seoDescription: 'Premium subscription with unlimited mock tests, expert doubt solving, and detailed analytics. Perfect for NEET, JEE, and CBSE preparation.',
            seoKeywords: ['premium mock tests', 'NEET preparation premium', 'JEE premium plan', 'unlimited tests', 'expert support'],
            targetAudience: ['Serious aspirants', 'Regular users', 'Students needing expert help'],
            testimonials: [
              {
                name: 'Arjun Patel',
                role: 'JEE Aspirant',
                content: 'Amazing value for money! The detailed analytics helped me improve significantly.',
                rating: 5
              },
              {
                name: 'Sneha Gupta',
                role: 'NEET Student',
                content: 'Expert doubt solving is a game-changer. Highly recommended!',
                rating: 5
              }
            ],
            stats: {
              totalSubscribers: 8930,
              conversionRate: 18.2,
              churnRate: 12.5,
              averageRating: 4.6
            },
            createdAt: '2024-01-01',
            updatedAt: '2024-01-20'
          },
          {
            id: '3',
            name: 'elite',
            displayName: 'Elite Plan',
            description: 'Ultimate preparation experience with 1-on-1 mentorship, live classes, and personalized study plans for top performers.',
            shortDescription: '1-on-1 mentorship & live classes',
            price: 599,
            originalPrice: 799,
            currency: 'INR',
            billingCycle: 'monthly',
            category: 'student',
            features: [
              'Everything in Premium',
              '1-on-1 Weekly Mentorship',
              'Live Interactive Classes',
              'Personalized Study Plans',
              'Custom Mock Tests',
              'Advanced Analytics & Reports',
              'WhatsApp Support Group',
              'Recorded Class Access',
              'Priority Test Evaluation'
            ],
            limitations: [],
            isPopular: false,
            isActive: true,
            seoTitle: 'Elite Plan ₹599/month - 1-on-1 Mentorship for NEET & JEE',
            seoDescription: 'Elite subscription with personal mentorship, live classes, and custom study plans. Best for serious NEET and JEE aspirants.',
            seoKeywords: ['elite plan', 'personal mentorship', 'live classes', 'NEET mentorship', 'JEE coaching', 'premium coaching'],
            targetAudience: ['Top aspirants', 'Students needing personal guidance', 'Competitive exam toppers'],
            testimonials: [
              {
                name: 'Rohit Kumar',
                role: 'JEE Topper',
                content: 'The personal mentorship helped me crack JEE Advanced. Worth every penny!',
                rating: 5
              }
            ],
            stats: {
              totalSubscribers: 2340,
              conversionRate: 8.7,
              churnRate: 6.2,
              averageRating: 4.8
            },
            createdAt: '2024-01-01',
            updatedAt: '2024-01-22'
          },
          {
            id: '4',
            name: 'institution',
            displayName: 'Institution Plan',
            description: 'Comprehensive solution for schools, colleges, and coaching institutes with bulk student management and advanced reporting.',
            shortDescription: 'Bulk student management for institutions',
            price: 2999,
            currency: 'INR',
            billingCycle: 'monthly',
            category: 'institution',
            features: [
              'Up to 500 Students',
              'Institution Dashboard',
              'Bulk Test Assignment',
              'Detailed Class Reports',
              'Parent Communication Portal',
              'Custom Branding',
              'Advanced Analytics',
              'API Access',
              'Dedicated Support Manager',
              'Teacher Training Sessions'
            ],
            limitations: [
              'Additional charges for >500 students'
            ],
            isPopular: false,
            isActive: true,
            seoTitle: 'Institution Plan ₹2999/month - School & Coaching Institute Solution',
            seoDescription: 'Complete digital testing solution for schools and coaching institutes. Manage up to 500 students with advanced reporting.',
            seoKeywords: ['institution plan', 'school management', 'coaching institute', 'bulk student management', 'educational institution'],
            targetAudience: ['Schools', 'Coaching institutes', 'Educational organizations', 'Teachers'],
            testimonials: [
              {
                name: 'Dr. Rajesh Agarwal',
                role: 'Principal, ABC School',
                content: 'Excellent platform for managing our students\' test preparation. Great reporting features!',
                rating: 5
              }
            ],
            stats: {
              totalSubscribers: 156,
              conversionRate: 15.6,
              churnRate: 8.9,
              averageRating: 4.7
            },
            createdAt: '2024-01-01',
            updatedAt: '2024-01-25'
          }
        ])
      }
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/admin/plan-features')
      if (response.ok) {
        const data = await response.json()
        setFeatures(data.features || [])
      } else {
        // Mock features data
        setFeatures([
          { id: '1', name: 'Mock Tests', description: 'Access to practice tests', category: 'Testing', isCore: true, isActive: true },
          { id: '2', name: 'Performance Analytics', description: 'Detailed performance insights', category: 'Analytics', isCore: true, isActive: true },
          { id: '3', name: 'Expert Doubt Solving', description: '24/7 expert support for doubts', category: 'Support', isCore: false, isActive: true },
          { id: '4', name: 'Live Classes', description: 'Interactive live sessions', category: 'Learning', isCore: false, isActive: true },
          { id: '5', name: '1-on-1 Mentorship', description: 'Personal guidance from experts', category: 'Mentorship', isCore: false, isActive: true }
        ])
      }
    } catch (error) {
      console.error('Failed to fetch features:', error)
    }
  }

  const fetchSeoSettings = async () => {
    try {
      const response = await fetch('/api/admin/seo-settings/pricing')
      if (response.ok) {
        const data = await response.json()
        setSeoSettings(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Failed to fetch SEO settings:', error)
    }
  }

  const savePlan = async (planData: Partial<SubscriptionPlan>) => {
    try {
      const method = planData.id ? 'PUT' : 'POST'
      const url = planData.id ? `/api/admin/subscription-plans/${planData.id}` : '/api/admin/subscription-plans'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      })

      if (response.ok) {
        await fetchPlans()
        setEditingPlan(null)
        setShowCreatePlan(false)
      }
    } catch (error) {
      console.error('Failed to save plan:', error)
    }
  }

  const deletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return
    
    try {
      const response = await fetch(`/api/admin/subscription-plans/${planId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPlans()
      }
    } catch (error) {
      console.error('Failed to delete plan:', error)
    }
  }

  const saveFeature = async (featureData: Partial<PlanFeature>) => {
    try {
      const method = featureData.id ? 'PUT' : 'POST'
      const url = featureData.id ? `/api/admin/plan-features/${featureData.id}` : '/api/admin/plan-features'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(featureData)
      })

      if (response.ok) {
        await fetchFeatures()
        setEditingFeature(null)
        setShowCreateFeature(false)
      }
    } catch (error) {
      console.error('Failed to save feature:', error)
    }
  }

  const deleteFeature = async (featureId: string) => {
    if (!confirm('Are you sure you want to delete this feature? This action cannot be undone.')) return
    
    try {
      const response = await fetch(`/api/admin/plan-features/${featureId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchFeatures()
      }
    } catch (error) {
      console.error('Failed to delete feature:', error)
    }
  }

  const toggleFeatureActive = async (featureId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/plan-features/${featureId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      })

      if (response.ok) {
        await fetchFeatures()
      }
    } catch (error) {
      console.error('Failed to toggle feature status:', error)
    }
  }

  const saveSeoSettings = async () => {
    try {
      const response = await fetch('/api/admin/seo-settings/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seoSettings)
      })

      if (response.ok) {
        alert('SEO settings saved successfully!')
      }
    } catch (error) {
      console.error('Failed to save SEO settings:', error)
    }
  }

  const FeatureForm = ({ feature, onSave, onCancel }: { 
    feature?: PlanFeature, 
    onSave: (data: Partial<PlanFeature>) => void, 
    onCancel: () => void 
  }) => {
    const [formData, setFormData] = useState<Partial<PlanFeature>>(
      feature || {
        name: '',
        description: '',
        category: 'Testing',
        isCore: false,
        isActive: true
      }
    )

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{feature ? 'Edit Feature' : 'Create New Feature'}</CardTitle>
          <CardDescription>
            Add or modify features that can be used across subscription plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="featureName">Feature Name</Label>
                <Input
                  id="featureName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Mock Tests"
                  required
                />
              </div>
              <div>
                <Label htmlFor="featureCategory">Category</Label>
                <select
                  id="featureCategory"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="Testing">Testing</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Support">Support</option>
                  <option value="Learning">Learning</option>
                  <option value="Mentorship">Mentorship</option>
                  <option value="Resources">Resources</option>
                  <option value="Platform">Platform</option>
                  <option value="Institution">Institution</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="featureDescription">Description</Label>
              <Textarea
                id="featureDescription"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this feature provides..."
                rows={3}
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isCore"
                  checked={formData.isCore}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isCore: checked }))}
                />
                <Label htmlFor="isCore">Core Feature</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Feature
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }
  const PlanForm = ({ plan, onSave, onCancel }: { 
    plan?: SubscriptionPlan, 
    onSave: (data: Partial<SubscriptionPlan>) => void, 
    onCancel: () => void 
  }) => {
    const [formData, setFormData] = useState<Partial<SubscriptionPlan>>(
      plan || {
        name: '',
        displayName: '',
        description: '',
        shortDescription: '',
        price: 0,
        currency: 'INR',
        billingCycle: 'monthly',
        category: 'student',
        features: [],
        limitations: [],
        isPopular: false,
        isActive: true,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: [],
        targetAudience: []
      }
    )

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{plan ? 'Edit Plan' : 'Create New Plan'}</CardTitle>
          <CardDescription>
            Configure subscription plan details, features, and SEO optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="seo">SEO Settings</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Plan ID</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., premium"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="e.g., Premium Plan"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed plan description..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Input
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                    placeholder="Brief description for cards"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={formData.originalPrice || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) || undefined }))}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingCycle">Billing Cycle</Label>
                    <select
                      id="billingCycle"
                      value={formData.billingCycle}
                      onChange={(e) => setFormData(prev => ({ ...prev, billingCycle: e.target.value as any }))}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annual</option>
                      <option value="lifetime">Lifetime</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="institution">Institution</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPopular"
                      checked={formData.isPopular}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPopular: checked }))}
                    />
                    <Label htmlFor="isPopular">Popular Plan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <div>
                  <Label>Features (one per line)</Label>
                  <Textarea
                    value={formData.features?.join('\n') || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value.split('\n').filter(f => f.trim()) }))}
                    placeholder="Unlimited Mock Tests\nExpert Doubt Solving\nDetailed Analytics"
                    rows={6}
                  />
                </div>

                <div>
                  <Label>Limitations (one per line)</Label>
                  <Textarea
                    value={formData.limitations?.join('\n') || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, limitations: e.target.value.split('\n').filter(l => l.trim()) }))}
                    placeholder="No 1-on-1 mentorship\nNo live classes"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Target Audience (one per line)</Label>
                  <Textarea
                    value={formData.targetAudience?.join('\n') || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value.split('\n').filter(a => a.trim()) }))}
                    placeholder="Serious aspirants\nRegular users\nStudents needing expert help"
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="Premium Mock Tests ₹299/month - NEET, JEE, CBSE Preparation"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.seoTitle?.length || 0}/60 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder="Premium subscription with unlimited mock tests, expert doubt solving, and detailed analytics..."
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.seoDescription?.length || 0}/160 characters
                  </p>
                </div>

                <div>
                  <Label>SEO Keywords (comma-separated)</Label>
                  <Textarea
                    value={formData.seoKeywords?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) }))}
                    placeholder="premium mock tests, NEET preparation premium, JEE premium plan"
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    Analytics data is automatically collected when the plan is active. Manual editing is for testing purposes only.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Total Subscribers</Label>
                    <Input
                      type="number"
                      value={formData.stats?.totalSubscribers || 0}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        stats: { ...prev.stats, totalSubscribers: Number(e.target.value) } as any
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Conversion Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.stats?.conversionRate || 0}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        stats: { ...prev.stats, conversionRate: Number(e.target.value) } as any
                      }))}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-4">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Plan
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  const filteredPlans = plans.filter(plan => 
    plan.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'student': return <Users className="h-4 w-4" />
      case 'teacher': return <Star className="h-4 w-4" />
      case 'institution': return <Building className="h-4 w-4" />
      case 'enterprise': return <Crown className="h-4 w-4" />
      default: return <Zap className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subscription Plans Management</h2>
          <p className="text-muted-foreground">Manage pricing, features, and SEO optimization for all subscription plans</p>
        </div>
        <Button onClick={() => setShowCreatePlan(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Plans Management</TabsTrigger>
          <TabsTrigger value="features">Features Library</TabsTrigger>
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Create/Edit Plan Form */}
          {(showCreatePlan || editingPlan) && (
            <PlanForm
              plan={editingPlan || undefined}
              onSave={savePlan}
              onCancel={() => {
                setShowCreatePlan(false)
                setEditingPlan(null)
              }}
            />
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.isPopular ? 'ring-2 ring-primary' : ''}`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(plan.category)}
                      <CardTitle className="text-lg">{plan.displayName}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingPlan(plan)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deletePlan(plan.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{plan.shortDescription}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-2">
                      {plan.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{plan.originalPrice}
                        </span>
                      )}
                      <span className="text-3xl font-bold">
                        {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">/{plan.billingCycle}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Features:</p>
                    <ul className="text-xs space-y-1">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li className="text-muted-foreground">
                          +{plan.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex gap-2">
                      <Badge variant={plan.category === 'student' ? 'default' : 'secondary'}>
                        {plan.category}
                      </Badge>
                      <Badge variant={plan.isActive ? 'default' : 'destructive'}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {plan.stats.totalSubscribers} subscribers
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Conversion</p>
                      <p className="font-medium">{plan.stats.conversionRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <p className="font-medium">⭐ {plan.stats.averageRating}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {/* Create/Edit Feature Form */}
          {(showCreateFeature || editingFeature) && (
            <FeatureForm
              feature={editingFeature || undefined}
              onSave={saveFeature}
              onCancel={() => {
                setShowCreateFeature(false)
                setEditingFeature(null)
              }}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle>Features Library</CardTitle>
              <CardDescription>
                Manage the feature library used across all subscription plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                      <Badge variant="outline" className="mt-1">{feature.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {feature.isCore && <Badge>Core</Badge>}
                      <Switch 
                        checked={feature.isActive} 
                        onCheckedChange={(checked) => toggleFeatureActive(feature.id, checked)}
                      />
                      <Button size="sm" variant="ghost" onClick={() => setEditingFeature(feature)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => deleteFeature(feature.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button className="w-full" variant="outline" onClick={() => setShowCreateFeature(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Pricing Page SEO Settings
              </CardTitle>
              <CardDescription>
                Configure SEO metadata for the pricing page to improve search engine visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pricingPageTitle">Page Title</Label>
                <Input
                  id="pricingPageTitle"
                  value={seoSettings.pricingPageTitle}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, pricingPageTitle: e.target.value }))}
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {seoSettings.pricingPageTitle.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="pricingPageDescription">Page Description</Label>
                <Textarea
                  id="pricingPageDescription"
                  value={seoSettings.pricingPageDescription}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, pricingPageDescription: e.target.value }))}
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {seoSettings.pricingPageDescription.length}/160 characters
                </p>
              </div>

              <div>
                <Label>Page Keywords</Label>
                <Textarea
                  value={seoSettings.pricingPageKeywords.join(', ')}
                  onChange={(e) => setSeoSettings(prev => ({ 
                    ...prev, 
                    pricingPageKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                  }))}
                  placeholder="pricing plans, subscription, mock tests"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Advanced SEO Features</h4>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableSchemaMarkup"
                    checked={seoSettings.enableSchemaMarkup}
                    onCheckedChange={(checked) => setSeoSettings(prev => ({ ...prev, enableSchemaMarkup: checked }))}
                  />
                  <Label htmlFor="enableSchemaMarkup">Enable Schema.org Markup</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableOpenGraph"
                    checked={seoSettings.enableOpenGraph}
                    onCheckedChange={(checked) => setSeoSettings(prev => ({ ...prev, enableOpenGraph: checked }))}
                  />
                  <Label htmlFor="enableOpenGraph">Enable Open Graph Tags</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableTwitterCards"
                    checked={seoSettings.enableTwitterCards}
                    onCheckedChange={(checked) => setSeoSettings(prev => ({ ...prev, enableTwitterCards: checked }))}
                  />
                  <Label htmlFor="enableTwitterCards">Enable Twitter Cards</Label>
                </div>
              </div>

              <Button onClick={saveSeoSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save SEO Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{plans.reduce((sum, plan) => sum + (plan.stats.totalSubscribers * plan.price), 0).toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {plans.reduce((sum, plan) => sum + plan.stats.totalSubscribers, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Across all plans</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Conversion</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(plans.reduce((sum, plan) => sum + plan.stats.conversionRate, 0) / plans.length).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Average across plans</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premium Rate</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    (plans.filter(p => p.price > 0).reduce((sum, plan) => sum + plan.stats.totalSubscribers, 0) / 
                    plans.reduce((sum, plan) => sum + plan.stats.totalSubscribers, 0)) * 100
                  ).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Paid vs free users</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Plan Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(plan.category)}
                      <div>
                        <h4 className="font-medium">{plan.displayName}</h4>
                        <p className="text-sm text-muted-foreground">
                          ₹{plan.price}/{plan.billingCycle} • {plan.stats.totalSubscribers} subscribers
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{plan.stats.conversionRate}% conversion</p>
                      <p className="text-xs text-muted-foreground">⭐ {plan.stats.averageRating} rating</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}