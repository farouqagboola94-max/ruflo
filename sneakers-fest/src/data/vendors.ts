export interface BoothTier {
  id: string
  name: string
  price: number
  size: string
  description: string
  perks: string[]
  badge?: string
  color: string
  available: boolean
}

export const BOOTH_TIERS: BoothTier[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 75000,
    size: '6 × 6 ft',
    description: 'A solid floor presence. Great for sneaker vendors, accessories, and indie brands making their first showing.',
    perks: [
      '6×6 ft booth space',
      'One 6ft table + 2 chairs',
      'Name on official vendor floor map',
      '2 vendor wristbands included',
      'Setup day access (Dec 11)',
    ],
    color: 'from-gray-700 to-gray-600',
    available: true,
  },
  {
    id: 'double',
    name: 'Double',
    price: 140000,
    size: '6 × 12 ft',
    description: 'Double the floor, double the impact. Corner-adjacent placement with room for full product displays and racks.',
    perks: [
      '6×12 ft booth space',
      'Two 6ft tables + 4 chairs',
      'Priority vendor map placement',
      '4 vendor wristbands included',
      'Setup day access (Dec 11)',
      'Social media feature before event',
    ],
    badge: 'Most Popular',
    color: 'from-orange-600 to-amber-500',
    available: true,
  },
  {
    id: 'anchor',
    name: 'Anchor',
    price: 250000,
    size: '10 × 12 ft',
    description: 'Full-zone ownership. Prime floor placement, complete branding rights, and a dedicated host for both event days.',
    perks: [
      '10×12 ft booth space',
      'Custom booth structure options',
      'Prime floor placement — guaranteed',
      '6 vendor wristbands included',
      'Setup day access (Dec 11)',
      'Branded on all event collateral',
      'Dedicated vendor host · both days',
      'Featured in event programme & social',
    ],
    badge: 'Best Placement',
    color: 'from-yellow-500 to-amber-600',
    available: true,
  },
]

export const PRODUCT_CATEGORIES = [
  'Sneakers & Footwear',
  'Apparel & Streetwear',
  'Accessories & Jewellery',
  'Art & Collectibles',
  'Photography & Prints',
  'Food & Beverages',
  'Tech & Gadgets',
  'Other',
]
