import { Request } from 'express'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
  userId?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export interface AnimeData {
  title: string
  titleJp?: string
  synopsis?: string
  coverImage?: string
  episodes?: number
  status?: string
  year?: number
  studio?: string
  director?: string
  genre?: string[]
  trailerUrl?: string
  streamingUrls?: string[]
  trivia?: string[]
  behindTheScenes?: string[]
}

export interface MangaData {
  title: string
  titleJp?: string
  synopsis?: string
  coverImage?: string
  chapters?: number
  volumes?: number
  status?: string
  year?: number
  author?: string
  publisher?: string
  genre?: string[]
  readingUrls?: string[]
  trivia?: string[]
  behindTheScenes?: string[]
}

export interface RatingData {
  score: number
  comment?: string
  animeId?: string
  mangaId?: string
  comparativaId?: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}