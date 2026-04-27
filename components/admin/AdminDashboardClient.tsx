'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Activity, Package, MessageSquare, ShieldAlert, Plus, Save, RefreshCw, PenSquare, Trash2, Users, Handshake, FileText, Image, File, LogOut, Loader2, Lock, CheckCircle2, XCircle, Eye, Calendar, User as UserIcon, Share2, Bookmark, GripVertical, Award, ShieldCheck } from 'lucide-react';
import { api, Event, Product, Feedback, Post, TeamMember, Partner, GalleryItem, DocumentItem, Category, teamUtils, certUtils, Certificate, EventRegistration } from '@/lib/api';
import CMSFormModal, { FormField } from './CMSFormModal'; 
import html2canvas from 'html2canvas';
import { useRef } from 'react';

type Tab = 'events' | 'merch' | 'posts' | 'team' | 'partners' | 'feedback' | 'gallery' | 'documents' | 'credentials' | 'users';

export default function AdminDashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
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
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedRegIds, setSelectedRegIds] = useState<Set<number>>(new Set());
  const [issuedRecent, setIssuedRecent] = useState<Certificate[]>([]);
  const [isIssuing, setIsIssuing] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{ total: number, current: number, status: string } | null>(null);
  const hiddenCertRef = useRef<HTMLDivElement>(null);
  const [activeSnapshotData, setActiveSnapshotData] = useState<Certificate | null>(null);
  
  // Reorder State
  const [isOrderDirty, setIsOrderDirty] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{title: string, fields: FormField[], initialData?: any, onSubmit: (data: any) => Promise<void>}>({
    title: '', fields: [], onSubmit: async () => {} 
  });
  
  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('var3738_token');
      if (token) {
        try {
          const user = await api.getMe();
          if (user.role === 'admin') {
            setIsAuthenticated(true);
            setIsAdmin(true);
            fetchData(activeTab);
          } else {
            setIsAdmin(false);
            // Non-admin users are redirected
            router.push('/');
          }
        } catch (err) {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    verifyAdmin();
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
      else if (tab === 'credentials') {
        const [certs, eventsData] = await Promise.all([
          api.getCertificates(),
          api.getEvents()
        ]);
        setCertificates(certs);
        setEvents(eventsData);
        setRegistrations([]);
        setSelectedEventId(null);
      }
      else if (tab === 'feedback') {
        const eventsData = await api.getEvents();
        setEvents(eventsData);
        if (eventsData.length > 0) setFeedbacks(await api.getFeedback(eventsData[0].id));
      }
      else if (tab === 'users') {
        setUsers(await api.getUsers());
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
      else if (type === 'users') await api.deleteUser(id as any);
      fetchData(activeTab);
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleSaveTeamOrder = async () => {
    setIsSavingOrder(true);
    try {
      // Loop through sequentially to avoid race conditions or API overload
      for (let i = 0; i < team.length; i++) {
        const member = team[i];
        const taggedPos = teamUtils.tagPosition(member.position, i);
        
        // Send the FULL member object instead of just position
        // This avoids validation errors if the backend doesn't support PATCH-style PUT
        await api.updateTeamMember(member.id, {
          ...member,
          position: taggedPos
        });
      }
      
      setIsOrderDirty(false);
      alert('Team alignment updated and persisted.');
      fetchData('team');
    } catch (err: any) {
      console.error('Failed to save team order:', err);
      // Show actual error if available
      alert(`Failed to save team order: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSavingOrder(false);
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
          { name: 'image_url', label: 'Feature Image', type: 'file', folder: 'blog' },
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
          { 
            name: 'position', 
            label: 'Position / Role', 
            type: 'text', 
            required: true,
            // Clean the position value for editing
            value: initialData ? teamUtils.cleanPosition(initialData.position) : '' 
          },
          { name: 'image_url', label: 'Profile Image', type: 'file', folder: 'team' }
        ],
        onSubmit: async (data: any) => {
          // If we are creating/editing, we should probably keep the existing rank if editing
          // or just save the clean position (it will be re-ranked on next "Save Order")
          if (initialData) {
            // Keep existing rank tag if it exists
            const rank = teamUtils.getRank(initialData.position);
            if (rank !== 9999) data.position = teamUtils.tagPosition(data.position, rank);
            await api.updateTeamMember(initialData.id, data);
          }
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
    } else if (type === 'users') {
      config = {
        title: 'Modify Citizen Profile',
        fields: [
          { name: 'full_name', label: 'Full Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'text', required: true },
          { name: 'role', label: 'Role', type: 'select', options: [
            { label: 'Guest', value: 'guest' },
            { label: 'Activated Youth', value: 'activated_youth' },
            { label: 'Youth Champion', value: 'youth_champion' },
            { label: 'Content Creator', value: 'content_creator' },
            { label: 'Admin', value: 'admin' }
          ]},
          { name: 'county', label: 'County', type: 'text' },
          { name: 'is_active', label: 'Account Active', type: 'checkbox' }
        ],
        onSubmit: async (data: any) => {
          await api.updateUser(initialData.id, data);
          fetchData('users');
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
    { id: 'credentials', label: 'Awards', icon: Award },
    { id: 'users', label: 'Citizens', icon: Users },
  ];

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-20 bg-background selection:bg-primary selection:text-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 text-primary mb-6">
          <div className="h-px w-8 bg-primary"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Command Center</span>
          <ShieldAlert size={14} />
        </div>
        
        <div className="flex items-center justify-between mb-8 md:mb-12 gap-4">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Admin <span className="text-primary italic">Dashboard</span>
          </h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 md:px-6 py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-white/40 hover:text-red-500 rounded-2xl transition-all group flex-shrink-0"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto no-scrollbar pb-px">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-1.5 px-3 sm:px-5 py-3.5 text-[9px] font-black uppercase tracking-[0.15em] transition-colors border-b-2 whitespace-nowrap ${
                  isActive 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-white/40 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon size={12} /> <span className="hidden sm:inline">{tab.label}</span>
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
                          <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">BY: {post.author_name || (post.author_id ? `${post.author_id.slice(0, 8)}...` : 'ADMIN')}</div>
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
                   <div className="flex items-center gap-4">
                     <h2 className="text-xl font-black uppercase tracking-widest">Team Members</h2>
                     {isOrderDirty && (
                       <motion.button 
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         onClick={handleSaveTeamOrder}
                         className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest bg-primary text-black px-3 py-1.5 rounded-full hover:scale-105 transition-transform"
                       >
                         {isSavingOrder ? <RefreshCw className="animate-spin" size={10} /> : <Save size={10} />}
                         Save Alignment
                       </motion.button>
                     )}
                   </div>
                   <button onClick={() => openModal('team')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-primary hover:text-black px-4 py-2 rounded transition-colors">
                     <Plus size={14} /> Add Member
                   </button>
                 </div>

                 <Reorder.Group axis="y" values={team} onReorder={(newOrder) => { setTeam(newOrder); setIsOrderDirty(true); }} className="space-y-4">
                   {team.map(member => (
                     <Reorder.Item key={member.id} value={member} className="modern-card p-6 bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group cursor-default">
                       <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                         <div className="text-white/20 hover:text-primary cursor-grab active:cursor-grabbing p-1">
                           <GripVertical size={20} />
                         </div>
                         <div className="w-12 h-12 bg-white/10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                           {member.image_url ? <img src={member.image_url.includes('http') ? member.image_url : `/${member.image_url}`} alt={member.name} className="object-cover w-full h-full" /> : <Users size={20} className="text-white/50" />}
                         </div>
                         <div className="overflow-hidden">
                           <h3 className="font-black uppercase tracking-tighter truncate w-full max-w-[200px]">{member.name}</h3>
                           <div className="text-[10px] font-bold uppercase tracking-widest text-primary truncate w-full max-w-[200px]">{teamUtils.cleanPosition(member.position)}</div>
                         </div>
                       </div>
                       <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity w-full sm:w-auto justify-end mt-2 sm:mt-0">
                          <button onClick={() => openModal('team', member)} className="p-3 bg-white/5 hover:bg-white/10 rounded transition-colors flex-1 sm:flex-none flex justify-center"><PenSquare size={16} /></button>
                          <button onClick={() => handleDelete('team', member.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors flex-1 sm:flex-none flex justify-center"><Trash2 size={16} /></button>
                       </div>
                     </Reorder.Item>
                   ))}
                 </Reorder.Group>
                 
                 {team.length === 0 && !isLoading && <p className="text-white/30 text-xs uppercase tracking-widest">No team members found.</p>}
                 {team.length > 0 && (
                   <p className="mt-6 text-[8px] font-bold uppercase tracking-widest text-white/20 italic">
                     * Drag the grip icons to rearrange the leadership structure. Changes must be saved to persist.
                   </p>
                 )}
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

            {/* CREDENTIALS / AWARDS TAB */}
            {activeTab === 'credentials' && (
              <motion.div key="credentials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-10 p-8 modern-card bg-primary/10 border border-primary/20 rounded-3xl relative overflow-hidden">
                   <div className="relative z-10">
                      <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 italic text-white">Awards Authority</h2>
                      <p className="text-xs font-medium text-white/60 max-w-lg mb-6 uppercase tracking-widest leading-relaxed">
                        Manage persistent digital credentials. Select a Townhall to view registrations and issue bulk certificates.
                      </p>
                   </div>
                   <Award className="absolute -right-10 -bottom-10 w-48 h-48 text-primary opacity-10 rotate-12" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
                   {/* Event & Registration Selection */}
                   <div className="lg:col-span-2 space-y-6">
                      <div className="modern-card p-8 bg-white/5 border border-white/10">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">1. Select Townhall / Event</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {events.map(ev => (
                               <button 
                                 key={ev.id} 
                                 onClick={async () => {
                                   setSelectedEventId(ev.id);
                                   setSelectedRegIds(new Set());
                                   setIsLoading(true);
                                   setRegistrations(await api.getEventRegistrations(ev.id));
                                   setIsLoading(false);
                                 }}
                                 className={`p-4 rounded-xl border text-left transition-all ${selectedEventId === ev.id ? 'bg-primary/20 border-primary' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                               >
                                  <div className="text-[10px] font-black uppercase tracking-widest text-white">{ev.title}</div>
                                  <div className="text-[8px] font-bold uppercase tracking-widest text-white/40">{ev.date}</div>
                               </button>
                            ))}
                         </div>
                      </div>

                      {selectedEventId && (
                        <div className="modern-card p-8 bg-white/5 border border-white/10 overflow-hidden">
                           <div className="flex justify-between items-center mb-6">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">2. Eligible Participants</h3>
                              <button 
                                disabled={isIssuing || (selectedRegIds.size === 0)}
                                onClick={async () => {
                                  setIsIssuing(true);
                                  const ev = events.find(e => e.id === selectedEventId);
                                  if (!ev) return;
                                  
                                  const recipients = registrations.filter(r => selectedRegIds.has(r.id));
                                  
                                  try {
                                    const results: Certificate[] = [];
                                    const total = recipients.length;
                                    setGenerationProgress({ total, current: 0, status: 'Issuing Records...' });

                                    for (let i = 0; i < recipients.length; i++) {
                                      const reg = recipients[i];
                                      setGenerationProgress({ total, current: i + 1, status: `Issuing for ${reg.full_name}...` });

                                      const cert = await api.issueCertificate({
                                        credential_id: certUtils.generateCredentialId(),
                                        recipient_name: reg.full_name || 'Participant',
                                        recipient_email: reg.email,
                                        user_id: reg.user_id,
                                        event_id: ev.id,
                                        event_name: ev.title,
                                        issue_date: new Date().toISOString(),
                                        is_claimed: true
                                      });
                                      
                                      // 1. Trigger Snapshot Render
                                      console.log(`[CERT_GEN] Starting issuance for ${reg.full_name} (${cert.credential_id})`);
                                      setGenerationProgress({ total, current: i + 1, status: `Snapshotting ${reg.full_name}...` });
                                      setActiveSnapshotData(cert);
                                      
                                      // Wait for React to render the hidden cert
                                      console.log(`[CERT_GEN] Waiting for render...`);
                                      await new Promise(r => setTimeout(r, 1500));

                                      // 2. Capture and Upload
                                      if (hiddenCertRef.current) {
                                        console.log(`[CERT_GEN] Capturing canvas...`);
                                        try {
                                          const canvas = await html2canvas(hiddenCertRef.current, {
                                            scale: 2,
                                            useCORS: true,
                                            backgroundColor: '#000000',
                                            logging: true,
                                            onclone: (clonedDoc) => {
                                              // Disable any stylesheet containing oklch/oklab which html2canvas cannot parse
                                              const sheets = Array.from(clonedDoc.styleSheets);
                                              for (const sheet of sheets) {
                                                try {
                                                  const rules = Array.from(sheet.cssRules || []);
                                                  const text = rules.map(r => r.cssText).join(' ');
                                                  if (text.includes('oklch') || text.includes('oklab')) {
                                                    (sheet as any).disabled = true;
                                                  }
                                                } catch {
                                                  // Cross-origin sheets throw on cssRules access — skip them
                                                }
                                              }
                                            }
                                          });

                                          console.log(`[CERT_GEN] Canvas captured. Converting to blob...`);
                                          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 0.95));
                                          
                                          if (blob) {
                                            console.log(`[CERT_GEN] Blob ready (${blob.size} bytes). Uploading to Cloudinary...`);
                                            const file = new window.File([blob], `Certificate_${cert.credential_id}.png`, { type: 'image/png' });
                                            const formData = new FormData();
                                            formData.append('file', file);
                                            formData.append('folder', 'certificates');

                                            const uploadRes = await fetch('/api/upload', {
                                              method: 'POST',
                                              body: formData
                                            });
                                            const uploadData = await uploadRes.json();
                                            
                                            if (uploadRes.ok && uploadData.url) {
                                              console.log(`[CERT_GEN] Upload SUCCESS: ${uploadData.url}`);
                                              // 3. Link back to DB
                                              console.log(`[CERT_GEN] Patching database record...`);
                                              await api.updateCertificate(cert.id, {
                                                file_url: uploadData.url
                                              });
                                              cert.file_url = uploadData.url;
                                              console.log(`[CERT_GEN] Database linked successfully.`);
                                            } else {
                                              console.error(`[CERT_GEN] Upload FAILED:`, uploadData);
                                            }
                                          } else {
                                            console.error(`[CERT_GEN] Failed to create blob from canvas.`);
                                          }
                                        } catch (snapErr) {
                                          console.error('[CERT_GEN] Snapshot logic error:', snapErr);
                                        }
                                      } else {
                                        console.error(`[CERT_GEN] hiddenCertRef.current is NULL. Capture impossible.`);
                                      }

                                      // Also register as a formal "Document" (CMS Registry)
                                      try {
                                        await api.createDocument({
                                          title: `CERTIFICATE: ${reg.full_name} (${cert.credential_id})`,
                                          file_url: cert.file_url || `${window.location.origin}/certificate?id=${cert.credential_id}`
                                        });
                                      } catch (docErr) {
                                        console.error('Failed to register certificate as document:', docErr);
                                      }

                                      results.push(cert);
                                    }
                                    setIssuedRecent(results);
                                    setSelectedRegIds(new Set());
                                    setGenerationProgress(null);
                                    setActiveSnapshotData(null);
                                    setCertificates(await api.getCertificates());
                                  } catch (e: any) {
                                    alert(`Awarding process encountered an error: ${e.message || 'Unknown error'}`);
                                    setGenerationProgress(null);
                                  } finally {
                                    setIsIssuing(false);
                                  }
                                }}
                                className="px-6 py-2 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform disabled:opacity-50"
                              >
                                 {isIssuing ? 'Processing...' : `Issue to ${selectedRegIds.size} Selected`}
                              </button>
                           </div>

                           <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                 <thead>
                                    <tr className="border-b border-white/10 text-left">
                                       <th className="py-4 w-10">
                                          <input 
                                            type="checkbox" 
                                            checked={registrations.length > 0 && selectedRegIds.size === registrations.length}
                                            onChange={() => {
                                               if (selectedRegIds.size === registrations.length) {
                                                  setSelectedRegIds(new Set());
                                               } else {
                                                  setSelectedRegIds(new Set(registrations.map(r => r.id)));
                                               }
                                            }}
                                            className="w-4 h-4 bg-white/5 border-white/10 rounded"
                                          />
                                       </th>
                                       <th className="py-4 text-[8px] font-black uppercase tracking-widest text-white/40">Participant</th>
                                       <th className="py-4 text-[8px] font-black uppercase tracking-widest text-white/40">Email</th>
                                       <th className="py-4 text-[8px] font-black uppercase tracking-widest text-white/40">County</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {registrations.map(reg => (
                                       <tr key={reg.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                          <td className="py-4">
                                             <input 
                                               type="checkbox" 
                                               checked={selectedRegIds.has(reg.id)}
                                               onChange={() => {
                                                  const newSelection = new Set(selectedRegIds);
                                                  if (newSelection.has(reg.id)) newSelection.delete(reg.id);
                                                  else newSelection.add(reg.id);
                                                  setSelectedRegIds(newSelection);
                                               }}
                                               className="w-4 h-4 bg-white/5 border-white/10 rounded"
                                             />
                                          </td>
                                          <td className="py-4 text-[10px] font-bold text-white uppercase tracking-widest">{reg.full_name || 'Unnamed Participant'}</td>
                                          <td className="py-4 text-[9px] font-medium text-white/40">{reg.email}</td>
                                          <td className="py-4 text-[8px] font-black text-primary uppercase tracking-widest">{reg.county || 'N/A'}</td>
                                       </tr>
                                    ))}
                                    {registrations.length === 0 && (
                                      <tr>
                                         <td colSpan={3} className="py-10 text-center text-[10px] font-bold uppercase tracking-widest text-white/20 italic">
                                            No registrations found for this event.
                                         </td>
                                      </tr>
                                    )}
                                 </tbody>
                               </table>
                           </div>
                        </div>
                      )}

                      {/* Automation Generation Progress */}
                      {generationProgress && (
                        <div className="modern-card p-6 bg-primary/5 border border-primary/20 mb-6 overflow-hidden relative">
                           <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Activity size={20} className="animate-spin" />
                                 </div>
                                 <div className="text-left">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">Automated Generation Engine</div>
                                    <div className="text-[12px] font-black uppercase tracking-tight text-white">{generationProgress.status}</div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-xl font-black italic text-primary">{Math.round((generationProgress.current / generationProgress.total) * 100)}%</div>
                                 <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">{generationProgress.current} / {generationProgress.total} Complete</div>
                              </div>
                           </div>
                           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                                transition={{ duration: 0.5 }}
                              />
                           </div>
                        </div>
                      )}

                      {/* Batch Issuance Results */}
                      <AnimatePresence>
                        {issuedRecent.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="modern-card p-8 bg-green-500/5 border border-green-500/20"
                          >
                             <div className="flex justify-between items-center mb-6">
                                <div>
                                   <div className="text-[8px] font-black uppercase tracking-widest text-green-500 mb-1">Batch Complete</div>
                                   <h3 className="text-xl font-black uppercase tracking-tighter italic text-white">{issuedRecent.length} Credentials Generated</h3>
                                </div>
                                <button 
                                  onClick={() => setIssuedRecent([])}
                                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/30"
                                >
                                   <XCircle size={16} />
                                </button>
                             </div>

                             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {issuedRecent.map(cert => (
                                   <div key={cert.id} className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between group">
                                      <div className="flex items-center gap-4">
                                         <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 text-sm">
                                            {cert.file_url ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
                                         </div>
                                         <div className="text-left">
                                            <div className="text-[10px] font-black uppercase tracking-tight text-white">{cert.recipient_name}</div>
                                            <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">{cert.credential_id}</div>
                                         </div>
                                      </div>
                                      <div className="flex gap-2">
                                         <button 
                                           onClick={() => window.open(cert.file_url || `/certificate?id=${cert.credential_id}`, '_blank')}
                                           className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all text-white/60 hover:text-white"
                                           title="View Official Certificate"
                                         >
                                            <Eye size={14} />
                                         </button>
                                         <button 
                                           onClick={() => {
                                             navigator.clipboard.writeText(cert.file_url || `${window.location.origin}/certificate?id=${cert.credential_id}`);
                                             alert('Link copied to clipboard!');
                                           }}
                                           className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all text-white/60 hover:text-white"
                                           title="Copy Public Link"
                                         >
                                            <Share2 size={14} />
                                         </button>
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Hidden Snapshot Component */}
                      {activeSnapshotData && (
                        <div className="fixed -left-[2000px] top-0 no-print" style={{ pointerEvents: 'none' }}>
                           <div 
                              ref={hiddenCertRef}
                              className="w-[1000px] aspect-[1/1.414] p-20 flex flex-col items-center justify-center text-center relative"
                              style={{ 
                                backgroundImage: 'radial-gradient(circle at center, #111111 0%, #000000 100%)',
                                border: '1px solid rgba(208, 23, 29, 0.4)'
                              }}
                           >
                               {/* Re-implementing simplified certificate layout for snapshotting */}
                               <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
                               
                               <div className="mb-12">
                                  <div className="w-16 h-16 rounded-2xl rotate-45 flex items-center justify-center mb-6 mx-auto" style={{ backgroundColor: '#d0171d' }}>
                                     <Award size={32} className="-rotate-45" style={{ color: '#000000' }} strokeWidth={3} />
                                  </div>
                                  <div className="text-[12px] font-black uppercase tracking-[0.4em]" style={{ color: '#d0171d' }}>Voice of a Generation</div>
                                  <div className="text-4xl font-black uppercase tracking-tighter mt-1">VAR 37/38</div>
                               </div>

                               <div className="mb-12">
                                  <div className="text-[10px] font-black uppercase tracking-[0.5em] mb-4" style={{ color: '#d0171d' }}>Official Accreditation</div>
                                  <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-tight">Certificate of<br/>Participation</h1>
                               </div>

                               <div className="flex-1 flex flex-col justify-center items-center">
                                  <div className="text-[12px] font-medium text-white/40 uppercase tracking-widest mb-6">This is to certify that</div>
                                  <div className="text-5xl font-black uppercase tracking-tight text-white mb-8 underline underline-offset-[12px]" style={{ textDecorationColor: 'rgba(208, 23, 29, 0.3)' }}>
                                     {activeSnapshotData.recipient_name}
                                  </div>
                                  <div className="max-w-2xl text-xl font-medium text-white/60 leading-relaxed mb-8">
                                     Has successfully participated and completed the 
                                     <span className="text-white block mt-2 font-black uppercase tracking-wide">
                                        {activeSnapshotData.event_name}
                                     </span>
                                  </div>
                                  <div className="text-[12px] font-black uppercase tracking-widest" style={{ color: 'rgba(208, 23, 29, 0.6)' }}>
                                     Issued on {new Date(activeSnapshotData.issue_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                  </div>
                               </div>

                               <div className="w-full pt-12 mt-12 border-t border-white/5 flex justify-between items-center">
                                  <div className="text-left">
                                     <div className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Credential ID</div>
                                     <div className="text-xs font-mono font-bold tracking-wider px-3 py-1.5 rounded border" style={{ color: '#d0171d', backgroundColor: 'rgba(208, 23, 29, 0.05)', borderColor: 'rgba(208, 23, 29, 0.1)' }}>
                                        {activeSnapshotData.credential_id}
                                     </div>
                                  </div>
                                  <div className="flex gap-4 items-center">
                                     <ShieldCheck size={32} style={{ color: '#d0171d', opacity: 0.5 }} />
                                     <div className="text-right">
                                        <div className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Authenticity</div>
                                        <div className="text-[10px] font-black uppercase text-white">Verified Security</div>
                                     </div>
                                  </div>
                               </div>
                           </div>
                        </div>
                      )}
                   </div>

                   {/* Registry Sidebar */}
                   <div className="space-y-6">
                      <div className="modern-card p-8 bg-white/5 border border-white/10">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">Recent Records</h3>
                         <div className="space-y-3">
                            {certificates.slice(0, 10).map(cert => (
                               <div key={cert.id} className="p-4 bg-black/40 border border-white/5 rounded group flex justify-between items-center">
                                  <div>
                                     <div className="text-[9px] font-black uppercase tracking-widest text-white">{cert.recipient_name}</div>
                                     <div className="text-[7px] font-bold uppercase tracking-widest text-white/30">{cert.credential_id}</div>
                                  </div>
                                  <button 
                                    onClick={() => {
                                       const url = `${window.location.origin}/certificate?id=${cert.credential_id}`;
                                       navigator.clipboard.writeText(url);
                                       alert('Record Link Copied!');
                                    }}
                                    className="p-2 opacity-0 group-hover:opacity-100 bg-white/5 rounded hover:bg-white/10 transition-all"
                                  >
                                     <Share2 size={12} className="text-white" />
                                  </button>
                               </div>
                            ))}
                            {certificates.length === 0 && (
                               <div className="text-[8px] font-bold uppercase tracking-widest text-white/20 italic text-center py-4">No records in database.</div>
                            )}
                         </div>
                         {certificates.length > 0 && (
                           <button className="w-full mt-6 py-3 border border-white/10 rounded text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
                              View Full Registry
                           </button>
                         )}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

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
            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black uppercase tracking-widest">Citizen Registry</h2>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                    {users.length} Profiles Indexed
                  </div>
                </div>
                <div className="space-y-4">
                  {users.map(user => (
                    <div key={user.id} className="modern-card p-6 bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group">
                      <div className="flex-1 w-full sm:w-auto">
                        <div className="flex items-center gap-3 mb-1">
                          <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                            user.role === 'admin' ? 'bg-red-500/20 text-red-500' : 
                            user.role === 'content_creator' ? 'bg-blue-500/20 text-blue-500' :
                            user.role === 'youth_champion' ? 'bg-primary/20 text-primary' :
                            'bg-white/10 text-white/40'
                          }`}>
                            {user.role.replace('_', ' ')}
                          </div>
                          {!user.is_active && (
                            <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-sm">Suspended</span>
                          )}
                        </div>
                        <h3 className="font-black uppercase tracking-tighter text-xl truncate w-full max-w-[250px] sm:max-w-lg">{user.full_name}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <div className="text-[10px] font-bold text-white/30 lowercase">{user.email}</div>
                          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{user.county} • {user.ward}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity w-full sm:w-auto justify-end mt-2 sm:mt-0">
                         <button onClick={() => openModal('users', user)} className="p-3 bg-white/5 hover:bg-white/10 rounded transition-colors flex-1 sm:flex-none flex justify-center"><PenSquare size={16} /></button>
                         <button onClick={() => handleDelete('users', user.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors flex-1 sm:flex-none flex justify-center"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && !isLoading && <p className="text-white/30 text-xs uppercase tracking-widest">No citizens found.</p>}
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
                               <div className="text-[10px] font-bold uppercase">{previewPost.author_name || (previewPost.author_id ? previewPost.author_id.slice(0, 8) : 'ADMIN')}</div>
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
