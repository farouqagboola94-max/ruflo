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
    name: 'General',
    price: 5000,
    description: 'Full access to the vendor floor, main stage, and showcase areas for both days.',
    perks: ['2-day vendor floor access', 'Main stage events', 'Sneaker showcase viewing', '1 raffle ticket included', 'Event wristband'],
    available: true,
    color: 'from-gray-700 to-gray-600',
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 10000,
    description: 'Enhanced experience with early access, exclusive areas, and premium swag.',
    perks: ['Everything in General', '1-hour early entry both days', 'VIP area access', '3 raffle tickets included', 'Limited edition VIP tee'],
    available: true,
    badge: 'Most Popular',
    color: 'from-orange-600 to-amber-500',
  },
  {
    id: 'vvip',
    name: 'VVIP',
    price: 25000,
    description: 'Premium access with exclusive previews, meet & greet, and priority everywhere.',
    perks: ['Everything in VIP', 'Exclusive pre-show preview', '5 raffle tickets + guaranteed prize', 'Meet & greet with keynote speakers', 'Signed event poster', 'VVIP badge & lanyard'],
    available: true,
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'phalanx',
    name: 'Phalanx',
    price: 50000,
    description: 'The front line. Unlimited access, exclusive drops, private sessions. Limited to 25 passes.',
    perks: ['Everything in VVIP', 'Private collector preview session', 'Guaranteed exclusive drop access', '₦10,000 vendor credit', 'Collector box set & merchandise', 'Dedicated host for both days', 'Name on Sneakers Fest Wall of Culture'],
    available: true,
    badge: 'Exclusive',
    color: 'from-lime-400 to-green-600',
  },
]
