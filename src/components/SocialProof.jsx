import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'

const NAMES = [
  'Tunde O.','Chisom A.','Bayo K.','Amaka E.','Seun F.',
  'Emeka D.','Kemi L.','Yetunde B.','Damilola I.','Femi O.',
  'Ngozi C.','Rotimi A.','Adaeze N.','Kunle M.','Sade T.',
  'Ibrahim K.','Halima Y.','Gbenga L.','Tolulope E.','Chinwe O.',
  'Olumide A.','Nkechi R.','Akin B.','Chika E.','Funmi O.',
]
const AREAS = [
  'Victoria Island','Lekki Phase 1','Ikeja GRA','Yaba','Surulere',
  'Ikoyi','Ajah','Gbagada','Maryland','Magodo',
  'Abuja','Port Harcourt','Ibadan','Accra, Ghana','London, UK',
  'Houston TX','Toronto','Kano','Enugu','Warri',
]
const TIERS = [
  { name:'GENERAL', color:B.neonCyan,    price:'₤5,000'  },
  { name:'VIP',     color:B.amber,       price:'₤10,000' },
  { name:'VVIP',    color:B.neonMagenta, price:'₤25,000' },
  { name:'PHALANX', color:B.neonLime,    price:'₤50,000' },
]
// Weighted: more generals than phalanx (believable distribution)
const POOL = [
  ...Array(6).fill(0), ...Array(4).fill(1),
  ...Array(2).fill(2), ...Array(1).fill(3),
]
const pick = arr => arr[Math.floor(Math.random() * arr.length)]

export default function SocialProof() {
  const [notif,   setNotif]   = useState(null)
  const [visible, setVisible] = useState(false)
  const t1 = useRef(null)
  const t2 = useRef(null)

  useEffect(() => {
    const fire = () => {
      const tier = TIERS[pick(POOL)]
      setNotif({
        name: pick(NAMES),
        area: pick(AREAS),
        tier,
        mins: Math.floor(Math.random() * 9) + 1,
      })
      setVisible(true)
      t2.current = setTimeout(() => setVisible(false), 5500)
      t1.current = setTimeout(fire, 32000 + Math.floor(Math.random() * 44000))
    }
    t1.current = setTimeout(fire, 14000 + Math.floor(Math.random() * 8000))
    return () => { clearTimeout(t1.current); clearTimeout(t2.current) }
  }, [])

  if (!notif) return null

  return (
    <div style={{
      position: 'fixed', bottom: 84, left: 16, zIndex: 900,
      maxWidth: 290,
      pointerEvents: visible ? 'auto' : 'none',
      transform: visible ? 'translateX(0)' : 'translateX(-24px)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.4s cubic-bezier(0.34,1.4,0.64,1), opacity 0.35s ease',
    }}>
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 10, bottom: 10, width: 3,
        background: notif.tier.color,
        borderRadius: '0 2px 2px 0',
        boxShadow: `0 0 10px ${notif.tier.color}55`,
      }} />

      <div style={{
        background: 'rgba(8,8,14,0.96)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: '12px 14px 12px 18px',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)',
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8, flexShrink: 0,
          background: `${notif.tier.color}18`,
          border: `1px solid ${notif.tier.color}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15,
        }}>🎟️</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Syne',sans-serif", fontSize: 12,
            color: B.white, fontWeight: 600,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {notif.name} just secured a ticket
          </div>
          <div style={{
            fontFamily: "'Space Mono',monospace", fontSize: 8.5,
            color: notif.tier.color, letterSpacing: '0.1em', marginTop: 2,
          }}>
            {notif.tier.name} · {notif.tier.price}
          </div>
          <div style={{
            fontFamily: "'Space Mono',monospace", fontSize: 8,
            color: B.dim, marginTop: 2,
          }}>
            {notif.area} · {notif.mins}m ago
          </div>
        </div>

        <button
          onClick={() => { setVisible(false); clearTimeout(t2.current) }}
          style={{ background: 'none', border: 'none', color: B.dim, cursor: 'pointer', padding: '2px', lineHeight: 1, flexShrink: 0, fontSize: 13 }}
        >✕</button>
      </div>
    </div>
  )
}
