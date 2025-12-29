'use client';

import React from 'react';
import Link from 'next/link';
import { useWeb3 } from '@/context/web3-context';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Upload, Coins } from 'lucide-react';

export const Navbar = () => {
    const { address, connect, disconnect, isConnecting } = useWeb3();
    const { isAuthenticated, login, isLoggingIn } = useAuth();

    const formatAddress = (addr: string) => {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Coins className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">TipJar</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {address ? (
                        <>
                            {!isAuthenticated ? (
                                <Button
                                    onClick={login}
                                    disabled={isLoggingIn}
                                    variant="secondary"
                                    className="gap-2"
                                >
                                    {isLoggingIn ? 'Authenticating...' : 'Sign to Login'}
                                </Button>
                            ) : (
                                <Button variant="ghost" size="sm" className="gap-2 hidden md:flex">
                                    <Upload className="h-4 w-4" />
                                    Upload
                                </Button>
                            )}

                            <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium">
                                <Wallet className="h-4 w-4 text-primary" />
                                <span>{formatAddress(address)}</span>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={disconnect}
                                title="Disconnect"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={connect}
                            disabled={isConnecting}
                            className="gap-2"
                        >
                            <Wallet className="h-4 w-4" />
                            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
};
