import { useState, useMemo } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { SNEAKERS, TIER_COLORS, BRAND_COLORS, lagosStory, marketData } from '../data/sneakers'
import Egg from '../components/Egg'

const TIERS = ['All', 'GRAIL', 'ELITE', 'HEAT', 'SOLID']
const BRANDS = ['All','Jordan','Nike','Adidas','New Balance','Luxury','Converse','Vans','Reebok','Asics','Puma','Salomon','Hoka','On Running','Saucony']

export default function SneakerBible() {
  const [tab, setTab] = useState('story')
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState('All')
  const [tier, setTier] = useState('All')
  const [sort, setSort] = useState('id')
  const [expanded, setExpanded] = useState(null)
  const [rarity, setRarity] = useState(0)

  const filtered = useMemo(() => {
    let d = [...SNEAKERS]
    if (search) d = d.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.colorway.toLowerCase().includes(search.toLowerCase()))
    if (brand !== 'All') d = d.filter(s => s.brand === brand || s.cat === brand)
    if (tier !== 'All') d = d.filter(s => s.tier === tier)
    if (rarity > 0) d = d.filter(s => s.rarity >= rarity)
    if (sort === 'priceAsc') d.sort((a, b) => a.rsLow - b.rsLow)
    if (sort === 'priceDesc') d.sort((a, b) => b.rsLow - a.rsLow)
    if (sort === 'retail') d.sort((a, b) => b.retail - a.retail)
    if (sort === 'rarity') d.sort((a, b) => b.rarity - a.rarity)
    if (sort === 'year') d.sort((a, b) => b.year - a.year)
    if (sort === 'id') d.sort((a, b) => a.id - b.id)
    return d
  }, [search, brand, tier, rarity, sort])

  const mono = "'Space Mono', 'Courier New', monospace"
  const s = {
    root: { fontFamily: mono, background: B.void, color: B.white, minHeight: '100vh' },
    hdr: { background: B.charcoal, borderBottom: `1px solid ${B.gunmetal}`, padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
    logo: { fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', color: B.amber, textTransform: 'uppercase', fontFamily: mono },
    hed: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 0.88, textTransform: 'uppercase', letterSpacing: '-0.01em' },
    sub: { fontFamily: mono, color: B.smoke, fontSize: 11, letterSpacing: '0.2em' },
    tabBar: { display: 'flex', gap: 0, borderBottom: `1px solid ${B.gunmetal}`, background: B.charcoal, overflowX: 'auto' },
    tab: (a) => ({ padding: '14px 22px', background: 'none', border: 'none', color: a ? B.amber : B.smoke, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', cursor: 'pointer', textTransform: 'uppercase', borderBottom: a ? `2px solid ${B.amber}` : '2px solid transparent', fontFamily: mono, whiteSpace: 'nowrap' }),
    page: { padding: '32px', maxWidth: 1400, margin: '0 auto' },
    storySection: { borderLeft: `3px solid ${B.amber}`, paddingLeft: 24, marginBottom: 36 },
    storyTitle: { fontSize: 12, fontWeight: 700, color: B.amber, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10, fontFamily: mono },
    storyBody: { fontFamily: "'Syne', sans-serif", fontSize: 15, lineHeight: 1.75, color: '#ccc', maxWidth: 760 },
    statRow: { display: 'flex', gap: 20, marginBottom: 32, flexWrap: 'wrap' },
    stat: { flex: '1 1 140px', background: B.charcoal, border: `1px solid ${B.gunmetal}`, padding: '16px 20px' },
    statVal: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: B.amber, lineHeight: 1 },
    statLbl: { fontFamily: mono, fontSize: 9, color: B.smoke, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4 },
    note: { background: B.amber + '12', border: `1px solid ${B.amber}35`, padding: '12px 16px', fontSize: 11, color: B.amber, letterSpacing: '0.05em', marginBottom: 24, lineHeight: 1.6, fontFamily: mono },
    filters: { display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' },
    searchBox: { background: B.charcoal, border: `1px solid ${B.gunmetal}`, color: B.white, padding: '10px 16px', fontSize: 12, fontFamily: mono, flex: '1 1 200px', outline: 'none', letterSpacing: '0.05em' },
    sel: { background: B.charcoal, border: `1px solid ${B.gunmetal}`, color: B.smoke, padding: '10px 12px', fontSize: 10, fontFamily: mono, letterSpacing: '0.1em', cursor: 'pointer' },
    count: { color: B.dim, fontSize: 10, letterSpacing: '0.15em', fontFamily: mono },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
    card: (t) => ({ background: '#0f0f0f', border: `1px solid ${B.gunmetal}`, borderTop: `3px solid ${TIER_COLORS[t] || '#333'}`, overflow: 'hidden' }),
    cardHd: (br) => ({ background: `${BRAND_COLORS[br] || B.charcoal}15`, borderBottom: `1px solid ${B.gunmetal}`, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }),
    tierBadge: (t) => ({ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: TIER_COLORS[t], background: `${TIER_COLORS[t]}18`, padding: '3px 8px', border: `1px solid ${TIER_COLORS[t]}45`, fontFamily: mono }),
    brandLbl: { fontSize: 10, color: B.smoke, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: mono },
    cardBd: { padding: 16 },
    snkrName: { fontSize: 13, fontWeight: 700, color: B.white, lineHeight: 1.3, marginBottom: 4 },
    clrwy: { fontSize: 10, color: B.smoke, letterSpacing: '0.1em', marginBottom: 14, fontFamily: mono },
    priceRow: { display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' },
    priceBox: { flex: 1, background: B.charcoal, padding: '8px 10px', minWidth: 80 },
    priceLbl: { fontSize: 9, color: B.dim, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2, fontFamily: mono },
    priceVal: { fontSize: 13, fontWeight: 700, color: B.white },
    nairaBox: { background: B.amber + '12', border: `1px solid ${B.amber}35`, padding: '6px 10px', fontSize: 11, color: B.amber, letterSpacing: '0.05em', marginBottom: 12, fontFamily: mono },
    stars: { color: B.amber, fontSize: 12, marginBottom: 10 },
    expandBtn: { fontSize: 9, color: B.smoke, letterSpacing: '0.15em', background: 'none', border: `1px solid ${B.gunmetal}`, padding: '6px 12px', cursor: 'pointer', fontFamily: mono, width: '100%', textAlign: 'center', marginTop: 8 },
    expandContent: { padding: '0 16px 16px', borderTop: `1px solid ${B.gunmetal}` },
    noteText: { fontSize: 12, color: '#999', lineHeight: 1.6, paddingTop: 14, marginBottom: 12, fontFamily: "'Syne', sans-serif" },
    stockxLink: { display: 'block', fontSize: 10, color: B.amber, letterSpacing: '0.15em', textDecoration: 'none', border: `1px solid ${B.amber}45`, padding: '8px 12px', textAlign: 'center', marginTop: 8, fontFamily: mono },
    mktGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 },
    mktCard: { background: '#0f0f0f', border: `1px solid ${B.gunmetal}`, padding: 20 },
    mktLbl: { fontSize: 10, color: B.amber, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8, fontFamily: mono },
    mktVal: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: B.white, marginBottom: 8 },
    mktNote: { fontSize: 11, color: B.smoke, lineHeight: 1.5, fontFamily: mono },
    secTitle: { fontFamily: mono, fontSize: 10, letterSpacing: '0.3em', color: B.smoke, textTransform: 'uppercase', marginBottom: 24, paddingBottom: 12, borderBottom: `1px solid ${B.gunmetal}` },
    exBlock: { background: '#0f0f0f', border: `1px solid ${B.gunmetal}`, padding: 24, marginBottom: 20 },
    exTitle: { fontFamily: mono, fontSize: 10, color: B.amber, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16 },
    exBody: { fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#ccc', lineHeight: 1.75 },
    list: { paddingLeft: 0, listStyle: 'none' },
    listItem: { borderLeft: `2px solid ${B.gunmetal}`, paddingLeft: 14, marginBottom: 10, fontSize: 13, color: '#aaa', lineHeight: 1.5, fontFamily: "'Syne', sans-serif" },
  }

  const TABS = [['story', 'THE LAGOS STORY'], ['vault', 'THE VAULT 200'], ['market', 'MARKET INTEL'], ['exhibition', 'EXHIBITION GUIDE']]
  const TIER_STRATEGY = [
    { t: 'GRAIL', c: B.amber, desc: 'Pairs with resell above $2,000 USD. Exhibition assets, not retail stock. They hold and appreciate value over time.', action: 'Acquire for exhibition display and auction events. Do NOT stock for regular sale.' },
    { t: 'ELITE', c: B.amberGlow, desc: 'Resell $500-$2,000. The sweet spot of serious collecting. Off-White collabs, Travis Scott drops, Fragment Jordan 1s. These move on Lagos Instagram within 24 hours of listing.', action: 'Stock limited quantities (2-5 pairs). Consignment model works well here.' },
    { t: 'HEAT', c: '#FFD700', desc: 'Resell $200-$500. The volume market. Air Jordan retros, Nike Dunks, Yeezys. Where the real Lagos sneaker economy lives. These sell to students, professionals, and first-time collectors.', action: 'Highest volume potential. 10-20 pairs per key colorway. This is where Sneakers Fest moves units.' },
    { t: 'SOLID', c: B.smoke, desc: 'At or near retail pricing. Air Force 1 White, Samba OG, Converse, NB 574. The foundation market. Every Lagos resident has worn one of these. Entry-level culture.', action: 'Display culture + entry market. Use for walk-in purchases and gifting packages.' },
  ]

  return (
    <section id="vault-200" style={{ ...s.root, position: 'relative', overflow: 'hidden' }}>
      <Egg id="egg-033" corner="top-right" />
      <Egg id="egg-034" corner="bottom-left" />
      <div style={s.hdr}>
        <div>
          <div style={s.logo}>Sneakers Fest 2026 -- Lagos</div>
          <div style={{ ...s.hed, marginTop: 4, color: B.white }}>THE VAULT 200</div>
          <div style={{ ...s.sub, marginTop: 6 }}>Exhibition Bible · Market Intelligence · Cultural Archive</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: B.dim, letterSpacing: '0.15em' }}>DEC 12 2026</div>
          <div style={{ fontFamily: mono, fontSize: 10, color: B.dim, letterSpacing: '0.15em' }}>MURI OKUNOLA PARK, V/I</div>
          <div style={{ fontFamily: mono, fontSize: 10, color: B.amber, letterSpacing: '0.15em', marginTop: 4 }}>200 SILHOUETTES</div>
        </div>
      </div>

      <div style={s.tabBar}>
        {TABS.map(([key, label]) => (
          <button key={key} style={s.tab(tab === key)} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      <div style={s.page}>

        {tab === 'story' && (
          <div>
            <div style={{ marginBottom: 40 }}>
              <div className="reveal-3d text-3d" style={{ ...s.hed, fontSize: 'clamp(36px, 7vw, 72px)', color: B.amber, marginBottom: 4 }}>LAGOS KICKS</div>
              <div className="reveal-3d text-3d" style={{ ...s.hed, fontSize: 'clamp(36px, 7vw, 72px)', color: B.white, marginBottom: 20 }}>A CULTURAL ARCHIVE</div>
              <div style={{ ...s.storyBody, maxWidth: 700 }}>The complete oral history of sneaker culture in Nigeria -- from the okrika markets of Yaba to the WhatsApp groups that moved Jordan 4s at 2AM. This is the story Sneakers Fest 2026 exists to tell.</div>
            </div>
            <div style={s.statRow}>
              {[['40+','Years of Lagos Sneaker History'],['200M+','Nigerians Connected to This Culture'],['1985','Year the Jordan 1 Changed Everything'],['2026','Year Lagos Plants Its Flag']].map(([v, l]) => (
                <div key={v} className="card-3d" style={s.stat}><div style={s.statVal}>{v}</div><div style={s.statLbl}>{l}</div></div>
              ))}
            </div>
            {lagosStory.map((sec, i) => (
              <div key={i} style={s.storySection}>
                <div style={s.storyTitle}>{String(i + 1).padStart(2, '0')} -- {sec.title}</div>
                <div style={s.storyBody}>{sec.body}</div>
              </div>
            ))}
            <div style={{ background: B.amber + '12', border: `1px solid ${B.amber}35`, padding: 24, marginTop: 32 }}>
              <div style={{ fontFamily: mono, fontSize: 10, color: B.amber, letterSpacing: '0.2em', marginBottom: 12 }}>EXHIBITION NARRATIVE NOTE</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#ccc', lineHeight: 1.75 }}>This narrative should be printed across exhibition panels in Lagos Noir typography. Each section becomes a physical station in the exhibition floor. The goal: every Lagos attendee sees their personal story reflected somewhere in the exhibition. Not education -- recognition. <em style={{ color: B.amber }}>We see you.</em></div>
            </div>
          </div>
        )}

        {tab === 'vault' && (
          <div>
            <div style={s.note}>
              PRICE DISCLAIMER: All retail and resell prices are approximate figures as of mid-2025. Resell prices change DAILY on StockX and GOAT. NGN estimates use ~1600/USD baseline -- verify current exchange rate before any commercial decision.
            </div>
            <div className="reveal-3d text-3d" style={{ ...s.hed, fontSize: 36, color: B.amber, marginBottom: 24 }}>THE 200</div>
            <div style={s.filters}>
              <input aria-label="Search by name or colourway" style={s.searchBox} placeholder="SEARCH BY NAME OR COLORWAY..." value={search} onChange={e => setSearch(e.target.value)} />
              <select aria-label="Filter by brand" style={s.sel} value={brand} onChange={e => setBrand(e.target.value)}>{BRANDS.map(b => <option key={b}>{b}</option>)}</select>
              <select aria-label="Filter by tier" style={s.sel} value={tier} onChange={e => setTier(e.target.value)}>{TIERS.map(t => <option key={t}>{t}</option>)}</select>
              <select aria-label="Sort order" style={s.sel} value={sort} onChange={e => setSort(e.target.value)}>
                <option value="id">ORDER: DEFAULT</option>
                <option value="rarity">ORDER: RARITY</option>
                <option value="priceDesc">ORDER: RESELL HIGH</option>
                <option value="priceAsc">ORDER: RESELL LOW</option>
                <option value="retail">ORDER: RETAIL</option>
                <option value="year">ORDER: YEAR</option>
              </select>
              <select aria-label="Filter by rarity" style={s.sel} value={rarity} onChange={e => setRarity(Number(e.target.value))}>
                <option value={0}>RARITY: ALL</option>
                <option value={3}>RARITY: 3+ STARS</option>
                <option value={4}>RARITY: 4+ STARS</option>
                <option value={5}>RARITY: 5 STARS</option>
              </select>
            </div>
            <div style={{ ...s.count, marginBottom: 20 }}>SHOWING {filtered.length} OF 200 SILHOUETTES</div>
            <div style={s.grid}>
              {filtered.map(sn => (
                <div key={sn.id} style={s.card(sn.tier)}>
                  <div style={s.cardHd(sn.brand)}>
                    <div>
                      <div style={s.brandLbl}>{sn.brand}</div>
                      <div style={{ fontFamily: mono, fontSize: 9, color: B.dim, letterSpacing: '0.1em' }}>#{String(sn.id).padStart(3,'0')} · {sn.year}{sn.retro ? ` (Retro ${sn.retro})` : ''}</div>
                    </div>
                    <div style={s.tierBadge(sn.tier)}>{sn.tier}</div>
                  </div>
                  <div style={s.cardBd}>
                    <div style={s.snkrName}>{sn.name}</div>
                    <div style={s.clrwy}>{sn.colorway}</div>
                    <div style={s.priceRow}>
                      <div style={s.priceBox}><div style={s.priceLbl}>Retail USD</div><div style={s.priceVal}>${sn.retail.toLocaleString()}</div></div>
                      <div style={s.priceBox}><div style={s.priceLbl}>Resell Range</div><div style={s.priceVal}>${sn.rsLow.toLocaleString()}--${sn.rsHigh.toLocaleString()}</div></div>
                    </div>
                    <div style={s.nairaBox}>Lagos Est: {sn.naira}</div>
                    <div style={s.stars}>{'★'.repeat(sn.rarity)}{'☆'.repeat(5 - sn.rarity)} <span style={{ fontFamily: mono, fontSize: 9, color: B.dim, letterSpacing: '0.1em' }}>RARITY</span></div>
                    <button style={s.expandBtn} onClick={() => setExpanded(expanded === sn.id ? null : sn.id)}>
                      {expanded === sn.id ? '▲ CLOSE' : '▼ CULTURAL NOTE + IMAGE SOURCE'}
                    </button>
                    {expanded === sn.id && (
                      <div style={s.expandContent}>
                        <div style={s.noteText}>{sn.note}</div>
                        <div style={{ fontFamily: mono, fontSize: 10, color: B.smoke, letterSpacing: '0.1em', marginBottom: 8 }}>FIND IMAGE WITH THIS SEARCH:</div>
                        <div style={{ background: B.charcoal, padding: '8px 12px', fontSize: 11, color: B.amber, letterSpacing: '0.05em', fontFamily: mono }}>{sn.stockx}</div>
                        <a href={`https://stockx.com/search?s=${encodeURIComponent(sn.stockx)}`} target="_blank" rel="noopener noreferrer" style={s.stockxLink}>→ VERIFY PRICE ON STOCKX</a>
                        <a href={`https://www.goat.com/sneakers/?query=${encodeURIComponent(sn.stockx)}`} target="_blank" rel="noopener noreferrer" style={{ ...s.stockxLink, color: B.smoke, borderColor: B.gunmetal }}>→ VERIFY ON GOAT</a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'market' && (
          <div>
            <div className="reveal-3d text-3d" style={{ ...s.hed, fontSize: 48, color: B.amber, marginBottom: 4 }}>MARKET</div>
            <div className="reveal-3d text-3d" style={{ ...s.hed, fontSize: 48, marginBottom: 32, color: B.white }}>INTELLIGENCE</div>
            <div style={s.note}>All data is approximate and based on available information as of mid-2025. The Lagos resell market is informal and largely untracked. All NGN figures depend on the current USD/NGN rate which is highly volatile. Verify every number before commercial decisions.</div>
            <div style={s.secTitle}>KEY MARKET METRICS</div>
            <div style={s.mktGrid}>
              {marketData.map((m, i) => (
                <div key={i} style={s.mktCard}>
                  <div style={s.mktLbl}>{m.label}</div>
                  <div style={s.mktVal}>{m.value}</div>
                  <div style={s.mktNote}>{m.note}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 48 }}>
              <div style={s.secTitle}>RESELL TIER INTELLIGENCE</div>
              {TIER_STRATEGY.map(item => (
                <div key={item.t} className="card-3d" style={{ background: '#0f0f0f', border: `1px solid ${item.c}30`, borderLeft: `4px solid ${item.c}`, padding: 20, marginBottom: 16 }}>
                  <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: item.c, letterSpacing: '0.2em', marginBottom: 8 }}>{item.t} TIER STRATEGY</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#ccc', lineHeight: 1.6, marginBottom: 10 }}>{item.desc}</div>
                  <div style={{ fontFamily: mono, fontSize: 11, color: '#888', borderTop: `1px solid ${B.gunmetal}`, paddingTop: 10 }}>ACTION: {item.action}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'exhibition' && (
          <div>
            <div className="reveal-3d text-3d" style={{ ...s.hed, fontSize: 48, color: B.amber, marginBottom: 4 }}>EXHIBITION</div>
            <div className="reveal-3d text-3d" style={{ ...s.hed, fontSize: 48, marginBottom: 32, color: B.white }}>GUIDE</div>
            <div style={s.statRow}>
              {[['Dec 12','Event Date 2026'],['Muri Okunola','Park, V/I Lagos'],['200','Silhouettes in The Vault'],['4','Exhibition Tiers']].map(([v, l]) => (
                <div key={v} className="card-3d" style={s.stat}><div style={s.statVal}>{v}</div><div style={s.statLbl}>{l}</div></div>
              ))}
            </div>
            {[
              { title: 'FLOOR LAYOUT -- FOUR ZONES', items: ['Zone 1 -- THE ARCHIVE: Lagos sneaker history from 1980s okrika to 2024. Wall panels, editorial photography, and cultural artefacts.','Zone 2 -- THE VAULT: Physical display of 50+ authenticated pairs across all four tiers. Museum-quality presentation with glass cases, lighting, and QR codes linking to this database.','Zone 3 -- THE MARKET: Live buy/sell/consignment floor. Vendors, traders, authenticated pairs available for purchase. Authentication station on-site.','Zone 4 -- THE STAGE: Panels, conversations, brand activations, and the Sneakers Fest cultural programming. DJ set, brand presentations, influencer walkthrough.'] },
              { title: 'CURATION STRATEGY -- WHAT TO DISPLAY', items: ['GRAIL TIER (5 pairs): Jordan 1 Chicago, Jordan 1 x Off-White, Air Yeezy 2 Red October, Nike SB Dunk Paris, Air Force 1 x Louis Vuitton.','ELITE TIER (10 pairs): Travis Scott Jordan 1 Low, Jordan 4 Lightning, Chunky Dunky, Kobe 6 Grinch, Fragment Jordan 1.','HEAT TIER (20 pairs): Rotate across brands -- Jordan retros, Yeezy 350 V2 colorways, Nike Sacai, Adidas Samba Wales Bonner, NB Joe Freshgoods.','SOLID TIER: Open market floor -- AF1 White, Panda Dunk, Converse Chuck, Samba OG, Stan Smith, NB 574. These are for purchase, not display.','NIGERIAN STORY CASE: 5 pairs that connect directly to Nigerian cultural moments -- shoes worn by Afrobeats artists, pairs linked to Super Eagles, Lagos fashion week moments.'] },
              { title: 'COMMERCIAL STRATEGY -- HOW TO MAKE MONEY', items: ['CONSIGNMENT MODEL: Lagos collectors bring authenticated pairs. Sneakers Fest takes 15-20% commission on sales. Low risk, high volume potential.','VENDOR BOOTHS: Charge 150K--500K per booth slot for resellers, brands, and boutiques. 30 booth cap.','GRAIL AUCTION: Live auction for 5-10 GRAIL tier pairs during peak hours. Start bids at 80% of current resell price. High energy, high margin.','TICKET REVENUE: General 5K. Collector (early access + zone 2 priority) 25K. VIP (all zones + auction access + brand gifts) 100K.','BRAND ACTIVATIONS: Brands pay for activation space. 2M--10M per brand depending on tier.'] },
            ].map((block, i) => (
              <div key={i} className="card-3d" style={s.exBlock}>
                <div style={s.exTitle}>{block.title}</div>
                <ul style={s.list}>{block.items.map((item, j) => <li key={j} style={s.listItem}>{item}</li>)}</ul>
              </div>
            ))}
            <div className="card-3d" style={{ ...s.exBlock, background: B.amber + '0A', borderColor: B.amber + '40' }}>
              <div style={s.exTitle}>SNEAKERS FEST 2026 -- THE CULTURAL DECLARATION</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#ccc', lineHeight: 1.8 }}>
                This is bigger than a market. It is bigger than a convention. Sneakers Fest 2026 is Lagos saying -- in 200 pairs of shoes, in one room, on one day -- that we were here. That we built this culture too, in our own way, with our own economics and our own stories. The world built sneaker culture. Lagos built its own chapter inside it. December 12 is the day we open that chapter for the world to read.
              </div>
              <div style={{ fontFamily: mono, fontSize: 11, color: B.amber, fontWeight: 700, marginTop: 16, letterSpacing: '0.1em' }}>The Catalyst. Lagos. 2026.</div>
            </div>
          </div>
        )}

        <div style={{ borderTop: `1px solid ${B.gunmetal}`, marginTop: 64, paddingTop: 24, fontFamily: mono, fontSize: 10, color: B.dim, letterSpacing: '0.15em', lineHeight: 1.8 }}>
          SNEAKERS FEST 2026 EXHIBITION BIBLE · THE CATALYST · CATALYST CONCEPTS LAGOS · ALL PRICES APPROXIMATE AS OF MID-2025 · VERIFY ALL FIGURES BEFORE COMMERCIAL USE · NGN ESTIMATES BASED ON ~1,600/USD -- RATE IS VOLATILE
        </div>
      </div>
    </section>
  )
}
