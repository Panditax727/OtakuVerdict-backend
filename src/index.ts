import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { errorHandler } from './middlewares/errorHandler'
import { notFound } from './middlewares/notFound'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(helmet())
app.use(morgan('dev'))
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}))
app.use(express.json())

// Health check — para verificar que el servidor funciona
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    project: 'AniVerdict API', 
    version: '1.0.0' 
  })
})

// Manejo de errores
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🟢 AniVerdict corriendo en http://localhost:${PORT}`)
  console.log(`📖 Health check: http://localhost:${PORT}/health`)
})

export default app