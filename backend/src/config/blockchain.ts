import { ethers } from 'ethers';
import config from './env';

// TipJarFactory ABI (only the functions we need to read)
export const TIPJAR_FACTORY_ABI = [
    'function creatorToTipJar(address) view returns (address)',
    'function getTipJar(address creator) view returns (address)',
    'function getAllTipJars() view returns (address[])',
    'function getTipJarCount() view returns (uint256)'
];

// TipJar ABI (read-only functions)
export const TIPJAR_ABI = [
    'function creator() view returns (address)',
    'function minTip() view returns (uint256)',
    'function totalTips() view returns (uint256)',
    'function tipCounter() view returns (uint256)',
    'function getTotalTips() view returns (uint256)',
    'function getRecentTip(uint256 index) view returns (address tipper, uint256 amount)',
    'function getAllRecentTips() view returns (tuple(address tipper, uint256 amount)[])'
];

let provider: ethers.JsonRpcProvider | null = null;

export const getProvider = (): ethers.JsonRpcProvider => {
    if (!provider) {
        if (!config.rpcUrl) {
            throw new Error('RPC_URL not configured');
        }
        provider = new ethers.JsonRpcProvider(config.rpcUrl);
    }
    return provider;
};

export const getTipJarFactoryContract = (): ethers.Contract => {
    if (!config.tipJarFactoryAddress) {
        throw new Error('TIPJAR_FACTORY_ADDRESS not configured');
    }
    return new ethers.Contract(
        config.tipJarFactoryAddress,
        TIPJAR_FACTORY_ABI,
        getProvider()
    );
};

export const getTipJarContract = (address: string): ethers.Contract => {
    return new ethers.Contract(address, TIPJAR_ABI, getProvider());
};
