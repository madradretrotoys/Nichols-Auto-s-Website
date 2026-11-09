import type { APIRoute } from 'astro';
import {services,guides} from '../data/site';
export const GET: APIRoute = () => {
 const routes=['/','/about/','/services/','/classic-cars/','/repair-stories/','/reviews/','/contact/','/privacy/',...services.map(s=>`/services/${s.slug}/`),...guides.map(g=>`/guides/${g.slug}/`)];
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r=>`<url><loc>https://nicholsautorepair.net${r}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
};
