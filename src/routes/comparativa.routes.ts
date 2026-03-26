import { Router } from 'express';
import { getComparativas, getComparativaById, createComparativa, updateComparativa, deleteComparativa } from '../controllers/comparativa.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getComparativas);
router.get('/:id', getComparativaById);
router.post('/', authMiddleware, createComparativa);
router.put('/:id', authMiddleware, updateComparativa);
router.delete('/:id', authMiddleware, deleteComparativa);

export default router;