
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import BlogList from '@/components/blog/BlogList';
import BlogDetail from '@/components/blog/BlogDetail';
import BlogEditor from '@/components/blog/BlogEditor';
import { toast } from 'sonner';
import { scheduledPostService } from './services/scheduledPostService';

// Start the scheduled post service when the blog component mounts
scheduledPostService.start();

const Blog = () => {

  return (
    <AppLayout
      title="Blog | HarmonyHub"
      description="Read the latest articles, tips, and news about music and instruments"
    >
      {/* Add beautiful animated gradient header */}
      <div className="container mx-auto px-4">
        <div className="w-full py-8 mb-4 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 dark:from-primary/20 dark:via-accent/10 dark:to-primary/20 rounded-b-2xl shadow-lg flex flex-col md:flex-row items-center justify-between px-6 gap-4 transition-colors duration-200">
          <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight drop-shadow-sm animate-fade-in">🎶 HarmonyHub Blog</h1>
          <span onClick={() => toast.info('Feature not available yet!')} className="text-sm md:text-md text-muted-foreground bg-card/70 px-3 py-1 rounded-xl font-medium shadow animate-scale-in">
            New: Share your music journey!
          </span>
        </div>
      </div>

      <div className="animate-fade-in min-h-screen bg-card dark:bg-card/60 transition-colors duration-200 py-8">

        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/new" element={<BlogEditor mode="create" />} />
          <Route path="/edit/:id" element={<BlogEditor mode="edit" />} />
          <Route path="/:id" element={<BlogDetail />} />
        </Routes>

      </div>
    </AppLayout>
  );
};

export default Blog;