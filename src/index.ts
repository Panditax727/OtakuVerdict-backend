import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { errorHandler } from './middlewares/errorHandler'
import { notFound } from './middlewares/notFound'

// Rutas
import authRoutes from './routes/auth.routes'
import animeRoutes from './routes/anime.routes'
import mangaRoutes from './routes/manga.routes'
import ratingRoutes from './routes/rating.routes'
import comparativaRoutes from './routes/comparativa.routes'
import characterRoutes from './routes/character.routes'
import postRoutes from './routes/post.routes'
import favoriteRoutes from './routes/favorite.routes'
import wikiRoutes from './routes/wiki.routes'
import commentRoutes from './routes/comment.routes'
import reputationRoutes from './routes/reputation.routes'
import achievementRoutes from './routes/achievement.routes'

import messageRoutes from './routes/message.routes'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 3000

// Socket.io
export const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}))
app.use(morgan('dev'))
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}))
app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    project: 'OtakuVerdict API',
    version: '1.0.0'
  })
})

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/animes', animeRoutes)
app.use('/api/mangas', mangaRoutes)
app.use('/api/ratings', ratingRoutes)
app.use('/api/comparativas', comparativaRoutes)
app.use('/api/characters', characterRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/wiki', wikiRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/reputation', reputationRoutes)
app.use('/api/achievements', achievementRoutes)

app.use('/api/messages', messageRoutes)

// Manejo de errores
app.use(notFound)
app.use(errorHandler)

// Socket.io — Chat en tiempo real
const connectedUsers = new Map<string, { username: string; level: string; avatar?: string }>()

io.on('connection', (socket) => {
  socket.on('user:join', (userData: { userId: string; username: string; level: string; avatar?: string }) => {
    socket.join(`user:${userData.userId}`)
    connectedUsers.set(socket.id, userData)
    io.emit('chat:users', Array.from(connectedUsers.values()))
  })

  socket.on('message:send', async (data: { toUserId: string; content: string; fromUser: any }) => {
    // Emitir al receptor
    io.to(`user:${data.toUserId}`).emit('message:receive', {
      content: data.content,
      fromUser: data.fromUser,
      createdAt: new Date().toISOString()
    })
  })

  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id)
    if (user) {
      connectedUsers.delete(socket.id)
      io.emit('chat:users', Array.from(connectedUsers.values()))
    }
  })
})

httpServer.listen(PORT, () => {
  console.log(`🟢 OtakuVerdict corriendo en http://localhost:${PORT}`)
  console.log(`📖 Health check: http://localhost:${PORT}/health`)
})

export default app