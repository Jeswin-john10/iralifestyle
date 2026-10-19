import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://iralifestyle.com';

  const aiAndSearchBots = [
    '*',
    'GPTBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-Web',
    'Google-Extended',
    'Googlebot',
    'Googlebot-Image',
    'PerplexityBot',
    'Applebot',
    'Applebot-Extended',
    'Meta-ExternalAgent',
    'Bingbot',
    'cohere-ai',
    'Bytespider',
    'Diffbot',
    'DuckDuckBot',
    'CCBot',
  ];

  return {
    rules: aiAndSearchBots.map((bot) => ({
      userAgent: bot,
      allow: '/',
      disallow: ['/admin/', '/api/admin/'],
    })),
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
