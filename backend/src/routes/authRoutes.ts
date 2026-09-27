import { Router } from 'express';
import { login } from '../controllers/authController';
import { authRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/login', authRateLimiter, login);

export default router;
