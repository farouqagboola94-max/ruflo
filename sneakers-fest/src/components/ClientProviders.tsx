'use client'

import { AuthProvider } from '@/context/AuthContext'
import AuthModal from './AuthModal'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <AuthModal />
    </AuthProvider>
  )
}
