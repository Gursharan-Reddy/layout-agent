import Groq from 'groq-sdk';

let groqClient;

function getGroqClient() {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Groq API Key configuration missing inside server/.env file');
    }
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

export async function callLLM(systemPrompt, history, userMessage) {
  const groq = getGroqClient();
  
  // Format history messages for the completion payload
  const messages = history.map(msg => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content
  }));
  
  messages.unshift({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: userMessage });

  // Swapping the decommissioned model for the active llama-3.3 production target
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: messages,
    temperature: 0.1,
    response_format: { type: 'json_object' }
  });

  const rawText = response.choices[0].message.content.trim();
  
  try {
    return JSON.parse(rawText);
  } catch (e) {
    // Regular expression fallback filtering for raw JSON blocks
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('LLM output layout graph parsing failed constraints.');
  }
}