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
      { id: 'sf-1', time: '9:00 AM',  title: 'Doors Open & Registration · proposed',                    description: 'Draft programme item. Check-in time and details to be confirmed.',                                               location: 'Venue to be confirmed', type: 'vendor' },
      { id: 'sf-2', time: '10:00 AM', title: 'Vendor Floor Opens · proposed',                            description: 'Draft programme item. Timing and vendor details to be confirmed.',                                              location: 'Venue to be confirmed', type: 'vendor',   featured: true },
      { id: 'sf-3', time: '11:00 AM', title: 'Keynote: The Future of Sneaker Culture · proposed',        description: 'Draft programme item. Speaker and timing to be confirmed.',                                                      location: 'Venue to be confirmed', type: 'panel',    featured: true },
      { id: 'sf-4', time: '12:30 PM', title: 'Panel: Reselling — Ethics, Markets & the Next Generation · proposed', description: 'Draft programme item. Speakers and timing to be confirmed.', location: 'Venue to be confirmed', type: 'panel' },
      { id: 'sf-5', time: '1:00 PM',  title: 'Customization Workshop · proposed',                        description: 'Draft programme item. Activity and timing to be confirmed.',                                                     location: 'Venue to be confirmed', type: 'workshop' },
      { id: 'sf-6', time: '2:30 PM',  title: 'Brand Showcase · proposed',                                description: 'Draft programme item. Participating brands and timing to be confirmed.',                                        location: 'Venue to be confirmed', type: 'showcase', featured: true },
      { id: 'sf-7', time: '4:00 PM',  title: 'Community Raffle · proposed',                             description: 'Any raffle format, prizes, and eligibility will be announced with the official ticket details.',                 location: 'Venue to be confirmed', type: 'raffle',   featured: true },
      { id: 'sf-8', time: '5:30 PM',  title: 'Design Talk: Behind the Silhouette · proposed',            description: 'Draft programme item. Speakers and timing to be confirmed.',                                                     location: 'Venue to be confirmed', type: 'panel',    featured: true },
      { id: 'sf-9', time: '7:00 PM',  title: 'Closing Set & Networking · proposed',                      description: 'Draft programme item. Performance and timing to be confirmed.',                                                  location: 'Venue to be confirmed', type: 'performance' },
    ]
  }
]
