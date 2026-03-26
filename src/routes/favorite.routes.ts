import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favorite.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getFavorites);
router.post('/', authMiddleware, addFavorite);
router.delete('/:id', authMiddleware, removeFavorite);

export default router;