import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Catalyst Talents Lagos',
  description: 'Privacy policy for Catalyst Talents Lagos — how we collect, use, and protect your personal data.',
}

export default function PrivacyPage() {
  return (
    <>
      <section
        className="pt-40 pb-16 px-4"
        style={{ background: 'linear-gradient(180deg, #050505 0%, #0d0d0d 100%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-gold text-xs tracking-[0.5em] uppercase mb-4">Legal</p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/40 text-sm">Last updated: January 2026</p>
        </div>
      </section>

      <section className="py-16 px-4 pb-24">
        <div className="max-w-3xl mx-auto space-y-12">

          <div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-4">1. Who We Are</h2>
            <p className="text-white/50 leading-relaxed">
              Catalyst Talents Lagos is the modelling and talent management division of Catalyst Concepts,
              based in Lagos, Nigeria. We are responsible for the personal data you provide to us through
              this website. For questions about this policy, contact us at{' '}
              <a href="mailto:info@catalysttalentslagos.com" className="text-gold/70 hover:text-gold transition-colors">
                info@catalysttalentslagos.com
              </a>.
            </p>
          </div>

          <div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
            <p className="text-white/50 leading-relaxed mb-4">
              We collect personal data you voluntarily provide when:
            </p>
            <ul className="space-y-2">
              {[
                'Submitting a talent application (name, contact details, measurements, portfolio links)',
                'Sending us a message via the contact form (name, email, message)',
                'Enquiring about bookings or partnerships',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/50">
                  <span className="text-gold mt-0.5 flex-shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-4">3. How We Use Your Data</h2>
            <ul className="space-y-2">
              {[
                'To review and process talent applications',
                'To respond to your enquiries',
                'To contact selected applicants about representation',
                'To send relevant updates if you have opted in',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/50">
                  <span className="text-gold mt-0.5 flex-shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-4">4. Data Retention</h2>
            <p className="text-white/50 leading-relaxed">
              Talent application data is retained for up to 24 months to allow us to reach out if
              opportunities arise. Contact form submissions are retained for 12 months. You may
              request deletion of your data at any time.
            </p>
          </div>

          <div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-4">5. Third Parties</h2>
            <p className="text-white/50 leading-relaxed">
              We use Netlify to host this website and process form submissions. Netlify may store
              form data on their servers. We do not sell or share your personal data with any
              third parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-4">6. Your Rights</h2>
            <p className="text-white/50 leading-relaxed mb-4">You have the right to:</p>
            <ul className="space-y-2">
              {[
                'Access the personal data we hold about you',
                'Request correction of inaccurate data',
                'Request deletion of your data',
                'Withdraw consent at any time',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/50">
                  <span className="text-gold mt-0.5 flex-shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-white/50 leading-relaxed mt-4">
              To exercise any of these rights, contact{' '}
              <a href="mailto:info@catalysttalentslagos.com" className="text-gold/70 hover:text-gold transition-colors">
                info@catalysttalentslagos.com
              </a>.
            </p>
          </div>

          <div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-4">7. Contact</h2>
            <p className="text-white/50 leading-relaxed">
              For any privacy-related questions or to exercise your rights, please contact us
              at{' '}
              <a href="mailto:info@catalysttalentslagos.com" className="text-gold/70 hover:text-gold transition-colors">
                info@catalysttalentslagos.com
              </a>{' '}
              or use our{' '}
              <Link href="/contact" className="text-gold/70 hover:text-gold transition-colors">
                contact form
              </Link>.
            </p>
          </div>

        </div>
      </section>
    </>
  )
}
