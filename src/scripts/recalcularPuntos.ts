import { prisma } from '../config/prisma';

const recalcularPuntos = async () => {
  console.log('🔄 Recalculando puntos de todos los usuarios...')

  const users = await prisma.user.findMany()

  for (const user of users) {
    const [posts, ratings, comments, comparativas, wikiSections] = await Promise.all([
      prisma.post.count({ where: { userId: user.id } }),
      prisma.rating.count({ where: { userId: user.id } }),
      prisma.comment.count({ where: { userId: user.id } }),
      prisma.comparativa.count(),
      prisma.wikiSection.count({ where: { animeId: { not: null } } })
    ])

    const points =
      posts * 10 +
      ratings * 5 +
      comments * 2

    let level = 'Novato'
    if (points >= 5000) level = 'Otaku Master'
    else if (points >= 1000) level = 'Sensei'
    else if (points >= 500) level = 'Senpai'
    else if (points >= 100) level = 'Otaku'

    await prisma.user.update({
      where: { id: user.id },
      data: { points, level }
    })

    console.log(`✅ ${user.username}: ${points} pts → ${level}`)
  }

  console.log('🎉 Recálculo completado')
  await prisma.$disconnect()
}

recalcularPuntos().catch(console.error)
