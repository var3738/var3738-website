'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { api, Post } from '@/lib/api';
import { Loader2, ArrowLeft, Calendar, User } from 'lucide-react';
import Link from 'next/link';

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      if (!params?.id) return;
      try {
        const data = await api.getPost(params.id as string);
        setPost(data);
      } catch (err: any) {
        console.error('Failed to load post:', err);
        setError('Article not found or currently offline.');
      } finally {
        setIsLoading(false);
      }
    }
    loadPost();
  }, [params?.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-40 pb-20 bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Decrypting File...</p>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen pt-40 pb-20 bg-background flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <span className="text-2xl font-black">!</span>
        </div>
        <p className="text-[12px] font-black uppercase tracking-widest text-white/50">{error || 'Post not found'}</p>
        <button onClick={() => router.push('/blog')} className="text-primary hover:underline text-[10px] uppercase font-black tracking-widest">
          Return to Registry
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background selection:bg-primary selection:text-black">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Registry</span>
        </Link>
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="modern-card p-8 md:p-12 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <header className="mb-12 border-b border-white/10 pb-12">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 leading-none">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/40">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span>{new Date(post.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric'})}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                <span>Author ID: {post.author_id.slice(0, 8)}</span>
              </div>
            </div>
          </header>

          {/* Render content basic string for now, could be markdown later */}
          <div className="prose prose-invert prose-p:text-white/70 prose-p:leading-relaxed prose-p:font-medium prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase max-w-none">
            {post.content.split('\n').map((paragraph, i) => (
              paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
            ))}
          </div>
        </motion.article>
      </div>
    </main>
  );
}
