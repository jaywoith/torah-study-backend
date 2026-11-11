import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import studyRouter from './routes/study';
import siddurRouter from './routes/siddur';
import coachRouter from './routes/coach';
import uiRouter from './routes/ui';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'torah-study-backend', version: '0.1.0' });
});

app.use('/v1/study', studyRouter);
app.use('/v1/siddur', siddurRouter);
app.use('/v1/coach', coachRouter);
app.use('/v1/ui-strings', uiRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Torah Study Backend listening on port ${PORT}`);
});

export default app;
