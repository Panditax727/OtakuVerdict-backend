import { Router } from 'express'
import { getMangas, getMangaById, createManga, updateManga, deleteManga } from '../controllers/manga.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { adminMiddleware } from '../middlewares/admin.middleware'

const router = Router()

router.get('/', getMangas)
router.get('/:id', getMangaById)
router.post('/', authMiddleware, adminMiddleware, createManga)
router.put('/:id', authMiddleware, adminMiddleware, updateManga)
router.delete('/:id', authMiddleware, adminMiddleware, deleteManga)

export default router