import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',      
      allow: '/',          
    },
    sitemap: 'https://json-toolkit-psi.vercel.app/sitemap.xml', 
  }
}