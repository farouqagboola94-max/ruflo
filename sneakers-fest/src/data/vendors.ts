export interface BoothTier {
  id: string
  name: string
  price: number
  size: string
  description: string
  perks: string[]
  badge?: string
  color: string
  spots: number
}

export const BOOTH_TIERS: BoothTier[] = [
  {
    id: 'standard',
    name: 'Standard Booth',
    price: 80000,
    size: '3m × 3m',
    description: 'Perfect for solo vendors and small sellers. Includes everything you need to showcase your collection.',
    perks: [
      '3m × 3m floor space',
      '1 table + 2 chairs',
      'Standard placement on vendor floor',
      '2 vendor passes included',
      'Name listed in event program',
      'Set-up from 7:00 AM',
    ],
    color: 'from-gray-700 to-gray-800',
    spots: 80,
  },
  {
    id: 'premium',
    name: 'Premium Booth',
    price: 150000,
    size: '4m × 4m',
    description: 'More space, better placement, and built-in visibility for established sellers and boutiques.',
    perks: [
      '4m × 4m floor space',
      '2 tables + display rack + chairs',
      'Featured placement (high-traffic zone)',
      '4 vendor passes included',
      'Logo in event program',
      'Social media shoutout pre-event',
      'Set-up from 6:30 AM',
    ],
    badge: 'Best Value',
    color: 'from-orange-600 to-yellow-500',
    spots: 40,
  },
  {
    id: 'brand',
    name: 'Brand Showcase',
    price: 350000,
    size: '6m × 6m',
    description: 'Prime location and maximum exposure for brands, boutiques, and serious collectors.',
    perks: [
      '6m × 6m prime floor space',
      'Custom setup assistance',
      'Prime location (main entrance zone)',
      '8 vendor passes included',
      'Featured in all event marketing',
      'Stage mention during program',
      'Meet & greet inclusion',
      'Set-up from 6:00 AM',
    ],
    badge: 'Limited — 10 Spots',
    color: 'from-yellow-500 to-amber-600',
    spots: 10,
  },
]

export const VENDOR_CATEGORIES = [
  'Sneakers',
  'Streetwear',
  'Accessories',
  'Custom & Art',
  'Collectibles',
  'Other',
]

export interface VendorApplication {
  id: string
  businessName: string
  contactName: string
  email: string
  phone: string
  website?: string
  instagram?: string
  category: string
  boothType: 'standard' | 'premium' | 'brand'
  description: string
  status: 'pending' | 'approved' | 'rejected'
  ref: string
  amount: number
  createdAt: string
}
