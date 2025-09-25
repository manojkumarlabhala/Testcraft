import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, category, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !category || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Prepare email content
    const emailContent = `
New Contact Form Submission
==========================

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Category: ${category}
Subject: ${subject}

Message:
${message}

---
Sent from Testcraft Contact Form
Timestamp: ${new Date().toISOString()}
    `.trim()

    // For now, we'll log the email content since we don't have email service configured
    // In production, you would integrate with an email service like SendGrid, Mailgun, etc.
    console.log('Contact form submission:', {
      to: 'support@testcraft.in',
      subject: `Testcraft Contact: ${subject}`,
      content: emailContent,
      from: email,
      category,
      timestamp: new Date().toISOString()
    })

    // TODO: Integrate with email service to send to support@testcraft.in
    // Example with a hypothetical email service:
    /*
    const emailResponse = await fetch('https://api.emailservice.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`
      },
      body: JSON.stringify({
        to: 'support@testcraft.in',
        subject: `Testcraft Contact: ${subject}`,
        text: emailContent,
        replyTo: email
      })
    })

    if (!emailResponse.ok) {
      throw new Error('Failed to send email')
    }
    */

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}