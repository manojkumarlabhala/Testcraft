import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const DATA_FILE = path.resolve(process.cwd(), 'data', 'blog-posts.json')

export async function GET() {
  try {
    const raw = await fs.promises.readFile(DATA_FILE, 'utf-8')
    const posts = JSON.parse(raw)
    return NextResponse.json(posts)
  } catch (err) {
    console.error('Failed to read blog posts:', err)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, excerpt, content, category } = body
    if (!title || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const date = new Date().toISOString().split('T')[0]

    let posts = []
    try {
      const raw = await fs.promises.readFile(DATA_FILE, 'utf-8')
      posts = JSON.parse(raw)
    } catch (e) {
      // start fresh
      posts = []
    }

    const newPost = { slug, title, excerpt: excerpt || '', date, category: category || 'Uncategorized', content }
    posts.unshift(newPost)

    await fs.promises.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8')

    return NextResponse.json(newPost, { status: 201 })
  } catch (err) {
    console.error('Failed to create post:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
