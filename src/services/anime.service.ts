import { prisma } from '../config/prisma';

export const getAllAnimes = async (search?: string) => {
  return prisma.anime.findMany({
    where: search ? { title: { contains: search, mode: 'insensitive' } } : {},
    orderBy: { createdAt: 'desc' }
  });
};

export const getAnimeById = async (id: string) => {
  return prisma.anime.findUnique({
    where: { id },
    include: { characters: true, ratings: true }
  });
};

export const createAnime = async (data: any) => {
  return prisma.anime.create({ data });
};

export const updateAnime = async (id: string, data: any) => {
  return prisma.anime.update({ where: { id }, data });
};

export const deleteAnime = async (id: string) => {
  return prisma.anime.delete({ where: { id } });
};