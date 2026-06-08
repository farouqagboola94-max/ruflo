export interface FaqItem {
  q: string
  a: string
  category: string
}

export const FAQ: FaqItem[] = [
  {
    category: 'General',
    q: 'What is Sneakers Fest?',
    a: "Sneakers Fest is West Africa's first dedicated sneaker culture event — a full day of buying, selling, trading, and celebrating kicks. The 2026 edition takes place on December 12 in Lagos, Nigeria.",
  },
  {
    category: 'General',
    q: 'Who can attend?',
    a: 'Open to everyone — from hardcore collectors to casual fans. Under-16s get free entry when accompanied by a ticketed adult.',
  },
  {
    category: 'General',
    q: 'Can I get my sneakers authenticated?',
    a: 'Yes. An authentication station will be available on the day with legit checks for attendees. Authentication certificates are available for purchase.',
  },
  {
    category: 'Tickets',
    q: 'Can I get a refund?',
    a: 'Tickets are non-refundable but transferable. Contact us at least 48 hours before the event.',
  },
  {
    category: 'Tickets',
    q: "What's the difference between ticket tiers?",
    a: 'General gives full access to vendor floors and main stage programming for the day. VIP adds early entry, lounge access, and premium swag. Collector Edition (50 passes only) includes a private showcase tour, vendor credit, and a guaranteed raffle entry.',
  },
  {
    category: 'Vendors',
    q: 'How do I apply for a vendor spot?',
    a: 'Submit an application via the Vendor page. Each spot includes floor space, a table, chairs, and vendor passes for the day. Applications close December 5.',
  },
  {
    category: 'Vendors',
    q: 'What can I sell?',
    a: 'Sneakers (all brands, new and used), accessories, apparel, and care products. Counterfeit items are strictly banned — authentication checks will be conducted at the gate.',
  },
  {
    category: 'Venue',
    q: 'Where is the event held?',
    a: 'Sneakers Fest 2026 will be held in Lagos, Nigeria. The exact venue will be announced closer to the date. Follow our social channels for the update.',
  },
  {
    category: 'Venue',
    q: 'Is there food at the event?',
    a: 'Yes — multiple food vendors on site. VIP pass holders get complimentary drinks in the lounge.',
  },
]

export const FAQ_CATEGORIES = ['All', 'General', 'Tickets', 'Vendors', 'Venue']
