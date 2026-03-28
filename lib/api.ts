/**
 * VAR 37/38 API Service Layer
 * This module provides a typed interface to the FastAPI backend.
 */

const BASE_URL = '/api/var3738'; // Rewritten by next.config.mjs to point to actual API_URL safely

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
    const data = await handleResponse<any>(response);
    return Array.isArray(data) ? data : (data.feedback || data.items || []);
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

  // Posts / CMS
  async getPosts(): Promise<Post[]> {
    const response = await fetch(`${BASE_URL}/cms/posts`);
    const data = await handleResponse<any>(response);
    return Array.isArray(data) ? data : (data.posts || data.items || []);
  },

  async getPost(id: number | string): Promise<Post> {
    const response = await fetch(`${BASE_URL}/cms/posts/${id}`);
    return handleResponse<Post>(response);
  },

  async createPost(post: Partial<Post>): Promise<Post> {
    const response = await fetch(`${BASE_URL}/cms/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(post)
    });
    return handleResponse<Post>(response);
  },

  async updatePost(id: number | string, post: Partial<Post>): Promise<Post> {
    const response = await fetch(`${BASE_URL}/cms/posts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(post)
    });
    return handleResponse<Post>(response);
  },

  async deletePost(id: number | string): Promise<void> {
    await fetch(`${BASE_URL}/cms/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Team
  async getTeamMembers(): Promise<TeamMember[]> {
    const response = await fetch(`${BASE_URL}/team`);
    const data = await handleResponse<any>(response);
    return Array.isArray(data) ? data : (data.team || data.members || data.items || []);
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

