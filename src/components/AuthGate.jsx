import { useAuth } from '../lib/auth'
import { B } from '../tokens'

export default function AuthGate({ children, title = 'Members Only', message = 'Sign in to unlock this feature.' }) {
  const { user, login, signup } = useAuth()
  if (user) return children

  return (
    <div style={{
      background: B.charcoal,
      border: `1px solid ${B.gunmetal}`,
      borderRadius: 16,
      padding: '60px 32px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, ${B.amber}08 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ fontSize: '2.4rem', marginBottom: 16 }}>🔐</div>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '2rem',
        color: B.amber,
        letterSpacing: '0.06em',
        marginBottom: 8,
        position: 'relative',
      }}>{title}</div>
      <p style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.72rem',
        color: B.smoke,
        maxWidth: 320,
        margin: '0 auto 28px',
        lineHeight: 1.6,
        position: 'relative',
      }}>{message}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
        <button
          onClick={login}
          style={{
            padding: '13px 30px',
            background: B.amber,
            color: B.black,
            border: 'none',
            borderRadius: 6,
            fontFamily: "'Orbitron', monospace",
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            cursor: 'pointer',
            boxShadow: `0 0 20px ${B.amber}30`,
          }}
        >SIGN IN</button>
        <button
          onClick={signup}
          style={{
            padding: '13px 30px',
            background: 'transparent',
            color: B.white,
            border: `1px solid ${B.gunmetal}`,
            borderRadius: 6,
            fontFamily: "'Orbitron', monospace",
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            cursor: 'pointer',
          }}
        >CREATE ACCOUNT</button>
      </div>
    </div>
  )
}
