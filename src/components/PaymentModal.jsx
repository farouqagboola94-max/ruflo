import { useState, useRef } from 'react'
import { B } from '../tokens'

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''
const FLW_KEY      = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || ''

const parseNaira = (str) => parseInt(str.replace(/[₦,\s]/g, ''))

function qrUrl(data, color) {
  const c = (color || '#F5A623').replace('#', '')
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&bgcolor=0A0A0A&color=${c}&qzone=2&data=${encodeURIComponent(data)}`
}

function ticketPayload(name, tier, ref) {
  return `SF26|${tier}|${ref}|${name}|DEC-12-2026|LAGOS`
}

function saveOrder(order) {
  try {
    const existing = JSON.parse(localStorage.getItem('sf26_orders') || '[]')
    existing.unshift(order)
    localStorage.setItem('sf26_orders', JSON.stringify(existing.slice(0, 20)))
  } catch {}
}

export async function downloadTicketPNG({ name, email, tier, tierColor, ref, price }) {
  const W = 600, H = 920
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#050508'
  ctx.fillRect(0, 0, W, H)

  // Top color bar
  const topGrad = ctx.createLinearGradient(0, 0, W, 0)
  topGrad.addColorStop(0, tierColor)
  topGrad.addColorStop(1, tierColor + '40')
  ctx.fillStyle = topGrad
  ctx.fillRect(0, 0, W, 5)

  // Subtle grid overlay
  ctx.strokeStyle = 'rgba(255,255,255,0.02)'
  ctx.lineWidth = 1
  for (let x = 0; x <= W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
  for (let y = 0; y <= H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

  // Event label
  ctx.fillStyle = tierColor
  ctx.font = '700 11px monospace'
  ctx.textAlign = 'left'
  ctx.fillText("SNEAKERS FEST '26  ·  THE SOLE EXHIBITION", 48, 52)

  // Big title
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '700 56px sans-serif'
  ctx.fillText('SOLE', 48, 128)
  ctx.fillStyle = tierColor
  ctx.fillText('FEST', 200, 128)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '700 20px sans-serif'
  ctx.fillText("'26", 420, 105)

  // Tier badge
  ctx.fillStyle = tierColor + '22'
  ctx.strokeStyle = tierColor + '80'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.roundRect(48, 148, 160, 34, 4); ctx.fill(); ctx.stroke()
  ctx.fillStyle = tierColor
  ctx.font = '700 12px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(tier.toUpperCase() + ' TICKET', 128, 170)

  // Perforated divider
  ctx.textAlign = 'left'
  ctx.strokeStyle = '#1E1E2A'
  ctx.lineWidth = 1
  ctx.setLineDash([5, 7])
  ctx.beginPath(); ctx.moveTo(48, 210); ctx.lineTo(W - 48, 210); ctx.stroke()
  ctx.setLineDash([])

  // Fields
  const field = (label, value, x, y, valColor) => {
    ctx.fillStyle = '#444455'
    ctx.font = '700 9px monospace'
    ctx.fillText(label, x, y)
    ctx.fillStyle = valColor || '#FFFFFF'
    ctx.font = '700 17px sans-serif'
    ctx.fillText(value, x, y + 26)
  }
  field('ATTENDEE',         name,                 48,  242)
  field('TIER',             tier.toUpperCase(),   48,  314, tierColor)
  field('DATE',             'DEC 12, 2026',       48,  386)
  field('VENUE',            'LAGOS, NIGERIA',     48,  458)
  field('PRICE',            price,               320,  314, tierColor)
  field('REFERENCE',        ref,                  48,  530, tierColor)

  // Second perforated divider
  ctx.strokeStyle = '#1E1E2A'
  ctx.setLineDash([5, 7])
  ctx.beginPath(); ctx.moveTo(48, 595); ctx.lineTo(W - 48, 595); ctx.stroke()
  ctx.setLineDash([])

  // QR section
  const qrData = ticketPayload(name, tier, ref)
  const qrSrc  = qrUrl(qrData, tierColor)
  const qrImg  = new Image()
  qrImg.crossOrigin = 'anonymous'

  await new Promise((resolve) => {
    const finish = () => {
      // QR border box
      ctx.fillStyle = '#0A0A0F'
      ctx.strokeStyle = tierColor + '50'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.roundRect((W - 220) / 2, 615, 220, 220, 6); ctx.fill(); ctx.stroke()

      if (qrImg.complete && qrImg.naturalWidth > 0) {
        ctx.drawImage(qrImg, (W - 200) / 2, 625, 200, 200)
      } else {
        ctx.fillStyle = '#1a1a2e'
        ctx.fillRect((W - 200) / 2, 625, 200, 200)
        ctx.fillStyle = '#333'
        ctx.font = '10px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('QR CODE', W / 2, 720)
        ctx.fillText('(VIEW ONLINE)', W / 2, 740)
      }

      // Bottom label
      ctx.fillStyle = '#2a2a3a'
      ctx.font = '700 10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('SCAN AT ENTRY · SNEAKERS FEST \'26 · DEC 12 LAGOS', W / 2, 870)

      // Bottom bar
      const botGrad = ctx.createLinearGradient(0, H - 5, W, H - 5)
      botGrad.addColorStop(0, tierColor + '40')
      botGrad.addColorStop(0.5, tierColor)
      botGrad.addColorStop(1, tierColor + '40')
      ctx.fillStyle = botGrad
      ctx.fillRect(0, H - 5, W, 5)

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob)
        const a   = document.createElement('a')
        a.href = url; a.download = `SF26-${tier}-${ref}.png`
        document.body.appendChild(a); a.click()
        document.body.removeChild(a); URL.revokeObjectURL(url)
        resolve()
      }, 'image/png')
    }
    qrImg.onload  = finish
    qrImg.onerror = finish
    qrImg.src = qrSrc
  })
}

function payWithPaystack({ name, email, amount, tier, serverRef, onSuccess, onError }) {
  if (!PAYSTACK_KEY) { onError('Add VITE_PAYSTACK_PUBLIC_KEY in Netlify → Environment Variables.'); return }
  if (!window.PaystackPop) { onError('Paystack SDK failed to load. Check your connection.'); return }
  const handler = window.PaystackPop.setup({
    key: PAYSTACK_KEY, email, amount: amount * 100, currency: 'NGN',
    ref: serverRef || `SF26_PS_${Date.now()}`,
    metadata: { custom_fields: [
      { display_name: 'Name',        variable_name: 'name', value: name },
      { display_name: 'Ticket Tier', variable_name: 'tier', value: tier },
    ]},
    callback: (res) => onSuccess('Paystack', res.reference),
    onClose: () => {},
  })
  handler.openIframe()
}

function payWithFlutterwave({ name, email, amount, tier, onSuccess, onError }) {
  if (!FLW_KEY) { onError('Add VITE_FLUTTERWAVE_PUBLIC_KEY in Netlify → Environment Variables.'); return }
  if (!window.FlutterwaveCheckout) { onError('Flutterwave SDK failed to load. Check your connection.'); return }
  window.FlutterwaveCheckout({
    public_key: FLW_KEY, tx_ref: `SF26_FLW_${Date.now()}`,
    amount, currency: 'NGN', payment_options: 'card,banktransfer,ussd,mobilemoney',
    customer: { email, name, phone_number: '' },
    customizations: { title: "Sneakers Fest '26", description: `${tier} Ticket — The Sole Exhibition`, logo: window.location.origin + '/favicon.svg' },
    callback: (res) => {
      if (res.status === 'successful' || res.status === 'completed')
        onSuccess('Flutterwave', String(res.transaction_id || res.tx_ref))
      res.modal?.close()
    },
    onclose: () => {},
  })
}

// ── TicketCard ────────────────────────────────────────────────────────────────
export function TicketCard({ name, tier, tierColor, ticketRef, price, qrData }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const src = qrUrl(qrData, tierColor)

  return (
    <div style={{ background:'#050508', border:`1px solid ${tierColor}40`, borderRadius:12, overflow:'hidden', maxWidth:360, margin:'0 auto' }}>
      <div style={{ height:4, background:`linear-gradient(90deg, ${tierColor}, ${tierColor}40)` }} />
      <div style={{ padding:'20px 24px' }}>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:tierColor, letterSpacing:3, marginBottom:4 }}>SNEAKERS FEST '26</div>
        <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:28, color:B.white, letterSpacing:3, lineHeight:1 }}>THE SOLE EXHIBITION</div>
        <div style={{ display:'inline-block', marginTop:8, padding:'3px 10px', background:`${tierColor}18`, border:`1px solid ${tierColor}50`, borderRadius:3 }}>
          <span style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:tierColor, letterSpacing:2 }}>{tier.toUpperCase()} TICKET</span>
        </div>
      </div>

      <div style={{ height:1, background:'#1a1a2e', margin:'0 24px' }} />

      <div style={{ padding:'16px 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 20px' }}>
        {[
          ['ATTENDEE', name, B.white],
          ['DATE',     'DEC 12, 2026', B.white],
          ['VENUE',    'LAGOS, NIGERIA', B.white],
          ['PRICE',    price, tierColor],
        ].map(([label, val, col]) => (
          <div key={label}>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#444', letterSpacing:2, marginBottom:3 }}>{label}</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:col, fontWeight:600 }}>{val}</div>
          </div>
        ))}
        <div style={{ gridColumn:'1/-1' }}>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#444', letterSpacing:2, marginBottom:3 }}>REFERENCE</div>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:tierColor }}>{ticketRef}</div>
        </div>
      </div>

      <div style={{ height:1, borderTop:'1px dashed #1a1a2e', margin:'0 24px' }} />

      <div style={{ padding:'16px 24px', display:'flex', justifyContent:'center' }}>
        <div style={{ position:'relative', width:130, height:130 }}>
          {!imgLoaded && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a12', borderRadius:4 }}>
              <div style={{ width:24, height:24, border:`2px solid ${tierColor}40`, borderTopColor:tierColor, borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
            </div>
          )}
          <img
            src={src} alt="Ticket QR" width={130} height={130}
            crossOrigin="anonymous"
            onLoad={() => setImgLoaded(true)}
            style={{ display: imgLoaded ? 'block' : 'none', borderRadius:4, imageRendering:'pixelated' }}
          />
        </div>
      </div>

      <div style={{ padding:'0 24px 16px', textAlign:'center' }}>
        <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#2a2a3a', letterSpacing:1 }}>SCAN AT ENTRY</div>
      </div>

      <div style={{ height:4, background:`linear-gradient(90deg, ${tierColor}40, ${tierColor}, ${tierColor}40)` }} />
    </div>
  )
}

// ── PaymentModal ──────────────────────────────────────────────────────────────
export default function PaymentModal({ tier, onClose }) {
  const [name,        setName]        = useState('')
  const [email,       setEmail]       = useState('')
  const [method,      setMethod]      = useState('paystack')
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [paymentUrl,  setPaymentUrl]  = useState(null)

  const quantity = tier.quantity || 1
  const amount   = parseNaira(tier.price) * quantity

  async function handlePay() {
    if (!name.trim()) { setError('Please enter your full name.'); return }
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address.'); return }
    setError(''); setLoading(true)
    const opts = {
      name: name.trim(), email: email.trim().toLowerCase(),
      amount, tier: tier.name,
      onSuccess: (gateway, ref) => {
        saveOrder({ name: name.trim(), email: email.trim().toLowerCase(), tier: tier.name, tierColor: tier.color, ref, price: tier.price, quantity, gateway, purchasedAt: Date.now() })
        setLoading(false); setSuccess({ gateway, ref })
      },
      onError: (msg) => { setLoading(false); setError(msg) },
    }
    if (method === 'paystack') {
      // Get a server-controlled reference so verify-payment can link the Blobs record
      let serverPaymentUrl = null
      try {
        const res = await fetch('/.netlify/functions/ticket-purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: opts.name, email: opts.email, tier: tier.name.toLowerCase(), quantity }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.reference)   opts.serverRef = data.reference
          if (data.payment_url) serverPaymentUrl = data.payment_url
        }
      } catch {}
      if (serverPaymentUrl) setPaymentUrl(serverPaymentUrl)
      payWithPaystack(opts)
      setTimeout(() => setLoading(false), 800)
    } else {
      payWithFlutterwave(opts)
      setTimeout(() => setLoading(false), 800)
    }
  }

  async function handleDownload() {
    setDownloading(true)
    await downloadTicketPNG({ name, email, tier: tier.name, tierColor: tier.color, ref: success.ref, price: tier.price })
    setDownloading(false)
  }

  const inputStyle = (accent) => ({
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${accent || 'rgba(255,255,255,0.1)'}`,
    borderRadius: 10, color: B.white, fontFamily: 'Space Mono,monospace', fontSize: 13,
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  })
  const label = (text) => (
    <label style={{ color:'#555', fontFamily:'Space Mono,monospace', fontSize:9, letterSpacing:2, display:'block', marginBottom:6 }}>{text}</label>
  )

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:2000, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, animation:'fadeUp 0.2s ease', overflowY:'auto' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ width:'100%', maxWidth:460, background:'rgba(10,10,15,0.97)', backdropFilter:'blur(24px) saturate(180%)', border:`1px solid ${tier.color}30`, borderRadius:20, overflow:'hidden', boxShadow:`0 0 80px ${tier.color}10, 0 40px 100px rgba(0,0,0,0.95)`, animation:'chatSlideIn 0.25s ease' }}>
        <div style={{ height:3, background:`linear-gradient(90deg, ${tier.color}, ${tier.color}30)` }} />

        {/* Header */}
        <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:`linear-gradient(90deg, ${tier.color}08, transparent)`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <p style={{ color:tier.color, fontFamily:'Orbitron,sans-serif', fontSize:9, letterSpacing:3, fontWeight:700, marginBottom:4 }}>SECURE CHECKOUT</p>
            <p style={{ color:B.white, fontFamily:'Bebas Neue,sans-serif', fontSize:22, letterSpacing:2 }}>{tier.name} TICKET</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, cursor:'pointer', color:B.smoke, width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {success ? (
          /* —— SUCCESS + TICKET —— */
          <div style={{ padding:'28px 24px', display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(184,255,0,0.08)', border:`2px solid ${B.neonLime}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={B.neonLime} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p style={{ color:B.neonLime, fontFamily:'Orbitron,sans-serif', fontSize:10, letterSpacing:3, fontWeight:700, marginBottom:4 }}>PAYMENT CONFIRMED</p>
              <p style={{ color:B.white, fontFamily:'Bebas Neue,sans-serif', fontSize:28, letterSpacing:2, lineHeight:1 }}>SEE YOU DECEMBER 12!</p>
            </div>

            <TicketCard
              name={name} tier={tier.name} tierColor={tier.color}
              ticketRef={success.ref} price={tier.price}
              qrData={ticketPayload(name, tier.name, success.ref)}
            />

            {/* Email status */}
            <div style={{ textAlign:'center' }}>
              <p style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#444' }}>
                A confirmation email will be sent to <span style={{ color:B.smoke }}>{email}</span>
              </p>
            </div>

            {/* Download button */}
            <button onClick={handleDownload} disabled={downloading}
              style={{ width:'100%', padding:'13px', borderRadius:10, border:`1px solid ${tier.color}`, background:`${tier.color}15`, color:tier.color, fontFamily:'Orbitron,sans-serif', fontSize:11, fontWeight:700, letterSpacing:2, cursor:downloading ? 'wait' : 'pointer', transition:'all 0.2s' }}>
              {downloading ? 'SAVING…' : 'DOWNLOAD TICKET PNG →'}
            </button>

            <button onClick={onClose}
              style={{ width:'100%', padding:'13px', borderRadius:10, border:'none', background:tier.color, color:B.black, fontFamily:'Orbitron,sans-serif', fontSize:11, fontWeight:700, letterSpacing:2, cursor:'pointer', boxShadow:`0 0 24px ${tier.color}40` }}>
              DONE →
            </button>

            <p style={{ color:'#333', fontFamily:'Space Mono,monospace', fontSize:9, textAlign:'center' }}>Powered by {success.gateway}</p>
          </div>
        ) : (
          /* —— PAYMENT FORM —— */
          <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ padding:'12px 16px', background:`${tier.color}08`, border:`1px solid ${tier.color}20`, borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ color:'#555', fontFamily:'Space Mono,monospace', fontSize:9, letterSpacing:1, marginBottom:2 }}>{quantity} × {tier.name} TICKET</p>
                <p style={{ color:B.smoke, fontFamily:'Space Mono,monospace', fontSize:10 }}>The Sole Exhibition · December 12 2026</p>
              </div>
              <p style={{ color:tier.color, fontFamily:'Orbitron,sans-serif', fontSize:20, fontWeight:900, textShadow:`0 0 16px ${tier.color}60` }}>
                {quantity > 1 ? `₦${amount.toLocaleString()}` : tier.price}
              </p>
            </div>

            <div>{label('FULL NAME')}<input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={inputStyle()} /></div>
            <div>{label('EMAIL ADDRESS')}<input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handlePay()} placeholder="your@email.com" style={inputStyle(`${tier.color}30`)} /></div>

            <div>
              {label('PAYMENT METHOD')}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {[
                  { id:'paystack',    label:'Paystack',    sub:'Card · Bank · USSD', color:'#00C3F7', ok:!!PAYSTACK_KEY },
                  { id:'flutterwave', label:'Flutterwave', sub:'Card · Mobile Money', color:'#F5A623', ok:!!FLW_KEY },
                ].map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)} style={{ padding:'13px 10px', borderRadius:10, cursor:'pointer', background: method === m.id ? `${m.color}12` : 'rgba(255,255,255,0.03)', border:`1.5px solid ${method === m.id ? m.color : 'rgba(255,255,255,0.08)'}`, textAlign:'center', transition:'all 0.2s' }}>
                    <p style={{ color: method === m.id ? m.color : B.smoke, fontFamily:'Orbitron,sans-serif', fontSize:10, fontWeight:700, marginBottom:3 }}>{m.label}</p>
                    <p style={{ color:'#555', fontFamily:'Space Mono,monospace', fontSize:9 }}>{m.sub}</p>
                    {!m.ok && <p style={{ color:'#333', fontFamily:'Space Mono,monospace', fontSize:8, marginTop:3 }}>key not set</p>}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ padding:'10px 14px', background:'rgba(255,45,123,0.08)', border:'1px solid rgba(255,45,123,0.2)', borderRadius:8 }}>
                <p style={{ color:B.neonMagenta, fontFamily:'Space Mono,monospace', fontSize:11 }}>{error}</p>
              </div>
            )}

            {/* Fallback link if popup was blocked */}
            {paymentUrl && !success && (
              <div style={{ padding:'10px 14px', background:'rgba(0,195,247,0.06)', border:'1px solid rgba(0,195,247,0.2)', borderRadius:8, textAlign:'center' }}>
                <p style={{ color:'#555', fontFamily:'Space Mono,monospace', fontSize:9, marginBottom:6 }}>POPUP BLOCKED?</p>
                <a href={paymentUrl} target="_blank" rel="noopener noreferrer"
                  style={{ color:'#00C3F7', fontFamily:'Orbitron,sans-serif', fontSize:10, fontWeight:700, letterSpacing:1, textDecoration:'none' }}>
                  OPEN PAYMENT PAGE →
                </a>
              </div>
            )}

            <button onClick={handlePay} disabled={loading}
              style={{ padding:'15px', borderRadius:10, border:`1px solid ${loading ? 'transparent' : tier.color}`, background: loading ? '#1a1a2e' : tier.color, color: loading ? B.smoke : B.black, fontFamily:'Orbitron,sans-serif', fontSize:12, fontWeight:700, letterSpacing:2, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 0 32px ${tier.color}30`, transition:'all 0.2s' }}>
              {loading
                ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}><span style={{ width:12, height:12, border:`2px solid ${B.smoke}`, borderTopColor:'transparent', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite' }} />OPENING PAYMENT…</span>
                : `PAY ₦${amount.toLocaleString()} →`}
            </button>

            <p style={{ color:'#333', fontFamily:'Space Mono,monospace', fontSize:9, textAlign:'center', letterSpacing:1 }}>
              SECURED BY {method === 'paystack' ? 'PAYSTACK' : 'FLUTTERWAVE'} · 256-BIT SSL
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
