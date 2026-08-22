// An in-memory stand-in for the Netlify Blobs edge, faithful to the wire
// protocol the real client speaks.
//
// Every other function test here stubs the @netlify/blobs MODULE, which means
// none of them exercise the actual client - so a change to the client, such as
// a major version upgrade, is exactly the class of thing they cannot catch.
// This goes one layer lower: the real client runs, and only the network
// underneath it is replaced, by passing `fetch` into getStore.
//
// The protocol, learned by logging what the client actually sends:
//
//   GET    /{siteID}/site:{store}/{key}     read a blob
//   PUT    /{siteID}/site:{store}/{key}     write a blob
//   DELETE /{siteID}/site:{store}/{key}     remove a blob
//   GET    /{siteID}/site:{store}?prefix=   list keys
//
// Conditional writes ride on ordinary HTTP preconditions:
//   if-none-match: *        write only if the key does not exist  (onlyIfNew)
//   if-match: "<etag>"      write only if the etag still matches  (onlyIfMatch)
//
// A precondition that does not hold answers 412, which the client turns into
// { modified: false } rather than throwing. That is the whole basis of
// compare-and-swap here, so this file has to get 412 exactly right.

export function createBlobEdge() {
  // store name -> key -> { body, etag, metadata }
  const stores = new Map()
  let version = 0
  const nextEtag = () => `"v${++version}"`

  const bucket = name => {
    if (!stores.has(name)) stores.set(name, new Map())
    return stores.get(name)
  }

  const stats = { get: 0, put: 0, delete: 0, list: 0, preconditionFailed: 0 }

  // Requests can be made to overlap deliberately, so a test can reproduce the
  // interleaving that a plain read-modify-write gets wrong.
  let delay = () => Promise.resolve()

  const fetch = async (url, opts = {}) => {
    const u = new URL(url)
    const method = String(opts.method || 'GET').toUpperCase()
    // /{siteID}/site:{storeName}[/{key}]
    const parts = u.pathname.split('/').filter(Boolean)
    const storeName = (parts[1] || '').replace(/^site:/, '')
    const key = parts.slice(2).join('/')
    const b = bucket(storeName)
    const headers = new Headers(opts.headers || {})

    await delay()

    if (method === 'GET' && !key) {
      stats.list++
      const prefix = u.searchParams.get('prefix') || ''
      const blobs = [...b.entries()]
        .filter(([k]) => k.startsWith(prefix))
        .map(([k, v]) => ({ key: k, etag: v.etag, size: v.body.length, last_modified: new Date(0).toISOString() }))
      return new Response(JSON.stringify({ blobs, directories: [] }),
        { status: 200, headers: { 'content-type': 'application/json' } })
    }

    if (method === 'GET') {
      stats.get++
      const rec = b.get(key)
      if (!rec) return new Response('Not found', { status: 404 })
      return new Response(rec.body, {
        status: 200,
        headers: {
          etag: rec.etag,
          'content-type': 'application/octet-stream',
          ...(rec.metadata ? { 'x-amz-meta-user': JSON.stringify(rec.metadata) } : {}),
        },
      })
    }

    if (method === 'PUT') {
      stats.put++
      const existing = b.get(key)
      const ifNoneMatch = headers.get('if-none-match')
      const ifMatch = headers.get('if-match')

      if (ifNoneMatch === '*' && existing) {
        stats.preconditionFailed++
        return new Response('Precondition Failed', { status: 412 })
      }
      if (ifMatch && (!existing || existing.etag !== ifMatch)) {
        stats.preconditionFailed++
        return new Response('Precondition Failed', { status: 412 })
      }

      const body = opts.body == null ? '' : String(opts.body)
      const etag = nextEtag()
      b.set(key, { body, etag, metadata: null })
      return new Response('', { status: 200, headers: { etag } })
    }

    if (method === 'DELETE') {
      stats.delete++
      b.delete(key)
      // 204 means no content, and the Response constructor enforces that: a
      // body of '' rather than null throws.
      return new Response(null, { status: 204 })
    }

    return new Response('Method not allowed', { status: 405 })
  }

  return {
    fetch,
    stats,
    stores,
    /** Make every request yield, so concurrent callers genuinely interleave. */
    setDelay(fn) { delay = fn },
    reset() { stores.clear(); version = 0; for (const k of Object.keys(stats)) stats[k] = 0 },
    options(name) {
      return {
        name, siteID: 'test-site', token: 'test-token',
        edgeURL: 'http://blobs.test', uncachedEdgeURL: 'http://blobs.test',
        fetch,
      }
    },
  }
}
