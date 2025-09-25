import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server-client'
import { revalidatePath } from 'next/cache'

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * POST /api/blog/create
 * Body: { title, slug?, excerpt, content, category, tags, author_id, status }
 * Protect this endpoint with an `x-api-key` header matching `API_PUBLISH_KEY` or `REVALIDATE_SECRET`.
 */
export async function POST(request: Request) {
  const apiKey = request.headers.get('x-api-key') || ''
  if (!apiKey || (apiKey !== process.env.API_PUBLISH_KEY && apiKey !== process.env.REVALIDATE_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  let { title, slug, excerpt = null, content, category = null, tags = [], author_id = null, status = 'published', readTime = null } = body
  if (!title || !content) {
    return NextResponse.json({ error: 'Missing required fields (title, content)' }, { status: 400 })
  }

  // Normalize tags
  if (!Array.isArray(tags)) {
    if (typeof tags === 'string') tags = tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    else tags = []
  }

  // Generate slug if not provided
  const baseSlug = slug ? slugify(String(slug)) : slugify(String(title))

  const supabase = createServerClient()

  // Check for existing slug; if exists, append a short suffix to avoid collision
  let finalSlug = baseSlug
  let attempt = 0
  while (true) {
    const { data: existing } = await supabase.from('blog_posts').select('id').eq('slug', finalSlug).limit(1).maybeSingle()
    if (!existing) break
    attempt += 1
    finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}-${attempt}`
    if (attempt > 5) break
  }

  const insertPayload = {
    title: String(title),
    slug: finalSlug,
    excerpt,
    content: String(content),
    category,
    tags,
    author_id,
    status,
    readTime,
    published_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from('blog_posts').insert([insertPayload]).select().single()
  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  // Revalidate listing and the specific blog page so it appears immediately
  try {
    revalidatePath('/blog')
    revalidatePath(`/blog/${finalSlug}`)
  } catch (e) {
    // best-effort
    console.warn('revalidate failed', e)
  }

  return NextResponse.json({ ok: true, post: data })
}
