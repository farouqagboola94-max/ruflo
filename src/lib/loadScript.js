// Loading third-party SDKs when they are actually needed.
//
// index.html used to pull three of them on every single page view: the Netlify
// Identity widget (render-blocking, so it held up first paint), Paystack, and
// Flutterwave. Most visitors never sign in and never reach checkout, so most
// visitors were paying for all three - and on Lagos mobile data that is a real
// cost, not a rounding error.

const cache = new Map()

/**
 * Load a script once and resolve when it is ready.
 *
 * Repeat calls for the same URL share one promise and one <script> tag, so a
 * visitor who opens the payment modal three times still downloads once. A
 * failure is evicted from the cache so a later attempt can retry - a checkout
 * that fails on a flaky connection must not be permanently poisoned.
 */
export function loadScript(src, { timeoutMs = 15000, doc = document } = {}) {
  if (cache.has(src)) return cache.get(src)

  const promise = new Promise((resolve, reject) => {
    const el = doc.createElement('script')
    el.src = src
    el.async = true

    let settled = false
    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      cache.delete(src)
      reject(new Error(`Timed out loading ${src}`))
    }, timeoutMs)

    el.onload = () => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve(true)
    }
    el.onerror = () => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      cache.delete(src)
      // The tag is left in place deliberately: removing it mid-flight has been
      // known to confuse browsers that are still settling the request.
      reject(new Error(`Failed to load ${src}`))
    }

    doc.head.appendChild(el)
  })

  cache.set(src, promise)
  return promise
}

/** Test seam. Not used by the app. */
export function _resetScriptCache() {
  cache.clear()
}

export const SDK = {
  paystack:    'https://js.paystack.co/v1/inline.js',
  flutterwave: 'https://checkout.flutterwave.com/v3.js',
  identity:    'https://identity.netlify.com/v1/netlify-identity-widget.js',
}

/**
 * Load an SDK and confirm the global it is supposed to define actually turned
 * up. A script can load from a captive portal or a stale cache and define
 * nothing; without this check the caller would go on to read undefined.
 */
export async function loadSDK(name, globalName, opts = {}) {
  const src = SDK[name]
  if (!src) throw new Error(`Unknown SDK: ${name}`)

  const scope = opts.scope || (typeof window !== 'undefined' ? window : {})
  if (scope[globalName]) return scope[globalName]

  await loadScript(src, opts)

  if (!scope[globalName]) {
    cache.delete(src)
    throw new Error(`${name} loaded but did not provide ${globalName}`)
  }
  return scope[globalName]
}
