import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const createWikiSection = async (req: Request, res: Response) => {
  try {
    const { title, content, order, animeId, mangaId } = req.body;
    const section = await prisma.wikiSection.create({
      data: { title, content, order: order || 0, animeId, mangaId }
    });
    return res.status(201).json(section);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const updateWikiSection = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const section = await prisma.wikiSection.update({
      where: { id },
      data: req.body
    });
    return res.json(section);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const deleteWikiSection = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.wikiSection.delete({ where: { id } });
    return res.json({ message: 'Sección eliminada' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};