import Link from 'next/link'

const WEEKS = [
  {
    week: 'Week 1',
    title: 'Drop Discussion',
    platform: 'Instagram · Twitter / X · WhatsApp',
    desc: 'A recent or upcoming drop goes in the feed. Community calls cop or pass. The debate runs all night. Saturday the verdict gets published.',
    revenue: 'Early access to exclusive festival content for participants.',
  },
  {
    week: 'Week 2',
    title: 'The Challenge',
    platform: 'Instagram · TikTok / Reels',
    desc: 'Best recent cop. Most creative lace swap. Oldest pair in your collection. Worst resale decision you\'ve made. Submissions open Friday, winner drops Sunday.',
    revenue: '₦500–₦1,000 entry on paid weeks. Free entry to build the habit first.',
  },
  {
    week: 'Week 3',
    title: 'The Conversation',
    platform: 'Twitter / X Space · Instagram Live',
    desc: 'A topic from Lagos sneaker culture. Who set it. Why certain brands own the market here. The ethics of resale. The fake market problem. The import hustle. 45–60 minutes with a rotating guest.',
    revenue: '₦1,000 for a guaranteed question slot.',
  },
  {
    week: 'Week 4',
    title: 'The Game',
    platform: 'Twitter / X · Telegram',
    desc: 'Sneaker trivia. Rapid-fire rounds. Themed categories — Air Max history, Nigerian streetwear brands, collab guessing game. Paid entry, real prize.',
    revenue: '₦1,000–₦2,000 paid entry. Cash or exclusive access prize.',
  },
]

const TARGETS = [
  { label: 'Month 1', members: '500', engagement: '100+', paid: '20+', revenue: '₦20K+' },
  { label: 'Month 3', members: '2,000', engagement: '300+', paid: '50+', revenue: '₦100K+' },
  { label: 'Event Month', members: '5,000+', engagement: '800+', paid: '100+', revenue: '₦200K+' },
]

const PLATFORMS = [
  { name: 'Instagram', use: 'Visuals, polls, Reels, challenge submissions', freq: '3–4× per week' },
  { name: 'Twitter / X', use: 'Conversations, threads, live game sessions', freq: 'Daily + FNP anchor' },
  { name: 'TikTok', use: 'Challenge content, event previews, culture commentary', freq: '2–3× per week' },
  { name: 'WhatsApp', use: 'Broadcast for drop alerts and FNP reminders', freq: 'Weekly minimum' },
  { name: 'Telegram', use: 'Game sessions, paid Q&A, inner circle', freq: 'As needed' },
  { name: 'Substack', use: 'Conversation writeups, culture essays', freq: 'Monthly' },
]

export default function FNPPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-neon/10 border border-brand-neon/30 text-brand-neon text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
          Live Every Friday Night
        </div>
        <h1 className="font-display text-5xl sm:text-7xl text-white mb-6 leading-none">
          FRIDAY NIGHT<br /><span className="text-gradient">PROTOCOL</span>
        </h1>
        <p className="text-gray-300 text-xl max-w-2xl leading-relaxed">
          The festival doesn't go dark between events. Every Friday, the Sneakers Fest community activates. By the time June arrives, you won't be meeting strangers.
        </p>
      </div>

      <div className="bg-brand-gray rounded-3xl p-8 border border-white/5 mb-10">
        <h2 className="font-display text-3xl text-white mb-6">WHAT IT IS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { title: 'Weekly ritual', desc: 'Every Friday night, content goes out, conversations start, games run, drops get announced. The audience knows it\'s coming.' },
            { title: 'Year-round brand', desc: 'Most Lagos events run for a day and go dark. FNP is why Sneakers Fest doesn\'t. The community lives here the other 364 days.' },
            { title: 'Revenue engine', desc: 'Free tier builds the audience. Paid challenges and games run before event day. Sponsors attach to specific sessions.' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-brand-dark rounded-2xl p-5 border border-white/5">
              <h3 className="text-brand-orange font-semibold mb-2 text-xs uppercase tracking-wider">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="font-display text-3xl text-white mb-8">4-WEEK ROTATION</h2>
        <div className="space-y-4">
          {WEEKS.map(({ week, title, platform, desc, revenue }) => (
            <div key={week} className="bg-brand-gray rounded-2xl p-6 border border-white/5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-brand-orange text-xs font-mono uppercase block mb-0.5">{week}</span>
                  <h3 className="text-white font-display text-xl">{title.toUpperCase()}</h3>
                </div>
                <span className="text-gray-500 text-xs bg-brand-dark px-3 py-1 rounded-full border border-white/5">{platform}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">{desc}</p>
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <span className="text-brand-neon text-xs font-semibold">Revenue hook:</span>
                <p className="text-brand-neon text-xs">{revenue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="font-display text-3xl text-white mb-8">GROWTH TARGETS</h2>
        <div className="bg-brand-gray rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-brand-dark">
                <tr>
                  {['Milestone', 'Community', 'Weekly Engagement', 'Paid Participants', 'Monthly Revenue'].map(h => (
                    <th key={h} className="text-left text-gray-500 uppercase tracking-wider text-xs py-3 px-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TARGETS.map(({ label, members, engagement, paid, revenue }) => (
                  <tr key={label} className="border-b border-white/5 hover:bg-brand-dark/50 transition-colors">
                    <td className="py-3 px-5 text-brand-orange font-medium">{label}</td>
                    <td className="py-3 px-5 text-white">{members}</td>
                    <td className="py-3 px-5 text-white">{engagement}</td>
                    <td className="py-3 px-5 text-white">{paid}</td>
                    <td className="py-3 px-5 text-brand-neon font-semibold">{revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-brand-dark rounded-3xl p-8 border border-white/10 mb-12">
        <h2 className="font-display text-2xl text-white mb-6">PLATFORMS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORMS.map(({ name, use, freq }) => (
            <div key={name} className="rounded-xl bg-brand-gray p-4 border border-white/5">
              <p className="text-white font-semibold text-sm mb-1">{name}</p>
              <p className="text-gray-500 text-xs leading-relaxed mb-2">{use}</p>
              <p className="text-brand-orange text-xs">{freq}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-brand-gray border border-brand-neon/20 p-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-neon/10 border border-brand-neon/20 text-brand-neon text-sm mb-4">
          <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
          The ritual is the brand.
        </div>
        <p className="text-gray-300 mb-2 text-lg font-medium">FNP doesn't pause. It doesn't skip weeks.</p>
        <p className="text-gray-500 mb-8">Get in before the event fills up. Your festival ticket anchors you to the community.</p>
        <Link href="/tickets" className="inline-flex px-8 py-4 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold text-lg hover:opacity-90">
          Get Your Festival Ticket
        </Link>
      </div>
    </div>
  )
}
