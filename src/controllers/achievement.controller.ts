import { Request, Response } from 'express'
import { prisma } from '../config/prisma'
import { ACHIEVEMENTS } from '../services/achievement.service'

export const getUserAchievements = async (req: Request, res: Response) => {
  try {
    const username = String(req.params.username)
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    const achievements = await prisma.achievement.findMany({
      where: { userId: user.id },
      orderBy: { unlockedAt: 'desc' }
    })

    const result = achievements.map(a => {
      const info = ACHIEVEMENTS.find(ac => ac.tag === a.tag)
      return {
        tag: a.tag,
        unlockedAt: a.unlockedAt,
        icon: info?.icon || 'bi-trophy',
        color: info?.color || '#f59e0b',
        description: info?.description || ''
      }
    })

    return res.json(result)
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}
