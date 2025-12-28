import { Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../types';

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        const token = authHeader.substring(7);
        const payload = AuthService.verifyToken(token);

        if (!payload) {
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }

        req.userAddress = payload.address;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};
