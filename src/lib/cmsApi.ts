/**
 * Frontend API Client
 * Fetches content from the backend REST API.
 * Falls back to the production Render endpoint when running in production.
 */

const PROD_API = 'https://wildwave-safari-api-zrll.onrender.com/api/public';
const LOCAL_API = 'http://localhost:5000/api/public';

const API_BASE = (() => {
  const env = import.meta.env.VITE_API_URL;
  if (env && !env.startsWith(':')) {
    try {
      const u = new URL(env);
      return `${u.origin}/api/public`;
    } catch { /* noop */ }
  }
  return import.meta.env.PROD ? PROD_API : LOCAL_API;
})();

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export interface ApiDestination {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  duration: string | null;
  image_url: string | null;
  category: string | null;
  country: string | null;
  tags: string | null;
  best_months: string | null;
  highlights: string[] | null;
  gallery_images: string[] | null;
  is_featured: boolean;
  published: boolean;
}

export interface ApiPackage {
  id: number;
  name: string;
  type: string | null;
  duration: string | null;
  price: number | null;
  description: string | null;
  image_url: string | null;
  tag: string | null;
  itinerary: string | null;
  itinerary_json: { day: number; title: string; description: string }[] | null;
  inclusions: string[] | null;
  accommodations: string[] | null;
  highlights: string[] | null;
  addons: string[] | null;
  includes: string | null;
  excludes: string | null;
  published: boolean;
}

export interface ApiBlog {
  id: number;
  title: string;
  category: string | null;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  read_time: string | null;
  author: string | null;
  tags: string[] | null;
  published: boolean;
  created_at: string;
}

export interface ApiPartner {
  id: number;
  name: string;
  logo_url: string;
  is_active: boolean;
  display_order: number;
}

export const fetchDestinations = (): Promise<ApiDestination[]> =>
  apiFetch<ApiDestination[]>('/destinations');

export const fetchPackages = (): Promise<ApiPackage[]> =>
  apiFetch<ApiPackage[]>('/packages');

export const fetchBlogs = (): Promise<ApiBlog[]> =>
  apiFetch<ApiBlog[]>('/blogs');

export const fetchPartners = (): Promise<ApiPartner[]> =>
  apiFetch<ApiPartner[]>('/partners');
