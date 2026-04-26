/**
 * VAR 37/38 API Service Layer
 * This module provides a typed interface to the FastAPI backend.
 */

const isServer = typeof window === 'undefined';
const BASE_URL = isServer 
  ? (process.env.API_URL || 'http://localhost:8000/api/v1') 
  : '/api/var3738'; // Rewritten by next.config.mjs to point to actual API_URL safely


// --- Types ---

// export type UserRole = 'guest' | 'activated_youth' | 'youth_champion' | 'content_creator' | 'admin';

// export interface User {
//   id: string;
//   full_name: string;
//   email: string;
//   phone?: string;
//   national_id?: string;
//   county: string;
//   sub_county: string;
//   ward: string;
//   role: UserRole;
//   is_active: boolean;
// }

// export interface UserCreate extends Omit<User, 'id' | 'is_active' | 'role'> {
//   password: string;
//   role?: UserRole;
// }

// export interface Event {
//   id: number;
//   title: string;
//   description: string;
//   ward: string;
//   date: string;
//   location_name: string;
//   max_capacity: number;
//   is_active: boolean;
//   registration_count?: number;
// }

// export interface EventCreate extends Omit<Event, 'id' | 'registration_count'> {}

// export interface Feedback {
//   id: number;
//   event_id: number;
//   user_id: string;
//   rating: number;
//   comment?: string;
//   created_at: string;
// }

// export interface TeamMember {
//   id: string;
//   name: string;
//   position: string;
//   image: string;
// }

// export interface Partner {
//   id: string;
//   name: string;
//   logo: string;
//   url: string;
// }

// export interface GalleryItem {
//   id: string;
//   title: string;
//   image_url: string;
//   created_at: string;
// }

// export interface DocumentItem {
//   id: string;
//   title: string;
//   file_url: string;
//   created_at: string;
// }

// export interface Post {
//   id: number;
//   title: string;
//   content: string;
//   author_id: string;
//   is_published: boolean;
//   created_at: string;
// }

// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   stock_quantity: number;
//   image_url?: string;
//   is_active: boolean;
// }

/**
 * VAR 37/38 API Service Layer - Corrected Types
 */

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
  user_full_name?: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image_url: string; // ✅ Corrected from 'image'
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string; // ✅ Corrected from 'logo'
  url: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string; // ✅ Correct
  created_at: string;
}

// Used for bulk creation
export interface GalleryBulkCreate {
  title: string;
  image_urls: string[]; // ✅ Correct
}

export interface DocumentItem {
  id: string;
  title: string;
  file_url: string; // ✅ Correct 
  created_at: string;
}

export interface Certificate {
  id: string; 
  credential_id: string; // VAR-YYYY-XXXX
  recipient_name: string;
  recipient_email?: string;
  user_id?: string;
  event_id: number | string;
  event_name: string;
  issue_date: string;
  is_claimed: boolean;
  metadata?: any;
}

export interface EventRegistration {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  county?: string;
  is_verified?: boolean;
}

export interface Post {
  id: string; // UUID
  title: string;
  slug: string; // Used for URLs
  summary?: string; 
  content: string; // Markdown supported
  author_id: string;
  author_name?: string;
  category_id?: string;
  status: 'draft' | 'published' | 'archived';
  is_published: boolean;
  image_url?: string; // Cloudinary URL
  seo_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id?: string; // Null for guest comments
  parent_id?: string; // Links to another comment if it's a reply
  content: string;
  is_approved: boolean;
  created_at: string;
  replies?: Comment[]; // Threaded structure
}

export interface PostCreate extends Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>> {
  title: string;
  content: string;
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
export const teamUtils = {
  /**
   * Extracts the real position from a tagged string (e.g., "CEO [RANK:0]" -> "CEO")
   */
  cleanPosition(position: string): string {
    if (!position) return '';
    return position.replace(/\s*\[RANK:\d+\]\s*/g, '').trim();
  },

  /**
   * Appends a rank tag to a position string
   */
  tagPosition(position: string, rank: number): string {
    const clean = this.cleanPosition(position);
    return `${clean} [RANK:${rank}]`;
  },

  /**
   * Extracts the rank integer from a position string
   */
  getRank(position: string): number {
    const match = position?.match(/\[RANK:(\d+)\]/);
    return match ? parseInt(match[1], 10) : 9999;
  },

  /**
   * Sorts team members based on their [RANK:X] tags
   */
  sortMembers(members: TeamMember[]): TeamMember[] {
    return [...members].sort((a, b) => this.getRank(a.position) - this.getRank(b.position));
  }
};

export const certUtils = {
  /**
   * Generates a signed token for a participant
   */
  generateToken(name: string, event: string, date: string): string {
    const data = JSON.stringify({ name, event, date });
    const encodedData = btoa(encodeURIComponent(data));
    // Simple signature using a secret "VAR_DEMOCRACY_ACT_2026"
    // In a real app, this would use a proper HMAC-SHA256 from the environment
    const signature = Array.from(encodedData).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `${encodedData}.${signature}`;
  },

  /**
   * Verifies and decodes a token
   */
  verifyToken(token: string): { name: string, event: string, date: string } | null {
    try {
      const [encodedData, signature] = token.split('.');
      if (!encodedData || !signature) return null;

      const expectedSignature = Array.from(encodedData).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      if (parseInt(signature, 10) !== expectedSignature) return null;

      const data = decodeURIComponent(atob(encodedData));
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  },

  /**
   * Generates a unique, readable Credential ID (VAR-YYYY-XXXX)
   */
  generateCredentialId(year: string | number = new Date().getFullYear()): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No O, 0, I, 1 for legibility
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `VAR-${year}-${result}`;
  }
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    let message = `API request failed with status ${response.status}`;
    
    if (errorData.detail) {
      if (Array.isArray(errorData.detail)) {
        // Handle FastAPI validation errors (list of objects)
        message = errorData.detail.map((err: any) => {
          const loc = err.loc ? err.loc.join('.') : '';
          return loc ? `${loc}: ${err.msg}` : err.msg;
        }).join(', ');
      } else {
        message = errorData.detail;
      }
    }
    
    throw new Error(message);
  }
  return response.json();
}

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('var3738_token');
  return token ? { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
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

  async getMe(): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: getAuthHeaders(),
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
    const response = await fetch(`${BASE_URL}/events/`);
    const data = await handleResponse<any>(response);
    return Array.isArray(data) ? data : (data.events || data.items || []);
  },

  async getEvent(id: number | string): Promise<Event> {
    const response = await fetch(`${BASE_URL}/events/${id}`);
    return handleResponse<Event>(response);
  },

  async createEvent(event: Partial<Event>): Promise<Event> {
    const response = await fetch(`${BASE_URL}/events/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(event)
    });

    console.log("response: ", getAuthHeaders());
    
    return handleResponse<Event>(response);
  },

  async updateEvent(id: number | string, event: Partial<Event>): Promise<Event> {
    const response = await fetch(`${BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(event)
    });
    return handleResponse<Event>(response);
  },

  async deleteEvent(id: number | string): Promise<void> {
    await fetch(`${BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  async registerForEvent(eventId: number, userId: string): Promise<void> {
    await fetch(`${BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ user_id: userId })
    });
  },

  // Feedback (Ground Intel)
  async getFeedback(eventId: number): Promise<Feedback[]> {
    const response = await fetch(`${BASE_URL}/events/${eventId}/feedback`);
    return handleResponse<Feedback[]>(response);
  },

  async getLatestFeedback(limit: number = 10): Promise<Feedback[]> {
    const response = await fetch(`${BASE_URL}/events/feedback/latest?limit=${limit}`);
    return handleResponse<Feedback[]>(response);
  },

  async submitFeedback(eventId: number, rating: number, comment?: string): Promise<Feedback> {
    const response = await fetch(`${BASE_URL}/events/${eventId}/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating, comment })
    });
    return handleResponse<Feedback>(response);
  },

  // Store / Merch
  async getProducts(includeInactive = false): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/merch/products`);
    const data = await handleResponse<any>(response);
    let items = Array.isArray(data) ? data : (data.products || data.items || []);
    if (!includeInactive) items = items.filter((p: any) => p.is_active !== false);
    return items;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${BASE_URL}/merch/products/${id}`);
    return handleResponse<Product>(response);
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const response = await fetch(`${BASE_URL}/merch/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    return handleResponse<Product>(response);
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const response = await fetch(`${BASE_URL}/merch/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    return handleResponse<Product>(response);
  },

  async deleteProduct(id: string): Promise<void> {
    await fetch(`${BASE_URL}/merch/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Posts / CMS V2
  async getPosts(params?: { 
    status?: 'published' | 'draft' | 'archived', 
    category_id?: string, 
    tag_id?: string 
  }): Promise<Post[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.category_id) query.append('category_id', params.category_id);
    if (params?.tag_id) query.append('tag_id', params.tag_id);

    const response = await fetch(`${BASE_URL}/cms/posts?${query.toString()}`);
    const data = await handleResponse<any>(response);
    return Array.isArray(data) ? data : (data.posts || data.items || []);
  },

  async getPost(id: string): Promise<Post> {
    const response = await fetch(`${BASE_URL}/cms/posts/${id}`);
    return handleResponse<Post>(response);
  },

  async getPostBySlug(slug: string): Promise<Post> {
    const response = await fetch(`${BASE_URL}/cms/posts/slug/${slug}`);
    return handleResponse<Post>(response);
  },

  async searchPosts(q: string): Promise<Post[]> {
    const response = await fetch(`${BASE_URL}/cms/posts/search?q=${encodeURIComponent(q)}`);
    const data = await handleResponse<any>(response);
    return Array.isArray(data) ? data : (data.posts || data.items || []);
  },

  async createPost(post: PostCreate): Promise<Post> {
    const response = await fetch(`${BASE_URL}/cms/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(post)
    });
    return handleResponse<Post>(response);
  },

  async updatePost(id: string, post: Partial<PostCreate>): Promise<Post> {
    const response = await fetch(`${BASE_URL}/cms/posts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(post)
    });
    return handleResponse<Post>(response);
  },

  async deletePost(id: string): Promise<void> {
    await fetch(`${BASE_URL}/cms/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Taxonomy
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${BASE_URL}/cms/categories`);
    const data = await handleResponse<any>(response);
    return Array.isArray(data) ? data : (data.categories || data.items || []);
  },

  async getTags(): Promise<Tag[]> {
    const response = await fetch(`${BASE_URL}/cms/tags`);
    const data = await handleResponse<any>(response);
    return Array.isArray(data) ? data : (data.tags || data.items || []);
  },

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    const response = await fetch(`${BASE_URL}/cms/posts/${postId}/comments`);
    const data = await handleResponse<any>(response);
    return Array.isArray(data) ? data : (data.comments || data.items || []);
  },

  async createComment(postId: string, content: string, parentId?: string): Promise<Comment> {
    const response = await fetch(`${BASE_URL}/cms/posts/${postId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content, parent_id: parentId })
    });
    return handleResponse<Comment>(response);
  },

  // Team
  async getTeamMembers(): Promise<TeamMember[]> {
    const response = await fetch(`${BASE_URL}/team`);
    const data = await handleResponse<any>(response);
    const members = Array.isArray(data) ? data : (data.team || data.members || data.items || []);
    return teamUtils.sortMembers(members);
  },

  async createTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
    const response = await fetch(`${BASE_URL}/team`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(member)
    });
    return handleResponse<TeamMember>(response);
  },

  async updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    const response = await fetch(`${BASE_URL}/team/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(member)
    });
    return handleResponse<TeamMember>(response);
  },

  async deleteTeamMember(id: string): Promise<void> {
    await fetch(`${BASE_URL}/team/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Partners
  async getPartners(): Promise<Partner[]> {
    const response = await fetch(`${BASE_URL}/partners`);
    const data = await handleResponse<any>(response);
    return Array.isArray(data) ? data : (data.partners || data.items || []);
  },

  async createPartner(partner: Partial<Partner>): Promise<Partner> {
    const response = await fetch(`${BASE_URL}/partners`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(partner)
    });
    return handleResponse<Partner>(response);
  },

  async updatePartner(id: string, partner: Partial<Partner>): Promise<Partner> {
    const response = await fetch(`${BASE_URL}/partners/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(partner)
    });
    return handleResponse<Partner>(response);
  },

  async deletePartner(id: string): Promise<void> {
    await fetch(`${BASE_URL}/partners/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    const response = await fetch(`${BASE_URL}/gallery`);
    const data = await handleResponse<any>(response);
    return Array.isArray(data) ? data : (data.gallery || data.items || []);
  },

  async createGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
    const response = await fetch(`${BASE_URL}/gallery/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    return handleResponse<GalleryItem>(response);
  },

  async createGalleryBulk(data: { title: string, image_urls: string[] }): Promise<GalleryItem[]> {
    const response = await fetch(`${BASE_URL}/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<GalleryItem[]>(response);
  },

  async updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<GalleryItem> {
    const response = await fetch(`${BASE_URL}/gallery/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    return handleResponse<GalleryItem>(response);
  },

  async deleteGalleryItem(id: string): Promise<void> {
    await fetch(`${BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Documents
  async getDocuments(): Promise<DocumentItem[]> {
    const response = await fetch(`${BASE_URL}/documents`);
    const data = await handleResponse<any>(response);
    return Array.isArray(data) ? data : (data.documents || data.items || []);
  },

  async createDocument(doc: Partial<DocumentItem>): Promise<DocumentItem> {
    const response = await fetch(`${BASE_URL}/documents`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(doc)
    });
    return handleResponse<DocumentItem>(response);
  },

  async updateDocument(id: string, doc: Partial<DocumentItem>): Promise<DocumentItem> {
    const response = await fetch(`${BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(doc)
    });
    return handleResponse<DocumentItem>(response);
  },

  async deleteDocument(id: string): Promise<void> {
    await fetch(`${BASE_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // --- Certificates (Persistent via Documents Proxy) ---
  
  /**
   * Fetches participants registered for a specific event
   */
  async getEventRegistrations(eventId: number | string): Promise<EventRegistration[]> {
    const response = await fetch(`${BASE_URL}/events/${eventId}/registrations`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse<any>(response);
    return Array.isArray(data) ? data : (data.registrations || data.items || []);
  },

  async getCertificates(filters?: { event_id?: number | string; user_id?: string; email?: string }): Promise<Certificate[]> {
    const params = new URLSearchParams();
    if (filters?.event_id) params.append('event_id', filters.event_id.toString());
    if (filters?.user_id) params.append('user_id', filters.user_id);
    if (filters?.email) params.append('email', filters.email);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${BASE_URL}/certificates${query}`, {
        headers: getAuthHeaders()
    });
    const data = await handleResponse<any>(response);
    return Array.isArray(data) ? data : (data.certificates || data.items || []);
  },

  async issueCertificate(certData: Omit<Certificate, 'id'>): Promise<Certificate> {
    const response = await fetch(`${BASE_URL}/certificates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(certData)
    });
    return handleResponse<Certificate>(response);
  },

  async updateCertificate(id: string, cert: Partial<Certificate>): Promise<Certificate> {
    const response = await fetch(`${BASE_URL}/certificates/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(cert)
    });
    return handleResponse<Certificate>(response);
  },

  async deleteCertificate(id: string): Promise<void> {
    await fetch(`${BASE_URL}/certificates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  async claimCertificate(credentialId: string): Promise<Certificate> {
    const response = await fetch(`${BASE_URL}/certificates/${credentialId}/claim`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse<Certificate>(response);
  },

  async getCertificateByCredentialId(credentialId: string): Promise<Certificate | null> {
    const response = await fetch(`${BASE_URL}/certificates/${credentialId}`, {
        headers: getAuthHeaders()
    });
    try {
        return await handleResponse<Certificate>(response);
    } catch (e) {
        return null;
    }
  },

  async getGeoBoundaries(adminLevel: number, parentPcode?: string): Promise<any> {
    const params = new URLSearchParams({ admin_level: adminLevel.toString() });
    if (parentPcode) params.append('parent_pcode', parentPcode);
    const response = await fetch(`${BASE_URL}/geo/boundaries/list?${params.toString()}`);
    return handleResponse<any>(response);
  },

  async getGeoBoundariesList(adminLevel: number, parentPcode?: string): Promise<{name: string, pcode: string}[]> {
    const params = new URLSearchParams({ admin_level: adminLevel.toString() });
    if (parentPcode) params.append('parent_pcode', parentPcode);
    const response = await fetch(`${BASE_URL}/geo/boundaries/list?${params.toString()}`);
    const data = await handleResponse<{count: number, boundaries: {name: string, pcode: string}[]}>(response);
    return data.boundaries;
  },

  async reverseGeocode(lat: number, lon: number): Promise<{county: {name: string, pcode: string}, sub_county: {name: string, pcode: string}, ward: {name: string, pcode: string}}> {
    const params = new URLSearchParams({ lat: lat.toString(), lon: lon.toString() });
    const response = await fetch(`${BASE_URL}/geo/reverse-geocode?${params.toString()}`);
    return handleResponse<{county: {name: string, pcode: string}, sub_county: {name: string, pcode: string}, ward: {name: string, pcode: string}}>(response);
  },

  async getNearbyEvents(lat: number, lon: number, radiusKm = 50.0): Promise<{query: any, count: number, events: any[]}> {
    const params = new URLSearchParams({ lat: lat.toString(), lon: lon.toString(), radius_km: radiusKm.toString() });
    const response = await fetch(`${BASE_URL}/geo/events/nearby?${params.toString()}`);
    return handleResponse<{query: any, count: number, events: any[]}>(response);
  }
};

