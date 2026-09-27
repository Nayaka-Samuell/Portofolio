import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import routes from './routes';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Main API Routes
app.use('/api', routes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'File size must not exceed 5MB' : err.message;
    res.status(400).json({ success: false, error: message });
    return;
  }
  if (err instanceof Error && err.message === 'Only image files are allowed') {
    res.status(400).json({ success: false, error: err.message });
    return;
  }

  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
