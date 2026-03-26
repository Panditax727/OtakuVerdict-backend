import { Router } from 'express'
import { getConversation, getConversations, sendMessage, getUnreadCount } from '../controllers/message.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/conversations', authMiddleware, getConversations)
router.get('/conversation/:toUserId', authMiddleware, getConversation)
router.post('/', authMiddleware, sendMessage)
router.get('/unread', authMiddleware, getUnreadCount)

export default router
