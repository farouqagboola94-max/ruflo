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
      "Working with Catalyst Talents was seamless from brief to shoot day. They understood what our brand needed and delivered talent that exceeded our expectations. The professionalism is unlike anything we've experienced with Lagos agencies before.",
    author: 'Chinyere Adichie',
    role: 'Brand Marketing Director',
    company: 'Paga Nigeria',
    category: 'brand',
  },
  {
    id: '2',
    quote:
      'Catalyst Talents has changed my career. Before signing, I was piecing together gigs on my own with no real direction. Now I have a team, a strategy, and bookings that match my ambition. They genuinely care about where you\'re going, not just where you are.',
    author: 'Adaeze Okafor',
    role: 'Fashion Model',
    company: 'Catalyst Talents Lagos',
    category: 'model',
  },
  {
    id: '3',
    quote:
      'For Lagos Fashion Week, I needed models who could do justice to the structural complexity of my pieces. Catalyst Talents sent me exactly the right people — technically excellent, visually stunning, and completely professional on set.',
    author: 'Kola Oshalusi',
    role: 'Creative Director',
    company: 'Insignia',
    category: 'designer',
  },
  {
    id: '4',
    quote:
      'The influencer campaign Catalyst Talents coordinated for our product launch delivered a 3x better engagement rate than our previous campaigns. Their talent understood the brief and made our brand look world-class.',
    author: 'Bisi Adekunle',
    role: 'Head of Digital',
    company: 'Moove Africa',
    category: 'brand',
  },
  {
    id: '5',
    quote:
      "I've cast for Nollywood and international co-productions alike. When I need talent from Lagos that can hold their own on any set, I call Catalyst Talents first. Their roster is curated, their people are prepared, and the process is painless.",
    author: 'Ngozi Williams',
    role: 'Casting Director',
    company: 'FilmHouse Studios',
    category: 'director',
  },
]
