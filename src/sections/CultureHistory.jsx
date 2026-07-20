import { useState } from 'react'
import { B } from '../tokens'
import Egg from '../components/Egg'

const ERAS = [
  {
    id: 'e1', period: '1917 – 1960s', color: B.smoke,
    title: 'BEFORE THE CULTURE',
    sub: 'SNEAKERS WERE TOOLS',
    body: 'Converse created the All Star in 1917 for basketball courts. Chuck Taylor evangelised them across America. For decades, sneakers meant sport — they lived in gyms and died there. Nobody thought to keep the box.',
    lagos: null,
    icon: '○',
  },
  {
    id: 'e2', period: '1970s', color: '#69C9D0',
    title: 'THE STREETS CLAIM THEM',
    sub: 'NYC REWRITES THE RULES',
    body: "New York's playground basketball scene turned sneakers into social currency. Adidas Superstar on the feet of Harlem ballers. Run DMC wore shell-toes with no laces and made it gospel. For the first time, a shoe told you who someone was before they spoke.",
    lagos: 'Lagos markets begin importing Adidas knock-offs. Surulere traders sense the demand before anyone names it.',
    icon: '◎',
  },
  {
    id: 'e3', period: '1984 – 1990', color: B.neonMagenta,
    title: 'THE JORDAN ERA',
    sub: 'ONE SHOE CHANGES EVERYTHING',
    body: 'Nike signs a 21-year-old Michael Jordan. The Air Jordan 1 launches. Nike gets fined $5,000 every game Jordan wears them — and pays it gladly. The shoe sells out before anyone can process what just happened. Hype is invented. The queue is born.',
    lagos: 'The Air Jordan mythology reaches Lagos through VHS tapes, music videos, and the occasional returnee from London or New York carrying contraband heat.',
    icon: '◆',
  },
  {
    id: 'e4', period: '1990s', color: B.amber,
    title: 'HIP-HOP UNITES THE MOVEMENT',
    sub: 'THE PAIR IS THE STATEMENT',
    body: 'Rap videos become sneaker lookbooks. Jay-Z in Forces. Nas in Uptowns. Every colorway becomes a code — if you knew what you were looking at, you knew who they were. The resell market is born in back alleys and school corridors. A shoe could buy respect.',
    lagos: 'Computer Village and Tejuosho market in Lagos build a parallel economy. First-generation "plug" culture emerges. Your guy knows a guy who can get it.',
    icon: '◈',
  },
  {
    id: 'e5', period: '2000s', color: B.neonCyan,
    title: 'THE INTERNET OPENS THE FLOOR',
    sub: 'THE WORLD BECOMES ONE QUEUE',
    body: 'NikeTalk, Sneaker News, ISS forums. For the first time collectors in Lagos could know a drop date at the same time as collectors in Tokyo. The global release changes everything — and the SNKRS app makes everyone equal in theory, unequal in outcome.',
    lagos: null,
    icon: '✦',
  },
  {
    id: 'e6', period: '2010s', color: B.neonLime,
    title: 'SNEAKERS BECOME AN ASSET CLASS',
    sub: 'THE HYPEBEAST ERA',
    body: 'Kanye West signs with Adidas. The Yeezy Boost 350 moves from foot to investment portfolio. StockX launches. A pair of DS Off-White Air Maxes becomes a down payment. Supreme collabs sell out in 0.3 seconds. The culture and the market are now inseparable.',
    lagos: 'Lagos Instagram sneaker accounts break through. Plug pages rack up 50,000 followers. The resell game goes digital and the city starts keeping up with New York.',
    icon: '⚡',
  },
  {
    id: 'e7', period: 'THE LAGOS CHAPTER', color: B.amber,
    title: 'THE CONTINENT WAKES UP',
    sub: 'THIS CITY HAS BEEN READY',
    body: "Afrobeats goes global and takes Lagos style with it. Burna Boy, Wizkid, Davido — on every stage in every city in the world — in heat. The world starts to look at Lagos not just for music but for what's on people's feet. Streetwear brands open pop-ups. Sneaker communities form in Yaba, Lekki, VI. The culture here was never absent — it was waiting for the platform.",
    lagos: 'THIS IS THE LAGOS CHAPTER. It was always here.',
    icon: '◉',
  },
  {
    id: 'e8', period: 'DECEMBER 12, 2026', color: B.neonMagenta,
    title: 'THE SOLE EXHIBITION',
    sub: 'NOW IT IS OUR TIME',
    body: "Sneakers Fest '26 is not an imitation of New York or Tokyo. It is Lagos speaking for itself. 30-50 curated vendors. Live performances. Custom art. The museum wall. The sacred wall. The drops. This is the chapter where the city claims its place in the global culture — permanently.",
    lagos: 'Lagos. December 12. We built this.',
    icon: '◆',
  },
]

const QUESTIONS = [
  {
    q: 'How did you first get pulled into sneaker culture?',
    opts: [
      { label: 'Music — a video, an artist, a moment', arch: 'CULTURE BEARER' },
      { label: 'Sport — I grew up playing', arch: 'GRAIL SEEKER' },
      { label: 'Fashion — I was always drawn to how things looked', arch: 'STYLE ARCHITECT' },
      { label: 'Community — people around me were into it', arch: 'MOVEMENT MAKER' },
      { label: "I'm still finding my way in", arch: 'THE NEWCOMER' },
    ],
  },
  {
    q: 'When you see a rare pair, what\'s your first instinct?',
    opts: [
      { label: 'Wear them — shoes are for feet', arch: 'CULTURE BEARER' },
      { label: 'Display them — they belong in a case', arch: 'GRAIL SEEKER' },
      { label: 'Study them — who designed this and why', arch: 'STYLE ARCHITECT' },
      { label: 'Who needs to see this — tag and share', arch: 'MOVEMENT MAKER' },
      { label: 'Research the resale value first', arch: 'GRAIL SEEKER' },
    ],
  },
  {
    q: 'What does your collection say about you?',
    opts: [
      { label: "It's a biography — every pair is a chapter", arch: 'CULTURE BEARER' },
      { label: "It's a gallery — curated, intentional, no duplicates", arch: 'STYLE ARCHITECT' },
      { label: "It's a vault — investments, preserved and protected", arch: 'GRAIL SEEKER' },
      { label: "It's a conversation — I dress to connect", arch: 'MOVEMENT MAKER' },
      { label: "It's still being written", arch: 'THE NEWCOMER' },
    ],
  },
  {
    q: 'What does Lagos becoming a sneaker capital mean to you?',
    opts: [
      { label: "Validation — we've always been this", arch: 'CULTURE BEARER' },
      { label: 'Opportunity — the market is opening up', arch: 'GRAIL SEEKER' },
      { label: 'Responsibility — we have to do it right', arch: 'STYLE ARCHITECT' },
      { label: 'Power — our city sets trends now', arch: 'MOVEMENT MAKER' },
      { label: 'Excitement — I want to be part of it', arch: 'THE NEWCOMER' },
    ],
  },
  {
    q: 'December 12 in Lagos. What is it to you?',
    opts: [
      { label: 'A celebration of who we are', arch: 'CULTURE BEARER' },
      { label: 'The biggest drop day on the calendar', arch: 'GRAIL SEEKER' },
      { label: 'A showcase — Lagos on display for the world', arch: 'STYLE ARCHITECT' },
      { label: 'The beginning of something permanent', arch: 'MOVEMENT MAKER' },
      { label: 'My first real introduction to the culture', arch: 'THE NEWCOMER' },
    ],
  },
]

const ARCHETYPES = {
  'GRAIL SEEKER': {
    color: B.amber,
    icon: '◆',
    desc: "You are the archive. The vaults exist because of people like you. You don't just collect shoes — you preserve history. Your shelf is a museum. Your eye is a scholarship.",
    stake: "Your stake in the culture is permanence. You make sure the culture remembers itself.",
  },
  'CULTURE BEARER': {
    color: B.neonCyan,
    icon: '◎',
    desc: "The culture moves through you. You were there for the music, the moment, the meaning — and you carry it forward. When the next generation asks how it felt, they'll ask you.",
    stake: 'Your stake in the culture is memory. You are a living archive.',
  },
  'STYLE ARCHITECT': {
    color: B.neonMagenta,
    icon: '◉',
    desc: "You design the aesthetic. You understand that how something looks is also how it feels, and how it speaks. Sneaker culture is fashion, and fashion is power — and you've always known this.",
    stake: 'Your stake in the culture is vision. You show the rest of us what it could be.',
  },
  'MOVEMENT MAKER': {
    color: B.neonLime,
    icon: '◈',
    desc: "You build the rooms. The communities, the conversations, the platforms — they exist because people like you refused to experience culture alone. The movement has your fingerprints.",
    stake: 'Your stake in the culture is its future. Without you it stays local. With you it goes everywhere.',
  },
  'THE NEWCOMER': {
    color: '#69C9D0',
    icon: '○',
    desc: "Every elder was once where you are. You bring something the culture always needs — fresh eyes, no assumptions, and hunger. You haven't been shaped by the old rules yet. That's power.",
    stake: 'Your stake in the culture is possibility. The next era belongs to you.',
  },
}

function EraCard({ era, idx }) {
  const [open, setOpen] = useState(false)
  const isRight = idx % 2 !== 0
  return (
    <div style={{ display: 'flex', gap: 0, position: 'relative', marginBottom: 0 }}>
      {/* Timeline spine connector */}
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2,
        background: `linear-gradient(${era.color}40, ${era.color}10)`, transform: 'translateX(-50%)',
        display: window?.innerWidth < 768 ? 'none' : 'block' }} />

      {/* Left side — content or spacer */}
      <div style={{ flex: 1, padding: isRight ? '0 40px 0 0' : '0 40px 0 0',
        display: 'flex', justifyContent: 'flex-end' }}>
        {!isRight && <EraContent era={era} open={open} setOpen={setOpen} />}
      </div>

      {/* Centre node */}
      <div style={{ flexShrink: 0, width: 48, display: 'flex', flexDirection: 'column',
        alignItems: 'center', paddingTop: 24, position: 'relative', zIndex: 2 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%',
          background: `radial-gradient(circle, ${era.color}22, ${B.void})`,
          border: `2px solid ${era.color}60`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 20px ${era.color}30`, cursor: 'pointer',
          transition: 'all 0.2s' }}
          onClick={() => setOpen(o => !o)}>
          <span style={{ color: era.color, fontSize: 14 }}>{era.icon}</span>
        </div>
      </div>

      {/* Right side */}
      <div style={{ flex: 1, padding: '0 0 0 40px' }}>
        {isRight && <EraContent era={era} open={open} setOpen={setOpen} />}
      </div>
    </div>
  )
}

function EraContent({ era, open, setOpen }) {
  return (
    <div style={{ paddingBottom: 40, width: '100%' }}>
      <div className="card-3d" style={{ padding: '20px 22px', background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${era.color}20`, borderRadius: 8, cursor: 'pointer',
        transition: 'all 0.25s', position: 'relative', overflow: 'hidden' }}
        onClick={() => setOpen(o => !o)}
        onMouseEnter={e => { e.currentTarget.style.borderColor = era.color + '50'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = era.color + '20'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}>
        <div style={{ height: 2, position: 'absolute', top: 0, left: 0, right: 0,
          background: `linear-gradient(90deg, ${era.color}80, transparent)` }} />
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: era.color,
          letterSpacing: 3, marginBottom: 4 }}>{era.period}</div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: B.white,
          letterSpacing: 2, lineHeight: 1, marginBottom: 2 }}>{era.title}</div>
        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 8, color: era.color,
          letterSpacing: 2, marginBottom: open ? 14 : 0 }}>{era.sub}</div>
        {open && (
          <>
            <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, color: B.smoke,
              lineHeight: 1.8, marginBottom: era.lagos ? 12 : 0 }}>{era.body}</p>
            {era.lagos && (
              <div className="card-3d" style={{ padding: '10px 14px', background: era.color + '10',
                border: `1px solid ${era.color}30`, borderRadius: 4 }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8,
                  color: era.color, letterSpacing: 2 }}>◆ LAGOS — </span>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 12,
                  color: B.white, fontStyle: 'italic' }}>{era.lagos}</span>
              </div>
            )}
          </>
        )}
        <div style={{ position: 'absolute', bottom: 10, right: 14, fontFamily: "'Space Mono',monospace",
          fontSize: 9, color: era.color + '60' }}>{open ? '▲ CLOSE' : '▼ READ'}</div>
      </div>
    </div>
  )
}

function StakeQuiz() {
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState({})
  const [result, setResult] = useState(null)

  const pick = (arch) => {
    const next = { ...scores, [arch]: (scores[arch] || 0) + 1 }
    setScores(next)
    if (step === QUESTIONS.length - 1) {
      const winner = Object.entries(next).sort((a, b) => b[1] - a[1])[0][0]
      setResult(winner)
    } else {
      setStep(s => s + 1)
    }
  }

  const reset = () => { setStep(0); setScores({}); setResult(null) }

  const q = QUESTIONS[step]
  const cfg = result ? ARCHETYPES[result] : null

  return (
    <div style={{ marginTop: 72, padding: '52px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <p style={{ fontFamily: "'Space Mono',monospace", color: B.amber, fontSize: 10, letterSpacing: 5, marginBottom: 12 }}>
          ◈ FIND YOUR STAKE
        </p>
        <h3 style={{ fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 'clamp(36px,6vw,64px)', lineHeight: 0.9, letterSpacing: 3, marginBottom: 0,
          background: `linear-gradient(180deg, ${B.white}, ${B.amber}80)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          WHAT IS YOUR<br />PLACE IN THE CULTURE?
        </h3>
      </div>

      {!result ? (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 32 }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{ width: i <= step ? 28 : 14, height: 4, borderRadius: 2,
                background: i < step ? B.amber : i === step ? B.amber : 'rgba(255,255,255,0.12)',
                transition: 'all 0.3s' }} />
            ))}
          </div>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: B.smoke,
            letterSpacing: 2, textAlign: 'center', marginBottom: 8 }}>
            QUESTION {step + 1} OF {QUESTIONS.length}
          </p>
          <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, color: B.white,
            lineHeight: 1.6, textAlign: 'center', marginBottom: 28 }}>{q.q}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.opts.map((opt, i) => (
              <button key={i} onClick={() => pick(opt.arch)}
                style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, cursor: 'pointer',
                  fontFamily: "'Syne',sans-serif", fontSize: 14, color: B.white,
                  textAlign: 'left', transition: 'all 0.2s', lineHeight: 1.5 }}
                onMouseEnter={e => { e.currentTarget.style.background = B.amber + '15'; e.currentTarget.style.borderColor = B.amber + '60' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)' }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center',
          animation: 'fadeUp 0.5s ease forwards' }}>
          <div style={{ padding: '40px 32px', background: `linear-gradient(135deg, ${cfg.color}12, rgba(255,255,255,0.03))`,
            border: `1px solid ${cfg.color}40`, borderRadius: 12,
            boxShadow: `0 0 60px ${cfg.color}10`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }} />
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: cfg.color,
              letterSpacing: 4, marginBottom: 8 }}>YOU ARE</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 'clamp(40px,8vw,72px)', color: cfg.color, letterSpacing: 4,
              lineHeight: 0.9, marginBottom: 20, textShadow: `0 0 40px ${cfg.color}50` }}>
              {cfg.icon} {result}
            </div>
            <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, color: B.white,
              lineHeight: 1.8, marginBottom: 20 }}>{cfg.desc}</p>
            <div style={{ padding: '14px 20px', background: cfg.color + '10',
              border: `1px solid ${cfg.color}30`, borderRadius: 6, marginBottom: 24 }}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, color: cfg.color,
                fontStyle: 'italic', lineHeight: 1.7 }}>"{ cfg.stake}"</p>
            </div>
            <button onClick={reset}
              style={{ padding: '10px 28px', background: 'transparent', border: `1px solid ${cfg.color}50`,
                borderRadius: 6, color: cfg.color, fontFamily: "'Space Mono',monospace",
                fontSize: 10, letterSpacing: 3, cursor: 'pointer' }}>
              RETAKE →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CultureHistory() {
  return (
    <section id="culture-history" style={{ background: B.void, padding: '100px 0 60px', position: 'relative', overflow: 'hidden' }}>
      <Egg id="egg-029" corner="top-right" />
      <Egg id="egg-030" corner="bottom-left" />
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 400, background: `radial-gradient(ellipse, ${B.amber}08, transparent 70%)`,
        pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: 500, height: 500,
        background: B.neonMagenta + '06', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <p style={{ fontFamily: "'Space Mono',monospace", color: B.amber, fontSize: 10, letterSpacing: 6, marginBottom: 14 }}>
            THE ARCHIVE
          </p>
          <h2 className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 'clamp(48px,9vw,96px)', lineHeight: 0.88, letterSpacing: 3, marginBottom: 20 }}>
            THE CULTURE<br />
            <span style={{ color: B.amber }}>HAS A HISTORY</span>
          </h2>
          <p style={{ fontFamily: "'Syne',sans-serif", color: B.smoke, fontSize: 15,
            maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
            Where sneakers came from, what they mean, and why Lagos is next. Tap each era to open the chapter.
          </p>
        </div>

        {/* Timeline — stacked on mobile, alternating on desktop */}
        <div style={{ position: 'relative' }}>
          {ERAS.map((era, idx) => (
            <EraCard key={era.id} era={era} idx={idx} />
          ))}
        </div>

        {/* Find Your Stake quiz */}
        <StakeQuiz />

      </div>
    </section>
  )
}
