export interface NewsArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  category: 'Industry' | 'Model Feature' | 'Events' | 'Campaign' | 'News'
  readTime: string
  gradient: string
  featured?: boolean
}

export const news: NewsArticle[] = [
  {
    id: '1',
    slug: 'lagos-fashion-week-2025-catalyst-talents',
    title: 'Lagos Fashion Week 2025: Catalyst Talents Owns the Runway',
    excerpt:
      'Our models walked for 12 designers at Lagos Fashion Week 2025, marking our biggest season yet. From Adaeze Okafor closing for Kenneth Ize to Emeka Nwachukwu opening for Orange Culture — it was a statement moment.',
    content: `Lagos Fashion Week 2025 was a landmark season for Catalyst Talents Lagos. For the first time, our models walked every major show on the runway schedule — representing the diversity, professionalism, and raw talent that defines the Lagos modelling scene today.\n\nAdaeze Okafor delivered the closing look for Kenneth Ize, wearing a sculptural Aso-oke gown that stopped the room. Emeka Nwachukwu opened for Orange Culture in a tailored suit that set the tone for the brand's new direction. Ngozi Ibe stole the show at IAMISIGO, her walk a masterclass in controlled elegance.\n\n“This is what we built Catalyst Talents Lagos for,” said the agency's founder. “To give these extraordinary humans the platform they deserve, and to show the world what Lagos is made of.”\n\nThe full LFW recap is available on our Instagram. Booking enquiries for the above models are open via our contact page.`,
    date: '2025-03-22',
    category: 'Events',
    readTime: '4 min read',
    gradient: 'linear-gradient(160deg, #0f0c29 0%, #302b63 100%)',
    featured: true,
  },
  {
    id: '2',
    slug: 'adaeze-okafor-model-feature',
    title: "Model Feature: Adaeze Okafor's Journey from Enugu to the Global Stage",
    excerpt:
      "We sit down with Catalyst Talents' breakout star to talk ambition, the Lagos fashion scene, and what it means to represent Nigeria on the world's most prestigious stages.",
    content: `There's a particular kind of quiet confidence about Adaeze Okafor. She doesn't perform it — it just exists, in the way she holds a room, in the precision of her walk, in the measured thoughtfulness of her answers.\n\nShe grew up in Enugu, the youngest of four siblings, and moved to Lagos at 18 with a garment bag and a dream. “I didn't know anyone in the industry,” she tells us, sitting in our Lagos Island studio. “I just knew I was supposed to be here.”\n\nThree years later, she has walked for Kenneth Ize, appeared in a Vogue Africa editorial, and is rapidly building an international profile. Catalyst Talents Lagos signed her in 2023, and the agency's structure gave her the platform she needed.\n\n“Before I signed, I was doing everything myself — negotiating my own fees, trying to figure out contracts. Catalyst gave me a team. That changed everything.”\n\nAdaeze is currently in preparation for a European season, with bookings in Milan and Paris in the pipeline. Watch this space.`,
    date: '2025-04-10',
    category: 'Model Feature',
    readTime: '6 min read',
    gradient: 'linear-gradient(160deg, #200122 0%, #6f0000 100%)',
    featured: false,
  },
  {
    id: '3',
    slug: 'nigerian-models-making-waves-2025',
    title: '5 Nigerian Models Making Waves Internationally in 2025',
    excerpt:
      "From the catwalks of Milan to the pages of Harper's Bazaar, Nigerian models are reshaping the global fashion narrative. We highlight five talents leading the charge.",
    content: `The Nigerian model is having a moment — and it has been earned over decades of persistence, talent, and a refusal to accept invisibility in an industry that has historically underrepresented African beauty.\n\nIn 2025, the tide has fully turned. Here are five names you need to know.\n\nThe list spans Lagos, Abuja, and the diaspora — models who have walked in New York, Paris, and Milan, appeared in global campaigns, and used their platforms to advocate for greater African representation in fashion.\n\nFor Catalyst Talents Lagos, the goal has always been to be the bridge — to take homegrown talent and give them the infrastructure to compete and win on the world stage. The global fashion industry is finally recognising what Lagos has always known: Nigerian models are world-class.`,
    date: '2025-05-01',
    category: 'Industry',
    readTime: '5 min read',
    gradient: 'linear-gradient(160deg, #093028 0%, #237a57 100%)',
    featured: false,
  },
  {
    id: '4',
    slug: 'catalyst-concepts-talent-division-launch',
    title: 'Catalyst Concepts Expands: Introducing Catalyst Talents Lagos',
    excerpt:
      'We officially announce the launch of our modelling and talent management division — a natural evolution of everything Catalyst Concepts has built over the past three years.',
    content: `Today marks a defining chapter in the Catalyst Concepts story.\n\nSince our founding, we have operated at the intersection of creativity and commerce — producing campaigns, events, and content that puts Nigerian talent at the centre of the conversation. Along the way, we encountered extraordinary individuals: models, actors, influencers, and performers who had everything it takes to build remarkable careers, but lacked the structural support to get there.\n\nCatalyst Talents Lagos is our answer to that gap.\n\nWe are now formally open for talent signings across four divisions: Fashion & Runway, Commercial & Brand, Influencers & Creators, and Acting & Presenting. Applications are open at the Apply page.\n\nTo the talents we will sign, develop, and champion: we see you. We're building this for you.`,
    date: '2025-01-15',
    category: 'News',
    readTime: '3 min read',
    gradient: 'linear-gradient(160deg, #1a1208 0%, #3d2c0a 100%)',
    featured: false,
  },
  {
    id: '5',
    slug: 'social-media-reshaping-nigerian-modelling',
    title: 'How Social Media is Reshaping Nigerian Modelling in 2025',
    excerpt:
      'The era of the waiting room and the comp card is evolving. Instagram, TikTok, and digital platforms are rewriting the rules of how talent gets discovered and booked in Nigeria.',
    content: `A decade ago, breaking into Nigerian modelling meant knowing someone at a Lagos agency, submitting a physical portfolio, and waiting. Today, a teenager in Abuja can post a video, rack up a million views, and have three brand deals by the end of the week.\n\nThe digital revolution has democratised access to modelling and talent careers in ways that were unimaginable five years ago. For agencies like Catalyst Talents Lagos, this shift is both an opportunity and a recalibration.\n\n“We now scout as much on TikTok as we do in person,” says the Catalyst Talents scouting team. “The platforms surface talent that would have been invisible to us otherwise — people from smaller cities, people who didn't have the confidence to walk into an agency, people who found their voice on a phone screen.”\n\nThe key, the team emphasises, is pairing that digital presence with professional infrastructure. Social media gets you noticed. The agency gets you booked.`,
    date: '2025-02-28',
    category: 'Industry',
    readTime: '7 min read',
    gradient: 'linear-gradient(160deg, #0a1a2e 0%, #1a3d5c 100%)',
    featured: false,
  },
  {
    id: '6',
    slug: 'behind-the-shoot-ss2025',
    title: 'Behind the Shoot: Our SS2025 Campaign',
    excerpt:
      'A look behind the scenes of our Spring/Summer 2025 portfolio campaign — shot over two days on Lagos Island, with six signed models and creative direction by our in-house team.',
    content: `Two days. Six models. One extraordinary campaign.\n\nOur SS2025 portfolio shoot brought together six of our most exciting signed talents for a campaign that captures what Catalyst Talents Lagos is about: Lagos energy, global aspiration, and uncompromising beauty.\n\nThe campaign was shot on Lagos Island — using the city's architecture, light, and texture as backdrop. We deliberately chose Lagos as our canvas rather than a neutral studio, because our identity is inseparable from this city.\n\nStyling was handled by our in-house creative team, with wardrobe sourcing from a mix of Lagos designers and international pieces. The result is a lookbook that feels unapologetically Nigerian and unapologetically global at the same time.\n\nThe full campaign gallery is available on our Instagram. Model bookings from this campaign are open — contact us via the contact page.`,
    date: '2025-04-25',
    category: 'Campaign',
    readTime: '4 min read',
    gradient: 'linear-gradient(160deg, #1a0a2e 0%, #3d1b6e 100%)',
    featured: false,
  },
]
