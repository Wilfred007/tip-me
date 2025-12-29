import { Router, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import { Content } from '../models/Content';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';
import { isValidAddress, isValidCategory, sanitizeString } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /content/upload
 * Create new content (authenticated)
 */
router.post(
    '/upload',
    authenticate,
    [
        body('category')
            .trim()
            .notEmpty()
            .withMessage('Category is required')
            .custom(isValidCategory)
            .withMessage('Invalid category'),
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ max: 200 })
            .withMessage('Title too long'),
        body('mediaUrl')
            .trim()
            .notEmpty()
            .withMessage('Media URL is required'),
        body('description')
            .optional()
            .trim()
            .isLength({ max: 2000 })
            .withMessage('Description too long'),
        body('thumbnailUrl')
            .optional()
            .trim()
    ],
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { category, title, description, mediaUrl, thumbnailUrl } = req.body;

            const content = await Content.create({
                creatorAddress: req.userAddress!,
                category: category.toLowerCase(),
                title: sanitizeString(title, 200),
                description: description ? sanitizeString(description, 2000) : undefined,
                mediaUrl,
                thumbnailUrl
            });

            res.status(201).json(content);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /content
 * List all content with pagination and filters
 */
router.get(
    '/',
    [
        query('page').optional().isInt({ min: 1 }).withMessage('Invalid page'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Invalid limit'),
        query('category').optional().custom(isValidCategory).withMessage('Invalid category'),
        query('creator').optional().custom(isValidAddress).withMessage('Invalid creator address')
    ],
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const skip = (page - 1) * limit;

            const filter: any = {};
            if (req.query.category) {
                filter.category = (req.query.category as string).toLowerCase();
            }
            if (req.query.creator) {
                filter.creatorAddress = (req.query.creator as string).toLowerCase();
            }

            const [content, total] = await Promise.all([
                Content.find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Content.countDocuments(filter)
            ]);

            res.json({
                content,
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
    }
);

/**
 * GET /content/:id
 * Get single content by ID
 */
router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const content = await Content.findById(req.params.id).lean();

        if (!content) {
            throw new AppError('Content not found', 404);
        }

        res.json(content);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /content/creator/:address
 * Get all content by creator address
 */
router.get(
    '/creator/:address',
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { address } = req.params;

            if (!isValidAddress(address)) {
                throw new AppError('Invalid address', 400);
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const skip = (page - 1) * limit;

            const [content, total] = await Promise.all([
                Content.find({ creatorAddress: address.toLowerCase() })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Content.countDocuments({ creatorAddress: address.toLowerCase() })
            ]);

            res.json({
                content,
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
    }
);

export default router;
