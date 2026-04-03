'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { api, Post, Category } from '@/lib/api';
import BlogCard from '@/components/BlogCard';
import { Loader2, Newspaper, PenSquare, Plus, ShieldCheck, Search, Filter, X } from 'lucide-react';
import CMSFormModal, { FormField } from '@/components/admin/CMSFormModal';

// Simple debounce helper to avoid lodash dependency issues
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export default function BlogListingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('var3738_token'));
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const loadPosts = async (catId?: string | null) => {
    setIsLoading(true);
    try {
      const data = await api.getPosts({ 
        category_id: catId || undefined,
        status: 'published'
      });
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('The newsroom is currently offline. Please check back later.');
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) {
        loadPosts(activeCategory);
        return;
      }
      setIsLoading(true);
      try {
        const results = await api.searchPosts(q);
        setPosts(results);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [activeCategory]
  );

  useEffect(() => {
    if (!searchQuery) {
      loadPosts(activeCategory);
    } else {
      debouncedSearch(searchQuery);
    }
  }, [activeCategory, searchQuery]);

  const postFields: FormField[] = [
    { name: 'title', label: 'Dispatch Title', type: 'text', required: true },
    { name: 'slug', label: 'URL Slug (voices-of-a-republic)', type: 'text', required: true },
    { name: 'summary', label: 'Short Summary', type: 'text' },
    { 
      name: 'category_id', 
      label: 'Category', 
      type: 'select', 
      options: categories.map(c => ({ label: c.name, value: c.id }))
    },
    { name: 'content', label: 'Content', type: 'richtext', required: true },
    { name: 'image_url', label: 'Feature Image', type: 'file', folder: 'blog' }
  ];

  const handleSubmit = async (data: any) => {
    try {
      await api.createPost({ ...data, is_published: false, status: 'draft' });
      alert('Dispatch submitted as draft! It will appear on the registry once approved by an admin.');
      setIsModalOpen(false);
      loadPosts(activeCategory);
    } catch (err) {
      console.error('Submission failed', err);
      alert('Submission failed. Network interference detected.');
    }
  };

  return (
    <main className="min-h-screen pt-40 pb-20 bg-background overflow-hidden selection:bg-primary selection:text-black">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-2xl">
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
              className="text-lg text-white/50 leading-relaxed font-bold tracking-tight"
            >
              Official updates, civic education, and dispatches from the front lines. 
              Real-time synchronization with the national movement database.
            </motion.p>
          </div>

          <div className="w-full lg:w-96 space-y-6 lg:mt-20">
             {/* Search Bar */}
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search the archive..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:border-primary/50 outline-none transition-all"
                />
                {searchQuery && (
                   <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                   >
                     <X size={16} />
                   </button>
                )}
             </div>

             {isLoggedIn && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full crimson-btn flex items-center justify-center gap-3 py-4"
              >
                <Plus size={18} />
                <span className="font-black uppercase tracking-widest text-[10px]">Contribute a Dispatch</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-wrap items-center gap-4 border-b border-white/5 pb-8">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 mr-4">
              <Filter size={12} />
              Filter By:
           </div>
           <button 
             onClick={() => setActiveCategory(null)}
             className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === null ? 'bg-primary border-primary text-black' : 'border-white/10 text-white/50 hover:border-white/30'}`}
           >
             All Regions
           </button>
           {categories.map(cat => (
             <button 
               key={cat.id}
               onClick={() => setActiveCategory(cat.id)}
               className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === cat.id ? 'bg-primary border-primary text-black' : 'border-white/10 text-white/50 hover:border-white/30'}`}
             >
               {cat.name}
             </button>
           ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Syncing Archival Data...</p>
          </div>
        ) : error ? (
          <div className="w-full py-20 text-center border border-white/5 rounded-2xl bg-white/2">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="w-full py-32 text-center border-2 border-dashed border-white/5 rounded-3xl">
             <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">No records match your query.</p>
             <button onClick={() => {setSearchQuery(''); setActiveCategory(null)}} className="text-primary text-[10px] font-black uppercase underline tracking-widest">Clear all filters</button>
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
