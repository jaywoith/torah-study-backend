import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

const UI_STRINGS_PATH = path.resolve(
  process.cwd(),
  'vendor/shared/ui-strings.json'
);

const FALLBACK_URL = 'https://raw.githubusercontent.com/jaywoith/torah-study-shared/main/ui-strings.json';

/**
 * GET /v1/ui-strings
 * Returns the shared ui-strings.json so clients stay consistent.
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    if (fs.existsSync(UI_STRINGS_PATH)) {
      const raw = fs.readFileSync(UI_STRINGS_PATH, 'utf-8');
      return res.json(JSON.parse(raw));
    }

    // Fallback: fetch from the shared repo (for environments without the submodule)
    const response = await fetch(FALLBACK_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch ui-strings: ${response.status}`);
    }
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load shared UI strings' });
  }
});

export default router;
