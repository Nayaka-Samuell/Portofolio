import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Counts only failed authentication attempts, then blocks the source IP.
export const adminAuthRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many failed authentication attempts. Try again later.' }
});

export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  let username = '';
  let password = '';
  
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Basic ')) {
    const b64auth = authHeader.split(' ')[1] || '';
    const decoded = Buffer.from(b64auth, 'base64').toString();
    const splitIndex = decoded.indexOf(':');
    if (splitIndex !== -1) {
      username = decoded.substring(0, splitIndex);
      password = decoded.substring(splitIndex + 1);
    }
  } else {
    username = (req.headers['x-admin-username'] as string) || (req.body?.adminUsername as string) || '';
    password = (req.headers['x-admin-password'] as string) || (req.body?.adminPassword as string) || '';
  }

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validUsername || !validPassword) {
    res.status(500).json({ success: false, error: 'Server configuration error: Admin credentials not set' });
    return;
  }

  if (username === validUsername && password === validPassword) {
    next();
  } else {
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid Username or Password' });
  }
};
