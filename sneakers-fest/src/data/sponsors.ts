export interface Sponsor {
  name: string
  tier: 'title' | 'gold' | 'silver' | 'media'
}

export const SPONSORS: Sponsor[] = [
  { name: 'Nike', tier: 'title' },
  { name: 'Adidas', tier: 'gold' },
  { name: 'New Balance', tier: 'gold' },
  { name: 'StockX', tier: 'silver' },
  { name: 'GOAT', tier: 'silver' },
  { name: 'Foot Locker', tier: 'silver' },
  { name: 'Flutterwave', tier: 'media' },
  { name: 'Beat FM', tier: 'media' },
  { name: 'Pulse Nigeria', tier: 'media' },
]

export const TIER_LABELS: Record<string, string> = {
  title: 'Title Sponsor',
  gold: 'Gold Sponsors',
  silver: 'Silver Sponsors',
  media: 'Media Partners',
}
