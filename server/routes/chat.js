import { Router } from 'express';
import { buildSystemPrompt } from '../prompts/systemPrompt.js';
import { callLLM } from '../services/llmService.js';
import { validateLayout } from '../utils/jsonValidator.js';
import { resizeArtboard } from '../services/layoutTransforms.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { message, layout, history } = req.body;

    if (!message || !layout) {
      return res.status(400).json({ 
        success: false, 
        error: 'Parameters mismatch: A message string and a target layout schema graph are required variables.' 
      });
    }

    // Invariant Structural Sanity Validation Checked on Entry Point
    validateLayout(layout);

    let baselineLayoutState = layout;
    const transformedInstruction = message.toLowerCase();

    // Deterministic Intercept Rules for high-risk aspect mutations 
    // Prevents mathematical error drift or variance on foundational aspect-ratio requests
    if (transformedInstruction.includes('9:16') || transformedInstruction.includes('story') || transformedInstruction.includes('reel')) {
      baselineLayoutState = resizeArtboard(layout, 1080, 1920);
    } else if (transformedInstruction.includes('1:1') || transformedInstruction.includes('instagram post')) {
      baselineLayoutState = resizeArtboard(layout, 1080, 1080);
    } else if (transformedInstruction.includes('16:9')) {
      baselineLayoutState = resizeArtboard(layout, 1920, 1080);
    }

    // Compose orchestration context system configuration prompt matrix
    const engineeredPrompt = buildSystemPrompt(baselineLayoutState);

    // Call LLM pipeline for spatial reasoning, color mutation, and granular element styling changes
    const inferenceResult = await callLLM(engineeredPrompt, history || [], message);

    // Structural Sanity Validation Checked on Exit Point to guarantee state tree integrity
    validateLayout(inferenceResult.updatedLayout);

    return res.json({
      success: true,
      explanation: inferenceResult.explanation,
      updatedLayout: inferenceResult.updatedLayout
    });
  } catch (error) {
    next(error);
  }
});

export default router;