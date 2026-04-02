'use client';

import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Post } from '@/lib/api';
import Link from 'next/link';

interface BlogCardProps {
  post: Post;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  // Format date
  const date = new Date(post.created_at).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 flex flex-col h-full"
    >
      {post.image_url && (
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 opacity-60"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
        </div>
      )}
      
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
            <Calendar size={12} />
            {date}
          </div>
          <div className="h-1 w-1 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
            <User size={12} />
            {post.author_id.substring(0, 8)}
          </div>
        </div>

        <h3 className="text-xl font-black uppercase tracking-tighter mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          {post.title}
        </h3>

        <p className="text-sm text-white/50 leading-relaxed font-bold tracking-tight mb-8 line-clamp-3">
          {post.summary || post.content}
        </p>

        <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
          <Link 
            href={`/blog/${post.slug}`}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-primary transition-colors flex items-center gap-2"
          >
            Read Dispatch <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
