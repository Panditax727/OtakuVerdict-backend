import { Router } from 'express';
import { getComments, createComment, deleteComment } from '../controllers/comment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getComments);
router.post('/', authMiddleware, createComment);
router.delete('/:id', authMiddleware, deleteComment);

export default router;