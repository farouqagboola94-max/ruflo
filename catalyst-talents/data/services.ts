export interface Service {
  id: string
  title: string
  description: string
  longDescription: string
  features: string[]
  icon: string
  forWho: 'brands' | 'talent'
}

export const services: Service[] = [
  {
    id: 'talent-booking',
    title: 'Talent Booking',
    description: 'Book our signed models and talents for campaigns, productions, and events.',
    longDescription:
      'Whether you need a high-fashion model for an editorial shoot or a charismatic presenter for a brand activation, our booking team matches the right talent to your brief — quickly and professionally. We handle everything from initial casting to on-set coordination.',
    features: [
      'Tailored casting recommendations',
      'Full talent dossiers & portfolios',
      'Contract drafting & negotiation',
      'Scheduling & logistics management',
      'On-set coordination available',
      'Post-production review & feedback',
    ],
    icon: '◈',
    forWho: 'brands',
  },
  {
    id: 'brand-ambassadorship',
    title: 'Brand Ambassadorship',
    description: 'Long-term partnerships between your brand and our most influential talents.',
    longDescription:
      'Build sustained brand equity through authentic, long-form relationships with our top models and influencers. We structure 3-month to 12-month ambassador agreements that align with your campaign calendar and brand identity.',
    features: [
      'Talent-brand alignment consultation',
      'Contract structuring (3–12 months)',
      'Exclusivity & usage rights management',
      'Content calendar planning',
      'Performance tracking & reporting',
      'Campaign refresh at each period',
    ],
    icon: '◉',
    forWho: 'brands',
  },
  {
    id: 'influencer-campaigns',
    title: 'Influencer Campaigns',
    description: 'Drive reach and engagement through our network of Lagos-based digital creators.',
    longDescription:
      'Our influencer division manages digital creators with combined audiences in the millions. We handle briefs, content approval, posting schedules, and ROI reporting — making your campaigns seamless from concept to conversion.',
    features: [
      'Audience & demographic matching',
      'Content brief development',
      'Content approval workflow',
      'Story, Reel & TikTok production',
      'Performance analytics reporting',
      'Multi-platform coordination',
    ],
    icon: '◆',
    forWho: 'brands',
  },
  {
    id: 'casting-direction',
    title: 'Casting Direction',
    description: 'Expert talent curation for film, TV, music videos, and live productions.',
    longDescription:
      "Our casting team draws from Catalyst Talents' roster and an extended network to fill any brief — from lead roles in Nollywood features to background talent for music videos. We understand the Nigerian market and deliver fast.",
    features: [
      'Full brief analysis & breakdown',
      'Talent sourcing & shortlisting',
      'Audition management & video submissions',
      'Final selection consultation',
      'Contracts & call sheet preparation',
      'On-set presence available',
    ],
    icon: '◇',
    forWho: 'brands',
  },
  {
    id: 'event-appearances',
    title: 'Event Appearances',
    description: 'Talent for launches, fashion shows, corporate events, and red carpets.',
    longDescription:
      'From Lagos Fashion Week runway slots to corporate product launches and high-profile red carpets, our talent delivers premium brand representation in person. We handle everything from briefing to on-the-day management.',
    features: [
      'Event-specific talent matching',
      'Styling & look confirmation',
      'Arrival timing & logistics',
      'Media & press coordination',
      'Post-event content capture',
      'Full event day support',
    ],
    icon: '◑',
    forWho: 'brands',
  },
  {
    id: 'career-management',
    title: 'Career Management',
    description: 'End-to-end career development for models and talents on our roster.',
    longDescription:
      'For our signed talent, we provide holistic career management — from portfolio development and training to booking negotiation and international placement. We are invested in your growth, not just your next gig.',
    features: [
      'Professional portfolio shoots',
      'Comp card design & production',
      'Runway & acting coaching referrals',
      'Social media growth strategy',
      'Brand deal negotiation',
      'International agency introductions',
    ],
    icon: '◐',
    forWho: 'talent',
  },
]
