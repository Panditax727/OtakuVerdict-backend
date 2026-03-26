import { prisma } from '../config/prisma';

export const getUserFavorites = async (userId: string) => {
  return prisma.favorite.findMany({
    where: { userId },
    include: { anime: true, manga: true }
  });
};

export const addFavorite = async (userId: string, animeId?: string, mangaId?: string) => {
  return prisma.favorite.create({
    data: { userId, animeId, mangaId }
  });
};

export const removeFavorite = async (id: string) => {
  return prisma.favorite.delete({ where: { id } });
};