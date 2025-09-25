"use client"

// Dev-only lightweight test page: render a predictable static DOM so
// Playwright can assert the chat widget without dealing with SSR/middleware.
export default function TestAIChatPage() {
  if (process.env.NODE_ENV === 'production') {
    return <div>Not available in production</div>
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-8">
      <div className="w-full max-w-3xl" data-testid="ai-chat-widget">
        <h2 className="text-2xl font-bold">AI Chat Agent (dev)</h2>
        <p className="text-muted-foreground">This is a dev-only test harness for the AI chat UI.</p>
        <div className="mt-4">
          <button className="btn" data-testid="ai-chat-start">Start chat</button>
        </div>
      </div>
    </div>
  )
}
