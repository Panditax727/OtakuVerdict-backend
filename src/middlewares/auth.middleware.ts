import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(401).json({ success: false, message: 'No autorizado' });
    } 

    try {
        // Aquí verificarías el token JWT
        // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        // req.user = decoded;
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        (req as any).userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token inválido' });
    }
};