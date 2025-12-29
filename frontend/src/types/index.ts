import { ethers } from 'ethers';

declare global {
    interface Window {
        ethereum?: any;
    }
}

export interface JWTPayload {
    address: string;
    iat: number;
    exp: number;
}

export interface Content {
    _id: string;
    creatorAddress: string;
    category: string;
    title: string;
    description?: string;
    mediaUrl: string;
    thumbnailUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    _id: string;
    contentId: string;
    address: string;
    text: string;
    createdAt: string;
}
