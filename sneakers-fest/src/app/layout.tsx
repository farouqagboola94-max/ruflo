import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ClientProviders from '@/components/ClientProviders'

export const metadata: Metadata = {
  title: 'SneakersFest 2026 | Africa\'s Ultimate Sneaker Culture Event',
  description: 'Join 10,000+ sneakerheads at Africa\'s biggest sneaker event. Buy, sell, trade, and celebrate sneaker culture. December 12–13, 2026 in Lagos.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <Navbar />
          <main className="pt-16 min-h-screen">{children}</main>
          <Footer />
        </ClientProviders>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
