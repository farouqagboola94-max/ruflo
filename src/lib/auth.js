import netlifyIdentity from 'netlify-identity-widget'
import { createContext, useContext, useEffect, useState } from 'react'
import { setPassportUser } from './passport'

netlifyIdentity.init()

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => netlifyIdentity.currentUser())

  useEffect(() => {
    setPassportUser(user?.email ?? null)
  }, [user])

  useEffect(() => {
    const onLogin = u => { setUser(u); netlifyIdentity.close() }
    const onLogout = () => setUser(null)
    const onInit = u => setUser(u)
    netlifyIdentity.on('login', onLogin)
    netlifyIdentity.on('logout', onLogout)
    netlifyIdentity.on('init', onInit)
    return () => {
      netlifyIdentity.off('login', onLogin)
      netlifyIdentity.off('logout', onLogout)
      netlifyIdentity.off('init', onInit)
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      login: () => netlifyIdentity.open('login'),
      signup: () => netlifyIdentity.open('signup'),
      logout: () => netlifyIdentity.logout(),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
