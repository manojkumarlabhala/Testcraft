"use client"
import { notFound } from 'next/navigation'
import { use } from "react"
import Link from 'next/link'
import { getAllBlogPosts, getPostBySlug } from '@/lib/blog-data'
import { BlogHeader } from '@/components/blog/blog-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  User, 
  Eye, 
  ArrowLeft, 
  ArrowRight, 
  Share2, 
  BookOpen, 
  Star,
  Calendar,
  Tag,
  ThumbsUp,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Copy
} from "lucide-react"

interface Params {
  params: Promise<{ slug: string }>
}

export default function PostPage({ params }: Params) {
  const resolvedParams = use(params)
  const allPosts = getAllBlogPosts()
  const post = getPostBySlug(resolvedParams.slug)
  
  if (!post) return notFound()

  const currentIndex = allPosts.findIndex(p => p.slug === resolvedParams.slug)
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3)

  const shareUrl = `https://testcraft.in/blog/${post.slug}`
  const shareText = `${post.title} - ${post.excerpt}`

  const handleShare = (platform: string) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    }
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl)
      return
    }

    window.open((urls as any)[platform], '_blank', 'width=600,height=400')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-950 dark:to-purple-950/30">
      <BlogHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{post.title}</span>
        </nav>
      </div>

      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <article className="mb-12">
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge className={`${
                  post.category === 'Study Tips' ? 'bg-blue-500' :
                  post.category === 'Competitive Exams' ? 'bg-green-500' :
                  post.category === 'Medical Entrance' ? 'bg-red-500' :
                  post.category === 'Career Guidance' ? 'bg-purple-500' :
                  post.category === 'Success Stories' ? 'bg-orange-500' :
                  'bg-gray-500'
                } text-white`}>
                  {post.category}
                </Badge>
                {post.tags && post.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime || '5 min read'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.views || '1.2K'} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Testcraft Editorial Team</span>
                </div>
              </div>
            </header>

            {/* Share Buttons */}
            <div className="sticky top-4 float-right ml-8 mb-8 hidden lg:block">
              <Card className="p-4 bg-white/80 backdrop-blur-sm">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </h3>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                    className="justify-start"
                  >
                    <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                    Facebook
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('twitter')}
                    className="justify-start"
                  >
                    <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                    Twitter
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('linkedin')}
                    className="justify-start"
                  >
                    <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('copy')}
                    className="justify-start"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </Card>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:bg-purple-100 prose-code:text-purple-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
              
              {/* Enhanced content for better SEO and user engagement */}
              <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    Apply these strategies consistently for best results
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    Track your progress using our analytics tools
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    Join our community for more tips and support
                  </li>
                </ul>
              </div>
            </div>

            {/* Article Actions */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    Helpful (127)
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Discuss (23)
                  </Button>
                </div>
                <div className="flex lg:hidden gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('twitter')}
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </article>

          {/* Navigation */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {previousPost && (
              <Link href={`/blog/${previousPost.slug}`}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300 group h-full">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <ArrowLeft className="h-4 w-4" />
                    Previous Post
                  </div>
                  <h3 className="font-bold group-hover:text-purple-600 transition-colors">
                    {previousPost.title}
                  </h3>
                </Card>
              </Link>
            )}
            {nextPost && (
              <Link href={`/blog/${nextPost.slug}`}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300 group h-full md:text-right">
                  <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                    Next Post
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold group-hover:text-purple-600 transition-colors">
                    {nextPost.title}
                  </h3>
                </Card>
              </Link>
            )}
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Exams?</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join 50,000+ students who are already using Testcraft to improve their scores by 40% on average.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 font-bold">
                Start Free Trial
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                View All Papers
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
