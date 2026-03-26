import { Request, Response } from 'express'
import { prisma } from '../config/prisma'

// Obtener conversación entre dos usuarios
export const getConversation = async (req: Request, res: Response) => {
  try {
    const fromUserId = String((req as any).userId)
    const toUserId = String(req.params.toUserId)

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId }
        ]
      },
      include: {
        fromUser: { select: { id: true, username: true, avatar: true, level: true } },
        toUser: { select: { id: true, username: true, avatar: true, level: true } }
      },
      orderBy: { createdAt: 'asc' }
    })

    await prisma.message.updateMany({
      where: { fromUserId: toUserId, toUserId: fromUserId, read: false },
      data: { read: true }
    })

    return res.json(messages)
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Obtener lista de conversaciones del usuario
export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }]
      },
      include: {
        fromUser: { select: { id: true, username: true, avatar: true, level: true } },
        toUser: { select: { id: true, username: true, avatar: true, level: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Agrupar por conversación
    const conversationsMap = new Map()
    for (const msg of messages) {
      const otherId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId
      const otherUser = msg.fromUserId === userId ? msg.toUser : msg.fromUser
      if (!conversationsMap.has(otherId)) {
        conversationsMap.set(otherId, {
          user: otherUser,
          lastMessage: msg,
          unread: msg.toUserId === userId && !msg.read ? 1 : 0
        })
      } else {
        const existing = conversationsMap.get(otherId)
        if (msg.toUserId === userId && !msg.read) {
          existing.unread++
        }
      }
    }

    return res.json(Array.from(conversationsMap.values()))
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Enviar mensaje (guardado en BD)
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const fromUserId = (req as any).userId
    const { toUserId, content } = req.body

    if (!content?.trim()) {
      return res.status(400).json({ message: 'El mensaje no puede estar vacío' })
    }

    const toUser = await prisma.user.findUnique({ where: { id: toUserId } })
    if (!toUser) return res.status(404).json({ message: 'Usuario no encontrado' })

    const message = await prisma.message.create({
      data: { fromUserId, toUserId, content: content.trim() },
      include: {
        fromUser: { select: { id: true, username: true, avatar: true, level: true } },
        toUser: { select: { id: true, username: true, avatar: true, level: true } }
      }
    })

    return res.status(201).json(message)
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Contar mensajes no leídos
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const count = await prisma.message.count({
      where: { toUserId: userId, read: false }
    })
    return res.json({ count })
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}