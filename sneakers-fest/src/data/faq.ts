export interface FaqItem {
  q: string
  a: string
  category: string
}

export const FAQ: FaqItem[] = [
  {
    category: 'General',
    q: 'What is Sneakers Fest?',
    a: 'Sneakers Fest Lagos is an online-first sneaker and youth-culture platform building toward a physical gathering on December 12, 2026.',
  },
  {
    category: 'General',
    q: 'Who can attend?',
    a: 'The event is being built for sneaker, streetwear, and youth-culture communities. Attendance and age details will be published with the official ticket listing.',
  },
  {
    category: 'Tickets',
    q: 'When do ticket sales open?',
    a: 'Ticket sales are not open yet. Tix Africa is the selected ticketing platform. Follow @s_fest26 for the official ticket link and launch details.',
  },
  {
    category: 'Tickets',
    q: 'What are the planned ticket prices?',
    a: 'Current planning bands are Early Bird ₦5,000–₦7,000, Standard ₦10,000–₦12,000, Late up to ₦15,000, VIP ₦25,000–₦40,000, and Group / Pack ₦100,000+. Final prices and benefits will appear on the official Tix Africa listing.',
  },
  {
    category: 'Vendors',
    q: 'How do I apply for a vendor spot?',
    a: 'Vendor pricing is being planned at Standard ₦50,000, Premium ₦100,000, and Corner ₦150,000. Application details will be announced after the venue and setup plan are confirmed.',
  },
  {
    category: 'Vendors',
    q: 'What can I sell?',
    a: 'Vendor categories and event policies will be shared with the application details.',
  },
  {
    category: 'Venue',
    q: 'Where is the event held?',
    a: 'The event is planned for Lagos, Nigeria. The venue has not been confirmed. Follow @s_fest26 for the announcement.',
  },
  {
    category: 'Venue',
    q: 'Will food and other experiences be available?',
    a: 'Food, programming, and attendee services will be confirmed closer to the event. Check the official channels for updates.',
  },
]

export const FAQ_CATEGORIES = ['All', 'General', 'Tickets', 'Vendors', 'Venue']
