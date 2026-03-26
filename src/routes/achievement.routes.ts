import { Router } from 'express'
import { getUserAchievements } from '../controllers/achievement.controller'

const router = Router()

router.get('/:username', getUserAchievements)

export default router