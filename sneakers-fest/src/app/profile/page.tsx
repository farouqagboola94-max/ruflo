'use client'

import { useAuth } from '@/context/AuthContext'
import { SNEAKERS } from '@/data/sneakers'
import SneakerCard from '@/components/SneakerCard'

export default function ProfilePage() {
  const { user, openAuth, logout } = useAuth()

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center">
        <div className="text-6xl mb-6">👟</div>
        <h1 className="font-display text-4xl text-white mb-3">YOUR PROFILE</h1>
        <p className="text-gray-400 mb-8">Sign in to view your favorites, tickets, and account details.</p>
        <button onClick={openAuth} className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold text-lg hover:opacity-90">
          Sign In
        </button>
      </div>
    )
  }

  const favorites = SNEAKERS.filter(s => user.favorites.includes(s.id))
  const initials = user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12 pb-10 border-b border-white/10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange to-brand-yellow flex items-center justify-center text-black font-display text-2xl font-bold">
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-3xl text-white">{user.name.toUpperCase()}</h1>
          <p className="text-gray-400">{user.email}</p>
          <p className="text-gray-500 text-sm mt-1">{user.tickets.length} ticket{user.tickets.length !== 1 ? 's' : ''} · {user.favorites.length} saved</p>
        </div>
        <button onClick={logout} className="px-5 py-2 rounded-full border border-white/20 text-gray-300 hover:text-white hover:border-white/40 text-sm transition-colors">Sign Out</button>
      </div>

      {user.tickets.length > 0 && (
        <div className="mb-12">
          <h2 className="font-display text-2xl text-white mb-6">MY TICKETS</h2>
          <div className="space-y-3">
            {user.tickets.map((t, i) => (
              <div key={i} className="flex items-center justify-between bg-brand-gray rounded-xl p-5 border border-white/5">
                <div>
                  <p className="text-white font-semibold">{t.tier}</p>
                  <p className="text-gray-400 text-sm">{t.quantity} ticket{t.quantity > 1 ? 's' : ''} · {t.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-brand-orange font-bold">₦{t.total.toLocaleString()}</p>
                  <p className="text-gray-600 text-xs font-mono">{t.ref}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-display text-2xl text-white mb-6">
          SAVED SNEAKERS {favorites.length > 0 && <span className="text-brand-orange">({favorites.length})</span>}
        </h2>
        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-brand-gray rounded-2xl border border-white/5">
            <div className="text-4xl mb-3">🤍</div>
            <p className="text-gray-400">No saved sneakers yet.</p>
            <a href="/catalog" className="inline-block mt-4 text-brand-orange text-sm hover:underline">Browse the catalog →</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(s => <SneakerCard key={s.id} sneaker={s} />)}
          </div>
        )}
      </div>
    </div>
  )
}
