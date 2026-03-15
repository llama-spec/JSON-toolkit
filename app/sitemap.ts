import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://json-toolkit-psi.vercel.app' // Replace with your actual domain

  // Define your routes
  const routes = [
    '',
    '/json-formatter',
    '/convert-json-to-typescript',
    '/json-diff-tool',
    '/debug-invalid-json',
    '/json-to-csv',
    '/json-to-xml',
    '/json-to-yaml',
  ]

  // Map the routes to the format Next.js expects
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly', // Tells Google how often the page changes
    priority: route === '' ? 1 : 0.8, // 1 is highest priority (homepage), 0.8 for tools
  }))
}