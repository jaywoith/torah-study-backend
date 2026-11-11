import { Router, Request, Response } from 'express';
import { generateDailyStudy, validateDailyStudy, UserProfile } from '@torah/core';

const router = Router();

/**
 * POST /v1/study/daily
 * Body: { profile: UserProfile, date?: string }
 * Returns generated DailyStudy after validation.
 */
router.post('/daily', (req: Request, res: Response) => {
  try {
    const { profile, date } = req.body as { profile?: UserProfile; date?: string };

    if (!profile) {
      return res.status(400).json({ error: 'Missing profile' });
    }

    // Basic validation against shared model shape
    const required = ['framework', 'level', 'interests', 'studyLength', 'languageMode'] as const;
    for (const field of required) {
      if (!(field in profile)) {
        return res.status(400).json({ error: `Missing profile.${field}` });
      }
    }

    if (!Array.isArray(profile.interests)) {
      return res.status(400).json({ error: 'profile.interests must be an array' });
    }

    const studyDate = date || new Date().toISOString().slice(0, 10);

    const study = generateDailyStudy(profile, studyDate);
    const validation = validateDailyStudy(study);

    if (!validation.valid) {
      return res.status(422).json({
        error: 'Generated study failed framework validation',
        issues: validation.issues,
        study,
      });
    }

    return res.json({ study, validation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to generate daily study' });
  }
});

export default router;
