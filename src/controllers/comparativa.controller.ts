import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

const addPoints = async (userId: string, points: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return
  const newPoints = user.points + points
  let newLevel = 'Novato'
  if (newPoints >= 5000) newLevel = 'Otaku Master'
  else if (newPoints >= 1000) newLevel = 'Sensei'
  else if (newPoints >= 500) newLevel = 'Senpai'
  else if (newPoints >= 100) newLevel = 'Otaku'
  await prisma.user.update({ where: { id: userId }, data: { points: newPoints, level: newLevel } })
}

export const getComparativas = async (req: Request, res: Response) => {
  try {
    const comparativas = await prisma.comparativa.findMany({
      include: {
        anime: true,
        manga: true,
        ratings: { include: { user: { select: { username: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(comparativas);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getComparativaById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const comparativa = await prisma.comparativa.findUnique({
      where: { id },
      include: {
        anime: { include: { characters: true } },
        manga: { include: { characters: true } },
        ratings: { include: { user: { select: { username: true, avatar: true, level: true } } } },
        posts: { include: { user: { select: { username: true, avatar: true, level: true } } } }
      }
    });
    if (!comparativa) return res.status(404).json({ message: 'Comparativa no encontrada' });
    return res.json(comparativa);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const createComparativa = async (req: Request, res: Response) => {
  try {
    const { animeId, mangaId, description, animeSceneUrl, mangaSceneUrl } = req.body;
    const userId = (req as any).userId;
    const comparativa = await prisma.comparativa.create({
      data: { animeId, mangaId, description, animeSceneUrl, mangaSceneUrl }
    });
    await addPoints(userId, 15)
    return res.status(201).json(comparativa);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const updateComparativa = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const comparativa = await prisma.comparativa.update({
      where: { id },
      data: req.body
    });
    return res.json(comparativa);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const deleteComparativa = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.comparativa.delete({ where: { id } });
    return res.json({ message: 'Comparativa eliminada' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};