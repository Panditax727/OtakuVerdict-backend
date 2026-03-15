import { Request } from 'express'

// Request con usuario autenticado
export interface AuthRequest extends Request {
    user?: {
        id: string
        email: string
        role: string
    }
}

// Respuesta de la API
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    message?: string
    errors?: string[]
}