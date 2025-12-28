import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/authService';
import { isValidAddress } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /auth/nonce
 * Request a nonce for wallet authentication
 */
router.post(
    '/nonce',
    [
        body('address')
            .trim()
            .notEmpty()
            .withMessage('Address is required')
            .custom(isValidAddress)
            .withMessage('Invalid Ethereum address')
    ],
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { address } = req.body;
        const nonce = AuthService.generateNonce(address);

        res.json({
            nonce,
            message: `Sign this message to authenticate: ${nonce}`
        });
    }
);

/**
 * POST /auth/verify
 * Verify signature and issue JWT
 */
router.post(
    '/verify',
    [
        body('address')
            .trim()
            .notEmpty()
            .withMessage('Address is required')
            .custom(isValidAddress)
            .withMessage('Invalid Ethereum address'),
        body('signature')
            .trim()
            .notEmpty()
            .withMessage('Signature is required')
    ],
    (req: Request, res: Response, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { address, signature } = req.body;

            // Get stored nonce
            const nonce = AuthService.getNonce(address);
            if (!nonce) {
                throw new AppError('Nonce not found or expired. Request a new nonce.', 400);
            }

            // Verify signature
            const message = `Sign this message to authenticate: ${nonce}`;
            const isValid = AuthService.verifySignature(address, message, signature);

            if (!isValid) {
                throw new AppError('Invalid signature', 401);
            }

            // Generate JWT
            const token = AuthService.generateToken(address);

            // Delete used nonce
            AuthService.deleteNonce(address);

            res.json({
                token,
                address: address.toLowerCase()
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
