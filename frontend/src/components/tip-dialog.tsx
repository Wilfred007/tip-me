'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWeb3 } from '@/context/web3-context';
import { ethers } from 'ethers';
import { getTipJarContract } from '@/lib/blockchain';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface TipDialogProps {
    creatorAddress: string;
    children: React.ReactNode;
}

export const TipDialog: React.FC<TipDialogProps> = ({ creatorAddress, children }) => {
    const { signer, address: userAddress } = useWeb3();
    const [amount, setAmount] = useState('0.01');
    const [isPending, setIsPending] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const handleTip = async () => {
        if (!signer) {
            alert('Please connect your wallet!');
            return;
        }

        try {
            setIsPending(true);
            setError(null);
            setTxHash(null);

            const contract = getTipJarContract(signer);

            // Call the tip function on the smart contract
            const tx = await contract.tip({
                value: ethers.parseEther(amount)
            });

            setTxHash(tx.hash);
            await tx.wait();

            // Success!
            setTxHash(tx.hash);
        } catch (err: any) {
            console.error('Tipping failed:', err);
            setError(err.message || 'Transaction failed');
        } finally {
            setIsPending(false);
        }
    };

    const resetState = () => {
        setTxHash(null);
        setError(null);
        setIsPending(false);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) resetState();
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Send a Tip</DialogTitle>
                    <DialogDescription>
                        Support this creator by sending ETH directly to their TipJar.
                    </DialogDescription>
                </DialogHeader>

                {!txHash && !error && (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount (ETH)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.001"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.01"
                            />
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Recipient: <span className="font-mono">{creatorAddress.substring(0, 10)}...{creatorAddress.substring(34)}</span>
                        </div>
                    </div>
                )}

                {isPending && (
                    <div className="flex flex-col items-center justify-center py-8 gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium">Confirming transaction...</p>
                    </div>
                )}

                {txHash && !isPending && (
                    <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                        <div>
                            <p className="font-bold text-lg">Tip Sent!</p>
                            <p className="text-sm text-muted-foreground">Thank you for supporting the creator.</p>
                        </div>
                        <a
                            href={`https://sepolia.etherscan.io/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                        >
                            View on Etherscan
                        </a>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                        <div>
                            <p className="font-bold text-lg text-destructive">Transaction Failed</p>
                            <p className="text-sm text-muted-foreground">{error.substring(0, 100)}...</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={resetState}>Try Again</Button>
                    </div>
                )}

                <DialogFooter>
                    {!txHash && !isPending && (
                        <Button onClick={handleTip} className="w-full">
                            Send Tip
                        </Button>
                    )}
                    {txHash && !isPending && (
                        <Button onClick={() => setOpen(false)} className="w-full">
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
