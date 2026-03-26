import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email o username ya en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword }
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    return res.status(201).json({
      token,
      user: {
        id: user.id, email: user.email, username: user.username,
        role: user.role, points: user.points, level: user.level,
        avatar: user.avatar, bio: user.bio
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    return res.json({
      token,
      user: {
        id: user.id, email: user.email, username: user.username,
        role: user.role, points: user.points, level: user.level,
        avatar: user.avatar, bio: user.bio
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).userId },
      select: {
        id: true, email: true, username: true,
        avatar: true, bio: true, role: true,
        points: true, level: true, createdAt: true
      }
    });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { username, bio, avatar } = req.body

    if (username) {
      const existing = await prisma.user.findFirst({
        where: { username, NOT: { id: userId } }
      })
      if (existing) {
        return res.status(400).json({ message: 'Username ya en uso' })
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar })
      },
      select: {
        id: true, email: true, username: true,
        avatar: true, bio: true, role: true,
        points: true, level: true
      }
    })

    return res.json(user)
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const username = String(req.params.username)
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true, username: true, avatar: true,
        bio: true, level: true, points: true,
        createdAt: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { username: true, avatar: true, level: true } } }
        },
        ratings: { select: { id: true, score: true } },
        favorites: { include: { anime: true, manga: true } }
      }
    })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    return res.json(user)
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: String(req.params.id) },
      select: { id: true, username: true, avatar: true, level: true }
    })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    return res.json(user)
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}