import { useState, useEffect, useMemo, useCallback } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag, Divider } from '../components/Shared'
import {
  useFestivalGamification,
  useFestivalTelemetry,
  playFestivalSound,
  dispatchFestivalAction,
  FESTIVAL_ACTIONS
} from '../framework/festivalFramework'

// Pre-seeded curated 1v1 Street Battles representing Lagos streetwear districts
const INITIAL_BATTLES = [
  {
    id: 'battle-01',
    round: 'ROUND 01 · CLASH OF THE GRAILS',
    category: 'VINTAGE COLLAB vs MODERN RUNNER',
    totalVotes: 710,
    active: true,
    contenderA: {
      id: 'contender-a1',
      alias: 'Tobi "YabaPlug" A.',
      handle: '@yabaplug_lagos',
      district: 'Mainland · Yaba Creative Corridor',
      kicks: 'Air Jordan 4 Retro "Military Black"',
      silhouette: 'AJ4 Mid Top',
      fitBreakdown: [
        'Vintage Fela Kuti Afrobeat Graphic Boxy Tee (Washed Black)',
        'Custom Tactical Multi-pocket Olive Cargo Pants',
        'Distressed Danfo Yellow Work Vest',
        'Chunky 14mm Silver Cuban Link & Dark Matrix Shades'
      ],
      votes: 342,
      winStreak: 4,
      imageTag: '🔥 MAINLAND VANGUARD',
      accentColor: B.amber,
      quote: "Clean lines, functional pockets for 14-hour Mainland hustle. The AJ4 silhouette carries real street weight."
    },
    contenderB: {
      id: 'contender-b1',
      alias: 'Chidera "IslandDon" O.',
      handle: '@island_chidera',
      district: 'Island · Lekki Phase 1 Luxury',
      kicks: 'Travis Scott x AJ1 Low "Reverse Mocha"',
      silhouette: 'AJ1 Low OG Reverse Swoosh',
      fitBreakdown: [
        'Off-White Heavyweight Ecru Cotton Tee with raw hems',
        'Japanese Bleached Flared Carpenter Denim',
        'Goyard Chevron Crossbody Bag',
        'Custom 18K Gold Sneakers Fest \'26 VIP Signet Ring'
      ],
      votes: 368,
      winStreak: 7,
      imageTag: '⚡ ISLAND SUPREME',
      accentColor: B.neonCyan,
      quote: "Immaculate leather, pristine neutral tones. Made for the front row at Muri Okunola Park."
    }
  },
  {
    id: 'battle-02',
    round: 'ROUND 02 · THE ALTÉ SYNDICATE SHOWDOWN',
    category: 'RETRO INDOOR vs METALLIC RUNNER',
    totalVotes: 805,
    active: false,
    contenderA: {
      id: 'contender-a2',
      alias: 'Kemi "AlteVibe" E.',
      handle: '@kemi_alte',
      district: 'Mainland · Surulere Retro Vault',
      kicks: 'Wales Bonner x Adidas Samba "Silver Metallic"',
      silhouette: 'Crochet Samba Classic',
      fitBreakdown: [
        'Hand-knitted Open Stitch Mohair Pullover in Lagoon Teal',
        'High-waisted Double-pleated Wide Leg Umber Slacks',
        'Vintage 2002 Sony Handycam on Braided Leather Strap',
        'Stack of Handcrafted Cowrie Shell Rings'
      ],
      votes: 410,
      winStreak: 5,
      imageTag: '🎨 SURULERE POET',
      accentColor: B.neonMagenta,
      quote: "Texture over hype. The crochet tongue of the Wales Bonner speaks an unspoken dialect."
    },
    contenderB: {
      id: 'contender-b2',
      alias: 'Damola "TechSole" K.',
      handle: '@damola_kicks',
      district: 'Mainland · Ikeja Computer Village',
      kicks: 'New Balance 9060 "Rain Cloud / Sea Salt"',
      silhouette: 'Futuristic Y2K Runner',
      fitBreakdown: [
        'GORE-TEX Welded Seam Technical Hooded Shell',
        'Water-repellent Drop-crotch Cargo Pant with bungee hems',
        'Matte Black Utility Chest Rig with EDC tools',
        'Oakley Radar EV Path Polarized Wrap Shades'
      ],
      votes: 395,
      winStreak: 3,
      imageTag: '💻 IKEJA TECHWEAR',
      accentColor: B.neonLime,
      quote: "Built for torrential Lagos downpours and all-day tech sprints without sacrificing one ounce of heat."
    }
  },
  {
    id: 'battle-03',
    round: 'ROUND 03 · THE HERITAGE CORNERSTONE',
    category: '1985 HOLY GRAIL vs LUXURY REIMAGINING',
    totalVotes: 1032,
    active: false,
    contenderA: {
      id: 'contender-a3',
      alias: 'Zack "BalogunKing" U.',
      handle: '@balogun_kicks',
      district: 'Mainland · Balogun Wholesale Roots',
      kicks: 'Air Jordan 1 High OG "Chicago Lost & Found \'85"',
      silhouette: 'High OG Cracked Collar',
      fitBreakdown: [
        'Upcycled Vintage Nike Windbreaker reworked with Ankara prints',
        'Heavyweight 16oz Raw Japanese Indigo Selvedge Denim',
        'Handmade Brass Belt Buckle with Lagos Transit Stamp',
        'Custom Leather Tote crafted from deadstock sneaker tongue leather'
      ],
      votes: 520,
      winStreak: 9,
      imageTag: '👑 BALOGUN ALCHEMIST',
      accentColor: B.amber,
      quote: "Where we come from, you don't buy respect — you wear history that has survived the streets."
    },
    contenderB: {
      id: 'contender-b3',
      alias: 'Farouk "EkoRoyalty" B.',
      handle: '@farouk_eko',
      district: 'Island · Victoria Island Waterfront',
      kicks: 'Louis Vuitton by Virgil Abloh AF1 Low "Monogram"',
      silhouette: 'Bespoke French Calfskin Low',
      fitBreakdown: [
        'Tailored Linen Double-breasted Kimono Robe in Sand',
        'Cropped Structured Silk-blend Trousers',
        'Solid Gold 24K Tooth Cap & Custom Cuban Choker',
        'Bottega Veneta Intrecciato Padded Cassette Bag'
      ],
      votes: 512,
      winStreak: 6,
      imageTag: '💎 EKO WATERFRONT',
      accentColor: B.electricPurple,
      quote: "Virgil opened the door for African youth to redefine high fashion. This is our coronation on foot."
    }
  }
]

// Crowd cheering reactions
const REACTIONS = [
  { emoji: '🔥', label: 'SHEESH!', sound: 'xp_gain' },
  { emoji: '⚡', label: 'GOD TIER!', sound: 'badge_unlock' },
  { emoji: '👟', label: 'CLEAN SOLE!', sound: 'zone_click' },
  { emoji: '💥', label: 'MAINLAND HEAT!', sound: 'xp_gain' },
  { emoji: '✨', label: 'ICED OUT!', sound: 'badge_unlock' }
]

export default function FitCheckArena() {
  const { gamification, awardXP, unlockBadge } = useFestivalGamification()
  const { setZone } = useFestivalTelemetry()

  const [battles, setBattles] = useState(() => {
    try {
      const saved = localStorage.getItem('sf26:fitcheck:battles')
      return saved ? JSON.parse(saved) : INITIAL_BATTLES
    } catch {
      return INITIAL_BATTLES
    }
  })

  const [activeBattleIndex, setActiveBattleIndex] = useState(0)
  const [userVotes, setUserVotes] = useState(() => {
    try {
      const saved = localStorage.getItem('sf26:fitcheck:uservotes')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [reactionFloaters, setReactionFloaters] = useState([])
  const [submitForm, setSubmitForm] = useState({
    alias: '',
    handle: '',
    district: 'Mainland · Yaba',
    kicks: '',
    fitTop: '',
    fitBottom: '',
    accessories: '',
    quote: ''
  })
  const [submitFeedback, setSubmitFeedback] = useState(null)

  const activeBattle = battles[activeBattleIndex] || battles[0]
  const currentBattleUserVote = userVotes[activeBattle.id] || null

  // Calculate vote percentages
  const { pctA, pctB, total } = useMemo(() => {
    const votesA = activeBattle.contenderA.votes
    const votesB = activeBattle.contenderB.votes
    const sum = votesA + votesB
    if (sum === 0) return { pctA: 50, pctB: 50, total: 0 }
    const pA = Math.round((votesA / sum) * 100)
    const pB = 100 - pA
    return { pctA: pA, pctB: pB, total: sum }
  }, [activeBattle])

  // Cast vote for a contender
  const castVote = useCallback((contenderKey) => {
    if (currentBattleUserVote) return // Already voted in this battle

    playFestivalSound('xp_gain')
    const updatedBattles = [...battles]
    const battle = { ...updatedBattles[activeBattleIndex] }

    if (contenderKey === 'A') {
      battle.contenderA = { ...battle.contenderA, votes: battle.contenderA.votes + 1 }
    } else {
      battle.contenderB = { ...battle.contenderB, votes: battle.contenderB.votes + 1 }
    }
    battle.totalVotes += 1
    updatedBattles[activeBattleIndex] = battle

    const updatedUserVotes = { ...userVotes, [battle.id]: contenderKey }
    setBattles(updatedBattles)
    setUserVotes(updatedUserVotes)

    try {
      localStorage.setItem('sf26:fitcheck:battles', JSON.stringify(updatedBattles))
      localStorage.setItem('sf26:fitcheck:uservotes', JSON.stringify(updatedUserVotes))
    } catch {}

    // Gamification rewards
    awardXP(50, `Voted in Fit Battle (${battle.round})`)
    dispatchFestivalAction(FESTIVAL_ACTIONS.FITCHECK_VOTE_CAST, { battleId: battle.id, contender: contenderKey })

    const totalVoted = Object.keys(updatedUserVotes).length
    if (totalVoted >= 3) {
      unlockBadge('FIT_BATTLE_JUDGE')
      playFestivalSound('badge_unlock')
    }
  }, [battles, activeBattleIndex, currentBattleUserVote, userVotes, awardXP, unlockBadge])

  // Trigger floating crowd reaction
  const triggerReaction = (reaction) => {
    playFestivalSound(reaction.sound)
    const newId = Date.now() + Math.random()
    const xPos = 20 + Math.random() * 60
    setReactionFloaters(prev => [...prev.slice(-12), { id: newId, emoji: reaction.emoji, label: reaction.label, x: xPos }])
    setTimeout(() => {
      setReactionFloaters(prev => prev.filter(r => r.id !== newId))
    }, 2000)
  }

  // Handle Fit Submission to the Arena
  const handleSubmitFit = (e) => {
    e.preventDefault()
    if (!submitForm.alias || !submitForm.kicks || !submitForm.fitTop) {
      setSubmitFeedback({ error: 'Please enter your moniker, kicks, and top wear!' })
      return
    }

    playFestivalSound('badge_unlock')
    const newContender = {
      id: `user-contender-${Date.now()}`,
      alias: submitForm.alias,
      handle: submitForm.handle.startsWith('@') ? submitForm.handle : `@${submitForm.handle || 'challenger'}`,
      district: submitForm.district,
      kicks: submitForm.kicks,
      silhouette: submitForm.kicks.split(' ')[0] + ' Custom Silhouette',
      fitBreakdown: [
        submitForm.fitTop,
        submitForm.fitBottom || 'Custom Streetwear Bottom',
        submitForm.accessories || 'Curated Street Accessories'
      ],
      votes: 1,
      winStreak: 1,
      imageTag: '🌟 REGISTERED CHALLENGER',
      accentColor: B.danfoYellow,
      quote: submitForm.quote || "Stepped out to claim the title at Sneakers Fest '26."
    }

    // Create a new active challenger battle
    const userBattle = {
      id: `battle-challenger-${Date.now()}`,
      round: 'LIVE CHALLENGER BATTLE · ARENA OPEN',
      category: 'COMMUNITY CHALLENGER vs REIGNING CHAMP',
      totalVotes: 1,
      active: true,
      contenderA: newContender,
      contenderB: battles[0].contenderB
    }

    const nextBattles = [userBattle, ...battles]
    setBattles(nextBattles)
    setActiveBattleIndex(0)

    try {
      localStorage.setItem('sf26:fitcheck:battles', JSON.stringify(nextBattles))
    } catch {}

    awardXP(150, 'Entered Live Fit-Check Arena')
    unlockBadge('BEST_DRESSED_STREET')
    setShowSubmitModal(false)
    setSubmitFeedback(null)
  }

  return (
    <section id="fitcheck-arena" style={{
      position: 'relative',
      overflow: 'hidden',
      background: `radial-gradient(ellipse at 50% 0%, ${B.charcoal} 0%, ${B.black} 80%)`,
      padding: '90px 24px 100px',
      borderBottom: `1px solid ${B.gunmetal}`
    }}>
      <GrainOverlay />

      {/* Floating Reaction Animation CSS & Keyframes */}
      <style>{`
        @keyframes floatUpFade {
          0% { transform: translateY(0) scale(0.8); opacity: 1; }
          100% { transform: translateY(-160px) scale(1.3); opacity: 0; }
        }
        @keyframes pulseGlowRing {
          0%, 100% { box-shadow: 0 0 25px ${B.amber}30, inset 0 0 15px ${B.amber}10; }
          50% { box-shadow: 0 0 45px ${B.amber}60, inset 0 0 25px ${B.amber}25; }
        }
        @keyframes clashLightning {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.15) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>

      {/* Dynamic Floating Reaction Particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 40, overflow: 'hidden' }}>
        {reactionFloaters.map(r => (
          <div key={r.id} style={{
            position: 'absolute',
            left: `${r.x}%`,
            bottom: '220px',
            animation: 'floatUpFade 2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(10, 10, 10, 0.85)',
            border: `1px solid ${B.amber}`,
            borderRadius: 999,
            padding: '6px 14px',
            boxShadow: `0 8px 30px ${B.amber}40`,
            backdropFilter: 'blur(8px)'
          }}>
            <span style={{ fontSize: 20 }}>{r.emoji}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: B.white }}>{r.label}</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1240, margin: '0 auto' }}>
        <SectionTag>LIVE ARENA · STREET CULTURE SHOWDOWN</SectionTag>

        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${B.amber}15`, border: `1px solid ${B.amber}40`, borderRadius: 999, padding: '4px 14px', marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: B.neonLime, boxShadow: `0 0 8px ${B.neonLime}`, animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.amber, letterSpacing: '0.15em', fontWeight: 700 }}>
                1v1 HEAD-TO-HEAD BATTLE RING · #KICKSONCOURT
              </span>
            </div>
            <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(26px, 4.5vw, 46px)', color: B.white, lineHeight: 1.1 }}>
              LIVE FIT-CHECK <span style={{ color: B.amber, textShadow: `0 0 25px ${B.amber}50` }}>ARENA</span>
            </h2>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 'clamp(11px, 1.4vw, 13px)', color: B.mist, marginTop: 10, maxWidth: 650, lineHeight: 1.6 }}>
              Where Lagos streetwear legends clash on foot. Vote in real-time, judge authentic silhouettes, earn XP, or submit your own fit to battle the reigning champions.
            </p>
          </div>

          {/* Action Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setShowSubmitModal(true)
                playFestivalSound('zone_click')
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: `linear-gradient(135deg, ${B.amber}, ${B.amberDeep})`,
                color: B.black,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                padding: '12px 22px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                boxShadow: `0 0 20px ${B.amber}50`,
                transition: 'all 0.2s ease'
              }}
            >
              <span>⚔️</span> ENTER YOUR FIT (+150 XP)
            </button>

            <a
              href="https://twitter.com/intent/tweet?text=Judging%20the%20heaviest%20on-foot%20streetwear%20clashes%20at%20Sneakers%20Fest%20'26!%20Vote%20now%20in%20the%20Live%20Fit-Check%20Arena%20%F0%9F%94%A5%20https%3A%2F%2Fsneakers-fest-55.netlify.app%23fitcheck-arena%20%40s_fest26%20%40catalystggg"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: B.charcoal,
                color: B.white,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                padding: '12px 18px',
                borderRadius: 6,
                border: `1px solid ${B.gunmetal}`,
                textDecoration: 'none',
                letterSpacing: '0.1em'
              }}
            >
              <span>📢</span> SHARE BATTLE
            </a>
          </div>
        </div>

        {/* Battle Round Selector Bar */}
        <div style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          paddingBottom: 14,
          marginBottom: 30,
          borderBottom: `1px solid ${B.gunmetal}`
        }}>
          {battles.map((b, idx) => {
            const isSelected = idx === activeBattleIndex
            const isVoted = Boolean(userVotes[b.id])
            return (
              <button
                key={b.id}
                onClick={() => {
                  setActiveBattleIndex(idx)
                  playFestivalSound('zone_click')
                }}
                style={{
                  background: isSelected ? `${B.amber}20` : B.charcoal,
                  border: isSelected ? `1px solid ${B.amber}` : `1px solid ${B.gunmetal}`,
                  borderRadius: 6,
                  padding: '10px 18px',
                  color: isSelected ? B.amberGlow : B.smoke,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s'
                }}
              >
                <span>{isSelected ? '🔴 LIVE' : '⚔️'}</span>
                <span>{b.round.split('·')[0]}</span>
                {isVoted && <span style={{ color: B.neonLime, fontSize: 11 }}>✓ VOTED</span>}
              </button>
            )
          })}
        </div>

        {/* ============================================================== */}
        {/* 1v1 HEAD-TO-HEAD OCTAGON RING                                 */}
        {/* ============================================================== */}
        <div style={{
          position: 'relative',
          background: `linear-gradient(180deg, ${B.charcoal} 0%, #101014 100%)`,
          border: `1px solid ${B.amber}30`,
          borderRadius: 12,
          padding: '30px 24px',
          boxShadow: `0 15px 40px rgba(0,0,0,0.6)`,
          marginBottom: 40
        }}>
          {/* Top Banner: Category and Live Odds */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24, borderBottom: `1px solid ${B.gunmetal}`, paddingBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.2em' }}>BATTLE CATEGORY</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 700, color: B.white, marginTop: 4 }}>
                {activeBattle.category}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.2em' }}>TOTAL CROWD VOTES</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, fontWeight: 900, color: B.amber, marginTop: 4 }}>
                {total.toLocaleString()} VOTES
              </div>
            </div>
          </div>

          {/* Real-Time Clash Voting Ratio Bar */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: B.amber }}>
                  {activeBattle.contenderA.alias}
                </span>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 900, color: B.amber }}>
                  {pctA}%
                </span>
              </div>

              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.15em' }}>
                {currentBattleUserVote ? 'YOUR VOTE LOCKED' : 'TAP BELOW TO CAST VOTE'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 900, color: B.neonCyan }}>
                  {pctB}%
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: B.neonCyan }}>
                  {activeBattle.contenderB.alias}
                </span>
              </div>
            </div>

            {/* Split Progress Bar */}
            <div style={{
              height: 12,
              borderRadius: 6,
              background: B.gunmetal,
              display: 'flex',
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
            }}>
              <div style={{
                width: `${pctA}%`,
                background: `linear-gradient(90deg, ${B.amberDeep}, ${B.amber})`,
                transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
              }} />
              <div style={{
                width: `${pctB}%`,
                background: `linear-gradient(90deg, ${B.neonCyan}, #0099FF)`,
                transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
              }} />
            </div>
          </div>

          {/* Grid Layout: Contender A vs VS Divider vs Contender B */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 24,
            alignItems: 'stretch',
            position: 'relative'
          }}>

            {/* CONTENDER A CARD */}
            <div style={{
              background: '#0D0E12',
              border: currentBattleUserVote === 'A' ? `2px solid ${B.amber}` : `1px solid ${B.amber}30`,
              borderRadius: 10,
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: currentBattleUserVote === 'A' ? `0 0 30px ${B.amber}40` : 'none',
              transition: 'all 0.3s ease'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9,
                    fontWeight: 700,
                    background: `${B.amber}20`,
                    color: B.amber,
                    padding: '4px 10px',
                    borderRadius: 4,
                    letterSpacing: '0.1em'
                  }}>
                    {activeBattle.contenderA.imageTag}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.mist }}>
                    🔥 {activeBattle.contenderA.winStreak} STREAK
                  </span>
                </div>

                <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: 20, fontWeight: 900, color: B.white, lineHeight: 1.2 }}>
                  {activeBattle.contenderA.alias}
                </h3>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.amberGlow, marginTop: 4 }}>
                  {activeBattle.contenderA.handle} · {activeBattle.contenderA.district}
                </div>

                {/* Hero Footwear Badge */}
                <div style={{
                  background: `${B.charcoal}`,
                  border: `1px solid ${B.amber}40`,
                  borderRadius: 8,
                  padding: '14px',
                  margin: '16px 0',
                  textAlign: 'left'
                }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.2em' }}>ON-FOOT WEAPON</div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 700, color: B.amberGlow, marginTop: 4 }}>
                    👟 {activeBattle.contenderA.kicks}
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.mist, marginTop: 4 }}>
                    Silhouette: {activeBattle.contenderA.silhouette}
                  </div>
                </div>

                {/* Fit Breakdown */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.15em', marginBottom: 8 }}>
                    FULL DRIP DECONSTRUCTION:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {activeBattle.contenderA.fitBreakdown.map((item, i) => (
                      <li key={i} style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        color: B.mist,
                        padding: '4px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        <span style={{ color: B.amber }}>›</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Statement Quote */}
                <div style={{
                  borderLeft: `2px solid ${B.amber}`,
                  paddingLeft: 10,
                  fontStyle: 'italic',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  color: B.smoke,
                  marginBottom: 20
                }}>
                  "{activeBattle.contenderA.quote}"
                </div>
              </div>

              {/* Vote Button A */}
              <button
                onClick={() => castVote('A')}
                disabled={Boolean(currentBattleUserVote)}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: currentBattleUserVote === 'A'
                    ? `linear-gradient(135deg, ${B.amber}, ${B.amberDeep})`
                    : currentBattleUserVote
                    ? B.gunmetal
                    : `linear-gradient(135deg, ${B.amber}30, ${B.amber}15)`,
                  border: `1px solid ${B.amber}`,
                  borderRadius: 6,
                  color: currentBattleUserVote === 'A' ? B.black : B.amberGlow,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  cursor: currentBattleUserVote ? 'default' : 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease'
                }}
              >
                {currentBattleUserVote === 'A' ? '✓ YOUR SELECTION' : 'VOTE THIS FIT (+50 XP)'}
              </button>
            </div>

            {/* CONTENDER B CARD */}
            <div style={{
              background: '#0D0E12',
              border: currentBattleUserVote === 'B' ? `2px solid ${B.neonCyan}` : `1px solid ${B.neonCyan}30`,
              borderRadius: 10,
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: currentBattleUserVote === 'B' ? `0 0 30px ${B.neonCyan}40` : 'none',
              transition: 'all 0.3s ease'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9,
                    fontWeight: 700,
                    background: `${B.neonCyan}20`,
                    color: B.neonCyan,
                    padding: '4px 10px',
                    borderRadius: 4,
                    letterSpacing: '0.1em'
                  }}>
                    {activeBattle.contenderB.imageTag}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.mist }}>
                    🔥 {activeBattle.contenderB.winStreak} STREAK
                  </span>
                </div>

                <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: 20, fontWeight: 900, color: B.white, lineHeight: 1.2 }}>
                  {activeBattle.contenderB.alias}
                </h3>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.neonCyan, marginTop: 4 }}>
                  {activeBattle.contenderB.handle} · {activeBattle.contenderB.district}
                </div>

                {/* Hero Footwear Badge */}
                <div style={{
                  background: `${B.charcoal}`,
                  border: `1px solid ${B.neonCyan}40`,
                  borderRadius: 8,
                  padding: '14px',
                  margin: '16px 0',
                  textAlign: 'left'
                }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.2em' }}>ON-FOOT WEAPON</div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 700, color: B.neonCyan, marginTop: 4 }}>
                    👟 {activeBattle.contenderB.kicks}
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.mist, marginTop: 4 }}>
                    Silhouette: {activeBattle.contenderB.silhouette}
                  </div>
                </div>

                {/* Fit Breakdown */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.15em', marginBottom: 8 }}>
                    FULL DRIP DECONSTRUCTION:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {activeBattle.contenderB.fitBreakdown.map((item, i) => (
                      <li key={i} style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        color: B.mist,
                        padding: '4px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        <span style={{ color: B.neonCyan }}>›</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Statement Quote */}
                <div style={{
                  borderLeft: `2px solid ${B.neonCyan}`,
                  paddingLeft: 10,
                  fontStyle: 'italic',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  color: B.smoke,
                  marginBottom: 20
                }}>
                  "{activeBattle.contenderB.quote}"
                </div>
              </div>

              {/* Vote Button B */}
              <button
                onClick={() => castVote('B')}
                disabled={Boolean(currentBattleUserVote)}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: currentBattleUserVote === 'B'
                    ? `linear-gradient(135deg, ${B.neonCyan}, #0099FF)`
                    : currentBattleUserVote
                    ? B.gunmetal
                    : `linear-gradient(135deg, ${B.neonCyan}30, ${B.neonCyan}15)`,
                  border: `1px solid ${B.neonCyan}`,
                  borderRadius: 6,
                  color: currentBattleUserVote === 'B' ? B.black : B.neonCyan,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  cursor: currentBattleUserVote ? 'default' : 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease'
                }}
              >
                {currentBattleUserVote === 'B' ? '✓ YOUR SELECTION' : 'VOTE THIS FIT (+50 XP)'}
              </button>
            </div>
          </div>

          {/* Crowd Reaction Soundboard Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 12,
            marginTop: 28,
            paddingTop: 20,
            borderTop: `1px solid ${B.gunmetal}`
          }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.2em', marginRight: 8 }}>
              CROWD ROAR:
            </span>
            {REACTIONS.map((r, i) => (
              <button
                key={i}
                onClick={() => triggerReaction(r)}
                style={{
                  background: B.charcoal,
                  border: `1px solid ${B.gunmetal}`,
                  borderRadius: 999,
                  padding: '6px 14px',
                  color: B.white,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'transform 0.15s ease'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>{r.emoji}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* FIT BATTLE CHAMPIONS: HALL OF FAME LEADERBOARD                */}
        {/* ============================================================== */}
        <div style={{
          background: B.charcoal,
          border: `1px solid ${B.gunmetal}`,
          borderRadius: 10,
          padding: '24px 20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.amber, letterSpacing: '0.15em', fontWeight: 700 }}>
              🏆 ARENA HALL OF FAME · TOP CROWD FAVORITES
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke }}>
              UPDATED LIVE AT MURI OKUNOLA PARK
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {[
              { rank: '01', name: 'Zack "BalogunKing" U.', kicks: 'AJ1 High Lost & Found \'85', record: '9-0 UNDEFEATED', badge: '👑 REIGNING KING' },
              { rank: '02', name: 'Chidera "IslandDon" O.', kicks: 'Travis Scott AJ1 Reverse Mocha', record: '7-1 MASTER', badge: '⚡ ISLAND DYNASTY' },
              { rank: '03', name: 'Farouk "EkoRoyalty" B.', kicks: 'LV x AF1 Low Virgil Abloh', record: '6-1 TITAN', badge: '💎 LUXURY VANGUARD' },
              { rank: '04', name: 'Kemi "AlteVibe" E.', kicks: 'Wales Bonner x Samba Silver', record: '5-0 UNDEFEATED', badge: '🎨 ALTÉ ICON' }
            ].map((champ, i) => (
              <div key={i} style={{
                background: '#121216',
                border: `1px solid ${B.gunmetal}`,
                borderRadius: 6,
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <div style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 16,
                  fontWeight: 900,
                  color: i === 0 ? B.amber : B.mist,
                  width: 28
                }}>
                  {champ.rank}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: B.white, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {champ.name}
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.amberGlow, marginTop: 2 }}>
                    {champ.kicks}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
                    <span style={{ fontSize: 8, color: B.neonLime, fontFamily: "'Space Mono', monospace" }}>{champ.record}</span>
                    <span style={{ fontSize: 8, color: B.smoke, fontFamily: "'Space Mono', monospace" }}>· {champ.badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SUBMIT YOUR FIT MODAL                                          */}
        {/* ============================================================== */}
        {showSubmitModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}>
            <div style={{
              background: '#0D0E12',
              border: `1px solid ${B.amber}`,
              borderRadius: 12,
              padding: '30px 24px',
              maxWidth: 540,
              width: '100%',
              boxShadow: `0 20px 60px ${B.amber}30`,
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.amber, letterSpacing: '0.2em' }}>
                    ENTER THE 1v1 OCTAGON
                  </span>
                  <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: 20, fontWeight: 900, color: B.white, marginTop: 4 }}>
                    SUBMIT YOUR FIT (+150 XP)
                  </h3>
                </div>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: B.smoke,
                    fontSize: 22,
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>

              {submitFeedback?.error && (
                <div style={{ background: 'rgba(255, 45, 123, 0.15)', border: `1px solid ${B.neonMagenta}`, padding: '10px', borderRadius: 4, color: B.neonMagenta, fontSize: 11, marginBottom: 16 }}>
                  {submitFeedback.error}
                </div>
              )}

              <form onSubmit={handleSubmitFit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, display: 'block', marginBottom: 4 }}>
                      MONIKER / ALIAS *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tunde 'SoleVanguard'"
                      value={submitForm.alias}
                      onChange={e => setSubmitForm({ ...submitForm, alias: e.target.value })}
                      style={{
                        width: '100%',
                        background: B.charcoal,
                        border: `1px solid ${B.gunmetal}`,
                        borderRadius: 4,
                        padding: '10px',
                        color: B.white,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, display: 'block', marginBottom: 4 }}>
                      X / IG HANDLE
                    </label>
                    <input
                      type="text"
                      placeholder="@yourhandle"
                      value={submitForm.handle}
                      onChange={e => setSubmitForm({ ...submitForm, handle: e.target.value })}
                      style={{
                        width: '100%',
                        background: B.charcoal,
                        border: `1px solid ${B.gunmetal}`,
                        borderRadius: 4,
                        padding: '10px',
                        color: B.white,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, display: 'block', marginBottom: 4 }}>
                    LAGOS DISTRICT / TERRITORY
                  </label>
                  <select
                    value={submitForm.district}
                    onChange={e => setSubmitForm({ ...submitForm, district: e.target.value })}
                    style={{
                      width: '100%',
                      background: B.charcoal,
                      border: `1px solid ${B.gunmetal}`,
                      borderRadius: 4,
                      padding: '10px',
                      color: B.white,
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 11
                    }}
                  >
                    <option value="Mainland · Yaba Creative Corridor">Mainland · Yaba Creative Corridor</option>
                    <option value="Mainland · Surulere Retro Vault">Mainland · Surulere Retro Vault</option>
                    <option value="Mainland · Ikeja Computer Village">Mainland · Ikeja Computer Village</option>
                    <option value="Island · Lekki Phase 1 Luxury">Island · Lekki Phase 1 Luxury</option>
                    <option value="Island · Victoria Island Waterfront">Island · Victoria Island Waterfront</option>
                    <option value="Mainland · Balogun Wholesale Hub">Mainland · Balogun Wholesale Hub</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, display: 'block', marginBottom: 4 }}>
                    ON-FOOT SNEAKER PAIR *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Travis Scott AJ1 Low OG 'Reverse Mocha'"
                    value={submitForm.kicks}
                    onChange={e => setSubmitForm({ ...submitForm, kicks: e.target.value })}
                    style={{
                      width: '100%',
                      background: B.charcoal,
                      border: `1px solid ${B.gunmetal}`,
                      borderRadius: 4,
                      padding: '10px',
                      color: B.white,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, display: 'block', marginBottom: 4 }}>
                    TOP WEAR / JACKET *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Boxy Heavyweight Vintage Tee with washed distress"
                    value={submitForm.fitTop}
                    onChange={e => setSubmitForm({ ...submitForm, fitTop: e.target.value })}
                    style={{
                      width: '100%',
                      background: B.charcoal,
                      border: `1px solid ${B.gunmetal}`,
                      borderRadius: 4,
                      padding: '10px',
                      color: B.white,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, display: 'block', marginBottom: 4 }}>
                      PANTS / CARGOS
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Wide Leg Carpenter Denim"
                      value={submitForm.fitBottom}
                      onChange={e => setSubmitForm({ ...submitForm, fitBottom: e.target.value })}
                      style={{
                        width: '100%',
                        background: B.charcoal,
                        border: `1px solid ${B.gunmetal}`,
                        borderRadius: 4,
                        padding: '10px',
                        color: B.white,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, display: 'block', marginBottom: 4 }}>
                      ACCESSORIES
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Silver Cuban chain + Danfo Tote"
                      value={submitForm.accessories}
                      onChange={e => setSubmitForm({ ...submitForm, accessories: e.target.value })}
                      style={{
                        width: '100%',
                        background: B.charcoal,
                        border: `1px solid ${B.gunmetal}`,
                        borderRadius: 4,
                        padding: '10px',
                        color: B.white,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    background: `linear-gradient(135deg, ${B.amber}, ${B.amberDeep})`,
                    color: B.black,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    padding: '14px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: 8,
                    boxShadow: `0 0 20px ${B.amber}50`
                  }}
                >
                  ⚡ STEP INTO THE RING (+150 XP & BADGE)
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
