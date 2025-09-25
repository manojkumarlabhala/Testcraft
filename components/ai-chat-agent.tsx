"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, Bot, User, X, Minimize2, Maximize2, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIChatAgent({ userEmail: propUserEmail, isStudentElite }: { userEmail?: string; isStudentElite?: boolean }) {
    const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriptionChecked, setSubscriptionChecked] = useState(false)
  const [remainingCredits, setRemainingCredits] = useState(5) // Student Premium and Free users get 5 credits
  const [userPlan, setUserPlan] = useState<string>('free') // Track the user's subscription plan
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(propUserEmail || null)
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [justDragged, setJustDragged] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [dragStartTime, setDragStartTime] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast()

  // Set initial position to bottom right corner (more intuitive location)
  useEffect(() => {
    const setInitialPosition = () => {
      const widgetSize = 64 // w-16 = 64px
      const margin = 20
      const rightX = window.innerWidth - widgetSize - margin
      const bottomY = window.innerHeight - widgetSize - margin

      setPosition({
        x: Math.max(0, rightX),
        y: Math.max(0, bottomY)
      })
    }

    setInitialPosition()
    window.addEventListener('resize', setInitialPosition)

    return () => window.removeEventListener('resize', setInitialPosition)
  }, [])

  useEffect(() => {
    if (!propUserEmail) {
      getUserEmail()
    } else {
      // If userEmail is provided as prop, set it and check subscription immediately
      setUserEmail(propUserEmail)
      checkSubscription()
    }
  }, [propUserEmail])

  useEffect(() => {
    // Only call checkSubscription when userEmail changes and it's not from props
    if (userEmail && !propUserEmail) {
      checkSubscription()
    }
  }, [userEmail])

  useEffect(() => {
    if (!scrollAreaRef.current) return
    // Use requestAnimationFrame to ensure DOM updates are flushed
    const raf = requestAnimationFrame(() => {
      try {
        scrollAreaRef.current!.scrollTop = scrollAreaRef.current!.scrollHeight
      } catch (e) {
        // ignore
      }
    })

    return () => cancelAnimationFrame(raf)
  }, [messages, isLoading])

  // Autofocus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  // Update welcome message based on subscription and credits
  useEffect(() => {
    if (subscriptionChecked) {
      let welcomeMessage = ""

      if (!userEmail) {
        welcomeMessage = "👋 Welcome to AI Study Buddy!\n\nPlease log in to start chatting with our AI tutor. Get personalized help with your studies, exam preparation, and more!\n\n🔐 Log in to unlock AI-powered learning assistance."
      } else if (userPlan === "Student Elite") {
        welcomeMessage = "🎓 Hey there! I'm your AI Study Buddy, ready to help you ace your exams! 📚\n\nI can help with:\n• Explaining difficult concepts\n• Creating study plans\n• Answering questions\n• Practice problems\n• Exam strategies\n\nWhat would you like to study today? 🚀"
      } else if (userPlan === "Student Premium") {
        welcomeMessage = `🎓 Hey there! I'm your AI Study Buddy! 📚\n\nYou have ${remainingCredits} credits remaining for this session.\n\nI can help with:\n• Explaining difficult concepts\n• Creating study plans\n• Answering questions\n• Practice problems\n• Exam strategies\n\nWhat would you like to study today? 🚀`
      } else {
        welcomeMessage = `🎓 Hey there! I'm your AI Study Buddy! 📚\n\nYou have ${remainingCredits} free credits remaining.\n\nI can help with:\n• Explaining difficult concepts\n• Creating study plans\n• Answering questions\n• Practice problems\n• Exam strategies\n\nWhat would you like to study today? 🚀`
      }

      setMessages([{
        id: '1',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date()
      }])
    }
  }, [subscriptionChecked, userPlan, remainingCredits, userEmail])

  const checkSubscription = async () => {
    if (!userEmail) {
      console.log("AI Chat: No user email available")
      setIsSubscribed(false)
      setUserPlan('free')
      setSubscriptionChecked(true)
      return
    }

    // For test user, always allow access
    if (userEmail === 'student.elite@testcraft.in') {
      console.log("AI Chat: Test user detected, granting access")
      setIsSubscribed(true)
      setUserPlan('Student Elite')
      setSubscriptionChecked(true)
      return
    }

    try {
      console.log("AI Chat: Checking subscription status for:", userEmail)
      const response = await fetch("/api/payments/subscription-status", {
        credentials: 'include'
      })
      console.log("AI Chat: Subscription API response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("AI Chat: Subscription data:", data)

        // Set user plan
        setUserPlan(data.plan || 'free')

        // Student Elite gets unlimited access, Student Premium gets credits, free users get limited credits
        const hasUnlimitedAccess = data.plan === "Student Elite" && data.isActive
        const hasCredits = data.plan === "Student Premium" || data.plan === "free"

        console.log("AI Chat: Has unlimited access:", hasUnlimitedAccess, "Has credits:", hasCredits, "Plan:", data.plan, "Active:", data.isActive)

        setIsSubscribed(hasUnlimitedAccess)

        // Set credits based on plan
        if (data.plan === "Student Elite") {
          setRemainingCredits(-1) // Unlimited
        } else if (data.plan === "Student Premium") {
          setRemainingCredits(10) // Premium users get 10 credits
        } else {
          setRemainingCredits(5) // Free users get 5 credits
        }
      } else {
        console.log("AI Chat: Subscription API error:", response.status)
        setIsSubscribed(false)
        setUserPlan('free')
      }
    } catch (error) {
      console.error("AI Chat: Failed to check subscription:", error)
      setIsSubscribed(false)
      setUserPlan('free')
    } finally {
      setSubscriptionChecked(true)
    }
  }

  const getUserEmail = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setUserEmail(data.email)
        // Don't auto-activate here - let checkSubscription handle it
      }
    } catch (error) {
      console.error("Failed to get user email:", error)
    }
  }

  const activateChatForTestUser = () => {
    if (userEmail === 'student.elite@testcraft.in') {
      console.log("AI Chat: Manually activating chat for test user")
      setIsSubscribed(true)
      toast({
        title: "Chat Activated",
        description: "AI chat has been activated for testing purposes.",
      })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if clicking on the main bubble area, not on interactive elements
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[role="button"]') || target.closest('input') || target.closest('textarea')) {
      return
    }

    setDragStartTime(Date.now())
    setIsDragging(true)
    const rect = bubbleRef.current!.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y

    // Keep bubble within viewport bounds
    const maxX = window.innerWidth - 60
    const maxY = window.innerHeight - 60

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }

  const handleMouseUp = () => {
    const dragDuration = Date.now() - dragStartTime
    const wasDragged = dragDuration > 150 // Consider it a drag if held for more than 150ms

    setIsDragging(false)

    if (wasDragged) {
      setJustDragged(true)
      // Reset justDragged after a short delay to allow normal clicks
      setTimeout(() => setJustDragged(false), 200)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded && bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }
  }, [isDragging, dragOffset])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    // Check if user is authenticated
    if (!userEmail) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use the AI chat feature",
        variant: "destructive",
      })
      return
    }

    // Check if user has access (Student Elite unlimited, Student Premium has credits, free users have limited credits)
    const hasAccess = userPlan === "Student Elite" || (userPlan === "Student Premium" && remainingCredits > 0) || (userPlan === "free" && remainingCredits > 0)

    if (!hasAccess) {
      // Only show upgrade prompt for free users, not for premium users
      if (userPlan === "free") {
        setShowUpgradePrompt(true)
      }
      toast({
        title: "Credits Exhausted",
        description: userPlan === "Student Premium" ? "You've used all your premium credits. Contact support for more credits." : "You've used all your free credits. Upgrade to Student Premium for unlimited access!",
        variant: "destructive",
      })
      return
    }

    // Deduct credit for non-Student Elite users (only if they have limited credits)
    if (userPlan !== "Student Elite" && remainingCredits > 0) {
      setRemainingCredits(prev => prev - 1)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Quick offline check to provide a clearer error than a generic 'Failed to fetch'
      if (typeof window !== 'undefined' && 'navigator' in window && !window.navigator.onLine) {
        throw new Error('You appear to be offline. Check your network connection and try again.')
      }
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])

      // Use AbortController to timeout the request if it takes too long
      const controller = new AbortController()
      const timeoutMs = 20000 // 20s
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  let response: Response
  // Diagnostic log to help trace network failures in the browser console
  console.log('AI Chat: sending message to /api/ai/chat', { message: userMessage.content })
      try {
        response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage.content,
            conversationHistory
          }),
          credentials: 'include',
          signal: controller.signal
        })
      } finally {
        clearTimeout(timeoutId)
      }

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error("Please log in to use the AI chat feature")
        } else if (response.status === 403) {
          throw new Error("Access denied. Please check your subscription status")
        } else {
          const error = await response.json().catch(() => ({ error: "Unknown error" }))
          throw new Error(error.error || `Request failed with status ${response.status}`)
        }
      }

      const contentType = response.headers.get('content-type')
      if (contentType?.includes('text/event-stream')) {
        // Handle streaming response
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let accumulatedText = ''

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6))
                  if (data.text) {
                    accumulatedText = data.text
                    setMessages(prev => prev.map(msg =>
                      msg.id === assistantMessageId ? { ...msg, content: accumulatedText } : msg
                    ))
                  }
                } catch (e) {
                  // Ignore
                }
              }
            }
          }
        }

        // Final update
        setMessages(prev => prev.map(msg =>
          msg.id === assistantMessageId ? { ...msg, content: accumulatedText } : msg
        ))
      } else {
        // Handle JSON response (mock or error)
        const data = await response.json()
        setMessages(prev => prev.map(msg =>
          msg.id === assistantMessageId ? { ...msg, content: data.response } : msg
        ))
      }

    } catch (error: any) {
      console.error("Chat error:", error)

      // Map common network errors to friendlier messages
      let messageText = 'Failed to send message. Please try again.'
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          messageText = 'The request timed out. Please try again.'
        } else if (error.message && error.message.includes('offline')) {
          messageText = error.message
        } else if (error.message) {
          messageText = error.message
        }
      }

      toast({
        title: "Error",
        description: messageText,
        variant: "destructive",
      })

      // Remove both the user message and the empty assistant message if it failed
      setMessages(prev => prev.slice(0, -2))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!subscriptionChecked) {
    console.log("AI Chat: Still checking subscription...")
    return null // Don't show anything while checking subscription
  }

  // Show chat widget for all users (Student Elite, Student Premium, Free)
  console.log("AI Chat: Rendering chat widget for user:", userEmail, "Plan:", userPlan, "Credits:", remainingCredits, "Loading:", isLoading, "Expanded:", isExpanded)

  return (
    <>
      {/* Upgrade Prompt */}
      {showUpgradePrompt && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Upgrade to Premium
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Get unlimited AI conversations and advanced study features
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowUpgradePrompt(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button
                  onClick={() => {
                    setShowUpgradePrompt(false)
                    window.open('/subscription', '_blank')
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Bubble (draggable) */}
      {!isExpanded && (
        <div
          ref={bubbleRef}
          className={`fixed z-50 transition-all duration-300 ease-out ${isDragging ? 'scale-110' : 'hover:scale-105'}`}
          style={{
            left: position.x,
            top: position.y,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
        >
          <div
            className="relative group cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!justDragged) {
                setIsExpanded(true)
              }
            }}
            aria-label="Open AI Study Buddy chat"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setIsExpanded(true) } }}
          >
            {/* Main Bubble */}
            <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center transition-transform duration-200 cursor-pointer relative overflow-hidden border border-gray-200"
              aria-hidden
            >
              <MessageCircle className="h-8 w-8 text-indigo-600 relative z-10" />
            </div>

            {/* Small Badge */}
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce border-2 border-white">
              <span className="text-xs font-bold text-white">!</span>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Chat Window (fixed, not draggable) */}
      {isExpanded && (
        <div className="fixed z-50 right-4 bottom-4 w-[96%] max-w-2xl sm:max-w-lg lg:max-w-2xl h-[80vh] sm:h-[76vh] md:h-[80vh] flex flex-col">
          <div className="w-full bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            {/* Chat Header (Material: neutral) */}
            <div className="bg-slate-50 text-slate-900 p-3 sm:p-4 flex items-center justify-between relative overflow-hidden flex-shrink-0 border-b border-gray-100">
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900">
                    AI Study Buddy
                  </h3>
                  <p className="text-xs text-slate-600">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-1 relative z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-200 rounded-full transition-all duration-200"
                  aria-label="Close chat"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages (scrollable) */}
            <div className="flex-1 p-3 overflow-auto" ref={scrollAreaRef} style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}

                    <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm shadow-sm transition-all duration-200 hover:shadow-md ${message.role === 'user' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'}`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>

                    {message.role === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                          <User className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2 justify-start animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-xl px-3 py-2 shadow-sm border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-1">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={userEmail ? "Ask me anything about your studies..." : "Please log in to use AI chat"}
                  disabled={isLoading || !userEmail}
                  className="flex-1 text-sm border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 rounded-full px-4 py-2 bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 focus:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading || !userEmail}
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg px-3 transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-center mt-2 gap-1">
                <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userEmail ? "Press Enter to send • AI responses are personalized ✨" : "Log in to start chatting with AI"}
                </p>
                <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
