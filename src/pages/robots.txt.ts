import type { APIRoute } from 'astro';
export const GET: APIRoute = () => new Response(import.meta.env.SITE_LIVE === 'true' ? 'User-agent: *\nAllow: /\nSitemap: https://nicholsautorepair.net/sitemap.xml\n' : 'User-agent: *\nDisallow: /\n', { headers: {'Content-Type':'text/plain'} });
