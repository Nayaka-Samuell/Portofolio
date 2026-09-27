import rateLimit from 'express-rate-limit';
import { getClientIp } from '../utils/ip';

export const tapRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many taps. Please wait a minute.' },
  keyGenerator: (req) => getClientIp(req),
});

export const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 login attempts
  message: { success: false, error: 'Too many login attempts. Try again in 5 minutes.' },
  keyGenerator: (req) => getClientIp(req),
});

export const contactRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // 3 messages
  message: { success: false, error: 'Too many messages sent. Try again later.' },
  keyGenerator: (req) => getClientIp(req),
});
