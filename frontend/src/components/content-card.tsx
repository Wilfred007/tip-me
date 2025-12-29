'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, DollarSign, Play, Music, FileText, Image as ImageIcon } from 'lucide-react';
import { Content } from '@/types';
import { socialApi } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { TipDialog } from './tip-dialog';

interface ContentCardProps {
    content: Content;
}

export const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
    const { isAuthenticated } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const countRes = await socialApi.getLikeCount(content._id);
                setLikeCount(countRes.data.count);

                if (isAuthenticated) {
                    const likedRes = await socialApi.checkLiked(content._id);
                    setLiked(likedRes.data.liked);
                }
            } catch (error) {
                console.error('Failed to fetch likes:', error);
            }
        };
        fetchLikes();
    }, [content._id, isAuthenticated]);

    const handleLike = async () => {
        if (!isAuthenticated) {
            alert('Please login to like content!');
            return;
        }

        try {
            setIsLiking(true);
            const res = await socialApi.toggleLike(content._id);
            setLiked(res.data.liked);
            setLikeCount(prev => res.data.liked ? prev + 1 : prev - 1);
        } catch (error) {
            console.error('Failed to toggle like:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'music': return <Music className="h-4 w-4" />;
            case 'video': return <Play className="h-4 w-4" />;
            case 'article': return <FileText className="h-4 w-4" />;
            case 'art': return <ImageIcon className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    return (
        <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all group">
            <div className="relative aspect-video overflow-hidden bg-muted">
                {content.thumbnailUrl ? (
                    <img
                        src={content.thumbnailUrl.startsWith('http') ? content.thumbnailUrl : `http://localhost:5000${content.thumbnailUrl}`}
                        alt={content.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        {getCategoryIcon(content.category)}
                    </div>
                )}
                <Badge className="absolute top-2 left-2 gap-1 bg-background/80 backdrop-blur-md text-foreground border-none">
                    {getCategoryIcon(content.category)}
                    <span className="capitalize">{content.category}</span>
                </Badge>
            </div>

            <CardHeader className="p-4 pb-2">
                <h3 className="text-lg font-bold leading-tight line-clamp-1">{content.title}</h3>
                <p className="text-xs text-muted-foreground font-mono">
                    by {content.creatorAddress.substring(0, 6)}...{content.creatorAddress.substring(38)}
                </p>
            </CardHeader>

            <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                    {content.description || 'No description provided.'}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex items-center gap-1 text-sm transition-colors ${liked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                        <span>{likeCount}</span>
                    </button>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        <span>0</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <TipDialog creatorAddress={content.creatorAddress}>
                        <Button size="sm" variant="secondary" className="h-8 gap-1">
                            <DollarSign className="h-3.5 w-3.5" />
                            Tip
                        </Button>
                    </TipDialog>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};
