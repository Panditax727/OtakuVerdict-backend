import { Router } from 'express';
import { createRating, getRatings, deleteRating } from '../controllers/rating.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getRatings);
router.post('/', authMiddleware, createRating);
router.delete('/:id', authMiddleware, deleteRating);

export default router;