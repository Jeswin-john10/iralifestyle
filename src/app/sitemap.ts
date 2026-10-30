import { MetadataRoute } from 'next';
import { getProducts, getCategories } from '@/lib/dbStore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://iralifestyle.com';
  const currentDate = new Date().toISOString();

  // Core Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic Category Routes from Database
  let categories: any[] = [];
  try {
    categories = await getCategories();
  } catch {}

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/shop/${cat.slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Dynamic Product Routes from Database
  let products: any[] = [];
  try {
    products = await getProducts();
  } catch {}

  const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${baseUrl}/product/${prod.id || prod.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
