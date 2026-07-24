import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  adminId?: number;
}

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_jwt_key_please_change') as { id: number };
    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa.' });
  }
};
