import FaqAccordion from '@/components/FaqAccordion'
import { ContactForm } from '@/components/LeadCaptureForms'
import { EVENT_FACTS } from '@/data/eventFacts'

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Official updates</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">CONTACT & FAQ</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Follow the official channels for event, ticket, venue, vendor, and partnership announcements.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
        <div className="bg-brand-gray rounded-2xl p-6 border border-white/5">
          <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-2">Event date</p>
          <p className="text-white font-semibold">{EVENT_FACTS.date}</p>
          <p className="text-gray-500 text-sm mt-1">Lagos, venue to be announced</p>
        </div>
        <div className="bg-brand-gray rounded-2xl p-6 border border-white/5">
          <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-2">Instagram</p>
          <a href={EVENT_FACTS.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-brand-orange">
            {EVENT_FACTS.instagramHandle}
          </a>
          <p className="text-gray-500 text-sm mt-1">Primary event updates</p>
        </div>
        <div className="bg-brand-gray rounded-2xl p-6 border border-white/5">
          <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-2">TikTok</p>
          <a href={EVENT_FACTS.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-brand-orange">
            @s_fest26
          </a>
          <p className="text-gray-500 text-sm mt-1">Culture and creator content</p>
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-8">
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Direct enquiry</p>
          <h2 className="font-display text-4xl text-white mb-3">SEND A MESSAGE</h2>
          <p className="text-gray-400">Use this form for press, accessibility, ticket, and community questions.</p>
        </div>
        <ContactForm />
      </section>

      <section>
        <div className="mb-8">
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Answers</p>
          <h2 className="font-display text-4xl text-white">FREQUENTLY ASKED</h2>
        </div>
        <FaqAccordion />
      </section>
    </div>
  )
}
