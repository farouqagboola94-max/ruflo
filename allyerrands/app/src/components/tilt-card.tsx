'use client';

import React, { useState, useRef, useCallback, ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltDegree?: number;
  glareOpacity?: number;
  scaleOnHover?: number;
  enableMagnetic?: boolean;
}

export function TiltCard({
  children,
  className = '',
  tiltDegree = 8,
  glareOpacity = 0.15,
  scaleOnHover = 1.02,
  enableMagnetic = false,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 300, damping: 30 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [0, 1], [tiltDegree, -tiltDegree]);
  const rotateY = useTransform(springX, [0, 1], [-tiltDegree, tiltDegree]);

  const glareX = useTransform(springX, [0, 1], [0, 100]);
  const glareY = useTransform(springY, [0, 1], [0, 100]);

  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.9), transparent 60%)`,
  );

  // Holographic rainbow border gradient
  const borderGradient = useTransform(
    [springX, springY],
    ([x, y]) => {
      const angle = x * 360;
      const hue1 = angle;
      const hue2 = angle + 60;
      const hue3 = angle + 120;
      return `linear-gradient(${angle}deg, 
        hsla(${hue1}, 80%, 65%, ${isHovering ? 0.5 : 0}), 
        hsla(${hue2}, 80%, 65%, ${isHovering ? 0.3 : 0}), 
        hsla(${hue3}, 80%, 65%, ${isHovering ? 0.5 : 0}))`;
    },
  );

  // 3D depth shadow
  const boxShadow = useTransform(
    [springX, springY],
    ([x, y]) => {
      if (!isHovering) return '0 0 0 0 transparent';
      const sx = (x - 0.5) * 20;
      const sy = (y - 0.5) * 20;
      return `${sx}px ${sy}px 40px rgba(139, 92, 246, 0.12), 0 8px 32px rgba(0,0,0,0.08)`;
    },
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Holographic border layer */}
      <motion.div
        className="absolute inset-0 rounded-2xl p-[1px]"
        style={{
          background: borderGradient,
        }}
      >
        <div className="w-full h-full rounded-2xl bg-background/80" />
      </motion.div>

      {/* Content with 3D tilt */}
      <motion.div
        className="relative z-[1]"
        style={{
          rotateX,
          rotateY,
          scale: isHovering ? scaleOnHover : 1,
          transformStyle: 'preserve-3d',
          boxShadow,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>

      {/* 3D glare overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
        style={{
          opacity: isHovering ? glareOpacity : 0,
          background: glareBackground,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Edge highlight for 3D depth */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
        style={{
          opacity: isHovering ? 0.08 : 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
        }}
      />

      {/* Animated border glow on hover */}
      <motion.div
        className="pointer-events-none absolute -inset-[1px] z-[-1] rounded-2xl"
        style={{
          opacity: isHovering ? 0.4 : 0,
          background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.3), rgba(236,72,153,0.2))',
          filter: 'blur(8px)',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({
  children,
  className = '',
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      className={`backdrop-blur-xl rounded-2xl border border-white/20 bg-white/10 shadow-2xl dark:bg-white/5 ${className}`}
      initial={{ opacity: 0, y: 20, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay,
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}