import { B } from '../tokens'

export const GrainOverlay = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundRepeat: "repeat", opacity: 0.5, mixBlendMode: "overlay",
  }} />
)

export const ScanLines = ({ opacity = 0.06 }) => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none", zIndex: 49,
    background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,${opacity}) 2px, rgba(0,0,0,${opacity}) 4px)`,
  }} />
)

export const AmberGlow = ({ top = "10%", left = "80%", size = 200 }) => (
  <div style={{
    position: "absolute", top, left, width: size, height: size,
    background: `radial-gradient(circle, ${B.amber}30 0%, ${B.amber}08 40%, transparent 70%)`,
    borderRadius: "50%", filter: "blur(30px)", pointerEvents: "none", zIndex: 5,
  }} />
)

export const SectionTag = ({ children, color }) => (
  <div style={{
    fontFamily: "'Space Mono', monospace", fontSize: 9,
    color: color || B.neonCyan,
    letterSpacing: "0.5em", marginBottom: 12, textTransform: "uppercase",
  }}>{children}</div>
)

export const Divider = ({ color }) => (
  <div style={{
    width: 60, height: 2,
    background: `linear-gradient(90deg, ${color || B.amber}, ${B.neonCyan})`,
    margin: "16px 0",
  }} />
)
