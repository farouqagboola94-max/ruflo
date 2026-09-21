export interface Sponsor {
  name: string
  tier: 'title' | 'gold' | 'silver' | 'bronze'
}

// No sponsors are confirmed yet. Partnership conversations are open.
export const SPONSORS: Sponsor[] = []

export const TIER_LABELS: Record<Sponsor['tier'], string> = {
  title: 'Title Sponsor',
  gold: 'Gold Partners',
  silver: 'Silver Partners',
  bronze: 'Bronze Partners',
}
