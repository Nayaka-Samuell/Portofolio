import { Router } from 'express';
import { submitContact } from '../controllers/contactController';
import { contactRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/', contactRateLimiter, submitContact);

export default router;
