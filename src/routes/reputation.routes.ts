import { Router } from 'express'
import { getUserReputation, voteReputation, getMyVotes } from '../controllers/reputation.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/:username', getUserReputation)
router.post('/', authMiddleware, voteReputation)
router.get('/:username/my-votes', authMiddleware, getMyVotes)

export default router