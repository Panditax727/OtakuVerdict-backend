import { Router } from 'express'
import { createWikiSection, updateWikiSection, deleteWikiSection } from '../controllers/wiki.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { adminMiddleware } from '../middlewares/admin.middleware'

const router = Router()

router.post('/', authMiddleware, adminMiddleware, createWikiSection)
router.put('/:id', authMiddleware, adminMiddleware, updateWikiSection)
router.delete('/:id', authMiddleware, adminMiddleware, deleteWikiSection)

export default router