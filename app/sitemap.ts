import { MetadataRoute } from 'next'
import { api } from '@/lib/api'
import fs from 'fs'
import path from 'path'

/**
 * Automatically discovers static pages in the app directory.
 * Excludes dynamic routes, API routes, and private/admin routes.
 */
function getStaticRoutes(appDirectory: string): string[] {
  const routes: string[] = [];
  const entries = fs.readdirSync(appDirectory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(appDirectory, entry.name);
    
    if (entry.isDirectory()) {
      // Ignore Next.js internal/special folders and specified private routes
      if (
        entry.name.startsWith('(') || 
        entry.name.startsWith('_') || 
        entry.name.startsWith('[') ||
        ['api', 'admin', 'login', 'auth'].includes(entry.name)
      ) {
        continue;
      }

      // Check if this directory has a page.tsx
      if (fs.existsSync(path.join(fullPath, 'page.tsx'))) {
        routes.push(entry.name);
      }

      // Recursively check subdirectories
      const subRoutes = getStaticRoutes(fullPath);
      for (const subRoute of subRoutes) {
        routes.push(`${entry.name}/${subRoute}`);
      }
    }
  }

  return routes;
}

/**
 * Dynamic Sitemap Generator
 * Automatically discovers static pages and fetches dynamic blog/merch data.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://var3738.org';
  const lastModified = new Date();
  const appPath = path.join(process.cwd(), 'app');

  // 1. Auto-discover Static Routes
  let discoveredRoutes: string[] = [];
  try {
    discoveredRoutes = getStaticRoutes(appPath);
  } catch (error) {
    console.error('Failed to auto-discover static routes:', error);
    // Fallback to manual list if FS access is restricted
    discoveredRoutes = ['about', 'blog', 'merch', 'tech', 'impact', 'reports', 'democracy-activated', 'privacy', 'terms'];
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified, changeFrequency: 'monthly', priority: 1 },
    ...discoveredRoutes.map(route => ({
      url: `${baseUrl}/${route}`,
      lastModified,
      changeFrequency: (route.includes('blog') || route.includes('merch') ? 'daily' : 'weekly') as 'daily' | 'weekly',
      priority: 0.8
    }))
  ];

  try {
    // 2. Dynamic Blog Posts
    const posts = await api.getPosts({ status: 'published' });
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // 3. Dynamic Products (Merch)
    const products = await api.getProducts();
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/merch/${product.id}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...postRoutes, ...productRoutes];
  } catch (error) {
    console.error('Sitemap dynamic data fetch failed:', error);
    return staticRoutes;
  }
}

export const revalidate = 3600; // 1 hour
