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
    day: 'December 12',
    date: 'December 12, 2026',
    events: [
      { id: 'sf-1', time: '9:00 AM',  title: 'Doors Open & Registration',                               description: 'Check in, collect your wristband and event pack.',                                                              location: 'Main Entrance',    type: 'vendor' },
      { id: 'sf-2', time: '10:00 AM', title: 'Vendor Floor Opens',                                       description: 'Vendors ready to buy, sell, and trade. First picks go fast.',                                                  location: 'Hall A & B',       type: 'vendor',   featured: true },
      { id: 'sf-3', time: '11:00 AM', title: 'Keynote: The Future of Sneaker Culture',                   description: 'Industry voices discuss where sneaker culture in Lagos and West Africa is headed.',                              location: 'Main Stage',       type: 'panel',    featured: true },
      { id: 'sf-4', time: '12:30 PM', title: 'Panel: Reselling — Ethics, Markets & the Next Generation', description: 'Is the resell game changing? Sellers and collectors weigh in on the future of the market.',                  location: 'Conference Stage', type: 'panel' },
      { id: 'sf-5', time: '1:00 PM',  title: 'Customization Workshop',                                   description: 'Learn paint techniques and hand-stitching from Lagos-based sneaker artists.',                                  location: 'Workshop Zone C',  type: 'workshop' },
      { id: 'sf-6', time: '2:30 PM',  title: 'Exclusive Brand Showcase',                                 description: "Upcoming releases and archive pieces — a curated preview of what's dropping.",                                location: 'Showcase Hall',    type: 'showcase', featured: true },
      { id: 'sf-7', time: '4:00 PM',  title: 'Raffle Draw — Live on Stage',                              description: 'Win deadstock pairs and more. VIP and Collector Edition ticket holders receive extra entries.',                  location: 'Main Stage',       type: 'raffle',   featured: true },
      { id: 'sf-8', time: '5:30 PM',  title: 'Design Talk: Behind the Silhouette',                       description: 'A deep-dive into sneaker silhouette design — from concept sketches to culturally iconic releases.',              location: 'Main Stage',       type: 'panel',    featured: true },
      { id: 'sf-9', time: '7:00 PM',  title: 'Closing Set & Networking',                                 description: 'Celebrate the culture with a live DJ set. Connect with collectors, sellers, and creators.',                     location: 'Main Stage',       type: 'performance' },
    ]
  }
]
