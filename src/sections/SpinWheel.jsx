import { useState, useRef, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { addXP, XP_VALUES } from '../lib/passport'
import Egg from '../components/Egg'

const PRIZES = [
  { label: '₦2,000 OFF',  sub: 'off any ticket tier',        color: '#F5A623', icon: '₦2K',   xp: 80,  rare: false },
  { label: 'MERCH RAFFLE', sub: 'free draw entry',            color: '#00F0FF', icon: 'MERCH', xp: 100, rare: false },
  { label: 'VIP UPGRADE',  sub: 'GA ticket → VIP access',    color: '#FF2D7B', icon: 'VIP',   xp: 300, rare: true  },
  { label: 'MEET & GREET', sub: 'backstage access pass',      color: '#B8FF00', icon: 'M&G',   xp: 250, rare: true  },
  { label: 'EARLY ACCESS', sub: '1hr before doors open',      color: '#7B2FBE', icon: 'EARLY', xp: 120, rare: false },
  { label: 'MYSTERY DROP', sub: 'secret collab at the event', color: '#FF6B35', icon: 'DROP',  xp: 200, rare: true  },
  { label: 'TRY AGAIN',   sub: 'better luck next time',       color: '#333',    icon: '↩',     xp: 15,  rare: false },
  { label: '₦5,000 OFF',  sub: 'off any ticket tier',         color: '#FFD080', icon: '₦5K',   xp: 130, rare: false },
]

const N    = PRIZES.length
const EACH = 360 / N
const CX = 150, CY = 150, R = 138

const TOTAL_KEY = 'sf26_spins_total'
const REG_KEY   = 'sf26_refcode'    // set by EarlyAccess when user joins waitlist
const TKT_KEY   = 'sf26_orders'     // set by PaymentModal when ticket purchased
const WR_KEY    = 'sf26_wheel_reg_used'
const WT_KEY    = 'sf26_wheel_tkt_used'
const REG_GRANT = 3
const TKT_GRANT = 3

function getTotalSpins() { try { return parseInt(localStorage.getItem(TOTAL_KEY) || '0') } catch { return 0 } }
function isRegistered()  { try { return !!localStorage.getItem(REG_KEY) } catch { return false } }
function hasTicket()     { try { return JSON.parse(localStorage.getItem(TKT_KEY) || '[]').length > 0 } catch { return false } }
function getRegUsed()    { try { return parseInt(localStorage.getItem(WR_KEY) || '0') } catch { return 0 } }
function getTktUsed()    { try { return parseInt(localStorage.getItem(WT_KEY) || '0') } catch { return 0 } }

function getSpinPools() {
  const regAllowed = isRegistered() ? REG_GRANT : 0
  const tktAllowed = hasTicket() ? TKT_GRANT : 0
  const regUsed = Math.min(getRegUsed(), regAllowed)
  const tktUsed = Math.min(getTktUsed(), tktAllowed)
  return {
    regAllowed, tktAllowed, regUsed, tktUsed,
    regLeft: regAllowed - regUsed,
    tktLeft: tktAllowed - tktUsed,
    totalLeft: (regAllowed - regUsed) + (tktAllowed - tktUsed),
    totalAllowed: regAllowed + tktAllowed,
    totalUsed: regUsed + tktUsed,
  }
}

function recordSpin() {
  const pools = getSpinPools()
  if (pools.regLeft > 0) { localStorage.setItem(WR_KEY, String(getRegUsed() + 1)) }
  else if (pools.tktLeft > 0) { localStorage.setItem(WT_KEY, String(getTktUsed() + 1)) }
  localStorage.setItem(TOTAL_KEY, String(getTotalSpins() + 1))
}

function segPath(i) {
  const a1 = (i * EACH - 90) * Math.PI / 180
  const a2 = ((i + 1) * EACH - 90) * Math.PI / 180
  const x1 = (CX + R * Math.cos(a1)).toFixed(2); const y1 = (CY + R * Math.sin(a1)).toFixed(2)
  const x2 = (CX + R * Math.cos(a2)).toFixed(2); const y2 = (CY + R * Math.sin(a2)).toFixed(2)
  return `M${CX} ${CY} L${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2}Z`
}
function labelTransform(i) {
  const mid = i * EACH + EACH / 2 - 90
  const rad = mid * Math.PI / 180
  const tx = (CX + R * 0.62 * Math.cos(rad)).toFixed(1)
  const ty = (CY + R * 0.62 * Math.sin(rad)).toFixed(1)
  return `translate(${tx},${ty}) rotate(${mid + 90})`
}

export default function SpinWheel() {
  const [rotation,   setRotation]   = useState(0)
  const [spinning,   setSpinning]   = useState(false)
  const [result,     setResult]     = useState(null)
  const [spunCount,  setSpunCount]  = useState(0)
  const [isNearMiss, setIsNearMiss] = useState(false)
  const [nearPrize,  setNearPrize]  = useState(null)
  const [confetti,   setConfetti]   = useState([])
  const [pools,      setPools]      = useState(() => getSpinPools())
  const [totalAll,   setTotalAll]   = useState(() => getTotalSpins())
  const [winCopied,  setWinCopied]  = useState(false)
  const winnerRef = useRef(null)

  function spin() {
    const p = getSpinPools()
    if (spinning || p.totalLeft <= 0) return
    setResult(null); setConfetti([]); setIsNearMiss(false); setNearPrize(null); setSpinning(true)
    setWinCopied(false)

    recordSpin()
    const newPools = getSpinPools()
    setPools(newPools)
    setTotalAll(prev => prev + 1)
    setSpunCount(c => c + 1)

    const TRYAGAIN_IDX = 6
    let winner
    const luck = Math.random()
    const used = newPools.totalUsed
    const prizePool = [0, 1, 2, 3, 4, 5, 7]
    if (luck < (used >= 5 ? 0.58 : used >= 3 ? 0.42 : 0.35)) {
      winner = prizePool[Math.floor(Math.random() * prizePool.length)]
    } else {
      winner = TRYAGAIN_IDX
    }

    const nearMiss   = winner === TRYAGAIN_IDX && Math.random() < 0.45
    const nearTarget = nearMiss ? prizePool[Math.floor(Math.random() * prizePool.length)] : null
    if (nearMiss) { setIsNearMiss(true); setNearPrize(PRIZES[nearTarget]) }

    winnerRef.current = winner

    const finalTarget = nearMiss ? nearTarget : winner
    const targetMod   = ((360 - (finalTarget * EACH + EACH / 2)) % 360 + 360) % 360
    const prevMod     = rotation % 360
    let extra = targetMod - prevMod
    if (extra < 0) extra += 360
    const overshoot   = nearMiss ? EACH : 0
    const newRotation = rotation + extra + overshoot + 360 * (5 + Math.floor(Math.random() * 3))
    setRotation(newRotation)

    setTimeout(() => {
      setSpinning(false)
      setResult(winnerRef.current)
      const won = PRIZES[winnerRef.current]
      if (won.label !== 'TRY AGAIN') {
        addXP(won.xp, 'Spin to Win', won.rare ? 'spin-rare' : undefined)
        const COLS = [B.amber, B.neonCyan, B.neonMagenta, B.neonLime, '#fff', won.color]
        setConfetti(Array.from({ length: 60 }, (_, k) => ({
          id: k, color: COLS[k % COLS.length],
          left: Math.random() * 100, delay: Math.random() * 0.5,
          dur: 0.9 + Math.random() * 0.7, size: 5 + Math.random() * 8,
          spin: Math.random() > 0.5 ? 720 : -720,
        })))
      } else {
        addXP(XP_VALUES.spinLose, 'Spin to Win')
      }
    }, 5400)
  }

  function shareWin(prize) {
    const text = `Just spun the wheel at Sneakers Fest '26 and won ${prize.label}! 🎡 Dec 12 · Muri Okunola Park, VI · Lagos 👟 sneakersfest26.com`
    if (navigator.share) navigator.share({ text }).catch(() => {})
    else {
      navigator.clipboard.writeText(text).catch(() => {})
      setWinCopied(true)
      setTimeout(() => setWinCopied(false), 2500)
    }
  }

  const prize      = result !== null ? PRIZES[result] : null
  const canSpin    = pools.totalLeft > 0 && !spinning
  const spinsLeft  = pools.totalLeft
  const isLastSpin = spinsLeft === 1

  return (
    <section id="spin" style={{
      background: `linear-gradient(180deg, ${B.charcoal} 0%, ${B.black} 100%)`,
      padding: '80px 20px', position: 'relative', overflow: 'hidden', textAlign: 'center',
    }}>
      <GrainOverlay /><ScanLines />
      <Egg id="egg-049" corner="top-right" />
      <Egg id="egg-050" corner="bottom-left" />
      <style>{`
        @keyframes winnerPop {
          0%  { opacity:0; transform:scale(0.6) rotate(-8deg); }
          70% { transform:scale(1.06) rotate(2deg); }
          100%{ opacity:1; transform:scale(1) rotate(0deg); }
        }
        @keyframes nearMissShake {
          0%,100%{ transform:translateX(0); }
          20%    { transform:translateX(-8px); }
          40%    { transform:translateX(8px); }
          60%    { transform:translateX(-4px); }
          80%    { transform:translateX(4px); }
        }
        @keyframes confettiRain {
          0%  { transform:translateY(-20px) rotate(0deg); opacity:1; }
          100%{ transform:translateY(120%) rotate(var(--s,540deg)); opacity:0; }
        }
        @keyframes wheelGlow {
          0%,100%{ filter:drop-shadow(0 0 8px ${B.amber}40); }
          50%    { filter:drop-shadow(0 0 28px ${B.amber}90); }
        }
        @keyframes lastSpinPulse {
          0%,100%{ box-shadow: 0 0 40px #FF2D7B60, 0 8px 32px rgba(0,0,0,0.5); }
          50%    { box-shadow: 0 0 80px #FF2D7B90, 0 8px 32px rgba(0,0,0,0.5); }
        }
        @keyframes unlockPulse {
          0%,100%{ opacity:0.75; }
          50%    { opacity:1; }
        }
      `}</style>

      {confetti.length > 0 && (
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:50 }}>
          {confetti.map(p => (
            <div key={p.id} style={{
              position:'absolute', left:`${p.left}%`, top:0,
              width:p.size, height:p.size,
              borderRadius: Math.random() > 0.5 ? '50%' : 2,
              background: p.color, '--s': `${p.spin}deg`,
              animation:`confettiRain ${p.dur}s ${p.delay}s ease-in forwards`,
              boxShadow:`0 0 6px ${p.color}80`,
            }}/>
          ))}
        </div>
      )}

      <div style={{ position:'absolute', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:600, borderRadius:'50%', background:`radial-gradient(circle, ${B.amber}08 0%, transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }} />

      <div style={{ maxWidth: 640, margin: '0 auto', position:'relative', zIndex:2 }}>
        <SectionTag>SPIN TO WIN</SectionTag>
        <h2 className="reveal-3d text-3d" style={{ fontFamily:"'Bebas Neue'", fontSize:'clamp(2.5rem,7vw,5rem)', color:B.white, letterSpacing:'0.05em', marginBottom:8 }}>
          TEST YOUR{' '}<span style={{ color:B.amber, textShadow:`0 0 40px ${B.amber}70` }}>LUCK</span>
        </h2>
        <p style={{ fontFamily:"'Space Mono'", fontSize:9, color:'#444', letterSpacing:'0.15em', marginBottom:28 }}>
          3 TRIALS ON REGISTRATION · 3 MORE AFTER TICKET PURCHASE
        </p>

        {/* Spin pool tracker */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, marginBottom:24 }}>
          {/* Registration pool */}
          <div className="card-3d" style={{
            display:'inline-flex', alignItems:'center', gap:12, padding:'9px 20px',
            background: pools.regAllowed > 0 ? `${B.neonLime}08` : 'rgba(255,255,255,0.02)',
            border:`1px solid ${pools.regAllowed > 0 ? B.neonLime + '35' : 'rgba(255,255,255,0.07)'}`,
            borderRadius:40,
          }}>
            <span style={{ fontFamily:"'Space Mono'", fontSize:7, color: pools.regAllowed > 0 ? B.neonLime : '#2a2a2a', letterSpacing:'0.15em' }}>
              {pools.regAllowed > 0 ? '✓ REGISTERED' : '○ WAITLIST'}
            </span>
            <div style={{ display:'flex', gap:6 }}>
              {Array.from({ length: REG_GRANT }).map((_, i) => (
                <div key={i} style={{
                  width:9, height:9, borderRadius:'50%',
                  background: pools.regAllowed === 0 ? '#161616' : i < pools.regUsed ? '#2a2a2a' : B.neonLime,
                  boxShadow: pools.regAllowed > 0 && i >= pools.regUsed ? `0 0 7px ${B.neonLime}80` : 'none',
                  transition:'all 0.3s',
                }}/>
              ))}
            </div>
            <span style={{ fontFamily:"'Space Mono'", fontSize:7, color: pools.regAllowed > 0 ? (pools.regLeft > 0 ? B.neonLime : '#444') : '#2a2a2a', letterSpacing:'0.1em' }}>
              {pools.regAllowed > 0 ? `${pools.regLeft}/${REG_GRANT}` : '3 FREE'}
            </span>
          </div>

          {/* Ticket pool */}
          <div className="card-3d" style={{
            display:'inline-flex', alignItems:'center', gap:12, padding:'9px 20px',
            background: pools.tktAllowed > 0 ? `${B.amber}08` : 'rgba(255,255,255,0.02)',
            border:`1px solid ${pools.tktAllowed > 0 ? B.amber + '40' : 'rgba(255,255,255,0.07)'}`,
            borderRadius:40,
          }}>
            <span style={{ fontFamily:"'Space Mono'", fontSize:7, color: pools.tktAllowed > 0 ? B.amber : '#2a2a2a', letterSpacing:'0.15em' }}>
              {pools.tktAllowed > 0 ? '🎟 TICKET HOLDER' : '🎟 BUY TICKET'}
            </span>
            <div style={{ display:'flex', gap:6 }}>
              {Array.from({ length: TKT_GRANT }).map((_, i) => (
                <div key={i} style={{
                  width:9, height:9, borderRadius:'50%',
                  background: pools.tktAllowed === 0 ? '#161616' : i < pools.tktUsed ? '#2a2a2a' : B.amber,
                  boxShadow: pools.tktAllowed > 0 && i >= pools.tktUsed ? `0 0 7px ${B.amber}80` : 'none',
                  transition:'all 0.3s',
                }}/>
              ))}
            </div>
            <span style={{ fontFamily:"'Space Mono'", fontSize:7, color: pools.tktAllowed > 0 ? (pools.tktLeft > 0 ? B.amber : '#444') : '#2a2a2a', letterSpacing:'0.1em' }}>
              {pools.tktAllowed > 0 ? `${pools.tktLeft}/${TKT_GRANT}` : '3 BONUS'}
            </span>
          </div>
        </div>

        {/* Unlock prompts */}
        {pools.regAllowed === 0 && (
          <div className="card-3d" style={{ marginBottom:20, padding:'11px 22px', background:`${B.neonLime}07`, border:`1px solid ${B.neonLime}20`, borderRadius:8, animation:'unlockPulse 2.4s ease-in-out infinite' }}>
            <p style={{ fontFamily:"'Space Mono'", fontSize:9, color:B.neonLime, margin:0, letterSpacing:'0.1em' }}>
              🔓{' '}
              <a href="#waitlist" style={{ color:B.neonLime, textDecoration:'underline' }}>Join the waitlist</a>
              {' '}to unlock your 3 free spins
            </p>
          </div>
        )}
        {pools.regAllowed > 0 && pools.tktAllowed === 0 && (
          <div className="card-3d" style={{ marginBottom:20, padding:'11px 22px', background:`${B.amber}07`, border:`1px solid ${B.amber}20`, borderRadius:8, animation:'unlockPulse 2.4s ease-in-out infinite' }}>
            <p style={{ fontFamily:"'Space Mono'", fontSize:9, color:B.amber, margin:0, letterSpacing:'0.1em' }}>
              🎟{' '}
              <a href="#tickets" style={{ color:B.amber, textDecoration:'underline' }}>Buy a ticket</a>
              {' '}to unlock 3 bonus spins
            </p>
          </div>
        )}

        {/* Wheel */}
        <div style={{ position:'relative', display:'inline-block', marginBottom:32 }}>
          <div style={{
            position:'absolute', top:-24, left:'50%', transform:'translateX(-50%)',
            width:0, height:0, zIndex:20,
            borderLeft:'14px solid transparent', borderRight:'14px solid transparent',
            borderTop:`34px solid ${B.amber}`,
            filter:`drop-shadow(0 0 14px ${B.amber}90)`,
          }}/>

          <div style={{
            width:308, height:308, borderRadius:'50%', padding:3,
            background:`conic-gradient(${B.amber}, ${B.neonMagenta}, ${B.neonCyan}, ${B.neonLime}, ${B.amber})`,
            boxShadow: spinning ? `0 0 80px ${B.amber}70, 0 0 160px ${B.amber}30` : `0 0 32px ${B.amber}25`,
            transition:'box-shadow 0.4s', animation: !spinning ? 'wheelGlow 3s ease-in-out infinite' : 'none',
          }}>
            <div style={{ width:'100%', height:'100%', borderRadius:'50%', overflow:'hidden', background:B.black }}>
              <svg viewBox="0 0 300 300" width="302" height="302"
                style={{
                  transform:`rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 5.4s cubic-bezier(0.02,0.68,0.14,1)' : 'none',
                  display:'block',
                  animation: isNearMiss && !spinning ? 'nearMissShake 0.5s ease' : 'none',
                }}
              >
                {PRIZES.map((p, i) => (
                  <g key={i}>
                    <path d={segPath(i)} fill={p.color} stroke="#0A0A0A" strokeWidth="1.5"/>
                    {p.rare && <path d={segPath(i)} fill="rgba(255,255,255,0.07)" stroke="none"/>}
                    <text transform={labelTransform(i)} fill="rgba(0,0,0,0.9)"
                      fontSize="8" fontWeight="bold" textAnchor="middle"
                      dominantBaseline="middle" fontFamily="'Courier New',monospace">
                      {p.icon}
                    </text>
                  </g>
                ))}
                <circle cx={CX} cy={CY} r="24" fill="#050508" stroke={B.amber} strokeWidth="2.5"/>
                <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle"
                  fontSize="8" fontWeight="bold" fontFamily="monospace" fill={B.amber}>SF26</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Spin button */}
        <div>
          <button
            onClick={spin}
            disabled={!canSpin}
            style={{
              background: canSpin ? (isLastSpin ? B.neonMagenta : B.amber) : B.gunmetal,
              color: canSpin ? B.black : '#444',
              border: 'none', padding:'16px 56px',
              fontFamily:"'Bebas Neue'", fontSize:'1.6rem', letterSpacing:'0.12em',
              cursor: canSpin ? 'pointer' : 'default',
              borderRadius:6, minWidth:240,
              boxShadow: canSpin
                ? (isLastSpin ? `0 0 40px ${B.neonMagenta}70, 0 8px 32px rgba(0,0,0,0.5)` : `0 0 40px ${B.amber}60, 0 8px 32px rgba(0,0,0,0.5)`)
                : 'none',
              animation: isLastSpin && canSpin ? 'lastSpinPulse 1.8s ease-in-out infinite' : 'none',
              transition:'all 0.3s',
              transform: canSpin ? 'scale(1)' : 'scale(0.96)',
            }}
          >
            {spinning
              ? 'SPINNING...'
              : !canSpin
                ? (pools.regAllowed === 0 ? 'REGISTER TO SPIN' : 'ALL SPINS USED')
                : isLastSpin ? '⚡ FINAL SPIN — GO ALL IN'
                : spunCount > 0 ? `SPIN AGAIN (${spinsLeft} LEFT)`
                : 'SPIN THE WHEEL'}
          </button>
        </div>

        {totalAll > 0 && (
          <p style={{ color:'#333', fontFamily:"'Space Mono'", fontSize:8, marginTop:14, letterSpacing:1 }}>
            {totalAll} total spin{totalAll !== 1 ? 's' : ''} · prizes redeemable at the gate · Dec 12
          </p>
        )}
      </div>

      {/* Result modal */}
      {prize && (
        <div
          onClick={() => { setResult(null); setIsNearMiss(false) }}
          style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.94)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background:`linear-gradient(145deg, #0a0a0f 0%, #101018 100%)`,
              borderRadius:16, padding:'48px 40px',
              maxWidth:420, width:'90%', textAlign:'center',
              border: `2px solid ${prize.color}`,
              boxShadow:`0 0 100px ${prize.color}50, 0 0 200px ${prize.color}20`,
              animation:'winnerPop 0.6s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {isNearMiss && prize.label === 'TRY AGAIN' && nearPrize ? (
              <>
                <div style={{ fontFamily:"'Space Mono'", fontSize:9, letterSpacing:3, color:'#555', marginBottom:8 }}>YOU WERE THIS CLOSE</div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:'2.8rem', color:B.neonMagenta, letterSpacing:3, textShadow:`0 0 40px ${B.neonMagenta}60`, marginBottom:6 }}>SO CLOSE!</div>
                <p style={{ fontFamily:"'Space Mono'", fontSize:10, color:'#666', marginBottom:20 }}>
                  One segment away from <span style={{ color:nearPrize.color }}>{nearPrize.label}</span>
                </p>
                <div style={{ width:64, height:64, borderRadius:'50%', background:`${prize.color}15`, border:`2px solid ${prize.color}50`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontFamily:"'Orbitron'", fontSize:'1rem', color:prize.color }}>↩</div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:'2rem', color:B.white, marginBottom:6 }}>TRY AGAIN</div>
                <p style={{ color:'#555', fontFamily:"'Space Mono'", fontSize:9, marginBottom:24 }}>
                  {pools.totalLeft > 0
                    ? `${pools.totalLeft} spin${pools.totalLeft !== 1 ? 's' : ''} remaining`
                    : 'No more spins — see you Dec 12!'}
                </p>
              </>
            ) : prize.label !== 'TRY AGAIN' ? (
              <>
                <div style={{ width:88, height:88, borderRadius:'50%', background:`${prize.color}20`, border:`2px solid ${prize.color}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontFamily:"'Orbitron'", fontSize:'1.1rem', fontWeight:900, color:prize.color, letterSpacing:'0.05em' }}>
                  {prize.icon}
                </div>
                {prize.rare && (
                  <div style={{ fontFamily:"'Space Mono'", fontSize:8, letterSpacing:3, color:B.neonLime, marginBottom:6 }}>⭐ RARE PRIZE</div>
                )}
                <div style={{ fontFamily:"'Space Mono'", fontSize:9, letterSpacing:3, color:prize.color, marginBottom:10 }}>YOU WON</div>
                <h3 style={{ fontFamily:"'Bebas Neue'", fontSize:'2.6rem', color:B.white, letterSpacing:'0.05em', marginBottom:8 }}>{prize.label}</h3>
                <p style={{ color:B.smoke, fontFamily:"'Space Mono'", fontSize:10, marginBottom:6 }}>{prize.sub}</p>
                <p style={{ color:prize.color, fontFamily:"'Orbitron'", fontSize:9, fontWeight:700, marginBottom:24 }}>+{prize.xp} XP EARNED</p>
                <div style={{ background:B.black, border:`1px solid ${prize.color}40`, borderRadius:8, padding:'12px 20px', marginBottom:20, fontFamily:"'Space Mono'", fontSize:9, color:prize.color, lineHeight:1.7 }}>
                  📸 Screenshot this · show at the event gate on Dec 12
                </div>
                <button
                  onClick={() => shareWin(prize)}
                  style={{
                    width:'100%', marginBottom:12, padding:'11px',
                    background:`${prize.color}15`, border:`1px solid ${prize.color}50`,
                    borderRadius:8, cursor:'pointer',
                    fontFamily:"'Bebas Neue'", fontSize:'1.1rem', letterSpacing:'0.1em',
                    color:prize.color,
                  }}
                >
                  {winCopied ? '✓ COPIED TO CLIPBOARD' : '🔗 SHARE YOUR WIN'}
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize:'3rem', marginBottom:16 }}>😬</div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:'2rem', color:B.white, marginBottom:8 }}>TRY AGAIN</div>
                <p style={{ color:'#555', fontFamily:"'Space Mono'", fontSize:9, marginBottom:24 }}>
                  {pools.totalLeft > 0
                    ? `${pools.totalLeft} spin${pools.totalLeft !== 1 ? 's' : ''} remaining — go again!`
                    : 'All spins used · see you at the event on Dec 12!'}
                </p>
              </>
            )}
            <button onClick={() => { setResult(null); setIsNearMiss(false) }}
              style={{ background:'transparent', border:`1px solid ${B.gunmetal}`, color:B.smoke, padding:'9px 32px', fontFamily:"'Space Mono'", fontSize:9, cursor:'pointer', borderRadius:6 }}>
              {pools.totalLeft > 0 && prize.label === 'TRY AGAIN' ? 'SPIN AGAIN' : 'CLOSE'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
