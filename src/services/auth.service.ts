import { prisma } from '../config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (email: string, username: string, password: string) => {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] }
  });

  if (existingUser) throw new Error('Email o username ya en uso');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, username, password: hashedPassword }
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  return { token, user: { id: user.id, email: user.email, username: user.username } };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error('Credenciales inválidas');

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) throw new Error('Credenciales inválidas');

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  return { token, user: { id: user.id, email: user.email, username: user.username } };
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, username: true, avatar: true, createdAt: true }
  });
};
