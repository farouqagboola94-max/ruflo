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
      { id: 'sf-1', time: '9:00 AM',  title: 'Doors Open & Registration',               description: 'Check in, collect your wristband and event pack.',                                                              location: 'Main Entrance',    type: 'vendor' },
      { id: 'sf-2', time: '10:00 AM', title: 'Vendor Floor Opens',                      description: 'Vendors ready to buy, sell, and trade. First picks go fast.',                                                  location: 'Hall A & B',       type: 'vendor',      featured: true },
      { id: 'sf-3', time: '11:00 AM', title: 'Keynote: The Future of Sneaker Culture',  description: 'Industry leaders discuss where sneakers are headed next.',                                                      location: 'Main Stage',       type: 'panel',       featured: true, speaker: 'Marcus Reid & DJ Skee' },
      { id: 'sf-4', time: '12:30 PM', title: 'Panel: Reselling Ethics & Market Trends', description: 'Is the resell game changing? Top sellers weigh in on the future of the market.',                               location: 'Conference Stage', type: 'panel',       speaker: 'StockX, GOAT & Sneaker News' },
      { id: 'sf-5', time: '1:00 PM',  title: 'Customization Workshop',                  description: 'Learn paint techniques and hand-stitching from top artists.',                                                  location: 'Workshop Zone C',  type: 'workshop',    speaker: 'Sole Artistry Studio' },
      { id: 'sf-6', time: '2:30 PM',  title: 'Nike Exclusive Showcase',                 description: 'First look at unreleased Nike colorways. Limited preview — ticketed access.',                             location: 'Showcase Hall',    type: 'showcase',    featured: true },
      { id: 'sf-7', time: '4:00 PM',  title: 'Raffle Draw — Live on Stage',         description: 'Win a pair of deadstock Jordan 1s and more. Weighted pool — VIP and VVIP get extra entries.',              location: 'Main Stage',       type: 'raffle',      featured: true },
      { id: 'sf-8', time: '5:30 PM',  title: 'Adidas x Yeezy Design Talk',              description: 'A deep-dive into silhouette design and the creative process behind iconic drops.',                             location: 'Main Stage',       type: 'panel',       featured: true, speaker: 'Senior Adidas Designer' },
      { id: 'sf-9', time: '7:00 PM',  title: 'Closing Set & Networking',                description: 'Celebrate the culture with a live DJ set. Connect with collectors, sellers, and creators.',                    location: 'Main Stage',       type: 'performance', speaker: 'DJ Phantom' },
    ]
  },
  {
    day: 'Day 2',
    date: 'December 13, 2026',
    events: [
      { id: 'sf2-1', time: '9:00 AM',  title: 'Doors Open — Day 2',                        description: 'Day two check-in. Collect any pre-ordered merch and reload on the trading floor.',                             location: 'Main Entrance',    type: 'vendor' },
      { id: 'sf2-2', time: '10:00 AM', title: 'Vendor Floor — Fresh Stock',                 description: 'Vendors restock overnight. New pairs, new prices. The trading floor resets for round two.',                   location: 'Hall A & B',       type: 'vendor',      featured: true },
      { id: 'sf2-3', time: '11:00 AM', title: 'Panel: Nigerian Streetwear — Past, Present & Next', description: 'Local designers, brands, and curators discuss where Lagos street fashion has been and where it is going.',  location: 'Main Stage',       type: 'panel',       featured: true, speaker: 'Alara Lagos · IAMISIGO · Orange Culture' },
      { id: 'sf2-4', time: '12:30 PM', title: 'Showcase: Jordan Brand Heritage Collection', description: 'A curated display of Air Jordan milestones from 85 to now — the pairs that defined generations.',          location: 'Showcase Hall',    type: 'showcase',    featured: true },
      { id: 'sf2-5', time: '1:30 PM',  title: 'Workshop: Sneaker Photography & Content',   description: 'Shoot, edit, post. A hands-on session with Lagos top sneaker content creators on building a real following.',  location: 'Workshop Zone C',  type: 'workshop',    speaker: 'The Pair Project' },
      { id: 'sf2-6', time: '3:00 PM',  title: 'Lagos Reseller Roundtable',                 description: 'The top resellers in the city on one stage. Margins, mistakes, and what the market looks like heading into 2027.', location: 'Conference Stage', type: 'panel',    speaker: 'SoleMate · KicksNG · YardSellLagos' },
      { id: 'sf2-7', time: '4:30 PM',  title: 'Grand Raffle — Deadstock Grand Prize Draw', description: 'The biggest draw of the weekend. One pair of deadstock grails. Weighted pool — VIP entries doubled.',   location: 'Main Stage',       type: 'raffle',      featured: true },
      { id: 'sf2-8', time: '6:00 PM',  title: 'Closing Ceremony & Live Auction',           description: 'A live auction of the rarest consigned pairs of the weekend, followed by closing remarks from the founders.',  location: 'Main Stage',       type: 'showcase',    featured: true },
      { id: 'sf2-9', time: '7:30 PM',  title: 'FNP Launch Night',                          description: 'The Friday Night Protocol goes live. Members-only. First challenges kick off. The year-round ritual starts here.', location: 'Rooftop Lounge', type: 'performance', featured: true, speaker: 'FNP x DJ Obinna' },
    ]
  }
]
