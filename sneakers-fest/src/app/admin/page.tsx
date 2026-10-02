import Link from 'next/link'
export default function AdminPage() {
 const tools = [
 { label: 'Enquiries and waitlists', description: 'Review the seven intake forms and export records for follow-up.', href: 'https://app.netlify.com/projects/sneakers-fest-app/forms' },
 { label: 'Accounts and saved sneakers', description: 'Manage accounts and database access in the Sneakers Fest project.', href: 'https://supabase.com/dashboard/project/qeoqxowpnrmttjupxkeb' },
 { label: 'Website deployments', description: 'Review releases, build logs and deploy history.', href: 'https://app.netlify.com/projects/sneakers-fest-app/deploys' },
 ]
 return <section className="mx-auto max-w-4xl px-5 py-16"><p className="text-brand-orange">Staff operations</p><h1 className="my-4 font-display text-4xl">OPERATIONS ACCESS</h1>
 <p className="mb-8 text-gray-400">Each service requires its own authorised team login. Visitor accounts do not grant access to enquiries or administration.</p>
 <div className="grid gap-5 md:grid-cols-3">{tools.map(tool => <a key={tool.href} href={tool.href} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/10 bg-brand-gray p-6"><h2 className="text-lg font-bold text-brand-orange">{tool.label} ↗</h2><p className="mt-3 text-sm text-gray-400">{tool.description}</p></a>)}</div>
 <p className="mt-8 text-gray-400">Ticket sales and gate validation require the event-specific Tix Africa setup. <Link href="/gate" className="text-brand-orange underline">Check-in information</Link></p>
 </section>
}
