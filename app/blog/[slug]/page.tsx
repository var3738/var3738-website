'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { api, Post, Comment } from '@/lib/api';
import { Loader2, ArrowLeft, Calendar, User, MessageSquare, Share2, Tag, Bookmark } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// --- Recursive Threaded Comments Component ---
function ThreadedComment({ comment, onReply }: { comment: Comment; onReply: (parentId: string) => void }) {
  return (
    <div className="mb-6">
      <div className="flex gap-4">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">
          {comment.user_id ? "U" : "G"}
        </div>
        <div className="flex-1">
          <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                {comment.user_id ? "Activated Youth" : "Guest Participant"}
              </span>
              <span className="text-[10px] font-black text-white/20">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-white/70 font-medium leading-relaxed">
              {comment.content}
            </p>
            <button 
              onClick={() => onReply(comment.id)}
              className="mt-3 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors flex items-center gap-2"
            >
              <MessageSquare size={12} />
              Reply
            </button>
          </div>

          {/* Recursive Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-8 border-l border-white/5 pl-8">
              {comment.replies.map(reply => (
                <ThreadedComment key={reply.id} comment={reply} onReply={onReply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function loadData() {
      if (!params?.slug) return;
      try {
        const postData = await api.getPostBySlug(params.slug as string);
        setPost(postData);
        setIsLoading(false); // Show the post immediately once it's loaded
        
        // Fetch comments separately so errors here don't block the post display
        try {
          const commentsData = await api.getComments(postData.id);
          setComments(commentsData);
        } catch (commentErr) {
          console.error('Failed to load comments:', commentErr);
          // Don't set the main error state
        }
      } catch (err: any) {
        console.error('Failed to load post data:', err);
        setError('Article not available for retrieval.');
        setIsLoading(false);
      }
    }
    loadData();
  }, [params?.slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentContent.trim()) return;

    try {
      await api.createComment(post.id, commentContent, replyTo || undefined);
      setCommentContent('');
      setReplyTo(null);
      // Refresh comments
      const updatedComments = await api.getComments(post.id);
      setComments(updatedComments);
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Failed to transmit comment. Network interference detected.');
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-40 pb-20 bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Syncing with Registry...</p>
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
    <main className="min-h-screen pt-32 pb-40 bg-background selection:bg-primary selection:text-black">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Repository Archive</span>
        </Link>

        {/* Article Header */}
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-21/9 rounded-[2.5rem] overflow-hidden mb-20 border border-white/10 bg-white/5"
          >
            <Image 
              src={post.image_url || '/trans-nzoia-townhall/tnts-image01.jpeg'} 
              alt={post.title}
              fill
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-10 leading-[0.9]"
          >
            {post.title}
          </motion.h1>

          <div className="flex flex-wrap items-center justify-between gap-6 border-y border-white/5 py-8">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={14} className="text-primary" />
                </div>
                <div>
                   <div className="text-[8px] font-black text-white/30 uppercase tracking-widest">Author ID</div>
                   <div className="text-[10px] font-bold uppercase">{post.author_id.slice(0, 8)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar size={14} className="text-primary" />
                </div>
                <div>
                   <div className="text-[8px] font-black text-white/30 uppercase tracking-widest">Logged On</div>
                   <div className="text-[10px] font-bold uppercase">{new Date(post.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-primary hover:border-primary transition-all">
                  <Share2 size={16} />
               </button>
               <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-primary hover:border-primary transition-all">
                  <Bookmark size={16} />
               </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-p:text-white/70 prose-p:leading-relaxed prose-p:text-xl prose-p:font-medium prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase max-w-none mb-32"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Comments Section */}
        <section className="mt-40 pt-20 border-t border-white/5">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">
              Threaded <span className="text-primary">Discourse</span>
            </h2>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">
              {comments.length} Interactions Logged
            </div>
          </div>

          {/* Comment Form */}
          <div className="mb-20">
             <form onSubmit={handleCommentSubmit} className="space-y-4">
                <AnimatePresence>
                  {replyTo && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center justify-between bg-primary/5 p-3 rounded-xl border border-primary/20 mb-4"
                    >
                      <span>Replying to Thread ID: {replyTo.slice(0, 8)}</span>
                      <button onClick={() => setReplyTo(null)} className="hover:text-white">Cancel</button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <textarea
                  ref={commentInputRef}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Share your thoughts on the reform..."
                  className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-sm font-medium focus:border-primary/50 outline-none transition-all h-32"
                />
                <div className="flex justify-end">
                   <button 
                    type="submit"
                    className="crimson-btn px-8 py-3 text-[10px] uppercase tracking-widest"
                   >
                     Submit Interaction
                   </button>
                </div>
             </form>
          </div>

          <div className="space-y-8">
            {comments.length > 0 ? (
              comments.filter(c => !c.parent_id).map(comment => (
                <ThreadedComment 
                  key={comment.id} 
                  comment={comment} 
                  onReply={(id) => {
                    setReplyTo(id);
                    commentInputRef.current?.focus();
                  }} 
                />
              ))
            ) : (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/20">The conversation has not yet been activated.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
