import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ClientProviders from '@/components/ClientProviders'
import NetlifyForms from '@/components/NetlifyForms'
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
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:p-3 focus:text-black">Skip to content</a>
          <Navbar />
          <main id="main-content" className="pt-[100px] min-h-screen">{children}</main>
          <NetlifyForms />
          <Footer />
        </ClientProviders>
      </body>
    </html>
  )
}
