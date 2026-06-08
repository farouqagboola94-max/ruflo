export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  company: string
  category: 'brand' | 'model' | 'designer' | 'director'
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      "We sign people, not assets. Your welfare, your professional limits, and your long-term trajectory come before any booking — always. If a deal is not right for you, we do not take it.",
    author: 'Catalyst Talents Lagos',
    role: 'Our Commitment to Talent',
    company: 'catalysttalentslagos.com',
    category: 'model',
  },
  {
    id: '2',
    quote:
      "We are a new agency, and we say so honestly. That means every talent we work with gets our full attention. There is no large roster for you to get lost in. We are building something from the ground up, carefully and correctly.",
    author: 'Catalyst Talents Lagos',
    role: 'Our Approach',
    company: 'A Catalyst Concepts Company',
    category: 'brand',
  },
  {
    id: '3',
    quote:
      "Every brand we work with receives professional, prepared talent — on brief, on time, and worth every naira. We represent our talent seriously. We expect brands to work with them seriously too.",
    author: 'Catalyst Talents Lagos',
    role: 'Our Promise to Clients',
    company: 'catalysttalentslagos.com',
    category: 'director',
  },
]
