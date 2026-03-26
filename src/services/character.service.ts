import { prisma } from '../config/prisma';

export const getAllCharacters = async (animeId?: string, mangaId?: string) => {
  return prisma.character.findMany({
    where: {
      ...(animeId && { animeId }),
      ...(mangaId && { mangaId })
    }
  });
};

export const createCharacter = async (data: any) => {
  return prisma.character.create({ data });
};

export const deleteCharacter = async (id: string) => {
  return prisma.character.delete({ where: { id } });
};