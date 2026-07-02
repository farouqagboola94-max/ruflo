import { createContext, useContext, useEffect, useState } from 'react'
import { setPassportUser } from './passport'

// netlify-identity-widget is loaded via CDN script tag in index.html
// (blocking script, so window.netlifyIdentity is available before this module runs)
const ni = window.netlifyIdentity

if (ni) {
  ni.init()
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => ni?.currentUser() ?? null)

  useEffect(() => {
    setPassportUser(user?.email ?? null)
  }, [user])

  useEffect(() => {
    if (!ni) return
    const onLogin = u => { setUser(u); ni.close() }
    const onLogout = () => setUser(null)
    const onInit = u => setUser(u)
    ni.on('login', onLogin)
    ni.on('logout', onLogout)
    ni.on('init', onInit)
    return () => {
      ni.off('login', onLogin)
      ni.off('logout', onLogout)
      ni.off('init', onInit)
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      login:  () => ni?.open('login'),
      signup: () => ni?.open('signup'),
      logout: () => ni?.logout(),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
