import { prisma } from '../config/prisma';

export const getAllPosts = async (comparativaId?: string) => {
  return prisma.post.findMany({
    where: comparativaId ? { comparativaId } : {},
    include: { user: { select: { username: true, avatar: true } } },
    orderBy: { createdAt: 'desc' }
  });
};

export const createPost = async (content: string, userId: string, comparativaId?: string) => {
  return prisma.post.create({
    data: { content, userId, comparativaId }
  });
};

export const deletePost = async (id: string) => {
  return prisma.post.delete({ where: { id } });
};