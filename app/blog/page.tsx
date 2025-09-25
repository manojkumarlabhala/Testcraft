import Link from "next/link"
import { getAllBlogPosts, getAllCategories } from "@/lib/blog-data"
import { BlogHeader } from "@/components/blog/blog-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User, Eye, TrendingUp, BookOpen, Star, ArrowRight } from "lucide-react"

export const metadata = {
  title: 'Education Blog & Updates | Testcraft.in - Study Tips, Exam Strategies & Career Guidance',
  description: 'Get the latest study tips, exam preparation strategies, career guidance, and educational technology updates. Expert advice for Indian students, teachers, and parents to excel in academics.',
  keywords: [
    'study tips India',
    'exam preparation strategies',
    'CBSE exam tips',
    'ICSE study guide',
    'JEE preparation',
    'NEET study tips',
    'career guidance India',
    'education blog',
    'student success stories',
    'teaching methods',
    'educational technology',
    'academic performance tips'
  ],
  openGraph: {
    title: 'Education Blog & Updates | Testcraft.in',
    description: 'Expert study tips, exam strategies, and career guidance for Indian students and teachers.',
    images: ['/blog-og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Education Blog & Updates | Testcraft.in',
    description: 'Expert study tips, exam strategies, and career guidance for Indian students and teachers.',
    images: ['/blog-twitter-image.png'],
  },
  alternates: {
    canonical: 'https://testcraft.in/blog',
  },
}

export default function BlogPage() {
  const posts = getAllBlogPosts()
  const categories = getAllCategories()
  
  // Featured content for better engagement and SEO
  const featuredContent = {
    studyTips: [
      { title: "10 Proven Study Techniques for Indian Students", views: "15.2K", rating: 4.9 },
      { title: "How to Score 95+ in CBSE Board Exams", views: "23.1K", rating: 4.8 },
      { title: "JEE Main Preparation Strategy 2025", views: "18.7K", rating: 4.9 },
    ],
    categories: [
      { name: "Study Tips", count: posts.filter(p => p.category.toLowerCase().includes("study") || p.category.toLowerCase().includes("learning")).length, icon: BookOpen, color: "blue" },
      { name: "Jobs & Careers", count: posts.filter(p => p.category.toLowerCase().includes("job") || p.category.toLowerCase().includes("career") || p.category.toLowerCase().includes("work")).length, icon: TrendingUp, color: "green" },
      { name: "Competitive Exams", count: posts.filter(p => p.category.toLowerCase().includes("exam") || p.category.toLowerCase().includes("jee") || p.category.toLowerCase().includes("neet") || p.category.toLowerCase().includes("competitive")).length, icon: Star, color: "purple" },
      { name: "Success Stories", count: posts.filter(p => p.category.toLowerCase().includes("success") || p.category.toLowerCase().includes("story")).length, icon: User, color: "orange" },
    ]
  }
  
  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-950 dark:to-purple-950/30">
        <BlogHeader />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Educational Content Coming Soon!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              We're preparing amazing study tips, exam strategies, and career guidance content for Indian students and teachers.
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              Get Notified When We Launch
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-950 dark:to-purple-950/30">
      <BlogHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              📚 Educational Content Hub
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Master Your Studies with Expert Guidance
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              Get proven study strategies, exam preparation tips, and career guidance from education experts. 
              Helping 50,000+ Indian students achieve academic excellence.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>1M+ Monthly Readers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>50+ Expert Contributors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Featured Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredContent.categories.map((category) => {
              const IconComponent = category.icon
              const colorClasses = {
                blue: "from-blue-500 to-cyan-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
                green: "from-green-500 to-emerald-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
                purple: "from-purple-500 to-pink-500 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
                orange: "from-orange-500 to-red-500 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
              }
              
              return (
                <Link key={category.name} href={`/blog/category/${category.name.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-')}`}>
                  <Card className={`${colorClasses[category.color as keyof typeof colorClasses]} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer`}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${colorClasses[category.color as keyof typeof colorClasses].split(' ')[0]} ${colorClasses[category.color as keyof typeof colorClasses].split(' ')[1]} flex items-center justify-center`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                      <p className="text-muted-foreground">{category.count} Articles</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Featured Articles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Most Popular Articles</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredContent.studyTips.map((article, index) => (
              <Card key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-yellow-500 text-white">Trending</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {article.views}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-3">{article.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{article.rating}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                      Read More <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Latest Posts */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Latest Updates</h2>
            <Button variant="outline">View All Posts</Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Card key={post.slug} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 relative">
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white/80" />
                  </div>
                  <Badge className={`absolute top-4 left-4 ${
                    post.category === 'Technology' ? 'bg-blue-500' :
                    post.category === 'Jobs' ? 'bg-green-500' : 'bg-purple-500'
                  } text-white`}>
                    {post.category}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors">
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
                      <span>{Math.floor(Math.random() * 10) + 5}K views</span>
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
        </section>

        {/* Newsletter Signup */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Study Tips</h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Get weekly study tips, exam strategies, and career guidance delivered to your inbox. 
            Join 50,000+ students who are already improving their academic performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
            />
            <Button className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-6 py-3">
              Subscribe Free
            </Button>
          </div>
          <p className="text-xs text-purple-200 mt-4">
            📧 No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </section>
      </main>
    </div>
  )
}
