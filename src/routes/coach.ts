import { Router, Request, Response } from 'express';
import { personas, getConstraintsForFramework } from '@torah/ai-rules';
import type { FrameworkId } from '@torah/ai-rules';

const router = Router();

/**
 * POST /v1/coach/message
 * Body: { framework?: FrameworkId, message: string, history?: any[] }
 * Stub that loads the persona + constraints from shared rules and returns a placeholder.
 * Real LLM integration will go here later while still obeying the shared constraints.
 */
router.post('/message', (req: Request, res: Response) => {
  try {
    const { framework = 'masorti_conservative', message } = req.body as {
      framework?: FrameworkId;
      message?: string;
    };

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid message' });
    }

    const persona = personas[framework];
    if (!persona) {
      return res.status(400).json({ error: `Unknown framework: ${framework}` });
    }

    const constraints = getConstraintsForFramework(framework);

    // Stub response – in production this would call an LLM with the system prompt
    const stubReply = `Thank you for your question. As your ${persona.name}, I would respond with sources and kavannah in mind. (This is a placeholder; real LLM integration will use the shared system prompt and constraints.)`;

    return res.json({
      reply: stubReply,
      persona: {
        name: persona.name,
        tone: persona.tone,
        systemPromptFragment: persona.systemPromptFragment,
      },
      constraints,
      note: 'Placeholder response. Future LLM calls will load the full system prompt from torah-ai-rules and enforce the constraints before returning.',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to process coach message' });
  }
});

export default router;
