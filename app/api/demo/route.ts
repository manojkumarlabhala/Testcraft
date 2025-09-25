import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, organization, role, preferredTime, message } = await request.json()

    // Validate required fields
    if (!name || !email || !organization || !role) {
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
New Demo Booking Request
========================

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Organization: ${organization}
Role: ${role}
Preferred Time: ${preferredTime || 'Not specified'}

Message:
${message || 'No additional message'}

---
Sent from Testcraft Demo Booking
Timestamp: ${new Date().toISOString()}
    `.trim()

    // For now, we'll log the email content since we don't have email service configured
    // In production, you would integrate with an email service like SendGrid, Mailgun, etc.
    console.log('Demo booking submission:', {
      to: 'support@testcraft.in',
      subject: `Testcraft Demo Request: ${name} from ${organization}`,
      content: emailContent,
      from: email,
      organization,
      role,
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
        subject: `Testcraft Demo Request: ${name} from ${organization}`,
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
      message: 'Demo booking request sent successfully'
    })

  } catch (error) {
    console.error('Demo booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}