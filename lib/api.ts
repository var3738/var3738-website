/**
 * VAR 37/38 API Service Layer
 * This module provides a typed interface to the FastAPI backend.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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
  rating: number;
  comment?: string;
  event_id: number;
  user_id: string;
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
    const response = await fetch(`${BASE_URL}/events/`);
    return handleResponse<Event[]>(response);
  },

  async registerForEvent(eventId: number): Promise<{ message: string }> {
    const response = await fetch(`${BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
    });
    return handleResponse<{ message: string }>(response);
  },

  // CMS
  async getPosts(): Promise<Post[]> {
    const response = await fetch(`${BASE_URL}/cms/posts`);
    return handleResponse<Post[]>(response);
  },

  // Merch
  async getProducts(activeOnly = true): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/merch/products?active_only=${activeOnly}`);
    return handleResponse<Product[]>(response);
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

  async createEvent(eventData: EventCreate): Promise<Event> {
    const response = await fetch(`${BASE_URL}/events/`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    return handleResponse<Event>(response);
  },

  async updateEvent(eventId: number, eventData: Partial<EventCreate>): Promise<Event> {
    const response = await fetch(`${BASE_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    return handleResponse<Event>(response);
  },

  async importEvents(eventsData: EventCreate[]): Promise<Event[]> {
    const response = await fetch(`${BASE_URL}/events/import`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(eventsData),
    });
    return handleResponse<Event[]>(response);
  },

  async createProduct(productData: ProductCreate): Promise<Product> {
    const response = await fetch(`${BASE_URL}/merch/products`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return handleResponse<Product>(response);
  },

  async updateProduct(productId: string, productData: Partial<ProductCreate>): Promise<Product> {
    const response = await fetch(`${BASE_URL}/merch/products/${productId}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return handleResponse<Product>(response);
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
