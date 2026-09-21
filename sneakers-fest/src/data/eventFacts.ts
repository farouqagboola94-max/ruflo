export const EVENT_FACTS = {
  name: 'Sneakers Fest Lagos 2026',
  date: 'December 12, 2026',
  city: 'Lagos, Nigeria',
  venue: 'Venue to be announced',
  ticketingPlatform: 'Tix Africa',
  ticketingStatus: 'Ticket sales opening soon',
  instagramHandle: '@s_fest26',
  instagramUrl: 'https://www.instagram.com/s_fest26/',
  tiktokUrl: 'https://www.tiktok.com/@s_fest26',
  positioning: 'An online-first sneaker and youth-culture platform building toward a physical gathering in Lagos.',
} as const

export const EVENT_TARGETS = [
  { value: '3,000–5,000', label: 'Attendees target' },
  { value: '50+', label: 'Vendor target' },
  { value: '10+', label: 'Sponsor target' },
  { value: '100M+', label: 'Online impressions target' },
] as const

export const TICKET_PRICE_BANDS = [
  { id: 'early-bird', name: 'Early Bird', price: '₦5,000–₦7,000' },
  { id: 'standard', name: 'Standard', price: '₦10,000–₦12,000' },
  { id: 'late', name: 'Late', price: 'Up to ₦15,000' },
  { id: 'vip', name: 'VIP', price: '₦25,000–₦40,000' },
  { id: 'group-pack', name: 'Group / Pack', price: '₦100,000+' },
] as const

export const VENDOR_PRICE_BANDS = [
  { name: 'Standard', price: '₦50,000' },
  { name: 'Premium', price: '₦100,000' },
  { name: 'Corner', price: '₦150,000' },
] as const

export const SPONSOR_PRICE_BANDS = [
  { name: 'Bronze', price: '₦250,000' },
  { name: 'Silver', price: '₦500,000' },
  { name: 'Gold', price: '₦1,000,000+' },
  { name: 'Title', price: '₦15,000,000+' },
] as const
