import { Router, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { uploadMedia } from '../middleware/upload';
import { AuthRequest } from '../types';
import { MediaService } from '../services/mediaService';

const router = Router();

/**
 * POST /media/upload
 * Upload media file (authenticated)
 */
router.post(
    '/upload',
    authenticate,
    uploadMedia.single('file'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }

            const fileUrl = MediaService.getFileUrl(req.file.filename);

            res.status(201).json({
                filename: req.file.filename,
                url: fileUrl,
                mimetype: req.file.mimetype,
                size: req.file.size
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
