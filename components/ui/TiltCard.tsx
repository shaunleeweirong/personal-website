"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

export function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      onPointerMove={(e) => {
        if (e.pointerType === "touch" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
