import path from 'path';
import fs from 'fs/promises';
import config from '../config/env';

export class MediaService {
    /**
     * Get full URL for uploaded file
     */
    static getFileUrl(filename: string): string {
        // In production, this would be your CDN/IPFS URL
        return `/uploads/${filename}`;
    }

    /**
     * Validate file type
     */
    static isValidFileType(mimetype: string, allowedTypes: string[]): boolean {
        return allowedTypes.some(type => mimetype.startsWith(type));
    }

    /**
     * Get allowed MIME types for content category
     */
    static getAllowedMimeTypes(category: string): string[] {
        const typeMap: Record<string, string[]> = {
            music: ['audio/'],
            podcast: ['audio/'],
            video: ['video/'],
            art: ['image/'],
            article: ['application/pdf', 'text/'],
            motivation: ['audio/', 'video/', 'image/', 'text/'],
            business: ['application/pdf', 'text/', 'video/'],
            education: ['video/', 'audio/', 'application/pdf', 'text/']
        };

        return typeMap[category] || ['image/', 'video/', 'audio/', 'application/pdf'];
    }

    /**
     * Delete file from storage
     */
    static async deleteFile(filename: string): Promise<void> {
        try {
            const filePath = path.join(config.uploadDir, filename);
            await fs.unlink(filePath);
        } catch (error) {
            console.error('Error deleting file:', error);
            // Don't throw - file might already be deleted
        }
    }

    /**
     * Ensure upload directory exists
     */
    static async ensureUploadDir(): Promise<void> {
        try {
            await fs.access(config.uploadDir);
        } catch {
            await fs.mkdir(config.uploadDir, { recursive: true });
        }
    }
}
