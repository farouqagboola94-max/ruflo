import { EVENT_FACTS } from '@/data/eventFacts'

const COMMUNITY_FORMATS = [
  { title: 'Drop conversations', desc: 'Talk through the pairs, releases, and stories shaping sneaker culture.' },
  { title: 'Community challenges', desc: 'Put the community’s collections, style, and creativity in the spotlight.' },
  { title: 'Creator and culture features', desc: 'Showcase the people building Lagos sneaker and streetwear culture.' },
  { title: 'Live conversations', desc: 'Make room for collectors, vendors, artists, and young founders to speak.' },
]

const CHANNELS = [
  { name: 'Instagram', detail: 'Official updates, visuals, community conversations' },
  { name: 'TikTok', detail: 'Short-form culture, style, and creator stories' },
  { name: 'WhatsApp', detail: 'Community announcements and event updates' },
]

export default function FNPPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <p className="text-brand-neon text-sm font-semibold uppercase tracking-wider mb-3">The online community behind the gathering</p>
        <h1 className="font-display text-5xl sm:text-7xl text-white mb-6 leading-none">
          FRIDAY NIGHT<br /><span className="text-gradient">PROTOCOL</span>
        </h1>
        <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
          Sneakers Fest starts online. FNP is the community and media layer connecting sneakers, streetwear, creators, and Lagos youth culture before and beyond the physical gathering.
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
        {COMMUNITY_FORMATS.map(({ title, desc }) => (
          <article key={title} className="bg-brand-gray rounded-2xl p-6 border border-white/5">
            <h2 className="text-white font-display text-xl mb-2">{title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
          </article>
        ))}
      </section>

      <section className="bg-brand-dark rounded-3xl p-8 border border-white/10 mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-2">Online reach target</p>
            <p className="font-display text-4xl text-white">100M+ impressions</p>
            <p className="text-gray-500 text-sm mt-2">Planning target across the campaign, not a current audience or achieved result.</p>
          </div>
          <p className="text-gray-400 text-sm max-w-md">
            The event day is one milestone in a year-round digital culture platform. Programming and activity dates will be announced through official channels.
          </p>
        </div>
      </section>

      <section className="bg-brand-gray rounded-3xl p-8 border border-white/5 mb-12">
        <h2 className="font-display text-2xl text-white mb-5">FOLLOW THE OFFICIAL CHANNELS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CHANNELS.map(({ name, detail }) => (
            <div key={name} className="bg-brand-dark rounded-xl p-4 border border-white/5">
              <p className="text-brand-orange font-semibold text-sm mb-1">{name}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
        <p className="text-gray-400 mb-2">{EVENT_FACTS.date} · Lagos, venue to be announced</p>
        <a href={EVENT_FACTS.instagramUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex px-7 py-3 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold">
          Follow {EVENT_FACTS.instagramHandle}
        </a>
      </div>
    </div>
  )
}
