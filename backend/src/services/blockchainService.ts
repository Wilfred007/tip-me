import { ethers } from 'ethers';
import { getTipJarFactoryContract, getTipJarContract } from '../config/blockchain';
import { TipJarInfo, TipRecord } from '../types';

export class BlockchainService {
    /**
     * Get TipJar address for a creator
     */
    static async getTipJarAddress(creatorAddress: string): Promise<string | null> {
        try {
            const factory = getTipJarFactoryContract();
            const tipJarAddress = await factory.getTipJar(creatorAddress);

            // Check if TipJar exists (address is not zero)
            if (tipJarAddress === ethers.ZeroAddress) {
                return null;
            }

            return tipJarAddress;
        } catch (error) {
            console.error('Error fetching TipJar address:', error);
            throw new Error('Failed to fetch TipJar address');
        }
    }

    /**
     * Get TipJar details
     */
    static async getTipJarInfo(tipJarAddress: string): Promise<TipJarInfo> {
        try {
            const tipJar = getTipJarContract(tipJarAddress);

            const [creator, minTip, totalTips, tipCounter] = await Promise.all([
                tipJar.creator(),
                tipJar.minTip(),
                tipJar.totalTips(),
                tipJar.tipCounter()
            ]);

            return {
                address: tipJarAddress,
                creator,
                minTip: ethers.formatEther(minTip),
                totalTips: ethers.formatEther(totalTips),
                tipCounter: Number(tipCounter)
            };
        } catch (error) {
            console.error('Error fetching TipJar info:', error);
            throw new Error('Failed to fetch TipJar info');
        }
    }

    /**
     * Get recent tips for a TipJar
     */
    static async getRecentTips(tipJarAddress: string): Promise<TipRecord[]> {
        try {
            const tipJar = getTipJarContract(tipJarAddress);
            const recentTips = await tipJar.getAllRecentTips();

            return recentTips.map((tip: any) => ({
                tipper: tip.tipper,
                amount: ethers.formatEther(tip.amount)
            }));
        } catch (error) {
            console.error('Error fetching recent tips:', error);
            throw new Error('Failed to fetch recent tips');
        }
    }

    /**
     * Get all TipJar addresses
     */
    static async getAllTipJars(): Promise<string[]> {
        try {
            const factory = getTipJarFactoryContract();
            return await factory.getAllTipJars();
        } catch (error) {
            console.error('Error fetching all TipJars:', error);
            throw new Error('Failed to fetch TipJars');
        }
    }

    /**
     * Check if creator has a TipJar
     */
    static async hasTipJar(creatorAddress: string): Promise<boolean> {
        const address = await this.getTipJarAddress(creatorAddress);
        return address !== null;
    }
}
