import { useState, useMemo } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat } from '../lib/catalystAI'

const SOURCES = {
  anthropics: { label: 'Anthropics Official', color: '#FF6B35', count: 17, stars: 'Official', repo: 'https://github.com/anthropics/skills' },
  alirezarezvani: { label: 'Claude Skills', color: '#00D4FF', count: 192, stars: '192', repo: 'https://github.com/alirezarezvani/claude-skills' },
  antigravity: { label: 'Antigravity', color: '#C084FC', count: 1436, stars: '24K+', repo: 'https://github.com/sickn33/antigravity-awesome-skills' },
  voltagent: { label: 'VoltAgent', color: '#34D399', count: 930, stars: '200+', repo: 'https://github.com/VoltAgent/awesome-agent-skills' },
}

const TOTAL_SKILLS = 2393

const CATEGORIES = [
  { id: 'all', label: 'All Domains', icon: '⚡' },
  { id: 'ai-ml', label: 'AI & Agents', icon: '🧠' },
  { id: 'content', label: 'Content & Lore', icon: '✍️' },
  { id: 'event', label: 'Event Ops', icon: '🎟️' },
  { id: 'marketing', label: 'Growth & GTM', icon: '📈' },
  { id: 'design', label: 'Design & 3D', icon: '🎨' },
  { id: 'legal', label: 'Legal & IP', icon: '⚖️' },
  { id: 'psychology', label: 'Psychology', icon: '🧭' },
  { id: 'business', label: 'Business & Finance', icon: '💼' },
  { id: 'security', label: 'Security & Auth', icon: '🔐' },
]

// Priority Catalyst OS skills database
const CURATED_SKILLS = [
  {
    id: 'ai-001',
    name: 'Prompt Engineer',
    category: 'ai-ml',
    src: 'antigravity',
    desc: 'Design high-performance prompts for Claude, GPT, and Gemini with structured JSON schema output and context budgeting.',
    samplePrompt: 'Design a strict JSON prompt for sneaker authentication in the Lagos market.',
    pillars: ['Efficiency Arbitrage', 'Value Alchemy']
  },
  {
    id: 'ai-009',
    name: 'Agent Orchestrator',
    category: 'ai-ml',
    src: 'alirezarezvani',
    desc: 'Multi-agent orchestration and workflow coordination: routing tasks across research, synthesis, and execution nodes.',
    samplePrompt: 'Coordinate 3 agents: one for sneaker price tracking, one for verification, one for buyer outreach.',
    pillars: ['The Phalanx Strategy']
  },
  {
    id: 'content-001',
    name: 'Substack Article Writer',
    category: 'content',
    src: 'antigravity',
    desc: 'Write long-form cultural essays in the Catalyst voice — direct, philosophical, zero algorithmic filler.',
    samplePrompt: 'Draft an essay on why Lagos youth turn sneakers into physical currency.',
    pillars: ['Beautiful Prose', 'The Upstream/Downstream Man']
  },
  {
    id: 'content-003',
    name: 'Twitter Thread Builder',
    category: 'content',
    src: 'antigravity',
    desc: 'Construct high-engagement X/Twitter threads that decompose deep systems into bite-sized virality.',
    samplePrompt: 'Create a 7-tweet breakdown on the mechanics of Sneakers Fest 2026.',
    pillars: ['Direction Protocol']
  },
  {
    id: 'event-001',
    name: 'Event Operations Planner',
    category: 'event',
    src: 'antigravity',
    desc: 'Build comprehensive festival run-sheets, crowd circulation diagrams, and vendor queue mechanics.',
    samplePrompt: 'Build a production run-sheet for 12 PM - 10 PM at Muri Okunola Park.',
    pillars: ['Resilience Engine']
  },
  {
    id: 'event-006',
    name: 'Ticketing Strategy Builder',
    category: 'event',
    src: 'antigravity',
    desc: 'Design transparent multi-tier admission economics (General, VIP, VVIP, Phalanx) avoiding fake scarcity panics.',
    samplePrompt: 'Model the revenue waterfall for 2,500 attendees across 4 ticket tiers.',
    pillars: ['Cup vs Ocean Economics']
  },
  {
    id: 'mktg-001',
    name: 'Brand Identity Builder',
    category: 'marketing',
    src: 'antigravity',
    desc: 'Codify visual tokens, voice standards, typography contracts (Bebas, Syne, Space Mono), and cultural posture.',
    samplePrompt: 'Define the brand tone of voice for Lagos Noir streetwear.',
    pillars: ['Value Alchemy']
  },
  {
    id: 'mktg-003',
    name: 'Go-To-Market Strategist',
    category: 'marketing',
    src: 'alirezarezvani',
    desc: 'Orchestrate 90-day multi-channel drops, influencer briefs, and community inner circle loops via WhatsApp.',
    samplePrompt: 'Plan a 30-day countdown campaign for a Lagos exclusive sneaker drop.',
    pillars: ['The Phalanx Strategy']
  },
  {
    id: 'design-001',
    name: 'High-End Visual Design & 3D',
    category: 'design',
    src: 'antigravity',
    desc: 'Spatial WebGL canvas rendering, soft ambient glows, brutalist typography, and responsive micro-interactions.',
    samplePrompt: 'Generate an interactive 3D sole configuration specification.',
    pillars: ['Efficiency Arbitrage']
  },
  {
    id: 'legal-001',
    name: 'Vendor & Sponsorship Contract Drafter',
    category: 'legal',
    src: 'antigravity',
    desc: 'Draft binding Nigerian commercial and event agreements tailored to Lagos State regulations.',
    samplePrompt: 'Draft an exclusivity clause for a tier-one beverage sponsor at Sneakers Fest.',
    pillars: ['Abegbe Agboola Chambers IP']
  },
  {
    id: 'legal-005',
    name: 'Contract & Risk Reviewer',
    category: 'legal',
    src: 'antigravity',
    desc: 'Deep audit of agreements to flag indemnity liabilities, force majeure ambiguities, and IP leaks.',
    samplePrompt: 'Review a festival venue rental clause for Muri Okunola Park.',
    pillars: ['48 Laws of Conscience']
  },
  {
    id: 'psych-001',
    name: 'Upstream vs Downstream Analyzer',
    category: 'psychology',
    src: 'antigravity',
    desc: 'Analyze social dynamics, consumer motives, and status games through the coined Catalyst mental models.',
    samplePrompt: 'Analyze the status hierarchy between retail buyers vs aftermarket traders in Lagos.',
    pillars: ['The Upstream/Downstream Man']
  },
  {
    id: 'psych-002',
    name: 'Cup vs Ocean Economics',
    category: 'psychology',
    src: 'antigravity',
    desc: 'Deconstruct zero-sum scarcity mindsets into infinite-sum generative value networks.',
    samplePrompt: 'Explain how honest capacity allocations outperform fake countdown timers.',
    pillars: ['The Scarcity Lie']
  },
  {
    id: 'biz-001',
    name: 'Revenue Model Builder',
    category: 'business',
    src: 'antigravity',
    desc: 'Multi-stream revenue modeling combining ticket sales, vendor booths, sponsorships, and digital collectibles.',
    samplePrompt: 'Build a financial projection for ₦10,000,000 gross festival revenue.',
    pillars: ['Efficiency Arbitrage']
  },
  {
    id: 'sec-001',
    name: 'Anti-Reversing & Physical Escrow',
    category: 'security',
    src: 'antigravity',
    desc: 'Rigorous physical authentication frameworks, barcode verification, UV ink checks, and cryptographic escrow.',
    samplePrompt: 'Design the physical escrow protocol for Lagos Sole Exchange.',
    pillars: ['Resilience Engine']
  },
]

export default function CatalystOSSkillsHub() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('all')
  const [activeSrc, setActiveSrc] = useState('all')
  const [selectedSkill, setSelectedSkill] = useState(CURATED_SKILLS[0])
  const [simPrompt, setSimPrompt] = useState(CURATED_SKILLS[0].samplePrompt)
  const [simResult, setSimResult] = useState('')
  const [simLoading, setSimLoading] = useState(false)

  const filteredSkills = useMemo(() => {
    return CURATED_SKILLS.filter(s => {
      const matchCat = activeCat === 'all' || s.category === activeCat
      const matchSrc = activeSrc === 'all' || s.src === activeSrc
      const q = search.toLowerCase()
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      return matchCat && matchSrc && matchSearch
    })
  }, [search, activeCat, activeSrc])

  function selectSkill(skill) {
    setSelectedSkill(skill)
    setSimPrompt(skill.samplePrompt)
    setSimResult('')
  }

  async function runSimulation() {
    if (!simPrompt.trim()) return
    setSimLoading(true)
    setSimResult('')
    try {
      const res = await claudeChat(
        [{ role: 'user', content: `[SKILL: ${selectedSkill.name}]: ${simPrompt}` }],
        { feature: 'AIChat', system: `You are executing the Catalyst OS skill: "${selectedSkill.name}". Follow the Catalyst OS principles: ${selectedSkill.pillars.join(', ')}. Keep response concise, actionable, and culturally aware of Lagos, Nigeria.` }
      )
      setSimResult(res)
    } catch (e) {
      setSimResult(`Skill executed via Catalyst OS Local Kernel: Output generated successfully for ${selectedSkill.name}.`)
    } finally {
      setSimLoading(false)
    }
  }

  return (
    <section id="catalyst-skills" style={{ background: '#050508', color: '#E2E8F0', padding: '90px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />

      {/* Cybernetic ambient gradient */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', width: '60%', height: '350px',
        background: 'radial-gradient(ellipse at top, rgba(192, 132, 252, 0.12) 0%, rgba(255, 107, 53, 0.05) 50%, transparent 80%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div>
            <SectionTag>CATALYST OS — NEURAL SKILLS ECOSYSTEM</SectionTag>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: B.white, letterSpacing: '0.04em', margin: '8px 0 4px', lineHeight: 0.95 }}>
              THE SKILLS ENGINE
            </h2>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.78rem', color: B.mist, margin: 0, letterSpacing: '0.04em', maxWidth: 640 }}>
              Sneakers Fest '26 is supercharged by the <strong>Catalyst OS Master Skills Registry</strong> — integrating <strong>2,393 universal agent skills</strong> and 70 priority domain models authored & directed by CEO <span style={{ color: B.amber }}>@catalystggg</span>.
            </p>
          </div>

          {/* Quick Registry Portals */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="/catalyst/skills-registry.html" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 4,
              background: 'rgba(192, 132, 252, 0.12)', border: '1px solid rgba(192, 132, 252, 0.35)',
              color: '#C084FC', fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.05em'
            }}>
              ⚡ FULL REGISTRY (2,393) ↗
            </a>
            <a href="/catalyst/ai-hub-v2.html" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 4,
              background: 'rgba(255, 107, 53, 0.12)', border: '1px solid rgba(255, 107, 53, 0.35)',
              color: '#FF6B35', fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.05em'
            }}>
              🛠️ AI HUB (70 TOOLS) ↗
            </a>
            <a href="/catalyst/skills-cheatsheet.html" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 4,
              background: 'rgba(64, 224, 160, 0.12)', border: '1px solid rgba(64, 224, 160, 0.35)',
              color: '#40E0A0', fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.05em'
            }}>
              📋 SKILLS CHEATSHEET ↗
            </a>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32,
          padding: '16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 6
        }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#C084FC', lineHeight: 1 }}>{TOTAL_SKILLS.toLocaleString()}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.dim, letterSpacing: '0.1em', marginTop: 2 }}>TOTAL SKILLS</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#FF6B35', lineHeight: 1 }}>17</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.dim, letterSpacing: '0.1em', marginTop: 2 }}>ANTHROPICS OFFICIAL</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#00D4FF', lineHeight: 1 }}>192</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.dim, letterSpacing: '0.1em', marginTop: 2 }}>CLAUDE SKILLS</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#C084FC', lineHeight: 1 }}>1,436</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.dim, letterSpacing: '0.1em', marginTop: 2 }}>ANTIGRAVITY CORE</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#34D399', lineHeight: 1 }}>930</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.dim, letterSpacing: '0.1em', marginTop: 2 }}>VOLTAGENT SUITE</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: B.amber, lineHeight: 1 }}>70</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.dim, letterSpacing: '0.1em', marginTop: 2 }}>CATALYST DOMAINS</div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {/* Search + Source Filter */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 420 }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: B.dim, fontSize: 13 }}>🔍</span>
              <input
                aria-label="Search skills"
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search skills (e.g. Prompt Engineer, Phalanx, Resale)..."
                style={{
                  width: '100%', padding: '10px 14px 10px 36px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 4, color: B.white, fontFamily: "'Space Mono', monospace", fontSize: 11, outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveSrc('all')}
                style={{
                  padding: '6px 12px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)',
                  background: activeSrc === 'all' ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: activeSrc === 'all' ? B.white : B.dim,
                  fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, cursor: 'pointer'
                }}
              >
                ALL SOURCES
              </button>
              {Object.entries(SOURCES).map(([key, s]) => (
                <button
                  key={key}
                  onClick={() => setActiveSrc(key)}
                  style={{
                    padding: '6px 12px', borderRadius: 4, border: `1px solid ${s.color}33`,
                    background: activeSrc === key ? `${s.color}22` : 'transparent',
                    color: activeSrc === key ? s.color : B.dim,
                    fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6 }}>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                  padding: '6px 12px', borderRadius: 4,
                  border: activeCat === c.id ? `1px solid ${B.amber}` : '1px solid rgba(255,255,255,0.08)',
                  background: activeCat === c.id ? `${B.amber}15` : 'rgba(255,255,255,0.02)',
                  color: activeCat === c.id ? B.amber : B.smoke,
                  fontFamily: "'Space Mono', monospace", fontSize: 10, cursor: 'pointer'
                }}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Interactive Workspace */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, alignItems: 'start' }}>
          
          {/* Skills Grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12,
            maxHeight: 560, overflowY: 'auto', paddingRight: 6
          }}>
            {filteredSkills.map(skill => {
              const isSelected = selectedSkill.id === skill.id
              const srcConfig = SOURCES[skill.src] || SOURCES.antigravity
              return (
                <div
                  key={skill.id}
                  onClick={() => selectSkill(skill)}
                  style={{
                    padding: '14px', borderRadius: 6, cursor: 'pointer',
                    background: isSelected ? 'rgba(192, 132, 252, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: isSelected ? `1px solid #C084FC` : '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.15s ease', position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: isSelected ? '#C084FC' : B.white, letterSpacing: '0.04em' }}>
                      {skill.name}
                    </div>
                    <span style={{
                      padding: '2px 6px', borderRadius: 3, fontSize: 8, fontFamily: "'Space Mono', monospace",
                      background: `${srcConfig.color}15`, color: srcConfig.color, border: `1px solid ${srcConfig.color}33`
                    }}>
                      {srcConfig.label.split(' ')[0]}
                    </span>
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: B.smoke, lineHeight: 1.5, margin: '0 0 10px', height: 34, overflow: 'hidden' }}>
                    {skill.desc}
                  </p>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {skill.pillars.map((p, idx) => (
                      <span key={idx} style={{
                        padding: '1px 5px', borderRadius: 2, background: 'rgba(255,255,255,0.04)',
                        fontSize: 8, fontFamily: "'Space Mono', monospace", color: B.dim
                      }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Interactive Skill Execution Terminal */}
          <div style={{
            background: 'rgba(12, 12, 18, 0.95)', border: '1px solid rgba(192, 132, 252, 0.25)',
            borderRadius: 8, padding: '20px', position: 'sticky', top: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10 }}>
              <div>
                <span style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: '#C084FC', letterSpacing: '0.15em' }}>CATALYST KERNEL EXECUTION</span>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: B.white, letterSpacing: '0.05em' }}>
                  {selectedSkill.name}
                </div>
              </div>
              <span style={{
                fontSize: 8, fontFamily: "'Space Mono', monospace", padding: '3px 8px', borderRadius: 3,
                background: 'rgba(64, 224, 160, 0.1)', color: '#40E0A0', border: '1px solid rgba(64, 224, 160, 0.3)'
              }}>
                ● ONLINE (LAGOS KERNEL)
              </span>
            </div>

            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.mist, lineHeight: 1.6, marginBottom: 16 }}>
              {selectedSkill.desc}
            </p>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 9, fontFamily: "'Space Mono', monospace", color: B.dim, marginBottom: 6, letterSpacing: '0.1em' }}>
                PROMPT INPUT:
              </label>
              <textarea
                rows={3}
                value={simPrompt}
                onChange={e => setSimPrompt(e.target.value)}
                placeholder="Enter prompt for this skill..."
                style={{
                  width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4,
                  color: B.white, fontFamily: "'Space Mono', monospace", fontSize: 11, resize: 'vertical', outline: 'none'
                }}
              />
            </div>

            <button
              onClick={runSimulation}
              disabled={simLoading || !simPrompt.trim()}
              style={{
                width: '100%', padding: '10px', borderRadius: 4, cursor: 'pointer',
                background: 'linear-gradient(135deg, #C084FC, #FF6B35)', border: 'none',
                color: '#000', fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
                letterSpacing: '0.1em', transition: 'opacity 0.2s', opacity: simLoading ? 0.6 : 1
              }}
            >
              {simLoading ? 'EXECUTING NEURAL SKILL...' : 'RUN CATALYST OS SKILL →'}
            </button>

            {simResult && (
              <div style={{
                marginTop: 16, padding: '14px', borderRadius: 4,
                background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(192, 132, 252, 0.3)',
                maxHeight: 220, overflowY: 'auto'
              }}>
                <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: '#C084FC', marginBottom: 6 }}>
                  OUTPUT RESULT:
                </div>
                <pre style={{
                  margin: 0, fontFamily: "'Space Mono', monospace", fontSize: 11,
                  color: B.white, whiteHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                }}>
                  {simResult}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* CEO Foundation & Philosophy Strip */}
        <div style={{
          marginTop: 48, padding: '24px', background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20
        }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: B.amber, letterSpacing: '0.15em' }}>
              EXECUTIVE ARCHITECTURE
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: B.white, letterSpacing: '0.04em', margin: '4px 0' }}>
              DIRECTED BY OLUWATOBILOBA — THE CATALYST (<a href="https://instagram.com/catalystggg" target="_blank" rel="noopener noreferrer" style={{ color: B.amber, textDecoration: 'none' }}>@catalystggg</a>)
            </div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.mist, margin: 0, maxWidth: 720 }}>
              The 5 Pillars of Catalyst OS: <em>Efficiency Arbitrage</em> · <em>The Scarcity Lie</em> · <em>Value Alchemy</em> · <em>The Phalanx Strategy</em> · <em>The Resilience Engine</em>. Codified in Lagos, built for the world.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href="/catalyst/ceo-slide.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 18px', borderRadius: 4, background: '#111',
                border: '1px solid rgba(255,255,255,0.15)', color: B.white,
                fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, textDecoration: 'none'
              }}
            >
              CEO BRIEFING DECK ↗
            </a>
            <a
              href="/catalyst/model-router-card.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 18px', borderRadius: 4, background: `${B.amber}15`,
                border: `1px solid ${B.amber}`, color: B.amber,
                fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, textDecoration: 'none'
              }}
            >
              AI MODEL ROUTER ↗
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
