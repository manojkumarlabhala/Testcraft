import { groq } from '@ai-sdk/groq'

export interface GenerateQuestionsParams {
  subject: string
  topic: string
  difficulty: string
  count: number
  questionType: string
}

export async function generateQuestions(params: GenerateQuestionsParams): Promise<any> {
  const { subject, topic, difficulty, count, questionType } = params;
  const promptText = `Generate ${count} ${difficulty} level ${questionType} questions for ${subject} - ${topic}.
Format each question as JSON with:
- question: The question text
- options: Array of 4 options (for MCQ)
- correctAnswer: Index of correct option (0-3)
- explanation: Detailed explanation of the answer
- difficulty: "${difficulty}"
- marks: Number of marks (1-5 based on difficulty)
Ensure questions are relevant to Indian educational standards.`;

  try {
    const response = await groq.languageModel('mixtral-8x7b-32768').doGenerate({
      prompt: [{ role: 'user', content: [{ type: 'text', text: promptText }] }],
      temperature: 0.7,
    });
    const content = response.content[0];
    let text = '';
    if ('text' in content) {
      text = content.text;
    } else if ('parts' in content && Array.isArray(content.parts) && content.parts[0]?.text) {
      text = content.parts[0].text;
    } else {
      throw new Error('Unexpected Groq response format');
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('Groq Question Generation Error:', error);
    throw new Error('Failed to generate questions');
  }
}
