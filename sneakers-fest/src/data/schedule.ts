export interface ScheduleEvent {
  id: string
  time: string
  title: string
  description: string
  location: string
  type: 'panel' | 'showcase' | 'raffle' | 'performance' | 'workshop' | 'vendor'
  speaker?: string
  featured?: boolean
}

export interface ScheduleDay {
  day: string
  date: string
  events: ScheduleEvent[]
}

export const SCHEDULE: ScheduleDay[] = [
  {
    day: 'Day 1',
    date: 'December 12, 2026',
    events: [
      { id: 'd1-1', time: '9:00 AM', title: 'Doors Open & Registration', description: 'Check in, collect your wristband and event pack.', location: 'Main Entrance', type: 'vendor' },
      { id: 'd1-2', time: '10:00 AM', title: 'Vendor Floor Opens', description: 'Vendors ready to buy, sell, and trade. First picks go fast.', location: 'Hall A & B', type: 'vendor', featured: true },
      { id: 'd1-3', time: '11:00 AM', title: 'Keynote: The Future of Sneaker Culture', description: 'Industry leaders discuss where sneakers are headed next.', location: 'Main Stage', type: 'panel', speaker: 'Marcus Reid & DJ Skee', featured: true },
      { id: 'd1-4', time: '1:00 PM', title: 'Customization Workshop', description: 'Learn paint techniques and hand-stitching from top artists.', location: 'Workshop Zone C', type: 'workshop', speaker: 'Sole Artistry Studio' },
      { id: 'd1-5', time: '2:30 PM', title: 'Nike Exclusive Showcase', description: 'First look at unreleased Nike colorways for 2026.', location: 'Showcase Hall', type: 'showcase', featured: true },
      { id: 'd1-6', time: '4:00 PM', title: 'Raffle Draw #1', description: 'Win a pair of deadstock Jordan 1s. Tickets sold at the door.', location: 'Main Stage', type: 'raffle' },
      { id: 'd1-7', time: '6:00 PM', title: 'Evening Networking Mixer', description: 'Connect with collectors, sellers, and creators over live music.', location: 'Rooftop Lounge', type: 'performance' },
    ]
  },
  {
    day: 'Day 2',
    date: 'December 13, 2026',
    events: [
      { id: 'd2-1', time: '10:00 AM', title: 'Vendor Floor Opens', description: 'Day 2 trading begins — early birds get first pick.', location: 'Hall A & B', type: 'vendor' },
      { id: 'd2-2', time: '11:30 AM', title: 'Panel: Reselling Ethics & Market Trends', description: 'Is the resell game changing? Top sellers weigh in.', location: 'Conference Room 1', type: 'panel', speaker: 'StockX, GOAT & Sneaker News' },
      { id: 'd2-3', time: '1:00 PM', title: 'Adidas x Yeezy Design Talk', description: 'A deep-dive into silhouette design and the creative process.', location: 'Main Stage', type: 'panel', speaker: 'Senior Adidas Designer', featured: true },
      { id: 'd2-4', time: '2:00 PM', title: 'Kids Customization Corner', description: 'Young sneakerheads paint their own pair to take home.', location: 'Workshop Zone D', type: 'workshop' },
      { id: 'd2-5', time: '3:30 PM', title: 'Raffle Draw #2 — Grand Prize', description: 'Grand Prize: Signed Air Jordan 11 “72-10” + ₦500,000 gift card.', location: 'Main Stage', type: 'raffle', featured: true },
      { id: 'd2-6', time: '5:00 PM', title: 'Closing Ceremony & Live DJ Set', description: 'Celebrate two days of culture with a live set by DJ Phantom.', location: 'Main Stage', type: 'performance', speaker: 'DJ Phantom' },
    ]
  }
]
