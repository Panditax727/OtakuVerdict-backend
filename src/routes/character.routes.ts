import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { adminMiddleware } from '../middlewares/admin.middleware'
import { getCharacters, createCharacter, updateCharacter, deleteCharacter } from '../controllers/character.controller'


const router = Router()

router.get('/', getCharacters)
router.post('/', authMiddleware, adminMiddleware, createCharacter)
router.put('/:id', authMiddleware, adminMiddleware, updateCharacter)
router.delete('/:id', authMiddleware, adminMiddleware, deleteCharacter)

export default router