import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, useAiAvailable } from '../lib/catalystAI'
import AIComingSoon from '../components/AIComingSoon'
import {
  useFestivalGamification,
  playFestivalSound,
  dispatchFestivalAction,
  FESTIVAL_ACTIONS,
} from '../framework/festivalFramework'

const SYSTEM = `You are the official Lagos Sneaker Culture registry. Based on someone's rotation, issue their collector profile.

Respond with ONLY this JSON:
{
  "collector_title": "Their official title — 3–5 words, e.g. 'The Grail Keeper of Lekki' or 'Island Flex God' or 'Alaba Market Prophet'",
  "rank": "LEGENDARY" | "ELITE" | "CERTIFIED" | "RISING" | "CASUAL",
  "rep_score": 87,
  "tagline": "One line that sums up their collector identity. Lagos voice.",
  "specialty": "What they clearly specialise in — e.g. retro Jordan heat, German engineering, rare colourways",
  "longest_flex": "Their most impressive shoe in the rotation — explain why it's a flex in Lagos context",
  "weakest_link": "The shoe holding back their rep — be specific but not cruel",
  "signature_move": "How this collector moves — what's their buying style, their flex method, their trade approach",
  "sf26_predicted_behavior": "What this collector will do at Sneakers Fest '26 — specific, funny, true",
  "share_line": "A one-line identity statement for them to post. Under 20 words. Quotable."
}

Rep score is 1–100. LEGENDARY is 90+, ELITE 75–89, CERTIFIED 60–74, RISING 45–59, CASUAL under 45.
Be specific and insightful, not generic. The title and share_line must feel earned.`

const RANK_CONFIG = {
  LEGENDARY: { color: B.amber, bg: '#1c1400' },
  ELITE:     { color: B.neonCyan, bg: '#001a1a' },
  CERTIFIED: { color: B.neonLime, bg: '#0a1a00' },
  RISING:    { color: '#A855F7', bg: '#0d0014' },
  CASUAL:    { color: B.smoke, bg: '#0a0a0a' },
}

const FOIL_THEMES = {
  GOLD: {
    id: 'GOLD',
    label: '✨ GOLD VAULT',
    border: '#F5A623',
    glow: 'rgba(245, 166, 35, 0.45)',
    accent: '#FFD700',
    shimmer: 'linear-gradient(90deg, #F5A623, #FFD700, #FFE57F, #F5A623)',
  },
  CYBER: {
    id: 'CYBER',
    label: '⚡ CYBER MAINLAND',
    border: '#00F5FF',
    glow: 'rgba(0, 245, 255, 0.45)',
    accent: '#00F5FF',
    shimmer: 'linear-gradient(90deg, #00F5FF, #A855F7, #EC4899, #00F5FF)',
  },
  DANFO: {
    id: 'DANFO',
    label: '🚌 DANFO TRANSIT',
    border: '#FFB800',
    glow: 'rgba(255, 184, 0, 0.45)',
    accent: '#FF5500',
    shimmer: 'linear-gradient(90deg, #FFB800, #FF5500, #111111, #FFB800)',
  },
  DIAMOND: {
    id: 'DIAMOND',
    label: '💎 DIAMOND GRAIL',
    border: '#E0F2FE',
    glow: 'rgba(224, 242, 254, 0.55)',
    accent: '#BAE6FD',
    shimmer: 'linear-gradient(90deg, #FFFFFF, #BAE6FD, #7DD3FC, #FFFFFF)',
  },
}

const ACCENT = [B.amber, B.neonCyan, '#A855F7', B.neonLime, '#f97316']

function generateHeuristicCard(shoes, handle) {
  const kicks = shoes.join(' ').toLowerCase()
  let title = 'The Mainland Sole Crusader'
  let rank = 'ELITE'
  let rep = 88
  let specialty = 'Lagos Street Rotation'
  let move = 'Calculated box-fresh heat with street presence'
  let flex = shoes[0]
  let weak = shoes[shoes.length - 1]
  let atFest = 'Seen at the front of the Trade Board inspecting grails before the DJ drop'
  let line = `Pulling up to Sneakers Fest '26 in my ${shoes[0]}. Check the rotation.`

  if (kicks.includes('jordan') || kicks.includes('retro')) {
    title = 'The Jumpman Disciple of VI'
    rank = 'LEGENDARY'
    rep = 95
    specialty = 'Tinker Hatfield & Air Jordan Archives'
    move = 'Doubling up on deadstock releases and never creasing the toe box'
    atFest = 'Stalking Grail Alley for 1985 originals and Jordan 4 White Cements'
    line = `Jordan rotation certified for Lagos streets. Sneakers Fest '26 ready.`
  } else if (kicks.includes('yeezy') || kicks.includes('foam')) {
    title = 'The Futuristic Heat Architect'
    rank = 'ELITE'
    rep = 89
    specialty = 'Organic silhouettes & earth-tone aesthetics'
    move = 'Pairing oversized cargo pants with sculptural foam silhouettes'
    atFest = 'Chilling in the VIP Lounge discussing silhouette evolution'
  } else if (kicks.includes('dunk') || kicks.includes('sb')) {
    title = 'The Skate & Swoosh Specialist'
    rank = 'CERTIFIED'
    rep = 84
    specialty = 'SB Dunks & high-energy color blocking'
    move = 'Swapping neon laces and wearing every pair to death'
    atFest = 'Bouncing between the main stage and photo alley'
  } else if (kicks.includes('new balance') || kicks.includes('asics') || kicks.includes('salomon')) {
    title = 'The Technical Archival Don'
    rank = 'LEGENDARY'
    rep = 96
    specialty = 'Gorpcore engineering, mesh layering, and premium suede'
    move = 'Walking 20,000 steps without a single complaint while looking impeccable'
    atFest = 'Consulting at the Authenticity Lab and scoping rare collaborations'
    line = `Comfort meets high culture. Catch me Dec 12 in full technical gear.`
  } else if (kicks.includes('travis') || kicks.includes('off-white') || kicks.includes('corteiz')) {
    title = 'The Island Grail Kingpin'
    rank = 'LEGENDARY'
    rep = 98
    specialty = 'High-stakes grails and hype collabs'
    move = 'Entering every raffle, winning the un-winnable, and letting everyone know'
    atFest = 'Entering with the entourage under the headline drop spotlight'
    line = `Nothing under six figures on foot. See you at Sneakers Fest '26.`
  }

  return {
    collector_title: title,
    rank,
    rep_score: rep,
    tagline: `Built on authentic Lagos street grit and certified sneaker heat.`,
    specialty,
    longest_flex: `${flex} — unmistakable presence on any Lagos tarmac.`,
    weakest_link: `${weak} — needs a sole scrub before Dec 12.`,
    signature_move: move,
    sf26_predicted_behavior: atFest,
    share_line: line,
  }
}

async function exportCardToCanvas(result, handle, shoes, format = 'story') {
  const W = format === 'story' ? 1080 : 1200
  const H = format === 'story' ? 1920 : 675
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')
  const rc = RANK_CONFIG[result.rank] || RANK_CONFIG.ELITE

  // Deep dark background
  ctx.fillStyle = '#06060A'
  ctx.fillRect(0, 0, W, H)

  // Glow gradients
  const g1 = ctx.createRadialGradient(W / 2, 200, 50, W / 2, 200, 600)
  g1.addColorStop(0, rc.color + '33')
  g1.addColorStop(1, 'transparent')
  ctx.fillStyle = g1
  ctx.fillRect(0, 0, W, H)

  // Border frame
  ctx.strokeStyle = rc.color + '60'
  ctx.lineWidth = 4
  ctx.strokeRect(30, 30, W - 60, H - 60)

  // Header
  ctx.fillStyle = rc.color
  ctx.font = '700 24px monospace'
  ctx.textAlign = 'center'
  ctx.fillText("SNEAKERS FEST '26 · OFFICIAL COLLECTOR REGISTRY", W / 2, format === 'story' ? 140 : 80)

  // Handle
  if (handle) {
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '700 32px sans-serif'
    ctx.fillText(handle.startsWith('@') ? handle : `@${handle}`, W / 2, format === 'story' ? 220 : 130)
  }

  // Title
  ctx.fillStyle = rc.color
  ctx.font = '900 68px sans-serif'
  ctx.fillText(result.collector_title, W / 2, format === 'story' ? 360 : 220)

  // Rep Score
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '900 130px sans-serif'
  ctx.fillText(String(result.rep_score), W / 2, format === 'story' ? 560 : 340)

  ctx.fillStyle = rc.color
  ctx.font = '700 32px monospace'
  ctx.fillText(`${result.rank} TIER · LAGOS REP`, W / 2, format === 'story' ? 640 : 400)

  if (format === 'story') {
    // Rotation section
    ctx.fillStyle = '#777788'
    ctx.font = '700 24px monospace'
    ctx.fillText('ROTATION CONFIRMED FOR DEC 12', W / 2, 800)

    let y = 880
    shoes.filter(Boolean).forEach((s, i) => {
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '700 34px sans-serif'
      ctx.fillText(`${i + 1}.  ${s}`, W / 2, y)
      y += 65
    })

    // Share line quote box
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.strokeStyle = rc.color + '40'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.roundRect(100, y + 60, W - 200, 200, 16); ctx.fill(); ctx.stroke()

    ctx.fillStyle = '#CCCCCC'
    ctx.font = 'italic 600 28px sans-serif'
    ctx.fillText(`"${result.share_line}"`, W / 2, y + 170)

    // Footer
    ctx.fillStyle = '#555566'
    ctx.font = '700 22px monospace'
    ctx.fillText("DECEMBER 12, 2026 · VICTORIA ISLAND, LAGOS", W / 2, H - 120)
    ctx.fillStyle = rc.color
    ctx.fillText("@s_fest26 · @catalystggg · SNEAKERSFEST.COM", W / 2, H - 70)
  }

  return new Promise(resolve => {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `SF26-COLLECTOR-${result.rank}-${Date.now().toString(36).toUpperCase()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      resolve()
    }, 'image/png')
  })
}

export default function CollectorCard() {
  const aiReady = useAiAvailable()
  const { gamification, awardXP, unlockBadge, setHandle: syncHandle } = useFestivalGamification()
  const [handle, setHandle] = useState(() => gamification?.handle || '')
  const [shoes, setShoes] = useState(['', '', ''])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [foilTheme, setFoilTheme] = useState(() => {
    try {
      return localStorage.getItem('sf26_card_foil_theme') || 'GOLD'
    } catch {
      return 'GOLD'
    }
  })
  const [nfcTapped, setNfcTapped] = useState(false)
  const [nfcScanning, setNfcScanning] = useState(false)

  function changeFoilTheme(themeKey) {
    setFoilTheme(themeKey)
    try {
      localStorage.setItem('sf26_card_foil_theme', themeKey)
    } catch {}
    playFestivalSound('click')
  }

  function simulateNfcTap() {
    if (nfcScanning) return
    setNfcScanning(true)
    playFestivalSound('telemetry_ping')
    setTimeout(() => {
      setNfcScanning(false)
      setNfcTapped(true)
      awardXP(50, 'NFC Gate Pass Verified')
      unlockBadge('VIP_FAST_PASS')
      dispatchFestivalAction(FESTIVAL_ACTIONS.WALLET_PASS_GENERATED, {
        tier: result?.rank || 'ELITE',
        handle: handle || 'ANONYMOUS_COLLECTOR',
        timestamp: Date.now(),
      })
      playFestivalSound('badge_unlock')
    }, 1200)
  }

  function updateShoe(i, val) {
    const next = [...shoes]
    next[i] = val
    setShoes(next)
    setResult(null)
  }

  function addShoe() {
    if (shoes.length < 5) setShoes([...shoes, ''])
  }

  function removeShoe(i) {
    if (shoes.length <= 3) return
    setShoes(shoes.filter((_, idx) => idx !== i))
    setResult(null)
  }

  async function generate() {
    const filled = shoes.filter(s => s.trim())
    if (filled.length < 3) return
    setLoading(true)
    setResult(null)
    setError('')
    setCopied(false)

    try {
      let finalCard = null
      if (aiReady) {
        const list = filled.map((s, i) => `${i + 1}. ${s}`).join('\n')
        const prompt = `My rotation:\n${list}\n\nIssue my collector card.`
        const raw = await claudeChat([{ role: 'user', content: prompt }], { feature: 'CollectorCard', model: 'smart', system: SYSTEM, maxTokens: 700 })
        const match = raw.match(/\{[\s\S]*\}/)
        if (match) {
          finalCard = JSON.parse(match[0])
        }
      }
      if (!finalCard) {
        finalCard = generateHeuristicCard(filled, handle)
      }
      setResult(finalCard)
      if (handle.trim()) syncHandle(handle.trim())
      awardXP(100, 'Collector Card Issued')
      unlockBadge('COLLECTOR_CARD_MINTED')
      playFestivalSound('xp_gain')
    } catch {
      const fallback = generateHeuristicCard(filled, handle)
      setResult(fallback)
      awardXP(100, 'Collector Card Issued')
      unlockBadge('COLLECTOR_CARD_MINTED')
      playFestivalSound('xp_gain')
    } finally {
      setLoading(false)
    }
  }

  function copy() {
    if (!result?.share_line) return
    const text = `${result.share_line}\n\nCollector Rank: ${result.rank} (${result.rep_score}/100)\nPulling up to @s_fest26 on Dec 12 in Lagos! #SneakersFest26`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  function shareToTwitter() {
    const tag = handle ? (handle.startsWith('@') ? handle : `@${handle}`) : ''
    const text = `${result.share_line}\n\n${tag ? tag + ' · ' : ''}Rank: ${result.rank} (${result.rep_score} REP)\nDec 12 · Muri Okunola Park, Lagos\n@s_fest26 @catalystggg #SneakersFest26`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  async function handleDownload(format) {
    if (!result) return
    setDownloading(true)
    await exportCardToCanvas(result, handle, shoes, format)
    setDownloading(false)
  }

  const filled = shoes.filter(s => s.trim())
  const rc = result ? RANK_CONFIG[result.rank] : null
  const curFoil = FOIL_THEMES[foilTheme] || FOIL_THEMES.GOLD

  return (
    <section id="collector-card" style={{ background: '#040404', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`@keyframes ccSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <SectionTag>COLLECTOR REGISTRY</SectionTag>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            COLLECTOR CARD
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.15em' }}>LAGOS SNEAKER REGISTRY</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 28, letterSpacing: '0.04em' }}>
          Enter your kicks rotation · Issue your official Sneakers Fest '26 collector card · Download high-res PNG for Instagram Story & X
        </p>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 8 }}>YOUR SOCIAL HANDLE (FOR PASS EXPORT)</div>
          <input
            value={handle}
            onChange={e => setHandle(e.target.value)}
            placeholder="@yourhandle (e.g. @lagos_sole_king)"
            style={{ width: '100%', boxSizing: 'border-box', background: '#0d0d0d', border: `1px solid ${handle.trim() ? B.amber + '60' : '#1e1e1e'}`, color: B.white, padding: '11px 14px', fontFamily: "'Space Mono'", fontSize: 10, outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 12 }}>YOUR ROTATION (3–5 KICKS)</div>
          {shoes.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: 11, color: ACCENT[i % ACCENT.length], fontWeight: 900, width: 20, flexShrink: 0 }}>0{i + 1}</div>
              <input aria-label={`Shoe ${i + 1}`}
                value={s}
                onChange={e => updateShoe(i, e.target.value)}
                placeholder={`Shoe ${i + 1} (e.g. Jordan 4 Military Black, NB 1906R, Samba OG)`}
                style={{ flex: 1, background: '#0d0d0d', border: `1px solid ${s.trim() ? ACCENT[i % ACCENT.length] + '44' : '#1a1a1a'}`, color: B.white, padding: '11px 14px', fontFamily: "'Space Mono'", fontSize: 10, outline: 'none', transition: 'border-color 0.15s' }}
              />
              {shoes.length > 3 && (
                <button onClick={() => removeShoe(i)} style={{ background: 'none', border: '1px solid #1a1a1a', color: B.dim, padding: '11px 12px', cursor: 'pointer', fontFamily: "'Space Mono'", fontSize: 10 }}>✕</button>
              )}
            </div>
          ))}
          {shoes.length < 5 && (
            <button onClick={addShoe} style={{ background: 'transparent', border: '1px dashed #2a2a2a', color: B.dim, fontFamily: "'Space Mono'", fontSize: 8, letterSpacing: '0.15em', padding: '8px 16px', cursor: 'pointer', marginTop: 4 }}>
              + ADD SHOE
            </button>
          )}
        </div>

        <button onClick={generate} disabled={filled.length < 3 || loading} style={{ width: '100%', padding: '14px', background: filled.length >= 3 && !loading ? B.amber : '#111', color: filled.length >= 3 && !loading ? B.black : B.dim, border: 'none', fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, cursor: filled.length >= 3 && !loading ? 'pointer' : 'default', marginBottom: 24, transition: 'all 0.2s' }}>
          {loading ? '⟳ ISSUING YOUR CARD...' : filled.length < 3 ? 'ADD AT LEAST 3 SHOES' : 'ISSUE MY COLLECTOR CARD →'}
        </button>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {result && rc && (
          <div style={{ animation: 'ccSlide 0.4s ease' }}>
            {/* Holographic Foil Coating Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
              background: '#0a0a0a',
              border: '1px solid #1e1e1e',
              padding: '10px 14px',
              borderRadius: 8,
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13 }}>✨</span>
                <span style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.15em' }}>
                  FOIL COATING:
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Object.values(FOIL_THEMES).map(t => (
                  <button
                    key={t.id}
                    onClick={() => changeFoilTheme(t.id)}
                    style={{
                      background: foilTheme === t.id ? t.glow : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${foilTheme === t.id ? t.border : 'rgba(255,255,255,0.1)'}`,
                      color: foilTheme === t.id ? B.white : B.dim,
                      fontFamily: "'Space Mono'",
                      fontSize: 8,
                      fontWeight: 700,
                      padding: '5px 10px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              background: `radial-gradient(ellipse at 50% 0%, ${curFoil.glow} 0%, ${rc.bg} 80%)`,
              border: `2px solid ${curFoil.border}`,
              padding: '28px 24px',
              marginBottom: 16,
              textAlign: 'center',
              borderRadius: 12,
              position: 'relative',
              boxShadow: `0 18px 48px ${curFoil.glow}`,
              overflow: 'hidden'
            }}>
              {/* Holographic foil line */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 4,
                background: curFoil.shimmer
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
                <span style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.25em' }}>
                  {handle ? `COLLECTOR PASS · ${handle.toUpperCase()}` : 'OFFICIAL COLLECTOR CARD'}
                </span>
                <span style={{
                  fontFamily: "'Orbitron'",
                  fontSize: 8,
                  fontWeight: 900,
                  color: B.white,
                  background: 'rgba(255,255,255,0.08)',
                  border: `1px solid ${curFoil.border}40`,
                  borderRadius: 999,
                  padding: '2px 8px'
                }}>
                  LVL {gamification?.level || 1} · {gamification?.xp || 0} XP
                </span>
              </div>

              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(1.5rem,3.8vw,2.6rem)', color: curFoil.accent, letterSpacing: '0.05em', marginBottom: 8 }}>
                {result.collector_title}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 14 }}>
                <div style={{ fontFamily: "'Orbitron'", fontSize: 48, fontWeight: 900, color: curFoil.accent, lineHeight: 1 }}>{result.rep_score}</div>
                <div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.15em' }}>REP SCORE</div>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 14, fontWeight: 900, color: curFoil.accent }}>{result.rank}</div>
                </div>
              </div>

              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.6, marginBottom: 14 }}>
                {result.tagline}
              </div>

              {/* RPG Collector Stat Bars */}
              <div style={{
                marginTop: 14,
                marginBottom: 14,
                padding: '12px 14px',
                background: 'rgba(0,0,0,0.55)',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'left'
              }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 10, textAlign: 'center' }}>
                  ⚡ RPG COLLECTOR ATTRIBUTES & RADAR
                </div>
                {[
                  { label: 'HYPE POWER', val: Math.min(100, Math.max(70, result.rep_score + 4)), color: B.amber, display: `${Math.min(100, Math.max(70, result.rep_score + 4))}/100` },
                  { label: 'AUTHENTICITY', val: 99, color: B.neonCyan, display: '99% VERIFIED' },
                  { label: 'RARITY INDEX', val: result.rank === 'LEGENDARY' ? 98 : result.rank === 'ELITE' ? 88 : 78, color: '#A855F7', display: result.rank === 'LEGENDARY' ? 'S-TIER GRAIL' : result.rank === 'ELITE' ? 'A-TIER HEAT' : 'B-TIER DRIP' },
                  { label: 'LAGOS STREET REP', val: result.rep_score, color: B.neonLime, display: `${result.rep_score}/100` },
                ].map((stat, sIdx) => (
                  <div key={sIdx} style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono'", fontSize: 8, marginBottom: 3 }}>
                      <span style={{ color: B.smoke }}>{stat.label}</span>
                      <span style={{ color: stat.color, fontWeight: 700 }}>{stat.display}</span>
                    </div>
                    <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${stat.val}%`, height: '100%', background: stat.color, boxShadow: `0 0 8px ${stat.color}`, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* NFC Gate Scanner Accreditation Simulation */}
              <div style={{ marginTop: 12, marginBottom: 10 }}>
                {nfcTapped ? (
                  <div style={{
                    background: 'rgba(34,197,94,0.14)',
                    border: '1px solid #22c55e',
                    borderRadius: 8,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontFamily: "'Space Mono'",
                    fontSize: 9,
                    color: '#4ade80',
                    letterSpacing: '0.08em'
                  }}>
                    <span>✅</span>
                    <span><strong>NFC GATE ACCREDITED:</strong> DEC 12 MURI OKUNOLA VIP FAST-LANE ACTIVE (+50 XP)</span>
                  </div>
                ) : (
                  <button
                    onClick={simulateNfcTap}
                    disabled={nfcScanning}
                    style={{
                      width: '100%',
                      background: nfcScanning ? '#121224' : 'linear-gradient(90deg, rgba(0,245,255,0.12), rgba(168,85,247,0.12))',
                      border: `1px dashed ${B.neonCyan}`,
                      color: B.white,
                      fontFamily: "'Space Mono'",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      padding: '11px 14px',
                      borderRadius: 8,
                      cursor: nfcScanning ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{nfcScanning ? '📡 CONNECTING TO VENUE NFC GATE SENSOR...' : '📲 SIMULATE NFC TAP (GATE SCANNER ACCREDITATION)'}</span>
                  </button>
                )}
              </div>

              {/* Unlocked Badges Ribbon */}
              {gamification?.badges?.length > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 6,
                  flexWrap: 'wrap',
                  paddingTop: 10,
                  borderTop: '1px solid rgba(255,255,255,0.08)'
                }}>
                  {gamification.badges.slice(-4).map((bg, idx) => (
                    <span key={idx} style={{
                      fontFamily: "'Space Mono'",
                      fontSize: 8,
                      fontWeight: 700,
                      color: B.amberGlow,
                      background: 'rgba(245,166,35,0.12)',
                      border: `1px solid ${B.amber}30`,
                      borderRadius: 4,
                      padding: '2px 6px'
                    }}>
                      🏅 {bg.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div style={{ background: '#0a0a0a', border: `1px solid ${B.amber}20`, padding: '12px 14px', borderRadius: 6 }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.amber, letterSpacing: '0.15em', marginBottom: 5 }}>SPECIALTY</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.6 }}>{result.specialty}</div>
              </div>
              <div style={{ background: '#0a0a0a', border: `1px solid ${B.neonCyan}20`, padding: '12px 14px', borderRadius: 6 }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.neonCyan, letterSpacing: '0.15em', marginBottom: 5 }}>SIGNATURE MOVE</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.6 }}>{result.signature_move}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div style={{ background: '#0a0a0a', border: `1px solid ${B.neonLime}20`, padding: '12px 14px', borderRadius: 6 }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.neonLime, letterSpacing: '0.15em', marginBottom: 5 }}>LONGEST FLEX</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.6 }}>{result.longest_flex}</div>
              </div>
              <div style={{ background: '#1a0000', border: '1px solid #ef444418', padding: '12px 14px', borderRadius: 6 }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#ef4444', letterSpacing: '0.15em', marginBottom: 5 }}>WEAKEST LINK</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#ff8888', lineHeight: 1.6 }}>{result.weakest_link}</div>
              </div>
            </div>

            <div style={{ background: '#0a0a0a', border: `1px solid ${'#A855F7'}20`, padding: '12px 16px', marginBottom: 14, borderRadius: 6 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#A855F7', letterSpacing: '0.15em', marginBottom: 5 }}>AT SF26</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.6 }}>{result.sf26_predicted_behavior}</div>
            </div>

            {/* Social Sharing & PNG Generation Section */}
            <div style={{ background: '#0a0a0a', border: `2px solid ${rc.color}33`, padding: '18px 20px', marginBottom: 14, borderRadius: 8 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.2em', marginBottom: 8 }}>YOUR IDENTITY QUOTE</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, color: B.white, letterSpacing: '0.04em', marginBottom: 16, lineHeight: 1.4 }}>"{result.share_line}"</div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 12 }}>
                <button onClick={() => handleDownload('story')} disabled={downloading} style={{ background: rc.color, border: 'none', color: B.black, fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.1em', fontWeight: 700, padding: '12px 14px', cursor: 'pointer', borderRadius: 6 }}>
                  {downloading ? 'GENERATING...' : '📸 DOWNLOAD STORY (9:16 PNG)'}
                </button>
                <button onClick={() => handleDownload('post')} disabled={downloading} style={{ background: 'transparent', border: `1px solid ${rc.color}`, color: rc.color, fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.1em', fontWeight: 700, padding: '12px 14px', cursor: 'pointer', borderRadius: 6 }}>
                  {downloading ? 'GENERATING...' : '🖼️ DOWNLOAD X CARD (16:9 PNG)'}
                </button>
                <button onClick={shareToTwitter} style={{ background: '#1D9BF0', border: 'none', color: '#fff', fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.1em', fontWeight: 700, padding: '12px 14px', cursor: 'pointer', borderRadius: 6 }}>
                  🐦 SHARE TO X (@s_fest26)
                </button>
              </div>

              <button onClick={copy} style={{ width: '100%', background: copied ? '#052e16' : 'rgba(255,255,255,0.05)', border: `1px solid ${copied ? '#22c55e' : 'rgba(255,255,255,0.1)'}`, color: copied ? '#22c55e' : B.smoke, fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', fontWeight: 700, padding: '10px', cursor: 'pointer', borderRadius: 6, transition: 'all 0.2s' }}>
                {copied ? '✓ COPIED QUOTE & TAGS TO CLIPBOARD' : 'COPY SHARE TEXT'}
              </button>
            </div>

            <button onClick={() => { setResult(null); setShoes(['', '', '']); setHandle('') }} style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a1a', color: B.dim, fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', padding: '10px', cursor: 'pointer', borderRadius: 6 }}>
              RESET — TRY DIFFERENT ROTATION
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
