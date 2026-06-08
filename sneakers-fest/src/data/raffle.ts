export interface RaffleItem {
  id: string
  name: string
  brand: string
  colorway: string
  image: string
  retailValue: number
  pairs: number
}

export const RAFFLE_ITEMS: RaffleItem[] = [
  {
    id: 'r1',
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Jordan',
    colorway: 'Chicago Lost & Found',
    // Jordan 1 High — distinct from Air Max silhouette
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
    retailValue: 180,
    pairs: 5,
  },
  {
    id: 'r2',
    name: 'Yeezy Boost 350 V2',
    brand: 'Adidas',
    colorway: 'Zebra',
    // Yeezy 350 V2 — Primeknit low-profile silhouette
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    retailValue: 220,
    pairs: 3,
  },
  {
    id: 'r3',
    name: 'Air Max 90',
    brand: 'Nike',
    colorway: 'Infrared',
    // Air Max with large visible air unit — Air Max 90 profile
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80',
    retailValue: 130,
    pairs: 8,
  },
  {
    id: 'r4',
    name: 'New Balance 574',
    brand: 'New Balance',
    colorway: 'Navy/Grey',
    // NB heritage runner — encapsulated N logo
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
    retailValue: 90,
    pairs: 6,
  },
  {
    id: 'r5',
    name: 'Nike Dunk Low',
    brand: 'Nike',
    colorway: 'University Blue',
    // White/blue low-top — Dunk Low silhouette
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
    retailValue: 100,
    pairs: 10,
  },
]

export const RAFFLE_ENTRIES_PER_TIER: Record<string, number> = {
  general: 1,
  vip: 3,
  collector: 5,
}

export interface RaffleSubmission {
  id: string
  ticketId: string
  ticketHolder: string
  tierId: string
  allocation: Record<string, number>
  totalEntries: number
  submittedAt: string
}
