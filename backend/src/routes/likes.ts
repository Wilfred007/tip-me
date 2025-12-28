import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Like } from '../models/Like';
import { Content } from '../models/Content';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /likes/toggle
 * Toggle like status for content (authenticated)
 */
router.post(
    '/toggle',
    authenticate,
    [
        body('contentId')
            .trim()
            .notEmpty()
            .withMessage('Content ID is required')
    ],
    async (req: AuthRequest, res: Response, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { contentId } = req.body;
            const address = req.userAddress!;

            // Verify content exists
            const content = await Content.findById(contentId);
            if (!content) {
                throw new AppError('Content not found', 404);
            }

            // Check if already liked
            const existingLike = await Like.findOne({ contentId, address });

            if (existingLike) {
                // Unlike
                await Like.deleteOne({ _id: existingLike._id });
                res.json({ liked: false, message: 'Content unliked' });
            } else {
                // Like
                await Like.create({ contentId, address });
                res.json({ liked: true, message: 'Content liked' });
            }
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /likes/count/:contentId
 * Get like count for content
 */
router.get('/count/:contentId', async (req: AuthRequest, res: Response, next) => {
    try {
        const { contentId } = req.params;

        const count = await Like.countDocuments({ contentId });

        res.json({ contentId, count });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /likes/me/:contentId
 * Check if authenticated user liked content
 */
router.get(
    '/me/:contentId',
    authenticate,
    async (req: AuthRequest, res: Response, next) => {
        try {
            const { contentId } = req.params;
            const address = req.userAddress!;

            const like = await Like.findOne({ contentId, address });

            res.json({
                contentId,
                liked: !!like
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
