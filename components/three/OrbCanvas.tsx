"use client";
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

function Orb() {
  const mesh = useRef<Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = t * 0.15 + window.scrollY * 0.0005 + pointer.current.y * 0.2;
    mesh.current.rotation.y = t * 0.2 + pointer.current.x * 0.3;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, 24]} />
      <MeshDistortMaterial color="#7c3aed" emissive="#2e1065" roughness={0.15} metalness={0.6} distort={0.35} speed={1.6} />
    </mesh>
  );
}

export default function OrbCanvas() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} aria-hidden className="absolute -right-8 -top-12 h-40 w-40">
      <Canvas dpr={[1, 1.5]} frameloop={visible ? "always" : "never"} camera={{ position: [0, 0, 3] }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 2, 4]} intensity={12} color="#22d3ee" />
        <pointLight position={[-3, -2, 2]} intensity={10} color="#a78bfa" />
        <Orb />
      </Canvas>
    </div>
  );
}
