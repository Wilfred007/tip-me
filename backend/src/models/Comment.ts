import mongoose, { Schema, Document } from 'mongoose';
import { IComment } from '../types';

interface CommentDocument extends Omit<IComment, '_id'>, Document { }

const commentSchema = new Schema<CommentDocument>(
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
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient comment retrieval
commentSchema.index({ contentId: 1, createdAt: -1 });

export const Comment = mongoose.model<CommentDocument>('Comment', commentSchema);
