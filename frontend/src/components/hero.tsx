'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/context/web3-context';
import { useAuth } from '@/context/auth-context';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const Hero = () => {
    const { address, connect } = useWeb3();
    const { isAuthenticated, login } = useAuth();

    return (
        <div className="relative overflow-hidden py-24 sm:py-32">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary.DEFAULT/10%),transparent)]" />

            <div className="container px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-primary/50 transition-all">
                            Now live on Sepolia Testnet.{' '}
                            <a href="#" className="font-semibold text-primary">
                                <span className="absolute inset-0" aria-hidden="true" />
                                Read more <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Empower Your Creativity with Direct Support
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        The decentralized home for creators. Share your music, art, videos, and more.
                        Receive tips directly from your fans without middlemen.
                    </p>

                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        {!address ? (
                            <Button size="lg" onClick={connect} className="gap-2">
                                Get Started <ArrowRight className="h-4 w-4" />
                            </Button>
                        ) : !isAuthenticated ? (
                            <Button size="lg" onClick={login} className="gap-2">
                                Authenticate to Continue <Sparkles className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button size="lg" className="gap-2">
                                Explore Content <Zap className="h-4 w-4" />
                            </Button>
                        )}
                        <Button variant="ghost" size="lg">
                            Learn more
                        </Button>
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl border bg-card/50 backdrop-blur-sm">
                        <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold">Non-Custodial</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            You own your content and your tips. Funds go directly to your wallet.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 rounded-2xl border bg-card/50 backdrop-blur-sm">
                        <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold">Instant Tipping</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Fans can support you instantly with ETH. No waiting for payouts.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 rounded-2xl border bg-card/50 backdrop-blur-sm">
                        <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold">Creator Native</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Built specifically for the needs of modern digital creators.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
