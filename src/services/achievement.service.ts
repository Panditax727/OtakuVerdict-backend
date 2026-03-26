import { prisma } from '../config/prisma'

export const ACHIEVEMENTS = [
  {
    tag: 'Pluma de oro',
    description: 'Publicar 10 posts en el blog',
    icon: 'bi-pen',
    color: '#f59e0b',
    check: async (userId: string) => {
      const count = await prisma.post.count({ where: { userId } })
      return count >= 10
    }
  },
  {
    tag: 'Maestro del Lore',
    description: 'Agregar 5 secciones wiki',
    icon: 'bi-mortarboard',
    color: '#7c3aed',
    check: async (userId: string) => {
      const animeWiki = await prisma.wikiSection.count({ where: { anime: { ratings: { some: { userId } } } } })
      const count = await prisma.post.count({ where: { userId } })
      return count >= 5
    }
  },
  {
    tag: 'Crítico de élite',
    description: 'Dejar 20 ratings',
    icon: 'bi-chat-quote',
    color: '#f59e0b',
    check: async (userId: string) => {
      const count = await prisma.rating.count({ where: { userId } })
      return count >= 20
    }
  },
  {
    tag: 'El Veredicto Final',
    description: 'Crear 5 comparativas',
    icon: 'bi-shield-check',
    color: '#dc2626',
    check: async (userId: string) => {
      const count = await prisma.comparativa.count()
      const ratings = await prisma.rating.count({ where: { userId, comparativaId: { not: null } } })
      return ratings >= 5
    }
  },
  {
    tag: 'Alma de la comunidad',
    description: 'Escribir 50 comentarios',
    icon: 'bi-heart',
    color: '#dc2626',
    check: async (userId: string) => {
      const count = await prisma.comment.count({ where: { userId } })
      return count >= 50
    }
  },
  {
    tag: 'Siempre presente',
    description: 'Acumular 500 puntos',
    icon: 'bi-lightning-charge',
    color: '#a855f7',
    check: async (userId: string) => {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      return (user?.points || 0) >= 500
    }
  },
  {
    tag: 'Leyenda viviente',
    description: 'Alcanzar nivel Sensei',
    icon: 'bi-stars',
    color: '#f59e0b',
    check: async (userId: string) => {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      return user?.level === 'Sensei' || user?.level === 'Otaku Master'
    }
  },
  {
    tag: 'El Sensei',
    description: 'Alcanzar nivel Otaku Master',
    icon: 'bi-person-workspace',
    color: '#7c3aed',
    check: async (userId: string) => {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      return user?.level === 'Otaku Master'
    }
  },
  {
    tag: 'Otaku de sangre',
    description: 'Tener favoritos de anime y manga',
    icon: 'bi-fire',
    color: '#dc2626',
    check: async (userId: string) => {
      const animes = await prisma.favorite.count({ where: { userId, animeId: { not: null } } })
      const mangas = await prisma.favorite.count({ where: { userId, mangaId: { not: null } } })
      return animes >= 3 && mangas >= 3
    }
  },
  {
    tag: 'Guardián del Canon',
    description: 'Tener reputación de 10 votos',
    icon: 'bi-award',
    color: '#f59e0b',
    check: async (userId: string) => {
      const count = await prisma.reputation.count({ where: { toUserId: userId } })
      return count >= 10
    }
  },
]

export const checkAndUnlockAchievements = async (userId: string) => {
  for (const achievement of ACHIEVEMENTS) {
    const existing = await prisma.achievement.findUnique({
      where: { userId_tag: { userId, tag: achievement.tag } }
    })
    if (existing) continue

    const unlocked = await achievement.check(userId)
    if (unlocked) {
      await prisma.achievement.create({
        data: { userId, tag: achievement.tag }
      })
      await prisma.user.update({
        where: { id: userId },
        data: { points: { increment: 25 } }
      })
    }
  }
}