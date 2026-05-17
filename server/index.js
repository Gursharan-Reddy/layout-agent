import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { callLLM } from './services/llmService.js';
import { buildSystemPrompt } from './prompts/systemPrompt.js';
import { validateLayout } from './utils/jsonValidator.js';

// Load environment variables immediately
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Global cross-origin configuration to allow communication with your Vercel frontend
app.use(cors({ origin: '*' }));
app.use(express.json());

// Core execution handler shared across endpoint routes
const handleChatRequest = async (req, res) => {
  try {
    const { message, layout, history } = req.body;

    if (!message || !layout) {
      return res.status(400).json({ success: false, error: 'Missing mandatory payload: message or layout state' });
    }

    // Validate the wireframe object schema structure
    validateLayout(layout);
    
    // Inject current canvas coordinates into the design rules
    const systemPrompt = buildSystemPrompt(layout);
    
    // Process layout adjustments using Groq Llama-3.3
    const aiResponse = await callLLM(systemPrompt, history || [], message);

    return res.json({
      success: true,
      explanation: aiResponse.explanation || 'Layout metrics transformed successfully.',
      updatedLayout: aiResponse.updatedLayout || layout
    });

  } catch (error) {
    console.error('Backend Execution Error:', error.message);
    return res.status(500).json({ 
      success: false, 
      error: `Internal Processing Failure: ${error.message}` 
    });
  }
};

// Bind the handler to BOTH possible endpoints to intercept any structural URL mismatch
app.post('/chat', handleChatRequest);
app.post('/api/chat', handleChatRequest);

app.listen(PORT, () => {
  console.log(`Server executing safely on interface port ${PORT}.`);
});