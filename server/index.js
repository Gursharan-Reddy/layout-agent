import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { callLLM } from './services/llmService.js';
import { buildSystemPrompt } from './prompts/systemPrompt.js';
import { validateLayout } from './utils/jsonValidator.js';

// Load the environment configuration instantly before calling services
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Handle cross-origin requests from Vite (port 5173) and parse JSON objects
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message, layout, history } = req.body;

    if (!message || !layout) {
      return res.status(400).json({ success: false, error: 'Missing mandatory payload: message or layout state' });
    }

    // Guardrail validation check on layout state structure
    validateLayout(layout);

    // Build the dynamic prompt matrix with the layout injected
    const systemPrompt = buildSystemPrompt(layout);

    // Forward the context payload downstream to the Groq Engine
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
});

app.listen(PORT, () => {
  console.log(`Server executing safely on interface port ${PORT}.`);
});