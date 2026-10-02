import Link from 'next/link'
export default function PrivacyPage() {
  return <article className="mx-auto max-w-3xl space-y-6 px-5 py-16 text-gray-300">
    <h1 className="font-display text-4xl text-white">PRIVACY & YOUR DATA</h1>
    <p>Updated 29 September 2026. This notice describes the current Sneakers Fest website.</p>
    <h2 className="text-xl text-white">What you share</h2><p>Waitlists, newsletters and enquiries collect the details shown on each form, including contact information and your interests. Accounts use your name and email; saved sneakers are linked to your account. Please do not send payment card details or sensitive personal information through these forms.</p>
    <h2 className="text-xl text-white">Where records are stored</h2><p>Form submissions are stored in Netlify for the event team to review and export. Supabase manages account authentication and saved sneakers. Passwords are handled by the authentication service, not saved as plain text by this website. Account sessions use browser storage to keep you signed in. The game keeps its practice best score on your device.</p>
    <h2 className="text-xl text-white">How we use your details</h2><p>The event team uses enquiries to respond and coordinate requested participation. Joining a waitlist or newsletter requests the relevant updates; it does not purchase a ticket or reserve a booth. Our hosting and account providers process data to operate these services.</p>
    <h2 className="text-xl text-white">Your choices</h2><p>You can remove saved sneakers from your profile and sign out on shared devices. To unsubscribe, request correction, request deletion of records or your account, or ask about retention, use the contact form and select “Privacy / unsubscribe”. The team may need to verify the request before acting.</p>
    <h2 className="text-xl text-white">External destinations</h2><p>Instagram, TikTok and ticketing sites have their own policies. Follow the official links and review the terms shown by those providers.</p>
    <Link href="/contact" className="inline-block rounded-full bg-brand-orange px-6 py-3 font-bold text-black">Contact the team</Link>
  </article>
}
