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

export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.query;
    const comments = await prisma.comment.findMany({
      where: postId ? { postId: String(postId) } : {},
      include: { user: { select: { username: true, avatar: true, level: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(comments);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { content, postId } = req.body;
    const userId = (req as any).userId;
    const comment = await prisma.comment.create({
      data: { content, postId, userId },
      include: { user: { select: { username: true, avatar: true, level: true } } }
    });
    await addPoints(userId, 2)
    await checkAndUnlockAchievements(userId)
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.comment.delete({ where: { id } });
    return res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};