import { Request, Response } from 'express';

export const login = (req: Request, res: Response): void => {
  const { username, password } = req.body;
  
  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validUsername || !validPassword) {
    res.status(500).json({ success: false, error: 'Server configuration error' });
    return;
  }

  if (username === validUsername && password === validPassword) {
    res.json({ 
      success: true, 
      message: 'Login successful',
      data: {
        token: Buffer.from(`${username}:${password}`).toString('base64') 
      }
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid Username or Password' });
  }
};
