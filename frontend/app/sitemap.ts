import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // We can also fetch dynamic routes like blog posts here if we wanted them to have individual pages.
  // Since it's a single page portfolio currently, we just return the root URL.
  
  return [
    {
      url: 'https://amar-portfolio.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
