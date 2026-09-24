import { Router } from 'express';
import { getDashboard, recordTap } from '../controllers/analyticsController';
import { adminAuth } from '../middlewares/adminAuth';
import { tapRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.get('/dashboard', adminAuth, getDashboard);
router.post('/tap', tapRateLimiter, recordTap);

export default router;
