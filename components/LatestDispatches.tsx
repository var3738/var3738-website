'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Newspaper, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { api, Post } from '@/lib/api';
import BlogCard from './BlogCard';

export default function LatestDispatches() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await api.getPosts();
        setPosts(data.slice(0, 3)); // Only take first 3
      } catch (err) {
        console.error('Failed to load dispatches:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (isLoading || posts.length === 0) {
    return null; // Don't show anything if failing or loading for a seamless landing page experience
  }

  return (
    <section className="w-full py-32 bg-black border-t border-white/5 relative overflow-hidden">
      <div className="glow-orb -top-20 -left-20 opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <div className="flex items-center gap-3 text-primary mb-6">
               <div className="h-px w-8 bg-primary"></div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Latest Dispatches</span>
               <Newspaper size={14} />
            </div>
            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
              From The <br /><span className="text-primary italic">Frontlines</span>
            </h2>
          </div>
          
          <Link 
            href="/blog"
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors border border-white/10 rounded-full px-6 py-3 bg-white/5 hover:bg-white/10"
          >
            Access Full Registry <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
             <BlogCard key={post.id} post={post} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
