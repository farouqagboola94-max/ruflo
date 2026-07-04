import { createHash } from 'crypto'

export const TIERS = {
  general: { code: 'GEN', priceNGN: 5000,  label: 'General Admission' },
  vip:     { code: 'VIP', priceNGN: 10000, label: 'VIP Access' },
  vvip:    { code: 'VVI', priceNGN: 25000, label: 'VVIP Access' },
  phalanx: { code: 'PHX', priceNGN: 50000, label: 'Phalanx Package' },
}

export const getTier = (key) => TIERS[(key || '').toLowerCase()] || null

export const generateTicketId = (tier, ref) => {
  const code = getTier(tier)?.code || 'TKT'
  const hash = createHash('sha256').update(ref).digest('hex').slice(0, 6).toUpperCase()
  return `SF26-${code}-${hash}`
}
