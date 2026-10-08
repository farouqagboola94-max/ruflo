import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { setPassportUser } from './passport'
import { loadSDK } from './loadScript'

// The Netlify Identity widget used to be a render-blocking script tag in
// index.html - downloaded and parsed before the page could paint, on every
// visit, for a login most visitors never use. It is fetched here on the first
// sign-in attempt instead.
//
// The trade is that `login()` is now async and can fail, so it reports that
// rather than doing nothing when the network is bad.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const niRef = useRef(null)
  const cleanupRef = useRef(null)

  useEffect(() => {
    setPassportUser(user?.email ?? null)
  }, [user])

  // Listeners can only be attached once the widget exists, so this runs at
  // load time rather than on mount.
  const ensure = useCallback(async () => {
    if (niRef.current) return niRef.current

    const ni = await loadSDK('identity', 'netlifyIdentity')
    ni.init()

    const onLogin  = u => { setUser(u); ni.close() }
    const onLogout = () => setUser(null)
    const onInit   = u => setUser(u)
    ni.on('login', onLogin)
    ni.on('logout', onLogout)
    ni.on('init', onInit)

    cleanupRef.current = () => {
      ni.off('login', onLogin)
      ni.off('logout', onLogout)
      ni.off('init', onInit)
    }

    // A session from a previous visit is only discoverable once the widget is
    // up, so anyone already signed in is restored at this point.
    const current = ni.currentUser()
    if (current) setUser(current)

    niRef.current = ni
    return ni
  }, [])

  useEffect(() => () => { cleanupRef.current?.() }, [])

  // Loading the widget only on click would leave someone who signed in last
  // visit looking signed out until they clicked something. The widget keeps
  // its session in localStorage under `gotrue.user`, so that key is a cheap
  // signal: if it is there, fetch the widget quietly once the page is idle.
  // Visitors who have never signed in - almost everyone - still pay nothing.
  useEffect(() => {
    let hasSession = false
    try { hasSession = Boolean(localStorage.getItem('gotrue.user')) } catch {}
    if (!hasSession) return

    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 1200))
    const id = idle(() => { ensure().catch(() => {}) })
    return () => { window.cancelIdleCallback?.(id) }
  }, [ensure])

  const open = useCallback(async (mode) => {
    setAuthError(''); setLoading(true)
    try {
      const ni = await ensure()
      ni.open(mode)
    } catch {
      setAuthError('Sign-in is unavailable right now. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [ensure])

  const logout = useCallback(() => {
    niRef.current?.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      authError,
      authLoading: loading,
      login:  () => open('login'),
      signup: () => open('signup'),
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
