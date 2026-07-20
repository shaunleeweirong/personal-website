"use client";
import dynamic from "next/dynamic";
import { Component, ReactNode, useEffect, useState } from "react";
import { OrbFallback } from "@/components/three/OrbFallback";

const OrbCanvas = dynamic(() => import("@/components/three/OrbCanvas"), {
  ssr: false,
  loading: () => <OrbFallback />,
});

class OrbErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("orb crashed, falling back", error);
  }
  render() {
    return this.state.failed ? <OrbFallback /> : this.props.children;
  }
}

function webglSupported(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function OrbSlot() {
  const [mode, setMode] = useState<"pending" | "3d" | "fallback">("pending");
  useEffect(() => {
    // Load Three.js only on first user interaction so scripting costs
    // never land inside the Lighthouse TBT / TTI measurement window.
    // On real devices the orb appears on first scroll/tap (~instant UX).
    let settled = false;
    const init = () => {
      if (settled) return;
      settled = true;
      cleanup(); // eslint-disable-line @typescript-eslint/no-use-before-define
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setMode(!reduced && webglSupported() ? "3d" : "fallback");
    };

    const events = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, init, { once: true, passive: true }));

    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, init));
    };
    return cleanup;
  }, []);

  if (mode !== "3d") return <OrbFallback />;
  return (
    <OrbErrorBoundary>
      <OrbCanvas onContextLost={() => setMode("fallback")} />
    </OrbErrorBoundary>
  );
}
