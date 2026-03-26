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

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { comparativaId } = req.query;
    const posts = await prisma.post.findMany({
      where: comparativaId ? { comparativaId: String(comparativaId) } : {},
      include: { user: { select: { username: true, avatar: true, level: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id)
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: { select: { username: true, avatar: true, level: true } },
        comments: {
          include: { user: { select: { username: true, avatar: true, level: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    if (!post) return res.status(404).json({ message: 'Post no encontrado' })
    return res.json(post)
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, title, type, comparativaId, animeId, mangaId } = req.body;
    const userId = (req as any).userId;
    const post = await prisma.post.create({
      data: { content, title, type: type || 'general', userId, comparativaId, animeId, mangaId }
    });
    await addPoints(userId, 10)
    await checkAndUnlockAchievements(userId)
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
  
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id)
    const { title, content, type } = req.body
    const userId = (req as any).userId

    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return res.status(404).json({ message: 'Post no encontrado' })

    if (post.userId !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para editar este post' })
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(type !== undefined && { type })
      }
    })

    return res.json(updated)
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}

export const deletePost = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.post.delete({ where: { id } });
    return res.json({ message: 'Post eliminado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};