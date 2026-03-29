'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api, Post } from '@/lib/api';
import BlogCard from '@/components/BlogCard';
import { Loader2, Newspaper, PenSquare, Plus, ShieldCheck } from 'lucide-react';
import CMSFormModal, { FormField } from '@/components/admin/CMSFormModal';

export default function BlogListingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('var3738_token'));
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPosts();
      setPosts(data.filter((p: Post) => p.is_published));
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('The newsroom is currently offline. Please check back later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const postFields: FormField[] = [
    { name: 'title', label: 'Dispatch Title', type: 'text', required: true },
    { name: 'content', label: 'Content', type: 'richtext', required: true }
  ];

  const handleSubmit = async (data: any) => {
    try {
      await api.createPost(data);
      alert('Dispatch submitted successfully! It will appear on the registry once approved by an admin.');
      setIsModalOpen(false);
      loadPosts();
    } catch (err) {
      console.error('Submission failed', err);
      alert('Submission failed. Your message might have been intercepted.');
    }
  };

  return (
    <main className="min-h-screen pt-40 pb-20 bg-background overflow-hidden selection:bg-primary selection:text-black">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="max-w-3xl mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-primary mb-6"
          >
            <div className="h-px w-8 bg-primary"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">The Registry</span>
            <Newspaper size={14} />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase"
          >
            Voices of <br /> <span className="text-primary italic">The Republic</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 leading-relaxed font-bold tracking-tight"
          >
            Official updates, civic education, and dispatches from the front lines of the movement. 
            Understanding Article 37 & 38 through the lens of a new generation.
          </motion.p>
          
          {isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10"
            >
              <button 
                onClick={() => setIsModalOpen(true)}
                className="crimson-btn flex items-center gap-3 px-8 py-4"
              >
                <Plus size={18} />
                <span className="font-black uppercase tracking-widest text-[10px]">Contribute a Dispatch</span>
                <ShieldCheck size={14} className="text-white/40" />
              </button>
            </motion.div>
          )}
        </div>

        {isLoading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Syncing with Central Registry...</p>
          </div>
        ) : error ? (
          <div className="w-full py-20 text-center border border-white/5 rounded-2xl bg-white/2">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <BlogCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        )}
      </div>

      <CMSFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Contribute a Dispatch"
        fields={postFields}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
