import { prisma } from '../config/prisma';

export const getAllComparativas = async () => {
  return prisma.comparativa.findMany({
    include: {
      anime: true,
      manga: true,
      ratings: { include: { user: { select: { username: true } } } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getComparativaById = async (id: string) => {
  return prisma.comparativa.findUnique({
    where: { id },
    include: {
      anime: { include: { characters: true } },
      manga: { include: { characters: true } },
      ratings: { include: { user: { select: { username: true, avatar: true } } } },
      posts: { include: { user: { select: { username: true, avatar: true } } } }
    }
  });
};

export const createComparativa = async (animeId: string, mangaId: string, description?: string) => {
  return prisma.comparativa.create({
    data: { animeId, mangaId, description }
  });
};

export const deleteComparativa = async (id: string) => {
  return prisma.comparativa.delete({ where: { id } });
};
