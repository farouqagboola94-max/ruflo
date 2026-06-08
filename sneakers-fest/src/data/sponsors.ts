export interface Sponsor {
  name: string
  tier: 'title' | 'gold' | 'silver' | 'media'
}

// No sponsors confirmed yet — partnerships are open.
export const SPONSORS: Sponsor[] = []

export const TIER_LABELS: Record<string, string> = {
  title: 'Presenting Sponsor',
  gold: 'Gold Partners',
  silver: 'Silver Partners',
  media: 'Media Partners',
}
