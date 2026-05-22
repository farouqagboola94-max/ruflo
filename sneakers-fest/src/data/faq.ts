export interface FaqItem {
  q: string
  a: string
  category: string
}

export const FAQ: FaqItem[] = [
  { category: 'General', q: 'What is SneakersFest?', a: "SneakersFest is Africa's biggest sneaker culture event, bringing together collectors, sellers, and enthusiasts for two days of buying, selling, and celebrating kicks. The 2026 edition takes place June 14–15 at Lagos Convention Centre." },
  { category: 'General', q: 'Who can attend?', a: 'Open to everyone — from hardcore collectors to casual fans. Under-16s get free entry when accompanied by a ticketed adult.' },
  { category: 'General', q: 'Can I get my sneakers authenticated?', a: 'Yes! Our authentication station (staffed by certified CheckCheck and Legit experts) is open both days. Free legit checks — authentication certificates available for purchase.' },
  { category: 'Tickets', q: 'Can I get a refund?', a: 'Tickets are non-refundable but transferable. Contact info@sneakersfest.com at least 48 hours before the event.' },
  { category: 'Tickets', q: "What's the difference between ticket tiers?", a: 'General gives full 2-day access to vendor floors and main stage. VIP adds early entry, lounge access, and premium swag. Collector Edition (50 passes only) includes a private showcase tour, ₦50,000 vendor credit, and a guaranteed raffle prize.' },
  { category: 'Vendors', q: 'How do I get a vendor table?', a: 'Submit a listing via the Marketplace page. Vendor slots are ₦80,000 for 2 days and include a 6ft table and 2 vendor passes. Applications close June 7.' },
  { category: 'Vendors', q: 'What can I sell?', a: 'Sneakers (all brands, new and used), accessories, apparel, and care products. Counterfeit items are strictly banned — authentication checks will be conducted at the gate.' },
  { category: 'Venue', q: 'Where is the event held?', a: 'Lagos Convention Centre, 1 Ozumba Mbadiwe Ave, Victoria Island, Lagos. Free parking on site. Accessible by BRT (Eko Hotel stop), Bolt, and Uber.' },
  { category: 'Venue', q: 'Is there food at the event?', a: 'Yes! Multiple food vendors on site. VIP pass holders get complimentary drinks in the lounge.' },
]

export const FAQ_CATEGORIES = ['All', 'General', 'Tickets', 'Vendors', 'Venue']
