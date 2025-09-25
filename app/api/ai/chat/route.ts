import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function POST(request: NextRequest) {
  try {
    // Use request-scoped client to validate authentication (respects cookies)
    const reqClient = await createClient()
    const {
      data: { user },
      error: authError,
    } = await reqClient.auth.getUser()
    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use service role client for DB reads to bypass RLS when checking profile and test attempts
    const serviceClient = createServerClient()

    // Check subscription status using the same logic as subscription-status API
    // Allow Student Elite, Student Premium, and free users (frontend handles credit limits)
    let userPlan = "free"
    let isAllowed = false

    // Special handling for test users (same as subscription-status API)
    if (user.email === 'student.elite@testcraft.in') {
      userPlan = "Student Elite"
      isAllowed = true
    } else {
      const testPremiumEmail = process.env.TEST_STUDENT_PREMIUM_EMAIL
      if (testPremiumEmail && user.email === testPremiumEmail) {
        userPlan = "Student Premium"
        isAllowed = true
      }
    }

    // If not a test user, check profile
    if (!isAllowed) {
      const { data: profile, error: profileError } = await serviceClient
        .from("profiles")
        .select("subscription_plan")
        .eq("id", user.id)
        .maybeSingle()

      if (profileError) {
        console.error("Profile error:", profileError)
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
      }

      if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 })
      }

      const allowedPlans = ["Student Elite", "Student Premium", "free"]
      if (!allowedPlans.includes(profile.subscription_plan)) {
        return NextResponse.json({
          error: "Invalid subscription plan"
        }, { status: 403 })
      }
      userPlan = profile.subscription_plan
      isAllowed = true
    }

    const { message, conversationHistory = [] } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get user context for personalized responses
    const { data: userData, error: userDataError } = await serviceClient
      .from("profiles")
      .select("full_name, class, exam_board")
      .eq("id", user.id)
      .maybeSingle()

    if (userDataError) {
      console.error("User data error:", userDataError)
    }

    // Get recent test performance for context
    const { data: recentTests, error: testsError } = await serviceClient
      .from("test_attempts")
      .select(`
        percentage,
        completed_at,
        mock_tests!inner(subject)
      `)
      .eq("user_id", user.id)
      .eq("is_completed", true)
      .order("completed_at", { ascending: false })
      .limit(5)

    if (testsError) {
      console.error("Tests error:", testsError)
    }

    const contextPrompt = `
You are Textcraft's AI personal support agent. You help students with their exam preparation and study-related queries.

User Information:
- Name: ${userData?.full_name || 'Student'}
- Class: ${userData?.class || 'Not specified'}
- Exam Board: ${userData?.exam_board || 'Not specified'}

Recent Performance (last 5 tests):
${recentTests?.map((test: any) => `- ${test.mock_tests?.subject}: ${test.percentage}% (${new Date(test.completed_at).toLocaleDateString()})`).join('\n') || 'No recent tests'}

Guidelines:
- Be encouraging and supportive
- Provide study tips and exam strategies
- Help with subject-specific questions
- Suggest relevant practice materials
- Keep responses focused on education and exam preparation
- If asked about non-educational topics, gently redirect to study-related help
- Use the user's performance data to give personalized advice
- Be concise but helpful

Conversation History:
${conversationHistory.slice(-10).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

Current Question: ${message}
`

    // AI SDK Groq provider not configured; using Google Gemini API directly with streaming
    const apiKey = process.env.VERTEX_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      const response = `Thank you for your question: "${message}". This is a mock response. To enable real AI responses with Gemini, please set GOOGLE_GENERATIVE_AI_API_KEY in .env.local.`
      // Store analytics
      try {
        await serviceClient.from("analytics").insert({
          user_id: user.id,
          event_type: "ai_chat_interaction",
          event_data: {
            message_length: message.length,
            response_length: response.length,
            has_performance_context: !!recentTests?.length
          }
        })
      } catch (analyticsError) {
        console.error("Analytics error:", analyticsError)
      }
      return NextResponse.json({
        response,
        timestamp: new Date().toISOString()
      })
    }

    // For streaming, use streamGenerateContent endpoint with SSE
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: contextPrompt
          }]
        }]
      })
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error("Gemini API error:", geminiResponse.status, errorText)
      // Fall back to mock response
      const mockResponse = `I apologize, but I'm currently experiencing technical difficulties with my AI processing. As a fallback, here's some general advice for your question: "${message}". 

For personalized help with exam preparation, study strategies, or subject-specific questions, please try again later or contact our support team.

Thank you for your understanding!`
      // Store analytics
      try {
        await serviceClient.from("analytics").insert({
          user_id: user.id,
          event_type: "ai_chat_interaction",
          event_data: {
            message_length: message.length,
            response_length: mockResponse.length,
            has_performance_context: !!recentTests?.length,
            fallback_used: true,
            api_error: `${geminiResponse.status}: ${errorText}`
          }
        })
      } catch (analyticsError) {
        console.error("Analytics error:", analyticsError)
      }
      return NextResponse.json({
        response: mockResponse,
        timestamp: new Date().toISOString()
      })
    }

    // Create a stream to forward the response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = geminiResponse.body?.getReader()
        if (!reader) {
          controller.error(new Error("No response body"))
          return
        }

        let accumulatedText = ''
        const decoder = new TextDecoder()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6))
                  if (data.candidates && data.candidates[0]?.content?.parts) {
                    const text = data.candidates[0].content.parts.map((part: any) => part.text).join('')
                    accumulatedText += text
                    // Send the incremental text
                    controller.enqueue(`data: ${JSON.stringify({ text: accumulatedText })}\n\n`)
                  }
                } catch (e) {
                  // Ignore invalid JSON
                }
              }
            }
          }

          // Store analytics after streaming
          try {
            await serviceClient.from("analytics").insert({
              user_id: user.id,
              event_type: "ai_chat_interaction",
              event_data: {
                message_length: message.length,
                response_length: accumulatedText.length,
                has_performance_context: !!recentTests?.length
              }
            })
          } catch (analyticsError) {
            console.error("Analytics error:", analyticsError)
          }

          controller.close()
        } catch (error) {
          console.error("Streaming error:", error)
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error("AI Chat error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Failed to process chat message: ${errorMessage}` }, { status: 500 })
  }
}
