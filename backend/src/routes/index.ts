import { Router } from 'express';
import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';
import analyticsRoutes from './analyticsRoutes';
import crudRoutes from './crudRoutes';
import contactRoutes from './contactRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/contact', contactRoutes);

// For the dynamic CRUD routes, the current path was '/api/:entity'
// So we mount it at the root of the router.
router.use('/', crudRoutes);

// For dashboard, the previous path was '/api/dashboard'.
// We moved it to '/api/analytics/dashboard' in analyticsRoutes, 
// so we also need to alias it or remap it if the frontend expects '/api/dashboard'.
// Let's create an alias for compatibility:
import { getDashboard } from '../controllers/analyticsController';
import { adminAuth } from '../middlewares/adminAuth';
router.get('/dashboard', adminAuth, getDashboard);

export default router;
