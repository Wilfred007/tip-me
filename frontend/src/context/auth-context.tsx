'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3 } from './web3-context';
import { authApi } from '@/lib/api';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => Promise<void>;
    logout: () => void;
    isLoggingIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { address, signer } = useWeb3();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('tipjar_token');
        if (token && address) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [address]);

    const login = async () => {
        if (!address || !signer) {
            alert('Please connect your wallet first!');
            return;
        }

        try {
            setIsLoggingIn(true);

            // 1. Get nonce
            const nonceRes = await authApi.getNonce(address);
            const { nonce } = nonceRes.data;

            // 2. Sign message
            const message = `Sign this message to authenticate: ${nonce}`;
            const signature = await signer.signMessage(message);

            // 3. Verify signature and get JWT
            const verifyRes = await authApi.verify(address, signature);
            const { token } = verifyRes.data;

            // 4. Store token
            localStorage.setItem('tipjar_token', token);
            setIsAuthenticated(true);

        } catch (error) {
            console.error('Login failed:', error);
            alert('Authentication failed. Please try again.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('tipjar_token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoggingIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
