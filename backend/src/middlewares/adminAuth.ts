import { Request, Response, NextFunction } from 'express';

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

  const validUsername = process.env.ADMIN_USERNAME || 'Nayaka21060112';
  const validPassword = process.env.ADMIN_PASSWORD || 'Akuganteng_21';

  if (username === validUsername && password === validPassword) {
    next();
  } else {
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid Username or Password' });
  }
};
