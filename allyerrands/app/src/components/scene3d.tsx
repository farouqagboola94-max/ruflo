'use client';

import React, { useRef, useMemo, useCallback, useEffect, useState, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

/* ─── Shared mouse position for cross-component reactivity ─── */
const sharedMouse = { x: 0, y: 0 };

/* ─── Theme color utilities ─────────────────────────────────── */
const LIGHT_COLOR_MAP: Record<string, string> = {
  '#8b5cf6': '#c4b5fd',
  '#06b6d4': '#a5f3fc',
  '#a855f7': '#d8b4fe',
  '#3b82f6': '#93c5fd',
  '#ec4899': '#f9a8d4',
  '#a78bfa': '#ddd6fe',
};

function getThemeColor(baseHex: string, isDark: boolean): string {
  return isDark ? baseHex : (LIGHT_COLOR_MAP[baseHex] || baseHex);
}

/* ─── Mouse-reactive camera rig with smooth inertia ──────────── */
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  const onPointerMove = useCallback((e: PointerEvent) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    mouse.current.x = nx;
    mouse.current.y = ny;
    sharedMouse.x = nx;
    sharedMouse.y = ny;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // Breathing motion
    const breathe = Math.sin(t * 0.3) * 0.15;

    // Smooth mouse follow with inertia
    const targetX = mouse.current.x * 0.6;
    const targetY = -mouse.current.y * 0.4 + breathe;

    velocity.current.x += (targetX - velocity.current.x) * 1.5 * delta;
    velocity.current.y += (targetY - velocity.current.y) * 1.5 * delta;

    // eslint-disable-next-line react-hooks/immutability -- R3F pattern: mutate camera in useFrame
    camera.position.x += (velocity.current.x - camera.position.x) * 0.03;
    camera.position.y += (velocity.current.y - camera.position.y) * 0.03;
    camera.position.z += (6.5 - camera.position.z) * 0.02;

    camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [onPointerMove]);

  return null;
}

/* ─── Morphing sphere (premium centerpiece) ──────────────────── */
function MorphingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshDistortMaterial>(null);
  const lastIsDark = useRef<boolean | null>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.1;
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.position.y = Math.sin(t * 0.4) * 0.2;
    }
    // Theme-aware color
    if (matRef.current) {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark !== lastIsDark.current) {
        lastIsDark.current = isDark;
        matRef.current.color.set(getThemeColor('#8b5cf6', isDark));
      }
    }
  });

  return (
    <Float speed={0.6} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={meshRef} position={[0, 0, -1]} scale={1.8}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          ref={matRef}
          color="#8b5cf6"
          transparent
          opacity={0.04}
          roughness={0.2}
          metalness={0.9}
          distort={0.25}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

/* ─── Floating geometry with glass-like material + mouse reactivity ── */
function FloatingShape({
  position,
  geometry,
  color,
  speed = 1,
  rotationSpeed = 0.3,
  scale = 1,
}: {
  position: [number, number, number];
  geometry: 'icosahedron' | 'octahedron' | 'torus' | 'torusKnot' | 'dodecahedron';
  color: string;
  speed?: number;
  rotationSpeed?: number;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const wireMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const mouseOffset = useRef(new THREE.Vector3(0, 0, 0));
  const lastIsDark = useRef<boolean | null>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * speed;

    // Subtle mouse reactivity — shapes drift slightly toward cursor
    const targetMx = sharedMouse.x * 0.12;
    const targetMy = -sharedMouse.y * 0.12;
    const lerpFactor = 1 - Math.exp(-2 * delta);
    mouseOffset.current.x += (targetMx - mouseOffset.current.x) * lerpFactor;
    mouseOffset.current.y += (targetMy - mouseOffset.current.y) * lerpFactor;

    if (meshRef.current) {
      meshRef.current.rotation.x = t * rotationSpeed * 0.7;
      meshRef.current.rotation.y = t * rotationSpeed;
      meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.4;
      meshRef.current.position.x = mouseOffset.current.x;
      meshRef.current.position.z = mouseOffset.current.y * 0.5;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = t * rotationSpeed * 0.7;
      wireRef.current.rotation.y = t * rotationSpeed;
      wireRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.4;
      wireRef.current.position.x = mouseOffset.current.x;
      wireRef.current.position.z = mouseOffset.current.y * 0.5;
    }

    // Theme-aware color update
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark !== lastIsDark.current) {
      lastIsDark.current = isDark;
      const themeColor = getThemeColor(color, isDark);
      if (matRef.current) matRef.current.color.set(themeColor);
      if (wireMatRef.current) wireMatRef.current.color.set(themeColor);
    }
  });

  const geo = useMemo(() => {
    switch (geometry) {
      case 'icosahedron': return <icosahedronGeometry args={[1, 0]} />;
      case 'octahedron': return <octahedronGeometry args={[1, 0]} />;
      case 'torus': return <torusGeometry args={[0.8, 0.3, 16, 32]} />;
      case 'torusKnot': return <torusKnotGeometry args={[0.6, 0.2, 64, 16]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[1, 0]} />;
    }
  }, [geometry]);

  return (
    <Float speed={speed * 0.4} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position} scale={scale}>
        <mesh ref={meshRef}>
          {geo}
          <meshStandardMaterial
            ref={matRef}
            color={color}
            transparent
            opacity={0.05}
            roughness={0.3}
            metalness={0.9}
            envMapIntensity={0.5}
          />
        </mesh>
        <mesh ref={wireRef} scale={1.02}>
          {geo}
          <meshBasicMaterial
            ref={wireMatRef}
            color={color}
            wireframe
            transparent
            opacity={0.12}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── Constellation particle field with connecting lines ────── */
function ConstellationField() {
  const count = 200;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const lastIsDark = useRef<boolean | null>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 8;
      temp.push({
        position: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi) - 2
        ),
        speed: 0.1 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
        scale: 0.5 + Math.random() * 1.5,
      });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const linePositions = useMemo(() => new Float32Array(count * 30 * 3), [count]);
  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color('#8b5cf6'),
        transparent: true,
        opacity: 0.06,
      }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    let lineIdx = 0;

    // Theme-aware color update
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark !== lastIsDark.current) {
      lastIsDark.current = isDark;
      lineMaterial.color.set(getThemeColor('#8b5cf6', isDark));
      if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
        meshRef.current.material.color.set(getThemeColor('#a78bfa', isDark));
      }
    }

    particles.forEach((p, i) => {
      const s = p.scale * (0.8 + Math.sin(t * p.speed + p.offset) * 0.3);
      const px = p.position.x + Math.sin(t * 0.1 + p.offset) * 0.4;
      const py = p.position.y + Math.cos(t * 0.15 + p.offset) * 0.3;
      const pz = p.position.z + Math.sin(t * 0.08 + p.offset * 0.5) * 0.2;

      dummy.position.set(px, py, pz);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // Draw lines to nearby particles (constellation effect)
      for (let j = i + 1; j < Math.min(i + 8, count); j++) {
        const q = particles[j];
        const qx = q.position.x + Math.sin(t * 0.1 + q.offset) * 0.4;
        const qy = q.position.y + Math.cos(t * 0.15 + q.offset) * 0.3;
        const qz = q.position.z + Math.sin(t * 0.08 + q.offset * 0.5) * 0.2;
        const dist = Math.sqrt((px - qx) ** 2 + (py - qy) ** 2 + (pz - qz) ** 2);
        if (dist < 4 && lineIdx * 3 + 5 < linePositions.length) {
          linePositions[lineIdx * 3] = px;
          linePositions[lineIdx * 3 + 1] = py;
          linePositions[lineIdx * 3 + 2] = pz;
          linePositions[lineIdx * 3 + 3] = qx;
          linePositions[lineIdx * 3 + 4] = qy;
          linePositions[lineIdx * 3 + 5] = qz;
          lineIdx++;
        }
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    // Update constellation lines
    if (linesRef.current) {
      const geo = linesRef.current.geometry;
      geo.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0, lineIdx * 6), 3));
      geo.setDrawRange(0, lineIdx * 2);
    }
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.5} />
      </instancedMesh>
      <lineSegments ref={linesRef} material={lineMaterial} frustumCulled={false}>
        <bufferGeometry />
      </lineSegments>
    </>
  );
}

/* ─── Animated light orbs with trails ────────────────────────── */
function LightOrbs() {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.PointLight>(null);
  const lastIsDark = useRef<boolean | null>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Theme-aware intensity and color
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark !== lastIsDark.current) {
      lastIsDark.current = isDark;
      if (light1Ref.current) light1Ref.current.color.set(getThemeColor('#8b5cf6', isDark));
      if (light2Ref.current) light2Ref.current.color.set(getThemeColor('#06b6d4', isDark));
      if (light3Ref.current) light3Ref.current.color.set(getThemeColor('#ec4899', isDark));
    }

    const intensityScale = isDark ? 1 : 0.5;

    if (light1Ref.current) {
      light1Ref.current.position.set(
        Math.sin(t * 0.3) * 5,
        Math.cos(t * 0.2) * 3,
        2
      );
      light1Ref.current.intensity = (0.6 + Math.sin(t * 0.8) * 0.2) * intensityScale;
    }
    if (light2Ref.current) {
      light2Ref.current.position.set(
        Math.cos(t * 0.25) * 4,
        Math.sin(t * 0.35) * 4,
        1
      );
      light2Ref.current.intensity = (0.4 + Math.cos(t * 0.6) * 0.15) * intensityScale;
    }
    if (light3Ref.current) {
      light3Ref.current.position.set(
        Math.sin(t * 0.15) * 3,
        Math.cos(t * 0.4) * 2,
        3
      );
      light3Ref.current.intensity = (0.3 + Math.sin(t * 1.2) * 0.1) * intensityScale;
    }
  });

  return (
    <>
      <pointLight ref={light1Ref} color="#8b5cf6" intensity={0.8} distance={15} />
      <pointLight ref={light2Ref} color="#06b6d4" intensity={0.5} distance={12} />
      <pointLight ref={light3Ref} color="#ec4899" intensity={0.3} distance={10} />
    </>
  );
}

/* ─── Wobbling torus ring ───────────────────────────────────── */
function WobblingRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  const lastIsDark = useRef<boolean | null>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.3;
      meshRef.current.rotation.z = t * 0.1;
      meshRef.current.position.y = Math.sin(t * 0.3) * 0.3;

      // Theme-aware color
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark !== lastIsDark.current) {
        lastIsDark.current = isDark;
        const mat = meshRef.current.material as THREE.MeshBasicMaterial;
        mat.color.set(getThemeColor('#8b5cf6', isDark));
      }
    }
  });

  return (
    <Float speed={0.3} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={meshRef} position={[0, 0, -2]} scale={3.5}>
        <torusGeometry args={[1, 0.015, 16, 100]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.08} />
      </mesh>
    </Float>
  );
}

/* ─── Animated grid floor ───────────────────────────────────── */
function GridFloor() {
  const ref = useRef<THREE.GridHelper>(null);
  const lastIsDark = useRef<boolean | null>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = -3 + Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
      (ref.current.material as THREE.Material).opacity =
        0.03 + Math.sin(state.clock.elapsedTime * 0.3) * 0.01;

      // Theme-aware color
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark !== lastIsDark.current) {
        lastIsDark.current = isDark;
        const themeColor = getThemeColor('#8b5cf6', isDark);
        (ref.current.material as THREE.Material).color.set(themeColor);
      }
    }
  });

  return (
    <gridHelper
      ref={ref}
      args={[40, 40, '#8b5cf6', '#8b5cf6']}
      position={[0, -4, -3]}
      rotation={[0, 0, 0]}
      material-transparent
      material-opacity={0.03}
    />
  );
}

/* ─── Energy waves (expanding rings) ────────────────────────── */
function EnergyWaves() {
  const groupRef = useRef<THREE.Group>(null);
  const ringCount = 5;
  const lastIsDark = useRef<boolean | null>(null);

  const rings = useMemo(
    () =>
      Array.from({ length: ringCount }, (_, i) => ({
        offset: (i / ringCount) * Math.PI * 2,
        speed: 0.3 + i * 0.05,
      })),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Theme-aware color
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark !== lastIsDark.current) {
      lastIsDark.current = isDark;
      groupRef.current.children.forEach((child) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.color.set(getThemeColor('#8b5cf6', isDark));
      });
    }

    groupRef.current.children.forEach((child, i) => {
      const ring = rings[i];
      const phase = ((t * ring.speed + ring.offset) % (Math.PI * 2)) / (Math.PI * 2);
      const scale = 1 + phase * 6;
      child.scale.set(scale, scale, 1);
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.06 * (1 - phase));
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -4]} rotation={[Math.PI / 2, 0, 0]}>
      {rings.map((_, i) => (
        <mesh key={i}>
          <ringGeometry args={[0.95, 1, 64]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Holographic DNA Helix ──────────────────────────────────── */
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const count = 60;
  const meshRef1 = useRef<THREE.InstancedMesh>(null);
  const meshRef2 = useRef<THREE.InstancedMesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const lastIsDark = useRef<boolean | null>(null);

  const dummy1 = useMemo(() => new THREE.Object3D(), []);
  const dummy2 = useMemo(() => new THREE.Object3D(), []);
  const linePositions = useMemo(() => new Float32Array(count * 6), [count]);
  const lineMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color('#8b5cf6'), transparent: true, opacity: 0.08 }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current || !meshRef1.current || !meshRef2.current) return;
    const t = state.clock.elapsedTime;

    // Theme-aware color
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark !== lastIsDark.current) {
      lastIsDark.current = isDark;
      lineMaterial.color.set(getThemeColor('#8b5cf6', isDark));
      if (meshRef1.current.material instanceof THREE.MeshBasicMaterial) {
        meshRef1.current.material.color.set(getThemeColor('#a78bfa', isDark));
      }
      if (meshRef2.current.material instanceof THREE.MeshBasicMaterial) {
        meshRef2.current.material.color.set(getThemeColor('#06b6d4', isDark));
      }
    }

    for (let i = 0; i < count; i++) {
      const frac = i / count;
      const y = (frac - 0.5) * 8;
      const angle = frac * Math.PI * 4 + t * 0.5;
      const radius = 1.5;

      // Strand 1
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      dummy1.position.set(x1, y, z1);
      dummy1.scale.setScalar(0.06 + Math.sin(frac * Math.PI) * 0.03);
      dummy1.updateMatrix();
      meshRef1.current.setMatrixAt(i, dummy1.matrix);

      // Strand 2 (opposite phase)
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      dummy2.position.set(x2, y, z2);
      dummy2.scale.setScalar(0.06 + Math.sin(frac * Math.PI) * 0.03);
      dummy2.updateMatrix();
      meshRef2.current.setMatrixAt(i, dummy2.matrix);

      // Connection lines (every 4th node)
      if (i % 4 === 0) {
        const idx = (i / 4) * 6;
        if (idx + 5 < linePositions.length) {
          // eslint-disable-next-line react-hooks/immutability -- R3F pattern: mutate buffer in useFrame
          linePositions[idx] = x1;
          linePositions[idx + 1] = y;
          linePositions[idx + 2] = z1;
          linePositions[idx + 3] = x2;
          linePositions[idx + 4] = y;
          linePositions[idx + 5] = z2;
        }
      }
    }

    meshRef1.current.instanceMatrix.needsUpdate = true;
    meshRef2.current.instanceMatrix.needsUpdate = true;

    // Update lines
    if (lineRef.current) {
      const geo = lineRef.current.geometry;
      geo.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0, (count / 4) * 6), 3));
      geo.setDrawRange(0, (count / 4) * 2);
    }

    // Slow rotation of entire helix
    groupRef.current.rotation.y = t * 0.05;
  });

  return (
    <group ref={groupRef} position={[-8, 0, -6]}>
      <instancedMesh ref={meshRef1} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.4} />
      </instancedMesh>
      <instancedMesh ref={meshRef2} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
      </instancedMesh>
      <lineSegments ref={lineRef} material={lineMaterial} frustumCulled={false}>
        <bufferGeometry />
      </lineSegments>
    </group>
  );
}

/* ─── Data Stream Particles (spiral flow) ────────────────────── */
function DataStreamParticles() {
  const count = 100;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lastIsDark = useRef<boolean | null>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        phase: (i / count) * Math.PI * 2,
        radiusOffset: Math.random() * 0.8,
        speed: 0.2 + Math.random() * 0.25,
        verticalOffset: (Math.random() - 0.5) * 5,
        verticalSpeed: 0.3 + Math.random() * 0.4,
        sizeScale: 0.6 + Math.random() * 0.8,
      })),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Theme-aware color
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark !== lastIsDark.current) {
      lastIsDark.current = isDark;
      if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
        meshRef.current.material.color.set(isDark ? '#06b6d4' : '#f0abfc');
        meshRef.current.material.opacity = isDark ? 0.6 : 0.45;
      }
    }

    particles.forEach((p, i) => {
      // Spiral motion around center
      const angle = p.phase + t * p.speed;
      const baseRadius = 0.6 + (i / count) * 1.8 + p.radiusOffset * 0.3;
      const radiusWobble = Math.sin(t * 0.8 + p.phase * 2) * 0.15;
      const radius = baseRadius + radiusWobble;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = p.verticalOffset + Math.sin(t * p.verticalSpeed + p.phase) * 0.6;

      dummy.position.set(x, y, z - 1.5);

      // Pulsing scale for a "breathing data" feel
      const pulse = 0.7 + Math.sin(t * 3 + p.phase) * 0.3;
      dummy.scale.setScalar(p.sizeScale * pulse);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.015, 6, 6]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
    </instancedMesh>
  );
}

/* ─── Theme updater for fog and global state ─────────────────── */
function ThemeUpdater() {
  const { scene } = useThree();
  const lastIsDark = useRef<boolean | null>(null);

  useFrame(() => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark === lastIsDark.current) return;
    lastIsDark.current = isDark;

    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.set(isDark ? '#0a0a0f' : '#fafaf9');
    }
  });

  return null;
}

/* ─── Main Scene ────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <CameraRig />
      <ThemeUpdater />

      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <LightOrbs />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0005, 0.0005)}
        />
        <Vignette eskil={false} offset={0.5} darkness={0.3} />
      </EffectComposer>

      {/* Stars background */}
      <Stars
        radius={60}
        depth={60}
        count={3000}
        factor={5}
        saturation={0.3}
        fade
        speed={0.3}
      />

      {/* Premium morphing center sphere */}
      <MorphingSphere />

      {/* Wobbling ring */}
      <WobblingRing />

      {/* Energy waves */}
      <EnergyWaves />

      {/* Holographic DNA Helix */}
      <DNAHelix />

      {/* Data stream spiral particles */}
      <DataStreamParticles />

      {/* Floating geometry */}
      <FloatingShape
        position={[-5, 2, -3]}
        geometry="icosahedron"
        color="#8b5cf6"
        speed={0.8}
        rotationSpeed={0.2}
        scale={0.7}
      />
      <FloatingShape
        position={[5.5, -1.5, -4]}
        geometry="octahedron"
        color="#06b6d4"
        speed={1}
        rotationSpeed={0.25}
        scale={0.6}
      />
      <FloatingShape
        position={[-3.5, -2.5, -5]}
        geometry="torus"
        color="#a855f7"
        speed={0.6}
        rotationSpeed={0.15}
        scale={0.5}
      />
      <FloatingShape
        position={[4, 3, -6]}
        geometry="dodecahedron"
        color="#3b82f6"
        speed={0.7}
        rotationSpeed={0.18}
        scale={0.4}
      />
      <FloatingShape
        position={[0, -3.5, -3]}
        geometry="torusKnot"
        color="#ec4899"
        speed={0.5}
        rotationSpeed={0.12}
        scale={0.35}
      />
      <FloatingShape
        position={[-6, 0, -7]}
        geometry="dodecahedron"
        color="#06b6d4"
        speed={0.4}
        rotationSpeed={0.1}
        scale={0.3}
      />
      <FloatingShape
        position={[6, 1, -8]}
        geometry="icosahedron"
        color="#8b5cf6"
        speed={0.3}
        rotationSpeed={0.08}
        scale={0.25}
      />

      {/* Constellation particles with lines */}
      <ConstellationField />

      {/* Grid */}
      <GridFloor />

      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0a0f', 10, 30]} />
    </>
  );
}

/* ─── Exported Canvas wrapper ───────────────────────────────── */
function Scene3DInner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard hydration guard
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
        eventSource={undefined}
        eventPrefix={undefined}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

const Scene3D = memo(Scene3DInner);
export default Scene3D;