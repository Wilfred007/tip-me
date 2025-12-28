import { ethers } from 'ethers';

export const isValidAddress = (address: string): boolean => {
    return ethers.isAddress(address);
};

export const normalizeAddress = (address: string): string => {
    return address.toLowerCase();
};

export const isValidCategory = (category: string): boolean => {
    const validCategories = [
        'music',
        'podcast',
        'article',
        'video',
        'art',
        'motivation',
        'business',
        'education'
    ];
    return validCategories.includes(category.toLowerCase());
};

export const sanitizeString = (str: string, maxLength: number = 1000): string => {
    return str.trim().substring(0, maxLength);
};
