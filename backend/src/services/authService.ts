import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/env';
import { NonceData, JWTPayload } from '../types';

// In-memory nonce storage (use Redis in production)
const nonceStore = new Map<string, NonceData>();

// Cleanup expired nonces every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [address, data] of nonceStore.entries()) {
        if (data.expiresAt < now) {
            nonceStore.delete(address);
        }
    }
}, 5 * 60 * 1000);

export class AuthService {
    /**
     * Generate a nonce for wallet address
     */
    static generateNonce(address: string): string {
        const nonce = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        nonceStore.set(address.toLowerCase(), { nonce, expiresAt });
        return nonce;
    }

    /**
     * Get stored nonce for address
     */
    static getNonce(address: string): string | null {
        const data = nonceStore.get(address.toLowerCase());
        if (!data) return null;

        if (data.expiresAt < Date.now()) {
            nonceStore.delete(address.toLowerCase());
            return null;
        }

        return data.nonce;
    }

    /**
     * Verify EIP-191 signature
     */
    static verifySignature(
        address: string,
        message: string,
        signature: string
    ): boolean {
        try {
            const recoveredAddress = ethers.verifyMessage(message, signature);
            return recoveredAddress.toLowerCase() === address.toLowerCase();
        } catch (error) {
            console.error('Signature verification error:', error);
            return false;
        }
    }

    /**
     * Generate JWT token
     */
    static generateToken(address: string): string {
        const payload = {
            address: address.toLowerCase()
        };

        return jwt.sign(payload, config.jwtSecret, {
            expiresIn: config.jwtExpiration
        } as jwt.SignOptions);
    }

    /**
     * Verify JWT token
     */
    static verifyToken(token: string): JWTPayload | null {
        try {
            const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
            return decoded;
        } catch (error) {
            return null;
        }
    }

    /**
     * Delete nonce after successful authentication
     */
    static deleteNonce(address: string): void {
        nonceStore.delete(address.toLowerCase());
    }
}
