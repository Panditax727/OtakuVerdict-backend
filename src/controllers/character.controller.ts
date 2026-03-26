import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getCharacters = async (req: Request, res: Response) => {
  try {
    const { animeId, mangaId } = req.query;
    const characters = await prisma.character.findMany({
      where: {
        ...(animeId && { animeId: String(animeId) }),
        ...(mangaId && { mangaId: String(mangaId) })
      }
    });
    return res.json(characters);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const createCharacter = async (req: Request, res: Response) => {
  try {
    const character = await prisma.character.create({ data: req.body });
    return res.status(201).json(character);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const updateCharacter = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id)
    const { name, role, description, image } = req.body
    const character = await prisma.character.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role !== undefined && { role }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image })
      }
    })
    return res.json(character)
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}

export const deleteCharacter = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.character.delete({ where: { id } });
    return res.json({ message: 'Personaje eliminado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};