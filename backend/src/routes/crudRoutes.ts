import { Router } from 'express';
import { createEntity, updateEntity, deleteEntity, getEntityById } from '../controllers/crudController';
import { adminAuth } from '../middlewares/adminAuth';

const router = Router();

router.get('/:entity/:id', getEntityById);
router.post('/:entity', adminAuth, createEntity);
router.put('/:entity/:id', adminAuth, updateEntity);
router.delete('/:entity/:id', adminAuth, deleteEntity);

export default router;
