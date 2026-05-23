import { MetadataRoute } from 'next'
import { models } from '@/data/models'
import { news } from '@/data/news'

const BASE = 'https://catalysttalentslagos.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const modelPages: MetadataRoute.Sitemap = models.map((m) => ({
    url: `${BASE}/models/${m.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const newsPages: MetadataRoute.Sitemap = news.map((a) => ({
    url: `${BASE}/news/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/models`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/news`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/apply`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...modelPages,
    ...newsPages,
  ]
}
