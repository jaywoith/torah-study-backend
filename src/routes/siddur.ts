import { Router, Request, Response } from 'express';
import { getNextSiddurUnit, Interest } from '@torah/core';

const router = Router();

/**
 * GET /v1/siddur/next
 * Query: completed (comma-separated ids), interests (comma-separated)
 * Uses shared Siddur path helper.
 */
router.get('/next', (req: Request, res: Response) => {
  try {
    const completedParam = (req.query.completed as string) || '';
    const interestsParam = (req.query.interests as string) || 'siddur,kavannah';

    const completedIds = completedParam ? completedParam.split(',').map(s => s.trim()).filter(Boolean) : [];
    const interests = interestsParam.split(',').map(s => s.trim()).filter(Boolean) as Interest[];

    const unit = getNextSiddurUnit(completedIds, interests);

    if (!unit) {
      return res.status(404).json({ error: 'No next Siddur unit found for the given interests' });
    }

    return res.json({ unit });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch next Siddur unit' });
  }
});

export default router;
