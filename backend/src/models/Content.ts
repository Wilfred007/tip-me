import mongoose, { Schema, Document } from 'mongoose';
import { ContentCategory, IContent } from '../types';

interface ContentDocument extends Omit<IContent, '_id'>, Document { }

const contentSchema = new Schema<ContentDocument>(
    {
        creatorAddress: {
            type: String,
            required: true,
            lowercase: true,
            index: true
        },
        category: {
            type: String,
            required: true,
            enum: Object.values(ContentCategory),
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000
        },
        mediaUrl: {
            type: String,
            required: true
        },
        thumbnailUrl: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// Indexes for efficient queries
contentSchema.index({ creatorAddress: 1, createdAt: -1 });
contentSchema.index({ category: 1, createdAt: -1 });

export const Content = mongoose.model<ContentDocument>('Content', contentSchema);
