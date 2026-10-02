import Link from 'next/link'
export default function TermsPage() {
 return <article className="mx-auto max-w-3xl space-y-6 px-5 py-16 text-gray-300">
 <h1 className="font-display text-4xl text-white">WEBSITE TERMS</h1>
 <p>Sneakers Fest is an online-first culture platform building toward 12 December 2026 in Lagos. The venue, final programme and commercial terms will be published when confirmed.</p>
 <h2 className="text-xl text-white">Accounts and community</h2><p>Use accurate contact details, keep your account secure, and do not submit abusive content, spam or another person’s private information. Saved sneakers and practice game scores do not create purchase rights or tournament qualification.</p>
 <h2 className="text-xl text-white">Enquiries and sample catalog</h2><p>Submitting a form registers interest. It does not confirm a vendor space, sponsorship, ticket or marketplace listing. Catalog images and values are illustrative references; this website currently has no live sneaker checkout.</p>
 <h2 className="text-xl text-white">Tickets and raffle</h2><p>Tix Africa is the official ticketing platform. The event-specific sales link, pricing and purchase terms must be confirmed before sales begin. Raffle entry opens only after the team publishes the rules and eligibility. Never pay based only on a sample listing.</p>
 <p><Link href="/contact" className="text-brand-orange underline">Contact support</Link> · <Link href="/privacy" className="text-brand-orange underline">Privacy</Link></p>
 </article>
}
