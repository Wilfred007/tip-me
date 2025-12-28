import { Request } from 'express';

// Content categories enum
export enum ContentCategory {
    MUSIC = 'music',
    PODCAST = 'podcast',
    ARTICLE = 'article',
    VIDEO = 'video',
    ART = 'art',
    MOTIVATION = 'motivation',
    BUSINESS = 'business',
    EDUCATION = 'education'
}

// JWT payload
export interface JWTPayload {
    address: string;
    iat: number;
    exp: number;
}

// Authenticated request
export interface AuthRequest extends Request {
    userAddress?: string;
}

// Nonce storage
export interface NonceData {
    nonce: string;
    expiresAt: number;
}

// Content types
export interface IContent {
    _id: string;
    creatorAddress: string;
    category: ContentCategory;
    title: string;
    description?: string;
    mediaUrl: string;
    thumbnailUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Like types
export interface ILike {
    _id: string;
    contentId: string;
    address: string;
    createdAt: Date;
}

// Comment types
export interface IComment {
    _id: string;
    contentId: string;
    address: string;
    text: string;
    createdAt: Date;
    updatedAt?: Date;
    deleted: boolean;
}

// Blockchain types
export interface TipJarInfo {
    address: string;
    creator: string;
    minTip: string;
    totalTips: string;
    tipCounter: number;
}

export interface TipRecord {
    tipper: string;
    amount: string;
}
