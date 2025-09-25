/**
 * Example AI worker that generates a simple blog post and publishes it
 * - Requires OPENAI_API_KEY or VERTEX_API_KEY for generation
 * - Requires API_PUBLISH_KEY (set in env / Coolify secret) to call the server
 * Usage: node scripts/ai-publish-example.js
 */
const fetch = require('node-fetch')

async function generateWithOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'gpt-4', messages: [{ role: 'user', content: prompt }], max_tokens: 800 }),
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content || null
}

async function publishPost(post) {
  const publishKey = process.env.API_PUBLISH_KEY
  if (!publishKey) throw new Error('API_PUBLISH_KEY not set')
  const res = await fetch(`${process.env.APP_URL || 'http://localhost:3000'}/api/blog/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': publishKey },
    body: JSON.stringify(post),
  })
  return res.json()
}

async function main() {
  const prompt = process.env.AI_PROMPT || 'Write a short 400-word blog post about effective study routines for board exams with a title and short excerpt.'
  const content = await generateWithOpenAI(prompt)
  if (!content) throw new Error('AI returned empty content')

  // Simple split: first line title, second line excerpt, rest content
  const lines = content.split('\n').filter(Boolean)
  const title = lines[0] || 'AI Generated Post'
  const excerpt = lines[1] || ''
  const body = lines.slice(2).join('\n') || content
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const post = { title, slug, excerpt, content: body, category: 'Study Tips', tags: ['ai', 'auto'], status: 'published' }

  const result = await publishPost(post)
  console.log('Publish result:', result)
}

main().catch(err => { console.error(err); process.exit(1) })
