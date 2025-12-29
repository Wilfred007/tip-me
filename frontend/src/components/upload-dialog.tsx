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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useAuth } from '@/context/auth-context';
import { contentApi, mediaApi } from '@/lib/api';
import { Loader2, Upload, CheckCircle2 } from 'lucide-react';

export const UploadDialog = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const [open, setOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'article',
        mediaUrl: '',
        thumbnailUrl: ''
    });

    const [files, setFiles] = useState<{
        media: File | null;
        thumbnail: File | null;
    }>({
        media: null,
        thumbnail: null
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'media' | 'thumbnail') => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) return;

        try {
            setIsUploading(true);

            let mediaUrl = formData.mediaUrl;
            let thumbnailUrl = formData.thumbnailUrl;

            // Upload media if file selected
            if (files.media) {
                const res = await mediaApi.upload(files.media);
                mediaUrl = res.data.url;
            }

            // Upload thumbnail if file selected
            if (files.thumbnail) {
                const res = await mediaApi.upload(files.thumbnail);
                thumbnailUrl = res.data.url;
            }

            // Create content
            await contentApi.upload({
                ...formData,
                mediaUrl,
                thumbnailUrl
            });

            setIsSuccess(true);
            setTimeout(() => {
                setOpen(false);
                setIsSuccess(false);
                setFormData({
                    title: '',
                    description: '',
                    category: 'article',
                    mediaUrl: '',
                    thumbnailUrl: ''
                });
                setFiles({ media: null, thumbnail: null });
                window.location.reload(); // Refresh to see new content
            }, 2000);

        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please check the console for details.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload Content</DialogTitle>
                    <DialogDescription>
                        Share your creativity with the world.
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                        <div>
                            <p className="text-xl font-bold">Content Published!</p>
                            <p className="text-muted-foreground">Your content is now live on TipJar.</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter a catchy title"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val) => setFormData({ ...formData, category: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="music">Music</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="article">Article</SelectItem>
                                    <SelectItem value="art">Art</SelectItem>
                                    <SelectItem value="podcast">Podcast</SelectItem>
                                    <SelectItem value="education">Education</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Tell us more about your content..."
                                className="h-24"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="media">Media File</Label>
                                <div className="relative">
                                    <Input
                                        id="media"
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'media')}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full gap-2"
                                        onClick={() => document.getElementById('media')?.click()}
                                    >
                                        <Upload className="h-4 w-4" />
                                        {files.media ? 'Selected' : 'Choose File'}
                                    </Button>
                                </div>
                                {files.media && <p className="text-[10px] text-muted-foreground truncate">{files.media.name}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="thumbnail">Thumbnail</Label>
                                <div className="relative">
                                    <Input
                                        id="thumbnail"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'thumbnail')}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full gap-2"
                                        onClick={() => document.getElementById('thumbnail')?.click()}
                                    >
                                        <Upload className="h-4 w-4" />
                                        {files.thumbnail ? 'Selected' : 'Choose Image'}
                                    </Button>
                                </div>
                                {files.thumbnail && <p className="text-[10px] text-muted-foreground truncate">{files.thumbnail.name}</p>}
                            </div>
                        </div>

                        <DialogFooter className="mt-4">
                            <Button type="submit" disabled={isUploading} className="w-full gap-2">
                                {isUploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    'Publish Content'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};
