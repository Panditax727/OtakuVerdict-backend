import { prisma } from '../config/prisma';

export const getAllRatings = async (filters: any) => {
  return prisma.rating.findMany({
    where: filters,
    include: { user: { select: { username: true, avatar: true } } },
    orderBy: { createdAt: 'desc' }
  });
};

export const createRating = async (data: any) => {
  return prisma.rating.create({ data });
};

export const deleteRating = async (id: string) => {
  return prisma.rating.delete({ where: { id } });
};