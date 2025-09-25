import Link from "next/link"
import { getAllBlogPosts } from "@/lib/blog-data"
import { BlogHeader } from "@/components/blog/blog-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User, Eye, ArrowLeft, BookOpen, TrendingUp, Star, Users, ArrowRight } from "lucide-react"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

const categoryConfig = {
  "study-tips": {
    name: "Study Tips",
    description: "Expert study techniques, time management strategies, and learning methods for academic success.",
    icon: BookOpen,
    color: "blue",
    keywords: ["study tips", "learning techniques", "time management", "study habits"]
  },
  "jobs-careers": {
    name: "Jobs & Careers",
    description: "Career guidance, job opportunities, professional development, and industry insights.",
    icon: TrendingUp,
    color: "green",
    keywords: ["jobs", "careers", "career guidance", "professional development"]
  },
  "competitive-exams": {
    name: "Competitive Exams",
    description: "Preparation strategies, exam patterns, and success tips for JEE, NEET, UPSC, and other competitive exams.",
    icon: Star,
    color: "purple",
    keywords: ["competitive exams", "jee", "neet", "exam preparation", "entrance exams"]
  },
  "success-stories": {
    name: "Success Stories",
    description: "Inspiring stories of students who achieved their academic goals through hard work and smart strategies.",
    icon: Users,
    color: "orange",
    keywords: ["success stories", "student achievements", "motivational stories"]
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = categoryConfig[params.slug as keyof typeof categoryConfig]

  if (!category) {
    return {
      title: 'Category Not Found | Testcraft.in Blog',
      description: 'The requested category could not be found.',
    }
  }

  return {
    title: `${category.name} - Educational Blog | Testcraft.in`,
    description: category.description,
    keywords: category.keywords,
    openGraph: {
      title: `${category.name} - Educational Blog | Testcraft.in`,
      description: category.description,
      images: ['/blog-og-image.png'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} - Educational Blog | Testcraft.in`,
      description: category.description,
      images: ['/blog-twitter-image.png'],
    },
    alternates: {
      canonical: `https://testcraft.in/blog/category/${params.slug}`,
    },
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categoryConfig[params.slug as keyof typeof categoryConfig]

  if (!category) {
    notFound()
  }

  const allPosts = getAllBlogPosts()

  // Filter posts based on category keywords
  const categoryPosts = allPosts.filter(post => {
    const postCategory = post.category.toLowerCase()
    const postTitle = post.title.toLowerCase()
    const postExcerpt = post.excerpt.toLowerCase()
    const postTags = post.tags.map(tag => tag.toLowerCase())

    return category.keywords.some(keyword =>
      postCategory.includes(keyword) ||
      postTitle.includes(keyword) ||
      postExcerpt.includes(keyword) ||
      postTags.some(tag => tag.includes(keyword))
    )
  })

  const IconComponent = category.icon
  const colorClasses = {
    blue: "from-blue-600 to-cyan-600",
    green: "from-green-600 to-emerald-600",
    purple: "from-purple-600 to-pink-600",
    orange: "from-orange-600 to-red-600"
  }

  if (!categoryPosts || categoryPosts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-950 dark:to-purple-950/30">
        <BlogHeader />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${colorClasses[category.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                <IconComponent className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
              <p className="text-xl text-muted-foreground">{category.description}</p>
            </div>

            <div className="text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Articles Coming Soon!</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We're working on amazing {category.name.toLowerCase()} content. Check back soon for expert insights and valuable resources.
              </p>
              <div className="space-y-4">
                <Button asChild>
                  <Link href="/blog">Explore Other Categories</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-950 dark:to-purple-950/30">
      <BlogHeader />

      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${colorClasses[category.color as keyof typeof colorClasses]} text-white py-16`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
              <IconComponent className="h-10 w-10 text-white" />
            </div>
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              {categoryPosts.length} Articles
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              {category.name}
            </h1>
            <p className="text-xl mb-8 text-white/90">
              {category.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{categoryPosts.reduce((sum, post) => sum + (parseInt(post.views?.replace('K', '000') || '0') || 0), 0)}K+ Total Views</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Expert Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Updated Regularly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categoryPosts.map((post, index) => (
            <Card key={post.slug} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className={`h-48 bg-gradient-to-br ${colorClasses[category.color as keyof typeof colorClasses]} relative`}>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <IconComponent className="h-16 w-16 text-white/80" />
                </div>
                <Badge className={`absolute top-4 left-4 ${
                  post.category === 'Technology' ? 'bg-blue-500' :
                  post.category === 'Jobs' ? 'bg-green-500' : 'bg-purple-500'
                } text-white`}>
                  {post.category}
                </Badge>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(post.date).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    <span>{post.views || Math.floor(Math.random() * 10) + 5}K views</span>
                  </div>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                    Read Full Article
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <section className={`bg-gradient-to-r ${colorClasses[category.color as keyof typeof colorClasses]} rounded-2xl p-8 text-white text-center mt-16`}>
          <h2 className="text-3xl font-bold mb-4">Stay Updated with {category.name}</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Get the latest {category.name.toLowerCase()} articles, tips, and insights delivered to your inbox.
            Join thousands of students who are already benefiting from our expert content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
            />
            <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-6 py-3">
              Subscribe Free
            </Button>
          </div>
          <p className="text-xs text-white/80 mt-4">
            📧 No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </section>
      </main>
    </div>
  )
}