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
    slug: 'catalyst-talents-lagos-now-open',
    title: 'Catalyst Talents Lagos Is Open — Registrations and Brand Deals Welcome',
    excerpt:
      'We are officially live. Catalyst Talents Lagos is the talent management division of Catalyst Concepts, built to represent models, influencers, actors, and commercial talent in Nigeria. Registrations are open. Brand partnerships are open. This is the beginning.',
    content: `Catalyst Talents Lagos is live.

We are the talent management arm of Catalyst Concepts — a creative company rooted in Lagos and committed to putting Nigerian talent at the centre of the global conversation. Through our work in events, content, and brand campaigns, we kept meeting extraordinary people: models with presence, actors with range, influencers with genuine voice, and commercial talent that brands should be working with.

What they needed was not just opportunity. They needed structure. Professional representation. A team that negotiated on their behalf, protected their interests, and helped them build careers — not just book gigs.

Catalyst Talents Lagos is that team.

We operate across four divisions:\n\nFashion & Runway — models for editorial, couture, and runway work.\nCommercial & Brand — talent for campaigns, print, and brand ambassadorships.\nInfluencers & Creators — digital-native voices with genuine audiences.\nActing & Presenting — performers for film, TV, and live events.\n\nWe are currently open for talent applications. If you have the drive, the presence, and the commitment to build a career in this industry, we want to hear from you. Apply through the Apply page — no prior agency experience required.\n\nWe are also open to brand partnerships. If your brand is looking to work with Lagos talent — for campaigns, events, content, or ambassadorships — reach us via the Booking or Contact page.\n\nWe are at the beginning. We are building this the right way.`,
    date: '2025-01-15',
    category: 'News',
    readTime: '3 min read',
    gradient: 'linear-gradient(160deg, #1a1208 0%, #3d2c0a 100%)',
    featured: true,
  },
  {
    id: '2',
    slug: 'talent-welfare-first-our-philosophy',
    title: 'Talent First: The Principle Behind Everything We Do',
    excerpt:
      'We are not in the business of booking bodies. We are in the business of building careers — with full attention to the human beings behind the work. This is what that means in practice.',
    content: `The modelling and talent industry has a reputation — and not always a good one.\n\nTalent as commodity. Exploitation disguised as opportunity. Agencies that take a cut and offer little in return. Promises that don't materialise. Contracts that protect everyone except the person they're supposed to serve.\n\nWe built Catalyst Talents Lagos because we believe it can be different.\n\nOur primary commitment is to talent welfare. That means:\n\nHonest contracts. You know exactly what you're agreeing to. No hidden clauses, no surprises, no pressure.\n\nFair negotiation. We negotiate your rates with brands and clients. You are not undersold. You are not overworked. And you are not taken advantage of because you're new to the industry.\n\nYour wellbeing comes first. If a booking is wrong for you — for any reason — you don't have to take it. We are not here to fill a calendar. We are here to build a career that serves you.\n\nTransparency always. You know what is being said on your behalf, what deals are in progress, and what you stand to earn from every engagement.\n\nThis is not a list of aspirations. This is the operational standard we hold ourselves to.\n\nWe are a new agency. That means we don't have decades of bookings to point to. What we have is a clear-eyed commitment to doing this right from the very beginning — for the people who trust us with their careers.`,
    date: '2025-02-10',
    category: 'Industry',
    readTime: '4 min read',
    gradient: 'linear-gradient(160deg, #0d1a1a 0%, #0a2e2e 100%)',
    featured: false,
  },
  {
    id: '3',
    slug: 'the-lagos-talent-platform',
    title: 'Lagos Has World-Class Talent. Here Is the Platform.',
    excerpt:
      'The talent has always been here. What Lagos has needed is professional infrastructure — representation that takes its models, actors, and creators seriously and puts them where they belong.',
    content: `Walk through Lagos on any given day and you will see it everywhere.\n\nPeople with presence. Faces that hold a camera. Bodies that move with purpose. Personalities that fill a room. Raw, extraordinary, visible talent that the world genuinely has not seen enough of.\n\nThis is not a new observation. Nigerian talent has been making noise internationally for decades — in music, in football, in Nollywood, in fashion. The world knows Lagos produces world-class people.\n\nWhat has been missing is not the talent. What has been missing is the infrastructure.\n\nProfessional talent representation — the kind that negotiates contracts, develops careers, connects local talent to global opportunities, and protects the people it works with — is still being built in Lagos. The gap is real, and it matters.\n\nCatalyst Talents Lagos is our contribution to filling it.\n\nWe are not claiming to be the finished article. We are a new agency, at the beginning of a long project, and we say that honestly. What we bring is the commitment to do this properly — to represent talent with professionalism, to negotiate on their behalf with seriousness, to connect them to brands and platforms that treat them with respect.\n\nIf you are a model, an influencer, an actor, or a commercial talent in Lagos: you belong on a platform that takes you seriously. We want to be that platform.\n\nApplications are open. This is the beginning.`,
    date: '2025-03-05',
    category: 'Industry',
    readTime: '5 min read',
    gradient: 'linear-gradient(160deg, #093028 0%, #1a4a35 100%)',
    featured: false,
  },
  {
    id: '4',
    slug: 'social-media-talent-discovery-lagos',
    title: 'How Social Media Is Changing the Way Lagos Talent Gets Found',
    excerpt:
      'Instagram, TikTok, and digital platforms have fundamentally changed talent scouting. Here is what that means for models, influencers, and creators in Nigeria building careers in 2025.',
    content: `A decade ago, breaking into modelling or acting in Lagos meant walking into an agency office, handing over a portfolio, and waiting — often in silence, often without feedback, often for a very long time.\n\nThat model is changing.\n\nToday, a teenager in Kano can post a video, build an audience of a hundred thousand, and have brands reaching out directly within months. An Abuja-based model can showcase a walk on TikTok and get noticed by stylists, photographers, and agencies without ever having stepped foot in a Lagos audition room.\n\nThe democratisation of talent discovery through social media is real, and it is significant. It has lowered the barriers to being seen, expanded the geographic reach of who can get noticed, and created entirely new categories of talent — the influencer, the content creator, the multi-hyphenate — that simply didn't exist as formal career paths ten years ago.\n\nFor talent, this is an opportunity. But social media reach and a professional career are not the same thing.\n\nBeing noticed is a starting point. Getting properly represented — with contracts negotiated in your favour, rates that reflect your worth, and a strategy for where your career goes next — is the infrastructure that turns visibility into a livelihood.\n\nIf you have built something on social media and you are ready to take the next step toward professional representation, we are open for applications. And if you don't yet have a platform but you have the presence and the drive, we want to hear from you too.`,
    date: '2025-04-02',
    category: 'Industry',
    readTime: '6 min read',
    gradient: 'linear-gradient(160deg, #0a1a2e 0%, #1a3d5c 100%)',
    featured: false,
  },
  {
    id: '5',
    slug: 'why-brands-should-work-with-lagos-talent',
    title: 'Why Forward-Looking Brands Should Invest in Lagos Talent',
    excerpt:
      'Lagos talent is world-class, culturally resonant, and underrepresented in major brand campaigns. Here is why that gap is worth filling — and what working with Catalyst Talents Lagos looks like.',
    content: `Nigerian consumers know the difference between a campaign that sees them and one that doesn't.\n\nThey know when a brand has done the work to find authentic talent — people whose look, voice, and energy genuinely reflects the market being spoken to. And they know when a brand has simply gone through the motions.\n\nThe brands that win in Lagos are the ones investing in local, authentic talent. Not as a diversity initiative. As a commercial strategy.\n\nHere is the reality: Lagos has an enormous, young, digitally fluent consumer base that responds to faces and personalities they recognise as real. Models, influencers, and presenters who come from the same culture, speak the same languages, carry the same references.\n\nCatalyst Talents Lagos exists to connect brands to that talent — professionally, efficiently, and with the full infrastructure of a managed talent agency. We handle the talent side: contracts, availability, rates, briefing, and coordination. Your team focuses on the creative.\n\nWe are a new agency. We do not have an extensive back catalogue to show you yet. What we have is a clear approach, genuine access to talent across Lagos, and the professionalism to deliver a booking experience that doesn't create more work than it solves.\n\nIf you are a brand, a production company, or a creative director looking for Lagos talent — for campaigns, events, content, or brand partnerships — reach us via the Booking page. We will respond within 48 hours.`,
    date: '2025-05-08',
    category: 'Industry',
    readTime: '5 min read',
    gradient: 'linear-gradient(160deg, #200122 0%, #4a1040 100%)',
    featured: false,
  },
  {
    id: '6',
    slug: 'signing-with-catalyst-talents-what-to-expect',
    title: 'What Joining Catalyst Talents Lagos Actually Looks Like',
    excerpt:
      'We are a new agency. We are honest about that. Here is exactly what signing with Catalyst Talents Lagos means — what we offer, what we expect, and what building a career with us looks like from the start.',
    content: `We want to be clear about something from the beginning: Catalyst Talents Lagos is a new agency.\n\nWe have not been around for decades. We do not have a vault of historical bookings or a roster of household names to show you. We are building this now, and we think it is important that anyone considering signing with us understands exactly what they are getting into.\n\nHere is what we offer every talent we represent:\n\nPortfolio development. If you don't yet have professional images, we will work with you to build material that represents you well. You cannot be booked without it.\n\nContract negotiation. Every booking goes through us. We negotiate your rates, review the terms, and make sure what you agree to is fair and protects your interests.\n\nCareer strategy. This is not about filling your calendar with random gigs. We work with you to understand where you want to go and build a booking approach that serves that direction.\n\nTransparency. You know what is being discussed on your behalf, what deals are in progress, and what you stand to earn from every engagement.\n\nSocial media guidance. We can help you build and refine your online presence in a way that supports your professional career — not just your follower count.\n\nWhat we expect from you:\n\nProfessionalism. Always. Every brief, every booking, every shoot.\nCommunication. We need to know your availability, your limits, and any changes as soon as they happen.\nCommitment. Building a career takes time. We are not a shortcut. We are a partnership.\n\nApplications are open across all four of our talent divisions. If you are ready, so are we.`,
    date: '2025-06-01',
    category: 'News',
    readTime: '4 min read',
    gradient: 'linear-gradient(160deg, #1a0a2e 0%, #3d1b6e 100%)',
    featured: false,
  },
]
