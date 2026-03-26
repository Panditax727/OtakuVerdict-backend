import { register, login, getMe, updateProfile, getPublicProfile, getUserById } from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { Router } from 'express'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authMiddleware, getMe)
router.put('/profile', authMiddleware, updateProfile)
router.get('/profile/:username', getPublicProfile)

router.get('/user/:id', getUserById)

export default router