import { Router } from 'express'
import { getAnimes, getAnimeById, createAnime, updateAnime, deleteAnime } from '../controllers/anime.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { adminMiddleware } from '../middlewares/admin.middleware'

const router = Router()

router.get('/', getAnimes)
router.get('/:id', getAnimeById)
router.post('/', authMiddleware, adminMiddleware, createAnime)
router.put('/:id', authMiddleware, adminMiddleware, updateAnime)
router.delete('/:id', authMiddleware, adminMiddleware, deleteAnime)

export default router