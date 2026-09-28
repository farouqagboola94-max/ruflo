const particles = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: `${8 + (index * 7) % 86}%`,
  delay: `${(index % 6) * 0.7}s`,
  size: `${6 + (index % 4) * 3}px`,
}))

export default function MotionBackdrop() {
  return (
    <div className="motion-backdrop" aria-hidden="true">
      <div className="motion-grid" />
      <div className="motion-orbit motion-orbit-one" />
      <div className="motion-orbit motion-orbit-two" />
      {particles.map(particle => (
        <span
          key={particle.id}
          className="motion-particle"
          style={{
            left: particle.left,
            animationDelay: particle.delay,
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
    </div>
  )
}
