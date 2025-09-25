import { MetadataRoute } from 'next'
import posts from '../data/blog-posts.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://testcraft.in'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mock-tests/create`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/subscription`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    },
  ]

  // Blog posts
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Exam board pages (dynamic based on popular boards)
  const examBoards = [
    'cbse',
    'icse', 
    'maharashtra-board',
    'up-board',
    'bihar-board',
    'west-bengal-board',
    'karnataka-board',
    'tamil-nadu-board',
    'andhra-pradesh-board',
    'telangana-board'
  ]

  const examBoardPages = examBoards.map((board) => ({
    url: `${baseUrl}/papers/${board}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Subject pages
  const subjects = [
    'mathematics',
    'physics', 
    'chemistry',
    'biology',
    'english',
    'hindi',
    'history',
    'geography',
    'economics',
    'political-science'
  ]

  const subjectPages = subjects.map((subject) => ({
    url: `${baseUrl}/papers/subject/${subject}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages, ...examBoardPages, ...subjectPages]
}