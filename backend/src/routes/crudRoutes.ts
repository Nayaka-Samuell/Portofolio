import { Router } from 'express';
import multer from 'multer';
import { createEntity, updateEntity, deleteEntity, getEntityById } from '../controllers/crudController';
import { adminAuth } from '../middlewares/adminAuth';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

router.get('/:entity/:id', getEntityById);
router.post('/:entity', adminAuth, upload.any(), createEntity);
router.put('/:entity/:id', adminAuth, upload.any(), updateEntity);
router.delete('/:entity/:id', adminAuth, deleteEntity);

export default router;
