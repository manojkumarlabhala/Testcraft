import blogPosts from '../data/blog-posts.json'
import blogPostsBatch1 from '../data/blog-posts-batch1.json'
import blogPostsBatch4Stage1 from '../data/blog-posts-batch4-stage1-updated.json'
import blogPostsBatch4Topic4 from '../data/blog-posts-batch4-topic4-stage2.json'
import blogPostsBatch2 from '../data/blog-posts-batch2.json'
import blogPostsBatch3 from '../data/blog-posts-batch3.json'
import blogPostsBatch3Stage1 from '../data/blog-posts-batch3-stage1.json'
import blogPostsBatch3Stage2 from '../data/blog-posts-batch3-stage2.json'
import blogPostsBatch4Stage1Original from '../data/blog-posts-batch4-stage1-updated.json'
import blogPostsBatch4Stage2 from '../data/blog-posts-batch4-stage2.json'
import blogPostsBatch4Topic2 from '../data/blog-posts-batch4-topic2-stage2.json'
import blogPostsBatch4Topic3 from '../data/blog-posts-batch4-topic3-stage2.json'
import blogPostsBatch4Topic5 from '../data/blog-posts-batch4-topic5-stage2.json'
import blogPostsBatch4Topic6 from '../data/blog-posts-batch4-topic6-stage2.json'
import blogPostsBatch4Topic7 from '../data/blog-posts-batch4-topic7-stage2.json'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  content: string
  readTime?: string
  views?: string
  tags: string[]
}

// Function to safely load JSON data
function safeLoadPosts(posts: any[]): BlogPost[] {
  try {
    if (!Array.isArray(posts)) {
      console.warn('Posts data is not an array:', posts)
      return []
    }
    return posts.filter(post => {
      const isValid = post && 
        typeof post === 'object' && 
        post.slug && 
        post.title && 
        post.excerpt && 
        post.date && 
        post.category &&
        post.content
      
      if (!isValid) {
        console.warn('Invalid post found:', post)
      }
      return isValid
    }) as BlogPost[]
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return []
  }
}

// Combine all blog posts from different files
export function getAllBlogPosts(): BlogPost[] {
  const allPosts: BlogPost[] = [
    ...safeLoadPosts(blogPosts || []),
    ...safeLoadPosts(blogPostsBatch1 || []),
    ...safeLoadPosts(blogPostsBatch4Stage1 || []),
    ...safeLoadPosts(blogPostsBatch4Topic4 || []),
    ...safeLoadPosts(blogPostsBatch2 || []),
    ...safeLoadPosts(blogPostsBatch3 || []),
    ...safeLoadPosts(blogPostsBatch3Stage1 || []),
    ...safeLoadPosts(blogPostsBatch3Stage2 || []),
    ...safeLoadPosts(blogPostsBatch4Stage1Original || []),
    ...safeLoadPosts(blogPostsBatch4Stage2 || []),
    ...safeLoadPosts(blogPostsBatch4Topic2 || []),
    ...safeLoadPosts(blogPostsBatch4Topic3 || []),
    ...safeLoadPosts(blogPostsBatch4Topic5 || []),
    ...safeLoadPosts(blogPostsBatch4Topic6 || []),
    ...safeLoadPosts(blogPostsBatch4Topic7 || [])
  ]

  // Remove duplicates based on slug
  const uniquePosts = allPosts.filter((post, index, self) => 
    index === self.findIndex(p => p.slug === post.slug)
  )

  // Sort by date (newest first)
  return uniquePosts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

// Get posts by category
export function getPostsByCategory(category: string): BlogPost[] {
  return getAllBlogPosts().filter(post => 
    post.category.toLowerCase().includes(category.toLowerCase())
  )
}

// Get a single post by slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find(post => post.slug === slug)
}

// Get all unique categories
export function getAllCategories(): string[] {
  const categories = getAllBlogPosts().map(post => post.category)
  return Array.from(new Set(categories)).sort()
}

// Get recent posts
export function getRecentPosts(limit: number = 10): BlogPost[] {
  return getAllBlogPosts().slice(0, limit)
}

// Search posts
export function searchPosts(query: string): BlogPost[] {
  const searchTerm = query.toLowerCase()
  return getAllBlogPosts().filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.category.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}