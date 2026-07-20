"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { hero } from "@/lib/content";

const SPRING = { stiffness: 180, damping: 18, mass: 0.4 };

/**
 * The hero portrait as a tilting pane of glass: it leans toward the cursor,
 * squares up and lifts on hover, and catches a moving specular highlight.
 * Falls back to a still card under reduced-motion or touch.
 */
export function HeroPhoto() {
  const reduced = useReducedMotion();

  // cursor position within the card, normalized to [-0.5, 0.5]
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), SPRING);
  const rotateZ = useSpring(1.5, SPRING); // jaunty at rest, squares up on hover
  const lift = useSpring(0, SPRING); // translateY on hover
  const glow = useSpring(0, SPRING); // sheen strength, 0 → 1

  // specular highlight tracks the cursor across the glass
  const sheenX = useTransform(px, [-0.5, 0.5], [30, 70]);
  const sheenY = useTransform(py, [-0.5, 0.5], [22, 78]);
  const sheen = useMotionTemplate`radial-gradient(120% 120% at ${sheenX}% ${sheenY}%, rgba(196,181,253,0.22), transparent 55%)`;

  function onMove(e: PointerEvent<HTMLElement>) {
    if (reduced || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onEnter(e: PointerEvent<HTMLElement>) {
    if (reduced || e.pointerType === "touch") return;
    rotateZ.set(0);
    lift.set(-6);
    glow.set(1);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
    rotateZ.set(1.5);
    lift.set(0);
    glow.set(0);
  }

  const interactive = !reduced;

  return (
    <div style={{ perspective: 900 }}>
      <motion.figure
        onPointerMove={interactive ? onMove : undefined}
        onPointerEnter={interactive ? onEnter : undefined}
        onPointerLeave={interactive ? onLeave : undefined}
        style={interactive ? { rotateX, rotateY, rotateZ, y: lift } : { rotate: 1.5 }}
        className="group relative overflow-hidden rounded-2xl border border-[#a78bfa]/35 shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_40px_rgba(124,58,237,0.25)] transition-[box-shadow,border-color] duration-300 hover:border-[#a78bfa]/60 hover:shadow-[0_28px_80px_rgba(0,0,0,0.6),0_0_64px_rgba(124,58,237,0.45)]"
      >
        <Image
          src="/profile.jpg"
          alt={hero.photoAlt}
          width={720}
          height={960}
          priority
          sizes="(max-width: 1024px) 300px, 340px"
          className="aspect-[3/4] w-full object-cover object-[center_20%]"
        />
        {interactive && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: sheen, opacity: glow }}
          />
        )}
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#05060f]/90 to-transparent px-4 pb-3 pt-8 text-[10px] tracking-[0.12em] text-[#c4b5fd]">
          {hero.photoCaption}
        </figcaption>
      </motion.figure>
    </div>
  );
}
