import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

const VALID_TAGS = [
  'Muy amable',
  'Buena vibra', 
  'Confiable',
  'Buen crítico',
  'Sabe mucho',
  'Gran escritor',
  'Experto en anime',
  'Experto en manga',
  'Otaku de corazón',
]

export const getUserReputation = async (req: Request, res: Response) => {
  try {
    const username = String(req.params.username)
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    const reputation = await prisma.reputation.groupBy({
      by: ['tag'],
      where: { toUserId: user.id },
      _count: { tag: true }
    })

    return res.json(reputation)
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}

export const voteReputation = async (req: Request, res: Response) => {
  try {
    const fromUserId = (req as any).userId
    const { toUsername, tag } = req.body

    if (!VALID_TAGS.includes(tag)) {
      return res.status(400).json({ message: 'Tag inválido' })
    }

    const toUser = await prisma.user.findUnique({ where: { username: toUsername } })
    if (!toUser) return res.status(404).json({ message: 'Usuario no encontrado' })

    if (fromUserId === toUser.id) {
      return res.status(400).json({ message: 'No puedes votarte a ti mismo' })
    }

    const existing = await prisma.reputation.findUnique({
      where: {
        fromUserId_toUserId_tag: {
          fromUserId,
          toUserId: toUser.id,
          tag
        }
      }
    })

    if (existing) {
      await prisma.reputation.delete({ where: { id: existing.id } })
      return res.json({ message: 'Voto eliminado', action: 'removed' })
    }

    const vote = await prisma.reputation.create({
      data: { fromUserId, toUserId: toUser.id, tag }
    })

    await prisma.user.update({
      where: { id: toUser.id },
      data: { points: { increment: 3 } }
    })

    return res.status(201).json({ message: 'Voto agregado', action: 'added', vote })
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}

export const getMyVotes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { toUsername } = req.query

    const toUser = await prisma.user.findUnique({ where: { username: String(toUsername) } })
    if (!toUser) return res.status(404).json({ message: 'Usuario no encontrado' })

    const votes = await prisma.reputation.findMany({
      where: { fromUserId: userId, toUserId: toUser.id }
    })

    return res.json(votes.map(v => v.tag))
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}