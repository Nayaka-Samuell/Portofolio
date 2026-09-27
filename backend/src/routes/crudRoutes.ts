import { Router } from 'express';
import multer from 'multer';
import { createEntity, updateEntity, deleteEntity, getEntityById } from '../controllers/crudController';
import { adminAuth, adminAuthRateLimiter } from '../middlewares/adminAuth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 11 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(new Error('Only image files are allowed'));
      return;
    }
    callback(null, true);
  }
});

router.get('/:entity/:id', getEntityById);
router.post('/:entity', adminAuthRateLimiter, adminAuth, upload.any(), createEntity);
router.put('/:entity/:id', adminAuthRateLimiter, adminAuth, upload.any(), updateEntity);
router.delete('/:entity/:id', adminAuthRateLimiter, adminAuth, deleteEntity);

export default router;
