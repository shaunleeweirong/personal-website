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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(!reduced && webglSupported() ? "3d" : "fallback");
  }, []);

  if (mode !== "3d") return <OrbFallback />;
  return (
    <OrbErrorBoundary>
      <OrbCanvas />
    </OrbErrorBoundary>
  );
}
