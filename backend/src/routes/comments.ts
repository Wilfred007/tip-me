import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { Comment } from '../models/Comment';
import { Content } from '../models/Content';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';
import { sanitizeString } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /comments
 * Create a comment (authenticated)
 */
router.post(
    '/',
    authenticate,
    [
        body('contentId')
            .trim()
            .notEmpty()
            .withMessage('Content ID is required'),
        body('text')
            .trim()
            .notEmpty()
            .withMessage('Comment text is required')
            .isLength({ max: 1000 })
            .withMessage('Comment too long')
    ],
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { contentId, text } = req.body;
            const address = req.userAddress!;

            // Verify content exists
            const content = await Content.findById(contentId);
            if (!content) {
                throw new AppError('Content not found', 404);
            }

            const comment = await Comment.create({
                contentId,
                address,
                text: sanitizeString(text, 1000),
                deleted: false
            });

            res.status(201).json(comment);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /comments/:contentId
 * Get all comments for content
 */
router.get('/:contentId', async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { contentId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = (page - 1) * limit;

        const [comments, total] = await Promise.all([
            Comment.find({ contentId, deleted: false })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Comment.countDocuments({ contentId, deleted: false })
        ]);

        res.json({
            comments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /comments/:commentId
 * Update a comment (authenticated, owner only)
 */
router.put(
    '/:commentId',
    authenticate,
    [
        body('text')
            .trim()
            .notEmpty()
            .withMessage('Comment text is required')
            .isLength({ max: 1000 })
            .withMessage('Comment too long')
    ],
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { commentId } = req.params;
            const { text } = req.body;
            const address = req.userAddress!;

            const comment = await Comment.findById(commentId);
            if (!comment) {
                throw new AppError('Comment not found', 404);
            }

            if (comment.address !== address) {
                throw new AppError('Not authorized to edit this comment', 403);
            }

            if (comment.deleted) {
                throw new AppError('Cannot edit deleted comment', 400);
            }

            comment.text = sanitizeString(text, 1000);
            comment.updatedAt = new Date();
            await comment.save();

            res.json(comment);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * DELETE /comments/:commentId
 * Soft delete a comment (authenticated, owner only)
 */
router.delete(
    '/:commentId',
    authenticate,
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { commentId } = req.params;
            const address = req.userAddress!;

            const comment = await Comment.findById(commentId);
            if (!comment) {
                throw new AppError('Comment not found', 404);
            }

            if (comment.address !== address) {
                throw new AppError('Not authorized to delete this comment', 403);
            }

            comment.deleted = true;
            await comment.save();

            res.json({ message: 'Comment deleted' });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
