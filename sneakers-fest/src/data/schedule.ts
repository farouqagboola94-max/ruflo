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
      { id: 'sf-1', time: '9:00 AM',  title: 'Doors Open & Registration',               description: 'Check in, collect your wristband and event pack.',                                                                               location: 'Main Gate',       type: 'vendor' },
      { id: 'sf-2', time: '10:00 AM', title: 'Vendor Floor Opens',                      description: 'Vendors ready to buy, sell, and trade. First picks go fast.',                                                                   location: 'Vendor Zones',    type: 'vendor',      featured: true },
      { id: 'sf-3', time: '11:00 AM', title: 'Keynote: The Future of Sneaker Culture',  description: 'Industry leaders discuss where Lagos sneaker culture is headed and what it means for the continent.',                           location: 'Main Stage',      type: 'panel',       featured: true, speaker: 'TBA' },
      { id: 'sf-4', time: '12:30 PM', title: 'Panel: Reselling Ethics & Market Trends', description: 'Is the resell game changing? Top sellers weigh in on the future of the market.',                                                 location: 'Side Stage',      type: 'panel',       speaker: 'Lagos Sneaker Community' },
      { id: 'sf-5', time: '1:00 PM',  title: 'Customization Workshop',                  description: 'Learn paint techniques and hand-stitching from top artists.',                                                                   location: 'Workshop Area',   type: 'workshop',    speaker: 'Sole Artistry Studio' },
      { id: 'sf-6', time: '2:30 PM',  title: 'Vault Showcase',                          description: 'Collector pieces from the Lagos community on display — deadstock, customs, and grails you have never seen in one room.',       location: 'Exhibition Tent', type: 'showcase',    featured: true },
      { id: 'sf-7', time: '4:00 PM',  title: 'Raffle Draw — Live on Stage',             description: 'Win a pair of deadstock Jordan 1s and more. Weighted pool — VIP and VVIP tickets carry extra entries.',                        location: 'Main Stage',      type: 'raffle',      featured: true },
      { id: 'sf-8', time: '5:30 PM',  title: 'Culture Talk: Lagos & the Sneaker Game',  description: 'A conversation about how Lagos became a sneaker city — the stories, the runners, the collectors, the culture.',               location: 'Main Stage',      type: 'panel',       featured: true, speaker: 'Lagos Collectors Collective' },
      { id: 'sf-9', time: '7:00 PM',  title: 'Closing Set & Networking',                description: 'Celebrate the culture with a live DJ set. Connect with collectors, sellers, and creators.',                                   location: 'Main Stage',      type: 'performance', speaker: 'DJ TBA' },
    ]
  }
]
