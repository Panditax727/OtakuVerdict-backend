import { prisma } from '../config/prisma';

export const getAllMangas = async (search?: string) => {
  return prisma.manga.findMany({
    where: search ? { title: { contains: search, mode: 'insensitive' } } : {},
    orderBy: { createdAt: 'desc' }
  });
};

export const getMangaById = async (id: string) => {
  return prisma.manga.findUnique({
    where: { id },
    include: { characters: true, ratings: true }
  });
};

export const createManga = async (data: any) => {
  return prisma.manga.create({ data });
};

export const updateManga = async (id: string, data: any) => {
  return prisma.manga.update({ where: { id }, data });
};

export const deleteManga = async (id: string) => {
  return prisma.manga.delete({ where: { id } });
};