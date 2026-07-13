'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Rotating wireframe sphere for loading ─────────────────── */
function LoadingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.x = t * 0.3;
      meshRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.3;
      wireRef.current.rotation.z = t * 0.2;
    }
  });

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <group>
          <mesh ref={meshRef}>
            <icosahedronGeometry args={[1, 3]} />
            <MeshDistortMaterial
              color="#8b5cf6"
              transparent
              opacity={0.12}
              roughness={0.2}
              metalness={0.9}
              distort={0.3}
              speed={3}
            />
          </mesh>
          <mesh ref={wireRef} scale={1.08}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.25} />
          </mesh>
        </group>
      </Float>

      {/* Orbiting particles */}
      <OrbitingParticles />
    </>
  );
}

/* ─── Particles orbiting the loading sphere ─────────────────── */
function OrbitingParticles() {
  const count = 40;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const data = useRef(
    Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 1.5 + Math.random() * 0.8,
      speed: 0.3 + Math.random() * 0.5,
      yOffset: (Math.random() - 0.5) * 2,
      ySpeed: 0.2 + Math.random() * 0.3,
      scale: 0.3 + Math.random() * 0.8,
    }))
  );

  const dummy = useRef(new THREE.Object3D());

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    data.current.forEach((p, i) => {
      const angle = p.angle + t * p.speed;
      dummy.position.set(
        Math.cos(angle) * p.radius,
        Math.sin(t * p.ySpeed + p.angle) * p.yOffset,
        Math.sin(angle) * p.radius
      );
      dummy.scale.setScalar(p.scale * (0.6 + Math.sin(t * 2 + p.angle) * 0.4));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 4, 4]} />
      <meshBasicMaterial color="#c4b5fd" transparent opacity={0.7} />
    </instancedMesh>
  );
}

/* ─── Exported Premium Loader ───────────────────────────────── */
export default function PremiumLoader() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="w-24 h-24 sm:w-32 sm:h-32">
        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: false }}
          style={{ background: 'transparent' }}
          eventSource={undefined}
          eventPrefix={undefined}
        >
          <ambientLight intensity={0.3} />
          <pointLight color="#8b5cf6" intensity={0.8} position={[2, 2, 2]} />
          <pointLight color="#06b6d4" intensity={0.4} position={[-2, -1, 1]} />
          <LoadingSphere />
        </Canvas>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading experience...
        </p>
      </div>
    </div>
  );
}