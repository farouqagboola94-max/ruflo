export interface TicketTier {
  id: string
  name: string
  price: number
  description: string
  perks: string[]
  available: boolean
  badge?: string
  color: string
}

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'general',
    name: 'General Admission',
    price: 35,
    description: 'Full access to the vendor floor, main stage, and showcase areas for both days.',
    perks: [
      '2-day vendor floor access',
      'Main stage events',
      'Sneaker showcase viewing',
      '1 raffle ticket included',
      'Event tote bag',
    ],
    available: true,
    color: 'from-gray-700 to-gray-800',
  },
  {
    id: 'vip',
    name: 'VIP Pass',
    price: 99,
    description: 'Enhanced experience with early access, exclusive lounge, and premium swag.',
    perks: [
      'Everything in General',
      '1-hour early entry both days',
      'VIP lounge access',
      '3 raffle tickets included',
      'Limited edition VIP tee',
      'Meet & greet with keynote speakers',
      'Priority raffle entries',
    ],
    available: true,
    badge: 'Most Popular',
    color: 'from-orange-600 to-yellow-500',
  },
  {
    id: 'collector',
    name: 'Collector Edition',
    price: 250,
    description: 'The ultimate experience for serious collectors. Limited to 50 passes.',
    perks: [
      'Everything in VIP',
      'Exclusive pre-show collector preview',
      '5 raffle tickets + guaranteed prize',
      'Signed event poster',
      'Private tour of showcase',
      'Collector badge & lanyard',
      'Vendor early access (30 min before VIP)',
      '$50 vendor credit',
    ],
    available: true,
    badge: 'Limited',
    color: 'from-yellow-500 to-amber-600',
  },
]
