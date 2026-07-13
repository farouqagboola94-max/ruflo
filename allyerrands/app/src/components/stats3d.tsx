'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Single 3D Stat Orb ──────────────────────────────────────── */
function StatOrb({
  value,
  color,
  position,
}: {
  value: number;
  color: string;
  position: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.15;
      groupRef.current.rotation.y = t * 0.2 + position[0];
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.3;
      ringRef.current.rotation.z = t * 0.2;
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(t * 1.5 + position[0]) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Core orb */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.15}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Wireframe shell */}
      <mesh scale={1.15}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.2} />
      </mesh>
      {/* Orbiting ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.6, 0.012, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      {/* Glow sphere */}
      <mesh ref={glowRef} scale={1.8}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>
      {/* Value text via sprite */}
      <ValueSprite value={value} color={color} />
    </group>
  );
}

/* ─── Canvas text rendered as sprite ──────────────────────────── */
function ValueSprite({ value, color }: { value: number; color: string }) {
  const spriteRef = useRef<THREE.Sprite>(null);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Parse color to determine text brightness
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(value), 64, 32);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [value]);

  return (
    <sprite ref={spriteRef} position={[0, 0, 0.7]} scale={[1.2, 0.6, 1]}>
      <spriteMaterial map={texture} transparent opacity={0.9} />
    </sprite>
  );
}

/* ─── Background particles for the mini scene ─────────────────── */
function MiniParticles() {
  const count = 50;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4 - 1
      ),
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      scale: 0.3 + Math.random() * 0.7,
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.position.x + Math.sin(t * 0.15 + p.offset) * 0.2,
        p.position.y + Math.cos(t * 0.2 + p.offset) * 0.15,
        p.position.z
      );
      dummy.scale.setScalar(p.scale * (0.7 + Math.sin(t * p.speed + p.offset) * 0.3));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.015, 4, 4]} />
      <meshBasicMaterial color="#a78bfa" transparent opacity={0.4} />
    </instancedMesh>
  );
}

/* ─── Mini scene ──────────────────────────────────────────────── */
function StatsScene({ stats }: { stats: { total: number; open: number; in_progress: number; completed: number } }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight color="#8b5cf6" intensity={0.5} position={[3, 2, 3]} />
      <pointLight color="#06b6d4" intensity={0.3} position={[-3, -1, 2]} />

      <StatOrb value={stats.total} color="#8b5cf6" position={[-2.8, 0, 0]} />
      <StatOrb value={stats.open} color="#10b981" position={[-0.9, 0, 0]} />
      <StatOrb value={stats.in_progress} color="#f59e0b" position={[0.9, 0, 0]} />
      <StatOrb value={stats.completed} color="#06b6d4" position={[2.8, 0, 0]} />

      <MiniParticles />
    </>
  );
}

/* ─── Exported 3D Stats Component ─────────────────────────────── */
export default function Stats3D({
  stats,
}: {
  stats: { total: number; open: number; in_progress: number; completed: number };
}) {
  if (stats.total === 0) return null;

  return (
    <div className="w-full h-[120px] sm:h-[140px] rounded-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-cyan-500/5 rounded-2xl border border-border/30" />
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        eventSource={undefined}
        eventPrefix={undefined}
      >
        <StatsScene stats={stats} />
      </Canvas>
      {/* Labels overlay */}
      <div className="absolute bottom-1.5 left-0 right-0 flex justify-around pointer-events-none">
        {[
          { label: 'Total', color: 'text-violet-400' },
          { label: 'Open', color: 'text-emerald-400' },
          { label: 'Active', color: 'text-amber-400' },
          { label: 'Done', color: 'text-cyan-400' },
        ].map((s) => (
          <span key={s.label} className={`text-[10px] font-semibold uppercase tracking-widest ${s.color} opacity-70`}>
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}