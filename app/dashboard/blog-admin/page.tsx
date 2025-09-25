"use client"

import { useState, useEffect } from 'react'
import TipTapEditor from '@/components/blog/tiptap-editor'

export default function BlogAdminPage() {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('Announcements')
  const [content, setContent] = useState('')
  const [posts, setPosts] = useState<any[]>([])
  const [status, setStatus] = useState<string | null>(null)

  const loadPosts = async () => {
    const res = await fetch('/api/blog')
    const data = await res.json()
    setPosts(data)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setStatus('saving')
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, content, category })
      })
      if (res.ok) {
        setStatus('saved')
        setTitle('')
        setExcerpt('')
        setContent('')
        loadPosts()
      } else if (res.status === 401) {
        setStatus('unauthorized')
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Blog Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
          <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short excerpt" className="w-full p-2 border rounded" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="w-full p-2 border rounded" />
          <div>
            <TipTapEditor content={content} onChange={(html) => setContent(html)} />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-primary text-white rounded">Create Post</button>
            {status === 'saving' && <span>Saving...</span>}
            {status === 'saved' && <span className="text-green-600">Saved</span>}
            {status === 'unauthorized' && <span className="text-red-600">Please log in to post</span>}
            {status === 'error' && <span className="text-red-600">Error saving post</span>}
          </div>
        </form>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Recent Posts</h2>
          <div className="space-y-3">
            {posts.map((p) => (
              <div key={p.slug} className="p-3 border rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-muted-foreground">{p.date} • {p.category}</div>
                  </div>
                </div>
                <p className="mt-2 text-sm">{p.excerpt}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
