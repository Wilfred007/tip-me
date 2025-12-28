import mongoose, { Schema, Document } from 'mongoose';
import { ILike } from '../types';

interface LikeDocument extends Omit<ILike, '_id'>, Document { }

const likeSchema = new Schema<LikeDocument>(
    {
        contentId: {
            type: String,
            required: true,
            index: true
        },
        address: {
            type: String,
            required: true,
            lowercase: true
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

// Compound unique index to prevent duplicate likes
likeSchema.index({ contentId: 1, address: 1 }, { unique: true });

export const Like = mongoose.model<LikeDocument>('Like', likeSchema);
