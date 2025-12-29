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

      <section className="container px-4 py-12 mx-auto">
        <div className="flex flex-col gap-12 items-center">
          <div className="flex flex-col items-center text-center gap-4 max-w-2xl">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore Content</h2>
              <p className="text-muted-foreground mt-2">Discover the latest creations from the community.</p>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <UploadDialog>
                  <Button className="gap-2 rounded-full px-6">
                    <Plus className="h-4 w-4" />
                    Upload Content
                  </Button>
                </UploadDialog>
              )}
              <Button variant="outline" size="icon" className="rounded-full">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full flex flex-col items-center" onValueChange={setCategory}>
            <div className="flex items-center justify-center w-full overflow-x-auto pb-2">
              <TabsList className="bg-muted/50 border h-12 p-1 rounded-full">
                <TabsTrigger value="all" className="px-8 rounded-full">All</TabsTrigger>
                <TabsTrigger value="music" className="px-8 rounded-full">Music</TabsTrigger>
                <TabsTrigger value="video" className="px-8 rounded-full">Video</TabsTrigger>
                <TabsTrigger value="article" className="px-8 rounded-full">Articles</TabsTrigger>
                <TabsTrigger value="art" className="px-8 rounded-full">Art</TabsTrigger>
                <TabsTrigger value="education" className="px-8 rounded-full">Education</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={category} className="mt-10 w-full">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-muted-foreground animate-pulse font-medium">Loading amazing content...</p>
                </div>
              ) : content.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
                  {content.map((item) => (
                    <ContentCard key={item._id} content={item} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center border rounded-[2rem] bg-muted/20 border-dashed max-w-4xl mx-auto w-full">
                  <div className="mb-6 rounded-full bg-muted p-6">
                    <Filter className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold">No content found</h3>
                  <p className="text-muted-foreground max-w-sm mt-3 text-lg">
                    Be the first to share something in this category!
                  </p>
                  {isAuthenticated && (
                    <UploadDialog>
                      <Button variant="outline" className="mt-8 rounded-full px-8">Upload Now</Button>
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
