import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos de administrador' })
    }

    next()
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}