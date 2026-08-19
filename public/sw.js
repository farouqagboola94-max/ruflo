// SF26 Service Worker - offline-first cache strategy
//
// PRECACHE and CACHE_NAME are rewritten at build time by the sw-precache
// plugin in vite.config.js. The values below are the dev-server defaults.
//
// Precaching is the whole point. This worker registers on window.load, which
// means every script the page needed has already been fetched around it by
// then - so left to its runtime handlers it caches nothing but its own
// install list, and a visitor who came once gets a blank page offline. That
// was the measured behaviour: three entries cached, zero sections rendered.
const CACHE_NAME = 'sf26-dev'
const PRECACHE = [
  '/',
  '/manifest.json',
  '/favicon.svg',
]
const CORE_ASSETS = PRECACHE

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // addAll is all-or-nothing: one 404 and the entire install rejects, so
      // the worker never activates and nothing is cached at all. Individual
      // puts mean a single missing file costs only that file.
      await Promise.all(CORE_ASSETS.map(url =>
        cache.add(url).catch(() => {})
      ))
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin and non-GET requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  // Skip Netlify functions — always network
  if (url.pathname.startsWith('/.netlify/')) return

  // Network-first for navigation requests, cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(c => c.put(request, clone))
          return res
        })
        // caches.match() always returns a Promise (truthy), so `a || b` would
        // never fall through — resolve the request first, then the shell.
        .catch(async () => (await caches.match(request)) || (await caches.match('/')) ||
          new Response('<h1>Offline</h1><p>Reconnect and reload.</p>', { headers: { 'Content-Type': 'text/html' }, status: 503 }))
    )
    return
  }

  // Cache-first for static assets (JS, CSS, fonts, images)
  if (/\.(js|css|woff2?|png|jpg|svg|ico|webp)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(res => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(c => c.put(request, clone))
          return res
        })
      })
    )
    return
  }

  // Stale-while-revalidate for everything else
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(request).then(cached => {
        const fetched = fetch(request).then(res => {
          cache.put(request, res.clone())
          return res
        }).catch(() => null)
        return cached || fetched
      })
    )
  )
})
