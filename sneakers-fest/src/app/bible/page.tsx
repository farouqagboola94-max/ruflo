'use client'

import { useState } from 'react'
import {
  BIBLE_SNEAKERS, BIBLE_BRANDS, BIBLE_TIERS, TIER_COLORS,
  LAGOS_STORY, MARKET_DATA, type BibleSneaker
} from '../../data/bible'

const s: Record<string, any> = {
  page:       { background: '#090909', minHeight: '100vh', color: '#e5e5e5', fontFamily: 'monospace' },
  hero:       { borderBottom: '1px solid #1a1a1a', padding: '4rem 1.5rem 2rem', textAlign: 'center' as const },
  title:      { fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 900, letterSpacing: '0.05em', lineHeight: 1, margin: '0 0 0.5rem', fontFamily: 'inherit' },
  orange:     { color: '#FF6B00' },
  sub:        { color: '#555', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' as const },
  tabs:       { display: 'flex', borderBottom: '1px solid #1a1a1a', overflowX: 'auto' as const, background: '#0d0d0d' },
  tab:        { padding: '0.9rem 1.5rem', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, cursor: 'pointer', border: 'none', background: 'transparent', transition: 'all 0.2s', whiteSpace: 'nowrap' as const },
  body:       { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.25rem' },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
  card:       { background: '#111', border: '1px solid #1f1f1f', borderRadius: '8px', padding: '1rem', cursor: 'pointer', transition: 'border-color 0.2s' },
  cardHd:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' },
  name:       { fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3, marginBottom: '0.2rem' },
  meta:       { fontSize: '0.72rem', color: '#555' },
  price:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #1f1f1f' },
  naira:      { fontSize: '0.88rem', fontWeight: 700, color: '#FF6B00' },
  range:      { fontSize: '0.7rem', color: '#555' },
  expBody:    { marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #1f1f1f', fontSize: '0.78rem', color: '#888', lineHeight: 1.6 },
  filterRow:  { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const, marginBottom: '1.25rem' },
  pill:       { fontSize: '0.68rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '999px', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.15s', letterSpacing: '0.1em', textTransform: 'uppercase' as const },
  storyCard:  { background: '#111', border: '1px solid #1f1f1f', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' },
  storyTitle: { color: '#FF6B00', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '0.75rem' },
  storyBody:  { color: '#999', fontSize: '0.88rem', lineHeight: 1.8 },
  mktRow:     { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '1rem 0', borderBottom: '1px solid #141414' },
  mktLbl:     { fontSize: '0.82rem', color: '#888' },
  mktVal:     { fontSize: '1.1rem', fontWeight: 800, color: '#FF6B00' },
  mktNote:    { fontSize: '0.7rem', color: '#555', marginTop: '0.2rem' },
  guide:      { background: '#111', border: '1px solid #1f1f1f', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' },
}

const TABS = ['Lagos Story', 'Vault 200', 'Market Intel', 'Exhibition Guide']

export default function BiblePage() {
  const [tab, setTab] = useState(0)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [tierFilter, setTierFilter] = useState('ALL')
  const [brandFilter, setBrandFilter] = useState('ALL')

  const filtered = BIBLE_SNEAKERS.filter((sn: BibleSneaker) =>
    (tierFilter === 'ALL' || sn.tier === tierFilter) &&
    (brandFilter === 'ALL' || sn.brand === brandFilter)
  )

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={{ ...s.sub, marginBottom: '1rem' }}>Sneakers Fest 2026</div>
        <h1 style={s.title}>
          <span style={s.orange}>SNEAKERS</span> BIBLE
        </h1>
        <p style={{ ...s.sub, marginTop: '0.75rem' }}>200 Kicks &middot; Lagos Edition &middot; The Vault Awaits</p>
      </div>

      <div style={s.tabs}>
        {TABS.map((label, i) => (
          <button
            key={label}
            onClick={() => setTab(i)}
            style={{
              ...s.tab,
              color: tab === i ? '#FF6B00' : '#444',
              borderBottom: tab === i ? '2px solid #FF6B00' : '2px solid transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={s.body}>

        {/* Tab 0: Lagos Story */}
        {tab === 0 && (
          <div>
            <p style={{ ...s.sub, marginBottom: '2rem' }}>How Lagos built a sneaker culture &mdash; and what it means</p>
            {LAGOS_STORY.map((section, i) => (
              <div key={i} style={s.storyCard}>
                <div style={s.storyTitle}>{section.title}</div>
                <div style={s.storyBody}>{section.body}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 1: Vault 200 */}
        {tab === 1 && (
          <div>
            <div style={s.filterRow}>
              <button
                onClick={() => setTierFilter('ALL')}
                style={{ ...s.pill, background: tierFilter === 'ALL' ? '#FF6B00' : '#111', color: tierFilter === 'ALL' ? '#000' : '#555', borderColor: tierFilter === 'ALL' ? '#FF6B00' : '#222' }}
              >All Tiers</button>
              {BIBLE_TIERS.map(tier => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  style={{
                    ...s.pill,
                    background: tierFilter === tier ? TIER_COLORS[tier] : '#111',
                    color: tierFilter === tier ? '#000' : '#555',
                    borderColor: tierFilter === tier ? TIER_COLORS[tier] : '#222',
                  }}
                >{tier}</button>
              ))}
            </div>
            <div style={s.filterRow}>
              <button
                onClick={() => setBrandFilter('ALL')}
                style={{ ...s.pill, background: brandFilter === 'ALL' ? '#222' : '#111', color: brandFilter === 'ALL' ? '#fff' : '#555', borderColor: brandFilter === 'ALL' ? '#444' : '#222' }}
              >All Brands</button>
              {BIBLE_BRANDS.slice(0, 8).map(brand => (
                <button
                  key={brand}
                  onClick={() => setBrandFilter(brand)}
                  style={{ ...s.pill, background: brandFilter === brand ? '#222' : '#111', color: brandFilter === brand ? '#fff' : '#555', borderColor: brandFilter === brand ? '#444' : '#222' }}
                >{brand}</button>
              ))}
            </div>
            <p style={{ ...s.meta, marginBottom: '1.25rem' }}>{filtered.length} sneakers</p>
            <div style={s.grid}>
              {filtered.map((sn: BibleSneaker) => (
                <div
                  key={sn.id}
                  style={{ ...s.card, borderColor: expanded === sn.id ? TIER_COLORS[sn.tier] : '#1f1f1f' }}
                  onClick={() => setExpanded(expanded === sn.id ? null : sn.id)}
                >
                  <div style={s.cardHd}>
                    <div style={{ flex: 1, marginRight: '0.5rem' }}>
                      <div style={s.name}>{sn.name}</div>
                      <div style={s.meta}>{sn.brand} &middot; {sn.year}</div>
                    </div>
                    <span style={{
                      fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.12em', padding: '0.2rem 0.5rem',
                      borderRadius: '3px', textTransform: 'uppercase' as const,
                      background: TIER_COLORS[sn.tier] + '22', color: TIER_COLORS[sn.tier],
                      border: `1px solid ${TIER_COLORS[sn.tier]}44`,
                    }}>
                      {sn.tier}
                    </span>
                  </div>
                  <div style={{ ...s.meta, marginBottom: '0.25rem' }}>{sn.colorway} &middot; {sn.cat}</div>
                  <div style={s.price}>
                    <span style={s.naira}>{sn.naira}</span>
                    <span style={s.range}>${sn.rsLow}&ndash;${sn.rsHigh}</span>
                  </div>
                  {expanded === sn.id && (
                    <div style={s.expBody}>
                      <div style={{ marginBottom: '0.4rem' }}>{sn.note}</div>
                      <div style={{ color: '#444', fontSize: '0.7rem' }}>
                        Retail: ${sn.retail} &middot; Rarity: {sn.rarity}/10 &middot; StockX: {sn.stockx}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Market Intel */}
        {tab === 2 && (
          <div>
            <p style={{ ...s.sub, marginBottom: '2rem' }}>What the market is saying right now</p>
            <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '8px', padding: '0 1.5rem', marginBottom: '2rem' }}>
              {MARKET_DATA.map((item, i) => (
                <div key={i} style={s.mktRow}>
                  <div>
                    <div style={s.mktLbl}>{item.label}</div>
                    <div style={s.mktNote}>{item.note}</div>
                  </div>
                  <div style={s.mktVal}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ ...s.storyCard, borderColor: '#FF6B0020' }}>
              <div style={s.storyTitle}>The Lagos Premium</div>
              <div style={s.storyBody}>
                Lagos buyers pay 15&ndash;40% above StockX prices due to import logistics, naira volatility, and limited local supply. Grails can trade at 2&ndash;3&times; retail. Understanding this premium is the difference between getting played and playing the market.
              </div>
            </div>
            <div style={s.storyCard}>
              <div style={s.storyTitle}>Naira Rate Watch</div>
              <div style={s.storyBody}>
                All naira prices in this bible are calculated at &#8358;1,650/$1. The real rate moves daily. Factor in a 5&ndash;10% buffer on any purchase. The price on the tag is never the final price.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Exhibition Guide */}
        {tab === 3 && (
          <div>
            <p style={{ ...s.sub, marginBottom: '2rem' }}>How to move at the festival</p>
            {[
              {
                title: 'Before You Arrive',
                items: [
                  'Register your ticket QR code before you get to the gate.',
                  'Know the pairs you want to buy, sell, or trade. The Vault 200 is your cheat sheet.',
                  'Bring cash (naira) and a mobile transfer backup. Not all vendors run POS.',
                  'Wear comfortable footwear. You will be on your feet. Ironic, we know.',
                ]
              },
              {
                title: 'On the Vendor Floor',
                items: [
                  'Prices are negotiable on pre-event arrivals. Come early, come prepared.',
                  'Verify grail authenticity before any transaction. Use rarity ratings as reference.',
                  'Deadstock means unworn, original laces, box, and paper. Confirm all four.',
                  'The raffle is weighted — VIP and VVIP tickets carry extra entries. Worth the upgrade.',
                ]
              },
              {
                title: 'What to Look For',
                items: [
                  'GRAIL tier items: expect StockX-level prices or above. Rare in Lagos legally.',
                  'HEAT tier items: the sweet spot. Strong flex, solid hold value, actually available.',
                  'SOLID tier: daily drivers and cult classics. Some of the best floor conversations.',
                  'Custom work in the Workshop Area — Lagos artists doing things not yet on the timeline.',
                ]
              },
              {
                title: 'After the Fest',
                items: [
                  'The community continues on FNP (Friday Night Protocol) every week.',
                  'Sellers not fully moved will be in the Sneakers Fest marketplace.',
                  'The bible gets updated quarterly. Watch the site.',
                  'You were here for the first one. That is worth something.',
                ]
              },
            ].map(({ title, items }) => (
              <div key={title} style={s.guide}>
                <div style={s.storyTitle}>{title}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', fontSize: '0.88rem', color: '#999', lineHeight: 1.7 }}>
                      <span style={{ color: '#FF6B00', flexShrink: 0, fontSize: '0.7rem', paddingTop: '0.35rem' }}>&#9658;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
