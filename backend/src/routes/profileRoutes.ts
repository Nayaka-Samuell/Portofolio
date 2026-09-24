import { Router } from 'express';
import multer from 'multer';
import { getProfile, upsertProfile, uploadCV } from '../controllers/profileController';
import { adminAuth } from '../middlewares/adminAuth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:username', getProfile);
router.post('/', adminAuth, upsertProfile);
router.post('/cv', adminAuth, upload.single('cv'), uploadCV);

export default router;
