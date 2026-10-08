import { useState, useEffect, useCallback } from 'react'

// Shared counters, read from and written to /.netlify/functions/hype.
//
// Several sections used to open at a hardcoded number - "2,341 badges created
// today", "1,432 played", "1,847 collectors revealed their worth" - and add
// this browser's own activity on top. None of those figures had ever been
// true, and no two visitors ever saw the same one.

const ENDPOINT = '/.netlify/functions/hype'

export async function readCounter(name) {
  const res = await fetch(`${ENDPOINT}?counter=${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error('counter unavailable')
  const data = await res.json()
  if (!Number.isFinite(data?.total)) throw new Error('counter unavailable')
  return data.total
}

export async function bumpCounter(name, by = 1) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ counter: name, taps: by }),
  })
  if (!res.ok) throw new Error('counter unavailable')
  const data = await res.json()
  return Number.isFinite(data?.total) ? data.total : null
}

/**
 * `null` until the real number arrives. Sections render a dash rather than a
 * placeholder figure, because a plausible-looking wrong number is worse than
 * an obvious blank.
 */
export function useCounter(name) {
  const [total, setTotal] = useState(null)

  useEffect(() => {
    let alive = true
    readCounter(name).then(n => { if (alive) setTotal(n) }).catch(() => {})
    return () => { alive = false }
  }, [name])

  const bump = useCallback(async (by = 1) => {
    try {
      const n = await bumpCounter(name, by)
      if (n !== null) setTotal(n)
    } catch {}
  }, [name])

  return [total, bump]
}
