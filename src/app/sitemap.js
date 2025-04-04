export default function sitemap() {
  const baseUrl = 'https://sketchflow.space';
  
  // Core pages
  const routes = [
    '',
    '/features',
    '/pricing',
    '/about',
    '/contact',
    '/login',
    '/register',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
  
  return routes;
}
