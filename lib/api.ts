/**
 * VAR 37/38 API Service Layer
 * This module provides a typed interface to the FastAPI backend.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// --- Types ---

export type UserRole = 'guest' | 'activated_youth' | 'youth_champion' | 'content_creator' | 'admin';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  national_id?: string;
  county: string;
  sub_county: string;
  ward: string;
  role: UserRole;
  is_active: boolean;
}

export interface UserCreate extends Omit<User, 'id' | 'is_active' | 'role'> {
  password: string;
  role?: UserRole;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  ward: string;
  date: string;
  location_name: string;
  max_capacity: number;
  is_active: boolean;
  registration_count?: number;
}

export interface EventCreate extends Omit<Event, 'id' | 'registration_count'> {}

export interface Feedback {
  id: number;
  event_id: number;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  url: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
}

// LocalStorage Mock Helpers
const getLocalData = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const saveLocalData = <T>(key: string, data: T[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: string;
  is_published: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  is_active: boolean;
}

export interface ProductCreate extends Omit<Product, 'id'> {}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// --- Helper Functions ---

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || `API request failed with status ${response.status}`);
  }
  return response.json();
}

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('var3738_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// --- API Endpoints ---

export const api = {
  // Auth
  async login(username: string, password: string): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    });
    const data = await handleResponse<AuthResponse>(response);
    if (typeof window !== 'undefined') {
      localStorage.setItem('var3738_token', data.access_token);
    }
    return data;
  },

  async register(userData: UserCreate): Promise<User> {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse<User>(response);
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('var3738_token');
    }
  },

  // Events
  async getEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${BASE_URL}/events/`);
      const data = await handleResponse<Event[]>(response);
      return [...data, ...getLocalData<Event>('var_events_mock')];
    } catch {
      return getLocalData<Event>('var_events_mock');
    }
  },

  async getEvent(id: number | string): Promise<Event> {
    const local = getLocalData<Event>('var_events_mock').find(e => e.id.toString() === id.toString());
    if (local) return local;
    const response = await fetch(`${BASE_URL}/events/${id}`);
    return handleResponse<Event>(response);
  },

  async createEvent(event: Partial<Event>): Promise<Event> {
    const newEvent = { ...event, id: Date.now() } as Event;
    const current = getLocalData<Event>('var_events_mock');
    saveLocalData('var_events_mock', [...current, newEvent]);
    return newEvent;
  },

  async updateEvent(id: number | string, event: Partial<Event>): Promise<Event> {
    const current = getLocalData<Event>('var_events_mock');
    const index = current.findIndex(e => e.id.toString() === id.toString());
    if (index !== -1) {
      current[index] = { ...current[index], ...event };
      saveLocalData('var_events_mock', current);
      return current[index];
    }
    throw new Error('Fallback update only supports locally mocked events for now');
  },

  async deleteEvent(id: number | string): Promise<void> {
    const current = getLocalData<Event>('var_events_mock');
    saveLocalData('var_events_mock', current.filter(e => e.id.toString() !== id.toString()));
  },

  async registerForEvent(eventId: number): Promise<{ message: string }> {
    const response = await fetch(`${BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
    });
    return handleResponse<{ message: string }>(response);
  },

  // CMS (Posts)
  async getPosts(): Promise<Post[]> {
    try {
      const response = await fetch(`${BASE_URL}/cms/posts`);
      const data = await handleResponse<Post[]>(response);
      return [...data, ...getLocalData<Post>('var_posts_mock')];
    } catch {
      return getLocalData<Post>('var_posts_mock');
    }
  },

  async getPost(id: number | string): Promise<Post> {
    const local = getLocalData<Post>('var_posts_mock').find(p => p.id.toString() === id.toString());
    if (local) return local;
    const response = await fetch(`${BASE_URL}/cms/posts/${id}`);
    return handleResponse<Post>(response);
  },

  async createPost(post: Partial<Post>): Promise<Post> {
    const newPost = { ...post, id: Date.now(), author_id: post.author_id || 'admin', created_at: new Date().toISOString() } as Post;
    const current = getLocalData<Post>('var_posts_mock');
    saveLocalData('var_posts_mock', [...current, newPost]);
    return newPost;
  },

  async updatePost(id: string | number, post: Partial<Post>): Promise<Post> {
    const current = getLocalData<Post>('var_posts_mock');
    const index = current.findIndex(p => p.id.toString() === id.toString());
    if (index !== -1) {
      current[index] = { ...current[index], ...post };
      saveLocalData('var_posts_mock', current);
      return current[index];
    }
    throw new Error('Update requires backend endpoint');
  },

  async deletePost(id: string | number): Promise<void> {
    const current = getLocalData<Post>('var_posts_mock');
    saveLocalData('var_posts_mock', current.filter(p => p.id.toString() !== id.toString()));
  },

  // Merch
  async getProducts(activeOnly = true): Promise<Product[]> {
    try {
      const response = await fetch(`${BASE_URL}/merch/products?active_only=${activeOnly}`);
      const data = await handleResponse<any>(response);
      const apiData = Array.isArray(data) ? data : (data.products || []);
      return [...apiData, ...getLocalData<Product>('var_merch_mock')];
    } catch {
      return getLocalData<Product>('var_merch_mock');
    }
  },

  async getProduct(id: string): Promise<Product> {
    const local = getLocalData<Product>('var_merch_mock').find(p => p.id === id);
    if (local) return local;
    const response = await fetch(`${BASE_URL}/merch/products/${id}`);
    return handleResponse<Product>(response);
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const newProduct = { ...product, id: Date.now().toString(), stock_quantity: product.stock_quantity || 0, price: product.price || 0, is_active: true } as Product;
    const current = getLocalData<Product>('var_merch_mock');
    saveLocalData('var_merch_mock', [...current, newProduct]);
    return newProduct;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const current = getLocalData<Product>('var_merch_mock');
    const index = current.findIndex(p => p.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...product };
      saveLocalData('var_merch_mock', current);
      return current[index];
    }
    throw new Error('Update requires backend');
  },

  async deleteProduct(id: string): Promise<void> {
    const current = getLocalData<Product>('var_merch_mock');
    saveLocalData('var_merch_mock', current.filter(p => p.id !== id));
  },


  // Geo-spatial
  // Admin / Feedback / Merch endpoints
  async submitFeedback(eventId: number, rating: number, comment?: string): Promise<Feedback> {
    const response = await fetch(`${BASE_URL}/events/${eventId}/feedback`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment, event_id: eventId, user_id: 'auto' }) // user_id overridden by backend
    });
    return handleResponse<Feedback>(response);
  },

  async getFeedback(eventId: number): Promise<Feedback[]> {
    const response = await fetch(`${BASE_URL}/events/${eventId}/feedback`, {
      headers: { ...getAuthHeaders() }
    });
    return handleResponse<Feedback[]>(response);
  },

  // Team
  async getTeamMembers(): Promise<TeamMember[]> {
    const initialTeam: TeamMember[] = [
      { id: '1', name: 'Keno Manwar', position: 'Founder', image: 'KenoManwar.jpeg' },
      { id: '2', name: 'Ivy Muchoki', position: 'National Cordinator/ Co-founder', image: 'IvyMuchoki.jpeg' },
      { id: '3', name: 'Madzao Rocha', position: 'Founding youth Leader', image: 'MadzaoRocha.jpeg' },
      { id: '4', name: 'Sincere Shem', position: 'Youth Thought leader/ Host', image: 'SincereShem.jpeg' },
      { id: '5', name: 'Benjamin Mkapa', position: 'Youth Thought Advocate', image: 'BenjaminMkapa2.jpeg' },
      { id: '6', name: 'Mongare Okiro', position: 'Youth Thought Advocate', image: 'MongareOkilo.jpeg' },
      { id: '7', name: 'Joyson Joe Aliero Ayuko', position: 'County Grassroot Mobiliser', image: 'JoysonJoeAlieroAyuko.jpeg' },
    ];
    return [...initialTeam, ...getLocalData<TeamMember>('var_team_mock')];
  },

  async createTeamMember(team: Partial<TeamMember>): Promise<TeamMember> {
    const newTeam = { ...team, id: Date.now().toString() } as TeamMember;
    const current = getLocalData<TeamMember>('var_team_mock');
    saveLocalData('var_team_mock', [...current, newTeam]);
    return newTeam;
  },

  async updateTeamMember(id: string, team: Partial<TeamMember>): Promise<TeamMember> {
    const current = getLocalData<TeamMember>('var_team_mock');
    const index = current.findIndex(t => t.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...team };
      saveLocalData('var_team_mock', current);
      return current[index];
    }
    throw new Error('Item not found');
  },

  async deleteTeamMember(id: string): Promise<void> {
    const current = getLocalData<TeamMember>('var_team_mock');
    saveLocalData('var_team_mock', current.filter(t => t.id !== id));
  },

  // Partners
  async getPartners(): Promise<Partner[]> {
    const initialPartners: Partner[] = [
      { id: '1', name: 'Uamuzi Foundation', logo: '/partners/uamuzi-logo.png', url: 'https://www.uamuzi.org' },
      { id: '2', name: 'CMD Kenya', logo: '/partners/cmd-kenya.webp', url: 'https://cmd-kenya.org/' },
      { id: '3', name: 'U.S Embassy', logo: '/partners/us-embassy.webp', url: 'https://ke.usembassy.gov/' },
      { id: '4', name: 'IEBC', logo: '/partners/IEBC_Emblem-nobg.png', url: 'https://www.iebc.or.ke/' },
      { id: '5', name: 'Allan Chesang Foundation', logo: '/partners/allan-chesang-foundation-logo.png', url: 'https://acfkenya.com/' },
    ];
    return [...initialPartners, ...getLocalData<Partner>('var_partners_mock')];
  },

  async createPartner(partner: Partial<Partner>): Promise<Partner> {
    const newPartner = { ...partner, id: Date.now().toString() } as Partner;
    const current = getLocalData<Partner>('var_partners_mock');
    saveLocalData('var_partners_mock', [...current, newPartner]);
    return newPartner;
  },

  async updatePartner(id: string, partner: Partial<Partner>): Promise<Partner> {
    const current = getLocalData<Partner>('var_partners_mock');
    const index = current.findIndex(p => p.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...partner };
      saveLocalData('var_partners_mock', current);
      return current[index];
    }
    throw new Error('Item not found');
  },

  async deletePartner(id: string): Promise<void> {
    const current = getLocalData<Partner>('var_partners_mock');
    saveLocalData('var_partners_mock', current.filter(p => p.id !== id));
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    return getLocalData<GalleryItem>('var_gallery_mock');
  },

  async createGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
    const newItem = { ...item, id: Date.now().toString(), created_at: new Date().toISOString() } as GalleryItem;
    const current = getLocalData<GalleryItem>('var_gallery_mock');
    saveLocalData('var_gallery_mock', [...current, newItem]);
    return newItem;
  },

  async updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<GalleryItem> {
    const current = getLocalData<GalleryItem>('var_gallery_mock');
    const index = current.findIndex(p => p.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...item };
      saveLocalData('var_gallery_mock', current);
      return current[index];
    }
    throw new Error('Item not found');
  },

  async deleteGalleryItem(id: string): Promise<void> {
    const current = getLocalData<GalleryItem>('var_gallery_mock');
    saveLocalData('var_gallery_mock', current.filter(p => p.id !== id));
  },

  // Documents
  async getDocuments(): Promise<DocumentItem[]> {
    return getLocalData<DocumentItem>('var_documents_mock');
  },

  async createDocument(doc: Partial<DocumentItem>): Promise<DocumentItem> {
    const newDoc = { ...doc, id: Date.now().toString(), created_at: new Date().toISOString() } as DocumentItem;
    const current = getLocalData<DocumentItem>('var_documents_mock');
    saveLocalData('var_documents_mock', [...current, newDoc]);
    return newDoc;
  },

  async updateDocument(id: string, doc: Partial<DocumentItem>): Promise<DocumentItem> {
    const current = getLocalData<DocumentItem>('var_documents_mock');
    const index = current.findIndex(p => p.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...doc };
      saveLocalData('var_documents_mock', current);
      return current[index];
    }
    throw new Error('Item not found');
  },

  async deleteDocument(id: string): Promise<void> {
    const current = getLocalData<DocumentItem>('var_documents_mock');
    saveLocalData('var_documents_mock', current.filter(p => p.id !== id));
  },

  async getGeoBoundaries(adminLevel: number, parentPcode?: string): Promise<any> {
    const url = new URL(`${BASE_URL}/geo/boundaries`);
    url.searchParams.append('admin_level', adminLevel.toString());
    if (parentPcode) url.searchParams.append('parent_pcode', parentPcode);
    
    const response = await fetch(url.toString());
    return handleResponse<any>(response);
  },

  async getGeoBoundariesList(adminLevel: number, parentPcode?: string): Promise<{name: string, pcode: string}[]> {
    const url = new URL(`${BASE_URL}/geo/boundaries/list`);
    url.searchParams.append('admin_level', adminLevel.toString());
    if (parentPcode) url.searchParams.append('parent_pcode', parentPcode);

    const response = await fetch(url.toString());
    const data = await handleResponse<{count: number, boundaries: {name: string, pcode: string}[]}>(response);
    return data.boundaries;
  },

  async reverseGeocode(lat: number, lon: number): Promise<{county: {name: string, pcode: string}, sub_county: {name: string, pcode: string}, ward: {name: string, pcode: string}}> {
    const url = new URL(`${BASE_URL}/geo/reverse-geocode`);
    url.searchParams.append('lat', lat.toString());
    url.searchParams.append('lon', lon.toString());

    const response = await fetch(url.toString());
    return handleResponse<{county: {name: string, pcode: string}, sub_county: {name: string, pcode: string}, ward: {name: string, pcode: string}}>(response);
  },

  async getNearbyEvents(lat: number, lon: number, radiusKm = 50.0): Promise<{query: any, count: number, events: any[]}> {
    const url = new URL(`${BASE_URL}/geo/events/nearby`);
    url.searchParams.append('lat', lat.toString());
    url.searchParams.append('lon', lon.toString());
    url.searchParams.append('radius_km', radiusKm.toString());

    const response = await fetch(url.toString());
    return handleResponse<{query: any, count: number, events: any[]}>(response);
  }
};
