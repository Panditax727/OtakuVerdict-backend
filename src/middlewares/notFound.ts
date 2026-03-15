// middleware 404
import { Request, Response } from 'express'

export const notFound = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
    })
}