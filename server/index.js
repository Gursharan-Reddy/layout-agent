import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { callLLM } from './services/llmService.js';
import { buildSystemPrompt } from './prompts/systemPrompt.js';
import { validateLayout } from './utils/jsonValidator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configures global permissive cross-origin access for smooth production syncs
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes directly to /chat to match the updated client endpoint definition
app.post('/chat', async (req, res) => {
  try {
    const { message, layout, history } = req.body;

    if (!message || !layout) {
      return res.status(400).json({ success: false, error: 'Missing mandatory payload: message or layout state' });
    }

    validateLayout(layout);
    const systemPrompt = buildSystemPrompt(layout);
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