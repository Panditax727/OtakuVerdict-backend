import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getAnimes = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const animes = await prisma.anime.findMany({
      where: search ? { title: { contains: String(search), mode: 'insensitive' } } : {},
      orderBy: { createdAt: 'desc' }
    });
    return res.json(animes);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getAnimeById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const anime = await prisma.anime.findUnique({
      where: { id },
      include: {
        characters: true,
        ratings: { include: { user: { select: { username: true, avatar: true } } } },
        wikiSections: { orderBy: { order: 'asc' } }
      }
    });
    if (!anime) return res.status(404).json({ message: 'Anime no encontrado' });
    return res.json(anime);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const createAnime = async (req: Request, res: Response) => {
  try {
    const {
      title, titleJp, synopsis, coverImage, episodes, status,
      year, studio, director, genre, trailerUrl, streamingUrls,
      trivia, behindTheScenes
    } = req.body;

    const anime = await prisma.anime.create({
      data: {
        title, titleJp, synopsis, coverImage, director, trailerUrl,
        episodes: episodes ? parseInt(episodes) : undefined,
        year: year ? parseInt(year) : undefined,
        status, studio,
        genre: genre || [],
        streamingUrls: streamingUrls || [],
        trivia: trivia || [],
        behindTheScenes: behindTheScenes || []
      }
    });
    return res.status(201).json(anime);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const updateAnime = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const anime = await prisma.anime.update({
      where: { id },
      data: req.body
    });
    return res.json(anime);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const deleteAnime = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.anime.delete({ where: { id } });
    return res.json({ message: 'Anime eliminado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};