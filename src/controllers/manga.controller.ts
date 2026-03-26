import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getMangas = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const mangas = await prisma.manga.findMany({
      where: search ? { title: { contains: String(search), mode: 'insensitive' } } : {},
      orderBy: { createdAt: 'desc' }
    });
    return res.json(mangas);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getMangaById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const manga = await prisma.manga.findUnique({
      where: { id },
      include: {
        characters: true,
        ratings: { include: { user: { select: { username: true, avatar: true } } } },
        wikiSections: { orderBy: { order: 'asc' } }
      }
    });
    if (!manga) return res.status(404).json({ message: 'Manga no encontrado' });
    return res.json(manga);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const createManga = async (req: Request, res: Response) => {
  try {
    const {
      title, titleJp, synopsis, coverImage, chapters, volumes,
      status, year, author, publisher, genre, readingUrls,
      trivia, behindTheScenes
    } = req.body;

    const manga = await prisma.manga.create({
      data: {
        title, titleJp, synopsis, coverImage, author, publisher,
        chapters: chapters ? parseInt(chapters) : undefined,
        volumes: volumes ? parseInt(volumes) : undefined,
        year: year ? parseInt(year) : undefined,
        status,
        genre: genre || [],
        readingUrls: readingUrls || [],
        trivia: trivia || [],
        behindTheScenes: behindTheScenes || []
      }
    });
    return res.status(201).json(manga);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const updateManga = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const manga = await prisma.manga.update({
      where: { id },
      data: req.body
    });
    return res.json(manga);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const deleteManga = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.manga.delete({ where: { id } });
    return res.json({ message: 'Manga eliminado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};