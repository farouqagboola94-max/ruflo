import { useState } from 'react'
import { B } from '../tokens'
import { claimEgg, hasFoundEgg, EGG_XP } from '../lib/easterEggs'

const CORNERS = {
  'top-left': { top: '6%', left: '3%' },
  'top-right': { top: '6%', right: '3%' },
  'bottom-left': { bottom: '6%', left: '3%' },
  'bottom-right': { bottom: '6%', right: '3%' },
  center: { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' },
}

// A tiny, easy-to-miss clickable dot hidden inside a section. Click (or tap)
// to claim it — each egg can only ever be claimed once per browser.
export default function Egg({ id, corner = 'bottom-right' }) {
  const [found, setFound] = useState(() => hasFoundEgg(id))
  const [justFound, setJustFound] = useState(false)
  const pos = CORNERS[corner] || CORNERS['bottom-right']

  if (found && !justFound) return null

  function onClaim() {
    if (found) return
    claimEgg(id)
    setFound(true)
    setJustFound(true)
    setTimeout(() => setJustFound(false), 2200)
  }

  return (
    <div
      onClick={onClaim}
      role="button"
      aria-label="hidden easter egg"
      title=""
      style={{
        position: 'absolute',
        ...pos,
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: justFound ? B.amber : `${B.amber}22`,
        border: `1px solid ${B.amber}33`,
        cursor: 'pointer',
        zIndex: 5,
        boxShadow: justFound ? `0 0 16px ${B.amber}` : 'none',
        transition: 'box-shadow 0.3s, background 0.3s',
      }}
    >
      {justFound && (
        <div
          style={{
            position: 'absolute',
            bottom: '120%',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            background: B.black,
            border: `1px solid ${B.amber}`,
            color: B.amber,
            fontSize: 11,
            letterSpacing: '0.05em',
            padding: '4px 10px',
            borderRadius: 4,
          }}
        >
          EGG FOUND +{EGG_XP} XP
        </div>
      )}
    </div>
  )
}
