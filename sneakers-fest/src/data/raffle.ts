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
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    retailValue: 180,
    pairs: 5,
  },
  {
    id: 'r2',
    name: 'Yeezy Boost 350 V2',
    brand: 'Adidas',
    colorway: 'Zebra',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    retailValue: 220,
    pairs: 3,
  },
  {
    id: 'r3',
    name: 'Air Max 90',
    brand: 'Nike',
    colorway: 'Infrared',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80',
    retailValue: 130,
    pairs: 8,
  },
  {
    id: 'r4',
    name: '574 Classic',
    brand: 'New Balance',
    colorway: 'Navy / Grey',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
    retailValue: 110,
    pairs: 6,
  },
  {
    id: 'r5',
    name: 'Dunk Low',
    brand: 'Nike',
    colorway: 'University Blue',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
    retailValue: 110,
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
