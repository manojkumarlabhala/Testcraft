// /pages/api/chat-agent.js


import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.VERTEX_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { question } = req.body;

  // Gemini API integration
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: question }] }]
      })
    });
    const data = await response.json();
    let answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no answer available.';
    return res.status(200).json({ answer });
  } catch (err) {
    let answer = `You asked: "${question}". This is a fallback response from your AI tutor.`;
    res.status(200).json({ answer });
  }
}
