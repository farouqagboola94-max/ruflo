import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { B } from '../tokens'
import { SECTIONS, ACTIONS, CATEGORIES, searchIndex } from '../lib/siteIndex'

const RECENT_KEY = 'sf26_palette_recent'
const MAX_RECENT = 5

// Shown when the input is empty — the paths most people actually want.
const QUICK_IDS = ['tickets', 'schedule', 'venue', 'waitlist', 'merch', 'vendors']

function readRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || [] } catch { return [] }
}

function pushRecent(id) {
  try {
    const next = [id, ...readRecent().filter(x => x !== id)].slice(0, MAX_RECENT)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {}
}

const byId = id => SECTIONS.find(s => s.id === id) || ACTIONS.find(a => a.id === id)

/**
 * Sections are lazy-loaded, so an anchor may not exist the instant it is
 * requested. Retry briefly while the chunk resolves before giving up.
 */
function scrollToSection(id, attempt = 0) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  if (attempt < 12) setTimeout(() => scrollToSection(id, attempt + 1), 120)
}

export default function CommandPalette() {
  const [open,     setOpen]     = useState(false)
  const [query,    setQuery]    = useState('')
  const [active,   setActive]   = useState(0)
  const [recent,   setRecent]   = useState([])
  const inputRef   = useRef(null)
  const listRef    = useRef(null)
  const restoreRef = useRef(null)

  // Flat, ordered list of what is currently on screen — the thing arrow
  // keys walk and Enter commits.
  const results = useMemo(() => {
    if (query.trim()) return searchIndex(query)
    const picks = [...recent, ...QUICK_IDS.filter(id => !recent.includes(id))]
    return picks.map(byId).filter(Boolean).slice(0, 9)
  }, [query, recent])

  const grouped = useMemo(() => {
    if (!query.trim()) return null
    const map = new Map()
    for (const r of results) {
      const key = r.c || 'actions'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(r)
    }
    return [...map.entries()]
  }, [results, query])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActive(0)
    if (restoreRef.current?.focus) restoreRef.current.focus()
  }, [])

  const go = useCallback(item => {
    if (!item) return
    pushRecent(item.id)
    if (item.ext) {
      window.open(item.href, '_blank', 'noopener,noreferrer')
    } else if (item.href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      scrollToSection(item.id)
    }
    close()
  }, [close])

  // Global open/close shortcuts.
  useEffect(() => {
    const onKey = e => {
      const k = e.key?.toLowerCase()
      if (k === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        restoreRef.current = document.activeElement
        setOpen(v => !v)
        return
      }
      // "/" opens, but never while the user is typing somewhere else.
      const tag = document.activeElement?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || document.activeElement?.isContentEditable
      if (e.key === '/' && !typing && !open) {
        e.preventDefault()
        restoreRef.current = document.activeElement
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    // Any element can request the palette: dispatch `sf26:palette`.
    const onRequest = () => { restoreRef.current = document.activeElement; setOpen(true) }
    window.addEventListener('sf26:palette', onRequest)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('sf26:palette', onRequest)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    setRecent(readRecent())
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => inputRef.current?.focus(), 30)
    return () => { document.body.style.overflow = ''; clearTimeout(t) }
  }, [open])

  useEffect(() => { setActive(0) }, [query])

  // Keep the highlighted row inside the scroll viewport.
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const onInputKey = e => {
    if (e.key === 'Escape')    { e.preventDefault(); close() }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => (i + 1) % Math.max(results.length, 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => (i - 1 + results.length) % Math.max(results.length, 1)) }
    if (e.key === 'Enter')     { e.preventDefault(); go(results[active]) }
    if (e.key === 'Home')      { e.preventDefault(); setActive(0) }
    if (e.key === 'End')       { e.preventDefault(); setActive(results.length - 1) }
  }

  if (!open) return null

  let cursor = -1 // running index so grouped rows share the flat keyboard order

  const Row = item => {
    cursor += 1
    const idx = cursor
    const on  = idx === active
    const accent = item.c ? B[CATEGORIES[item.c].color] : B.amber
    return (
      <button
        key={item.id}
        data-idx={idx}
        onClick={() => go(item)}
        onMouseMove={() => active !== idx && setActive(idx)}
        style={{
          display: 'flex', alignItems: 'center', gap: 14, width: '100%',
          padding: '11px 16px', textAlign: 'left', cursor: 'pointer',
          background: on ? `${accent}12` : 'transparent',
          border: 'none', borderLeft: `2px solid ${on ? accent : 'transparent'}`,
          transition: 'background 0.12s, border-color 0.12s',
        }}
      >
        <div style={{
          width: 26, height: 26, flexShrink: 0, borderRadius: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: on ? accent : B.gunmetal, transition: 'background 0.12s',
        }}>
          <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 9, color: on ? B.black : B.smoke }}>
            {item.t.charAt(0)}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: on ? 700 : 400, color: on ? B.white : B.mist, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.t}{item.ext ? ' ↗' : ''}
          </div>
          {item.d && (
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.d}
            </div>
          )}
        </div>
        {on && (
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: accent, letterSpacing: '0.16em', flexShrink: 0 }}>ENTER ↵</span>
        )}
      </button>
    )
  }

  const GroupLabel = text => (
    <div key={`h-${text}`} style={{
      padding: '14px 16px 6px', fontFamily: "'Space Mono', monospace",
      fontSize: 9, color: B.smoke + '80', letterSpacing: '0.3em',
    }}>{text}</div>
  )

  return (
    <>
      <style>{`
        @keyframes paletteIn { from { opacity:0; transform:translateY(-10px) scale(0.985) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes paletteFade { from { opacity:0 } to { opacity:1 } }
        .sf26-palette input::placeholder { color: ${B.smoke}70; }
        @media (prefers-reduced-motion: reduce) {
          .sf26-palette, .sf26-palette-shell { animation: none !important; }
        }
      `}</style>

      <div
        className="sf26-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        onMouseDown={e => { if (e.target === e.currentTarget) close() }}
        style={{
          position: 'fixed', inset: 0, zIndex: 4000,
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(7px)', WebkitBackdropFilter: 'blur(7px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '10vh 16px 16px', animation: 'paletteFade 0.16s ease',
        }}
      >
        <div
          className="sf26-palette-shell"
          style={{
            width: '100%', maxWidth: 620, maxHeight: '76vh',
            display: 'flex', flexDirection: 'column',
            background: B.void, border: `1px solid ${B.gunmetal}`, borderRadius: 10,
            boxShadow: `0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px ${B.amber}12`,
            overflow: 'hidden', animation: 'paletteIn 0.18s cubic-bezier(0.2,0.9,0.3,1)',
          }}
        >
          <div style={{ height: 2, background: `linear-gradient(90deg, ${B.amber}, ${B.neonCyan}, ${B.neonMagenta})`, flexShrink: 0 }} />

          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderBottom: `1px solid ${B.gunmetal}`, flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" stroke={B.amber} strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke={B.amber} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Search tickets, venue, games, vendors..."
              aria-label="Search the site"
              autoComplete="off"
              spellCheck="false"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: B.white, fontFamily: "'Syne', sans-serif", fontSize: 16,
              }}
            />
            <button
              onClick={close}
              aria-label="Close search"
              style={{
                flexShrink: 0, background: 'transparent', border: `1px solid ${B.gunmetal}`,
                borderRadius: 3, padding: '4px 8px', cursor: 'pointer',
                fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.12em',
              }}
            >ESC</button>
          </div>

          {/* Results */}
          <div ref={listRef} style={{ overflowY: 'auto', flex: 1, paddingBottom: 6 }}>
            {results.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 900, color: B.smoke, marginBottom: 6 }}>NOTHING FOUND</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke }}>
                  No match for "{query}". Try "tickets", "venue" or "games".
                </div>
              </div>
            )}

            {!query.trim() && results.length > 0 &&
              GroupLabel(recent.length ? 'JUMP BACK IN' : 'POPULAR')}
            {!query.trim() && results.map(Row)}

            {grouped?.map(([key, items]) => (
              <div key={key}>
                {GroupLabel(CATEGORIES[key]?.label || 'ACTIONS')}
                {items.map(Row)}
              </div>
            ))}
          </div>

          {/* Footer hints */}
          <div style={{
            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 10, flexWrap: 'wrap', padding: '9px 16px',
            borderTop: `1px solid ${B.gunmetal}`, background: B.black,
            fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke + '90', letterSpacing: '0.14em',
          }}>
            <span>↑↓ NAVIGATE &nbsp;·&nbsp; ↵ OPEN &nbsp;·&nbsp; ESC CLOSE</span>
            <span style={{ color: B.amber + 'AA' }}>{SECTIONS.length} SECTIONS INDEXED</span>
          </div>
        </div>
      </div>
    </>
  )
}

/** Fire from anywhere (navbar, menus) to open the palette. */
export function openPalette() {
  window.dispatchEvent(new CustomEvent('sf26:palette'))
}
