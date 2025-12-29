'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { ContentCard } from '@/components/content-card';
import { UploadDialog } from '@/components/upload-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { contentApi } from '@/lib/api';
import { Content } from '@/types';
import { Loader2, Plus, Filter } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('all');

  const fetchContent = async (cat: string = 'all') => {
    try {
      setIsLoading(true);
      const params: any = { limit: 20 };
      if (cat !== 'all') params.category = cat;

      const res = await contentApi.list(params);
      setContent(res.data.content);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(category);
  }, [category]);

  return (
    <main className="flex-1">
      <Navbar />
      <Hero />

      <section className="container px-4 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Explore Content</h2>
              <p className="text-muted-foreground">Discover the latest creations from the community.</p>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <UploadDialog>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Upload Content
                  </Button>
                </UploadDialog>
              )}
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setCategory}>
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              <TabsList className="bg-background border h-11 p-1">
                <TabsTrigger value="all" className="px-6">All</TabsTrigger>
                <TabsTrigger value="music" className="px-6">Music</TabsTrigger>
                <TabsTrigger value="video" className="px-6">Video</TabsTrigger>
                <TabsTrigger value="article" className="px-6">Articles</TabsTrigger>
                <TabsTrigger value="art" className="px-6">Art</TabsTrigger>
                <TabsTrigger value="education" className="px-6">Education</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={category} className="mt-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground animate-pulse">Loading amazing content...</p>
                </div>
              ) : content.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {content.map((item) => (
                    <ContentCard key={item._id} content={item} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center border rounded-3xl bg-muted/30 border-dashed">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Filter className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">No content found</h3>
                  <p className="text-muted-foreground max-w-xs mt-2">
                    Be the first to share something in this category!
                  </p>
                  {isAuthenticated && (
                    <UploadDialog>
                      <Button variant="outline" className="mt-6">Upload Now</Button>
                    </UploadDialog>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <footer className="border-t py-12 bg-muted/30">
        <div className="container px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 TipJar Creator. Built with Next.js, Tailwind CSS, and Ethers.js.
          </p>
        </div>
      </footer>
    </main>
  );
}
