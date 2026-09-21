import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ClientProviders from '@/components/ClientProviders'
import { EVENT_FACTS } from '@/data/eventFacts'

export const metadata: Metadata = {
  title: 'Sneakers Fest Lagos 2026 | Online-first sneaker culture',
  description: `${EVENT_FACTS.positioning} ${EVENT_FACTS.date}. ${EVENT_FACTS.city}.`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <Navbar />
          <main className="pt-[100px] min-h-screen">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  )
}
