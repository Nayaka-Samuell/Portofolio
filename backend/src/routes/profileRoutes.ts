import { Router } from 'express';
import multer from 'multer';
import { getProfile, upsertProfile, uploadCV, downloadVCard } from '../controllers/profileController';
import { adminAuth } from '../middlewares/adminAuth';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  }
});

router.get('/:username', getProfile);
router.get('/:username/vcard', downloadVCard);
router.post('/', adminAuth, upsertProfile);
router.post('/cv', adminAuth, upload.single('cv'), uploadCV);

export default router;
