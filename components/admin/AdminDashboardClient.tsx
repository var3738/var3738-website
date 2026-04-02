'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Package, MessageSquare, ShieldAlert, Plus, Save, RefreshCw, PenSquare, Trash2, Users, Handshake, FileText, Image, File, LogOut, Loader2, Lock, CheckCircle2, XCircle, Eye, Calendar, User as UserIcon, Share2, Bookmark } from 'lucide-react';
import { api, Event, Product, Feedback, Post, TeamMember, Partner, GalleryItem, DocumentItem, Category } from '@/lib/api';
import CMSFormModal, { FormField } from './CMSFormModal';

type Tab = 'events' | 'merch' | 'posts' | 'team' | 'partners' | 'feedback' | 'gallery' | 'documents';

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  
  // Data State
  const [events, setEvents] = useState<Event[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{title: string, fields: FormField[], initialData?: any, onSubmit: (data: any) => Promise<void>}>({
    title: '', fields: [], onSubmit: async () => {} 
  });
  
  useEffect(() => {
    const token = localStorage.getItem('var3738_token');
    if (token) {
      setIsAuthenticated(true);
      fetchData(activeTab);
    }
  }, []);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchData(activeTab);
    }
  }, [activeTab, isAuthenticated]);

  const fetchData = async (tab: Tab) => {
    setIsLoading(true);
    try {
      if (tab === 'events') setEvents(await api.getEvents());
      else if (tab === 'merch') setProducts(await api.getProducts(false));
      else if (tab === 'posts') {
        const [postsData, categoriesData] = await Promise.all([
          api.getPosts(),
          api.getCategories()
        ]);
        setPosts(postsData);
        setCategories(categoriesData);
      }
      else if (tab === 'team') setTeam(await api.getTeamMembers());
      else if (tab === 'partners') setPartners(await api.getPartners());
      else if (tab === 'gallery') setGallery(await api.getGallery());
      else if (tab === 'documents') setDocuments(await api.getDocuments());
      else if (tab === 'feedback') {
        const eventsData = await api.getEvents();
        setEvents(eventsData);
        if (eventsData.length > 0) setFeedbacks(await api.getFeedback(eventsData[0].id));
      }
    } catch (err: any) {
      console.error('Admin fetch error', err);
      if (err.message?.includes('401') || err.message?.toLowerCase().includes('unauthorized')) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    try {
      await api.login(authForm.username, authForm.password);
      setIsAuthenticated(true);
      fetchData(activeTab);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Security clearance denied.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      await api.updatePost(post.id, { is_published: !post.is_published });
      fetchData('posts');
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  const handleDelete = async (type: Tab, id: string | number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      if (type === 'events') await api.deleteEvent(id as any);
      else if (type === 'merch') await api.deleteProduct(id as any);
      else if (type === 'posts') await api.deletePost(id as any);
      else if (type === 'team') await api.deleteTeamMember(id as any);
      else if (type === 'partners') await api.deletePartner(id as any);
      else if (type === 'gallery') await api.deleteGalleryItem(id as any);
      else if (type === 'documents') await api.deleteDocument(id as any);
      fetchData(activeTab);
    } catch (err) {
      alert('Delete failed');
    }
  };

  const openModal = (type: Tab, initialData?: any) => {
    let config: any = {};
    if (type === 'posts') {
      config = {
        title: initialData ? 'Edit Dispatch' : 'New Dispatch',
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'slug', label: 'Slug', type: 'text', required: true },
          { name: 'summary', label: 'Summary', type: 'textarea' },
          { 
            name: 'category_id', 
            label: 'Category', 
            type: 'select', 
            options: categories.map(c => ({ label: c.name, value: c.id }))
          },
          { name: 'image_url', label: 'Image URL', type: 'text' },
          { name: 'content', label: 'Content', type: 'richtext', required: true },
          { name: 'status', label: 'Status', type: 'select', options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' }
          ]},
          { name: 'is_published', label: 'Published / Visible to Public', type: 'checkbox' }
        ],
        onSubmit: async (data: any) => {
          if (initialData) await api.updatePost(initialData.id, data);
          else await api.createPost(data);
          fetchData('posts');
        }
      };
    } else if (type === 'events') {
      config = {
        title: initialData ? 'Edit Civic Activation' : 'New Civic Activation',
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'ward', label: 'Ward', type: 'text', required: true },
          { name: 'location_name', label: 'Venue', type: 'text', required: true },
          { name: 'date', label: 'Date', type: 'date', required: true },
          { name: 'max_capacity', label: 'Capacity', type: 'number', required: true }
        ],
        onSubmit: async (data: any) => {
          if (initialData) await api.updateEvent(initialData.id, data);
          else await api.createEvent(data);
          fetchData('events');
        }
      };
    } else if (type === 'merch') {
      config = {
        title: initialData ? 'Edit Product' : 'New Product',
        fields: [
          { name: 'name', label: 'Product Name', type: 'text', required: true },
          { name: 'price', label: 'Price (KSH)', type: 'number', required: true },
          { name: 'stock_quantity', label: 'Stock', type: 'number', required: true },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'image_url', label: 'Image URL', type: 'file', folder: 'merch' }
        ],
        onSubmit: async (data: any) => {
          if (initialData) await api.updateProduct(initialData.id, data);
          else await api.createProduct(data);
          fetchData('merch');
        }
      };
    } else if (type === 'team') {
       config = {
        title: initialData ? 'Edit Team Member' : 'New Team Member',
        fields: [
          { name: 'name', label: 'Full Name', type: 'text', required: true },
          { name: 'position', label: 'Position / Role', type: 'text', required: true },
          { name: 'image_url', label: 'Profile Image', type: 'file', folder: 'team' }
        ],
        onSubmit: async (data: any) => {
          if (initialData) await api.updateTeamMember(initialData.id, data);
          else await api.createTeamMember(data);
          fetchData('team');
        }
      };
    } else if (type === 'partners') {
      config = {
        title: initialData ? 'Edit Partner' : 'New Partner',
        fields: [
          { name: 'name', label: 'Organization Name', type: 'text', required: true },
          { name: 'url', label: 'Website URL', type: 'url' },
          { name: 'logo_url', label: 'Partner Logo', type: 'file', folder: 'partners' }
        ],
        onSubmit: async (data: any) => {
          if (initialData) await api.updatePartner(initialData.id, data);
          else await api.createPartner(data);
          fetchData('partners');
        }
      };
    } else if (type === 'gallery') {
      config = {
        title: initialData ? 'Edit Gallery Photo' : 'Upload Gallery Photos',
        fields: [
          { name: 'title', label: 'Image Title / Caption', type: 'text', required: true },
          { name: 'image_url', label: 'Gallery Photo(s)', type: 'file', folder: 'gallery', multiple: true, required: true }
        ],
        onSubmit: async (data: any) => {
          if (initialData) {
            await api.updateGalleryItem(initialData.id, data);
          } else {
            if (Array.isArray(data.image_url)) {
              await api.createGalleryBulk({ title: data.title, image_urls: data.image_url });
            } else {
              await api.createGalleryItem(data);
            }
          }
          fetchData('gallery');
        }
      };
    } else if (type === 'documents') {
      config = {
        title: initialData ? 'Edit Document' : 'Upload Document',
        fields: [
          { name: 'title', label: 'Document Title', type: 'text', required: true },
          { name: 'file_url', label: 'Document File (PDF)', type: 'file', folder: 'documents', required: true }
        ],
        onSubmit: async (data: any) => {
          if (initialData) await api.updateDocument(initialData.id, data);
          else await api.createDocument(data);
          fetchData('documents');
        }
      };
    }

    config.initialData = initialData;
    setModalConfig(config);
    setIsModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl"
        >
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
              <Lock className="text-primary w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Command Center</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Secure Administrative Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {authError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center rounded-xl">
                {authError}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Username / ID</label>
              <input 
                type="text"
                required
                value={authForm.username}
                onChange={e => setAuthForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="REGISTRY_CORE_ADMIN"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Access Token</label>
              <input 
                type="password"
                required
                value={authForm.password}
                onChange={e => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full crimson-btn py-5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
              <span className="font-black uppercase tracking-widest text-xs">Authorize Access</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const TABS = [
    { id: 'posts', label: 'The Registry', icon: FileText },
    { id: 'events', label: 'Activations', icon: Activity },
    { id: 'merch', label: 'Merch', icon: Package },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'partners', label: 'Partners', icon: Handshake },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'documents', label: 'Documents', icon: File },
    { id: 'feedback', label: 'Intel', icon: MessageSquare },
  ];

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background selection:bg-primary selection:text-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 text-primary mb-6">
          <div className="h-px w-8 bg-primary"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Command Center</span>
          <ShieldAlert size={14} />
        </div>
        
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Admin <span className="text-primary italic">Dashboard</span>
          </h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-white/40 hover:text-red-500 rounded-2xl transition-all group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto no-scrollbar pb-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors border-b-2 whitespace-nowrap ${
                  isActive 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-white/40 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* POSTS TAB */}
            {activeTab === 'posts' && (
              <motion.div key="posts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black uppercase tracking-widest">Dispatches</h2>
                  <button onClick={() => openModal('posts')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-primary hover:text-black px-4 py-2 rounded transition-colors">
                    <Plus size={14} /> Publish New
                  </button>
                </div>
                <div className="space-y-4">
                  {posts.map(post => (
                    <div key={post.id} className="modern-card p-6 bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group">
                      <div className="w-full overflow-hidden">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-primary">{new Date(post.created_at).toLocaleDateString()}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">BY: {post.author_id.slice(0, 8)}...</div>
                          {post.category_id && (
                             <div className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded">
                               {categories.find(c => c.id === post.category_id)?.name || 'Misc'}
                             </div>
                          )}
                          <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${post.is_published ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                            {post.status.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-black uppercase tracking-tighter text-xl truncate w-full max-w-[250px] sm:max-w-lg">{post.title}</h3>
                        <div className="text-[8px] font-mono text-white/20 mt-1 uppercase tracking-widest">Slug: {post.slug}</div>
                      </div>
                      <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity w-full sm:w-auto justify-end mt-2 sm:mt-0">
                         <button 
                           onClick={() => { setPreviewPost(post); setIsPreviewOpen(true); }}
                           title="Quick Preview"
                           className="p-3 bg-primary/10 text-primary hover:bg-primary hover:text-black rounded transition-colors flex-1 sm:flex-none flex justify-center"
                         >
                           <Eye size={16} />
                         </button>
                         <button 
                           onClick={() => handleTogglePublish(post)} 
                           title={post.is_published ? "Unpublish" : "Publish Now"}
                           className={`p-3 rounded transition-colors flex-1 sm:flex-none flex justify-center ${post.is_published ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'}`}
                         >
                           {post.is_published ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                         </button>
                         <button onClick={() => openModal('posts', post)} className="p-3 bg-white/5 hover:bg-white/10 rounded transition-colors flex-1 sm:flex-none flex justify-center"><PenSquare size={16} /></button>
                         <button onClick={() => handleDelete('posts', post.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors flex-1 sm:flex-none flex justify-center"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && !isLoading && <p className="text-white/30 text-xs uppercase tracking-widest">No dispatches found.</p>}
                </div>
              </motion.div>
            )}

            {/* EVENTS TAB */}
            {activeTab === 'events' && (
              <motion.div key="events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black uppercase tracking-widest">Civic Activations</h2>
                  <button onClick={() => openModal('events')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-primary hover:text-black px-4 py-2 rounded transition-colors">
                    <Plus size={14} /> Add Event
                  </button>
                </div>
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="modern-card p-6 bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group">
                      <div className="flex-1 w-full sm:w-auto">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{event.ward} • {new Date(event.date).toLocaleDateString()}</div>
                        <h3 className="font-black uppercase tracking-tighter text-xl wrap-break-word">{event.title}</h3>
                        <p className="text-xs text-white/50 truncate max-w-[250px] sm:max-w-full">{event.location_name}</p>
                      </div>
                      <div className="flex flex-row sm:items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <div className="text-left sm:text-right border-r border-white/10 pr-6">
                           <div className="text-2xl font-black">{event.registration_count || 0}<span className="text-sm text-white/40">/{event.max_capacity}</span></div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Registered</div>
                        </div>
                        <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => openModal('events', event)} className="p-3 bg-white/5 hover:bg-white/10 rounded transition-colors"><PenSquare size={16} /></button>
                           <button onClick={() => handleDelete('events', event.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && !isLoading && <p className="text-white/30 text-xs uppercase tracking-widest">No events found.</p>}
                </div>
              </motion.div>
            )}

            {/* MERCH TAB */}
            {activeTab === 'merch' && (
              <motion.div key="merch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-black uppercase tracking-widest">Inventory</h2>
                   <button onClick={() => openModal('merch')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-primary hover:text-black px-4 py-2 rounded transition-colors">
                     <Plus size={14} /> Add Product
                   </button>
                 </div>
                 <div className="space-y-4">
                   {products.map(product => (
                     <div key={product.id} className="modern-card p-6 bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group">
                       <div className="flex items-center gap-4 w-full sm:w-auto">
                         {product.image_url ? (
                           <img src={product.image_url} alt={product.name} className="w-16 h-16 flex-shrink-0 object-cover rounded bg-white/5" />
                         ) : (
                           <div className="w-16 h-16 flex-shrink-0 bg-white/5 rounded flex items-center justify-center"><Package size={20} className="text-white/20" /></div>
                         )}
                         <div className="overflow-hidden">
                           <h3 className="font-black uppercase tracking-tighter text-lg truncate w-full max-w-[200px]">{product.name}</h3>
                           <div className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">KSH {product.price}</div>
                           <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">STOCK: {product.stock_quantity}</div>
                         </div>
                       </div>
                       <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity w-full sm:w-auto justify-end mt-2 sm:mt-0">
                          <button onClick={() => openModal('merch', product)} className="p-3 bg-white/5 hover:bg-white/10 rounded transition-colors flex-1 sm:flex-none flex justify-center"><PenSquare size={16} /></button>
                          <button onClick={() => handleDelete('merch', product.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors flex-1 sm:flex-none flex justify-center"><Trash2 size={16} /></button>
                       </div>
                     </div>
                   ))}
                   {products.length === 0 && !isLoading && <p className="text-white/30 text-xs uppercase tracking-widest">No products found.</p>}
                 </div>
              </motion.div>
            )}

            {/* TEAM TAB */}
            {activeTab === 'team' && (
              <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-black uppercase tracking-widest">Team Members</h2>
                   <button onClick={() => openModal('team')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-primary hover:text-black px-4 py-2 rounded transition-colors">
                     <Plus size={14} /> Add Member
                   </button>
                 </div>
                 <div className="space-y-4">
                   {team.map(member => (
                     <div key={member.id} className="modern-card p-6 bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group">
                       <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                         <div className="w-12 h-12 bg-white/10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                           {member.image_url ? <img src={member.image_url.includes('http') ? member.image_url : `/${member.image_url}`} alt={member.name} className="object-cover w-full h-full" /> : <Users size={20} className="text-white/50" />}
                         </div>
                         <div className="overflow-hidden">
                           <h3 className="font-black uppercase tracking-tighter truncate w-full max-w-[200px]">{member.name}</h3>
                           <div className="text-[10px] font-bold uppercase tracking-widest text-primary truncate w-full max-w-[200px]">{member.position}</div>
                         </div>
                       </div>
                       <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity w-full sm:w-auto justify-end mt-2 sm:mt-0">
                          <button onClick={() => openModal('team', member)} className="p-3 bg-white/5 hover:bg-white/10 rounded transition-colors flex-1 sm:flex-none flex justify-center"><PenSquare size={16} /></button>
                          <button onClick={() => handleDelete('team', member.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors flex-1 sm:flex-none flex justify-center"><Trash2 size={16} /></button>
                       </div>
                     </div>
                   ))}
                   {team.length === 0 && !isLoading && <p className="text-white/30 text-xs uppercase tracking-widest">No team members found.</p>}
                 </div>
              </motion.div>
            )}

            {/* PARTNERS TAB */}
            {activeTab === 'partners' && (
              <motion.div key="partners" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-black uppercase tracking-widest">Partners</h2>
                   <button onClick={() => openModal('partners')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-primary hover:text-black px-4 py-2 rounded transition-colors">
                     <Plus size={14} /> Add Partner
                   </button>
                 </div>
                 <div className="space-y-4">
                   {partners.map(partner => (
                     <div key={partner.id} className="modern-card p-6 bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group">
                       <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto overflow-hidden">
                         <div className="w-16 h-12 bg-white/10 flex-shrink-0 rounded flex items-center justify-center p-2">
                            {partner.logo_url ? <img src={partner.logo_url} alt={partner.name} className="max-h-full max-w-full" /> : <Handshake size={20} />}
                         </div>
                         <div className="overflow-hidden">
                           <h3 className="font-black uppercase tracking-tighter truncate w-full max-w-[200px]">{partner.name}</h3>
                           <div className="wrap-break-word text-white/40 group-hover:text-white/60 transition-colors text-[10px] font-bold">{partner.url}</div>
                         </div>
                       </div>
                       <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity w-full sm:w-auto justify-end mt-2 sm:mt-0">
                          <button onClick={() => openModal('partners', partner)} className="p-3 bg-white/5 hover:bg-white/10 rounded transition-colors flex-1 sm:flex-none flex justify-center"><PenSquare size={16} /></button>
                          <button onClick={() => handleDelete('partners', partner.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors flex-1 sm:flex-none flex justify-center"><Trash2 size={16} /></button>
                       </div>
                     </div>
                   ))}
                   {partners.length === 0 && !isLoading && <p className="text-white/30 text-xs uppercase tracking-widest">No partners found.</p>}
                 </div>
              </motion.div>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <motion.div key="gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-black uppercase tracking-widest">Gallery Media</h2>
                   <button onClick={() => openModal('gallery')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-primary hover:text-black px-4 py-2 rounded transition-colors">
                     <Plus size={14} /> Add Photo
                   </button>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {gallery.map(item => (
                     <div key={item.id} className="relative group rounded-xl overflow-hidden aspect-square border border-white/10">
                        {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                           <h3 className="font-black uppercase tracking-widest text-lg mb-4">{item.title}</h3>
                           <div className="flex gap-2">
                              <button onClick={() => openModal('gallery', item)} className="p-3 bg-white/5 hover:bg-white/10 rounded transition-colors"><PenSquare size={16} /></button>
                              <button onClick={() => handleDelete('gallery', item.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"><Trash2 size={16} /></button>
                           </div>
                        </div>
                     </div>
                   ))}
                   {gallery.length === 0 && !isLoading && <p className="text-white/30 text-xs uppercase tracking-widest col-span-full">No gallery photos found.</p>}
                 </div>
              </motion.div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === 'documents' && (
              <motion.div key="documents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-black uppercase tracking-widest">Public Documents</h2>
                   <button onClick={() => openModal('documents')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-primary hover:text-black px-4 py-2 rounded transition-colors">
                     <Plus size={14} /> Upload Document
                   </button>
                 </div>
                 <div className="space-y-4">
                   {documents.map(doc => (
                     <div key={doc.id} className="modern-card p-6 bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group">
                       <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                         <div className="w-12 h-12 bg-white/10 flex-shrink-0 rounded flex items-center justify-center">
                           <File size={20} className="text-red-500" />
                         </div>
                         <div className="overflow-hidden">
                           <h3 className="font-black uppercase tracking-tighter text-lg truncate w-full max-w-[200px]">{doc.title}</h3>
                           <div className="text-[10px] font-bold text-white/50 mt-1">{new Date(doc.created_at).toLocaleDateString()}</div>
                         </div>
                       </div>
                       <div className="flex items-center justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-bold text-primary hover:underline">View PDF</a>
                          <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                             <button onClick={() => openModal('documents', doc)} className="p-3 bg-white/5 hover:bg-white/10 rounded transition-colors flex-1 sm:flex-none flex justify-center"><PenSquare size={16} /></button>
                             <button onClick={() => handleDelete('documents', doc.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors flex-1 sm:flex-none flex justify-center"><Trash2 size={16} /></button>
                          </div>
                       </div>
                     </div>
                   ))}
                   {documents.length === 0 && !isLoading && <p className="text-white/30 text-xs uppercase tracking-widest">No documents uploaded.</p>}
                 </div>
              </motion.div>
            )}

            {/* FEEDBACK TAB */}
            {activeTab === 'feedback' && (
              <motion.div key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-6 flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-widest mb-2">Ground Intel</h2>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Showing feedback for latest event: <span className="text-white">{events[0]?.title || 'None'}</span></p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {feedbacks.map(fb => (
                     <div key={fb.id} className="modern-card p-6 bg-white/5 border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-[10px] font-mono text-white/30">User: {fb.user_id.slice(0, 8)}</div>
                          <div className="flex gap-1 text-primary">
                             {Array.from({ length: fb.rating }).map((_, i) => <span key={i}>★</span>)}
                             {Array.from({ length: 5 - fb.rating }).map((_, i) => <span key={i} className="text-white/10">★</span>)}
                          </div>
                        </div>
                        <p className="text-sm font-bold tracking-tight text-white/80">"{fb.comment || 'No comment provided'}"</p>
                     </div>
                   ))}
                   {feedbacks.length === 0 && !isLoading && <p className="text-white/30 text-xs uppercase tracking-widest">No intel acquired for this event.</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <CMSFormModal 
        key={modalConfig.initialData?.id || (isModalOpen ? 'new' : 'closed')}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalConfig.title}
        fields={modalConfig.fields}
        initialData={modalConfig.initialData}
        onSubmit={modalConfig.onSubmit}
      />

      <AnimatePresence>
        {isPreviewOpen && previewPost && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-md"
              onClick={() => setIsPreviewOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-5xl h-[90vh] bg-background border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Preview Toolbar */}
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Eye size={14} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-white">Live Preview Mode</h2>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Draft ID: {previewPost.id.slice(0, 8)}</p>
                  </div>
                </div>
                <button onClick={() => setIsPreviewOpen(false)} className="crimson-btn px-6 py-2 text-[10px] uppercase font-black tracking-widest">
                  Exit Preview
                </button>
              </div>

              {/* Scrollable Render Area (Mimicking app/blog/[slug]/page.tsx) */}
              <div className="flex-1 overflow-y-auto no-scrollbar pt-20 pb-40 px-8 md:px-20">
                <div className="max-w-4xl mx-auto">
                   <header className="mb-20">
                      <div className="relative aspect-21/9 rounded-3xl overflow-hidden mb-12 border border-white/10 bg-white/5">
                        {previewPost.image_url && <img src={previewPost.image_url} className="object-cover w-full h-full opacity-60" />}
                        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
                      </div>

                      <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-10 leading-[0.9]">
                        {previewPost.title}
                      </h1>

                      <div className="flex flex-wrap items-center justify-between gap-6 border-y border-white/5 py-8">
                        <div className="flex items-center gap-10">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserIcon size={14} className="text-primary" />
                            </div>
                            <div>
                               <div className="text-[8px] font-black text-white/30 uppercase tracking-widest">Author ID</div>
                               <div className="text-[10px] font-bold uppercase">{previewPost.author_id.slice(0, 8)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Calendar size={14} className="text-primary" />
                            </div>
                            <div>
                               <div className="text-[8px] font-black text-white/30 uppercase tracking-widest">Logged On</div>
                               <div className="text-[10px] font-bold uppercase">{new Date(previewPost.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                           <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30">
                              <Share2 size={16} />
                           </button>
                           <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30">
                              <Bookmark size={16} />
                           </button>
                        </div>
                      </div>
                   </header>

                   <article className="prose prose-invert prose-p:text-white/70 prose-p:leading-relaxed prose-p:text-xl prose-p:font-medium prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase max-w-none">
                      {previewPost.content.split('\n').map((paragraph, i) => (
                        paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
                      ))}
                   </article>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
