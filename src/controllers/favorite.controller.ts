import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { anime: true, manga: true }
    });
    return res.json(favorites);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { animeId, mangaId } = req.body;
    const favorite = await prisma.favorite.create({
      data: { userId, animeId, mangaId }
    });
    return res.status(201).json(favorite);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.favorite.delete({ where: { id } });
    return res.json({ message: 'Favorito eliminado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};