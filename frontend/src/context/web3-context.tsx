'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
    address: string | null;
    provider: ethers.BrowserProvider | null;
    signer: ethers.JsonRpcSigner | null;
    connect: () => Promise<void>;
    disconnect: () => void;
    isConnecting: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [address, setAddress] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const connect = async () => {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask!');
            return;
        }

        try {
            setIsConnecting(true);
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await browserProvider.send('eth_requestAccounts', []);
            const rpcSigner = await browserProvider.getSigner();

            setProvider(browserProvider);
            setSigner(rpcSigner);
            setAddress(accounts[0]);

            // Handle account changes
            window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
                if (newAccounts.length > 0) {
                    setAddress(newAccounts[0]);
                } else {
                    disconnect();
                }
            });

            // Handle chain changes
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });

        } catch (error) {
            console.error('Failed to connect wallet:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnect = () => {
        setAddress(null);
        setProvider(null);
        setSigner(null);
        localStorage.removeItem('tipjar_token');
    };

    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const browserProvider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await browserProvider.listAccounts();
                if (accounts.length > 0) {
                    const rpcSigner = await browserProvider.getSigner();
                    setProvider(browserProvider);
                    setSigner(rpcSigner);
                    setAddress(accounts[0].address);
                }
            }
        };
        checkConnection();
    }, []);

    return (
        <Web3Context.Provider value={{ address, provider, signer, connect, disconnect, isConnecting }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (context === undefined) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
};
