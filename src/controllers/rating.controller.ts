import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { checkAndUnlockAchievements } from '../services/achievement.service'

const addPoints = async (userId: string, points: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return

  const newPoints = user.points + points
  let newLevel = user.level

  if (newPoints >= 5000) newLevel = 'Otaku Master'
  else if (newPoints >= 1000) newLevel = 'Sensei'
  else if (newPoints >= 500) newLevel = 'Senpai'
  else if (newPoints >= 100) newLevel = 'Otaku'
  else newLevel = 'Novato'

  await prisma.user.update({
    where: { id: userId },
    data: { points: newPoints, level: newLevel }
  })
}

export const getRatings = async (req: Request, res: Response) => {
  try {
    const { animeId, mangaId, comparativaId } = req.query;
    const ratings = await prisma.rating.findMany({
      where: {
        ...(animeId && { animeId: String(animeId) }),
        ...(mangaId && { mangaId: String(mangaId) }),
        ...(comparativaId && { comparativaId: String(comparativaId) })
      },
      include: { user: { select: { username: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(ratings);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const createRating = async (req: Request, res: Response) => {
  try {
    const { score, comment, animeId, mangaId, comparativaId } = req.body;
    const userId = (req as any).userId;

    // Verificar si ya existe un rating
    const existing = await prisma.rating.findFirst({
      where: {
        userId,
        ...(animeId && { animeId }),
        ...(mangaId && { mangaId }),
        ...(comparativaId && { comparativaId })
      }
    })

    if (existing) {
      return res.status(400).json({ message: 'Ya calificaste esto anteriormente' })
    }

    const rating = await prisma.rating.create({
      data: { score, comment, userId, animeId, mangaId, comparativaId }
    });
    await addPoints(userId, 5)
    await checkAndUnlockAchievements(userId)
    return res.status(201).json(rating);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const deleteRating = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.rating.delete({ where: { id } });
    return res.json({ message: 'Rating eliminado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};