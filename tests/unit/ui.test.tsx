import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { Badge } from "@/components/ui/Badge";
import { SectionLabel } from "@/components/ui/SectionLabel";

describe("ui primitives", () => {
  it("GlassCard renders children", () => {
    render(<GlassCard>hello</GlassCard>);
    expect(screen.getByText("hello")).toBeDefined();
  });
  it("GradientText applies gradient class", () => {
    render(<GradientText>shine</GradientText>);
    expect(screen.getByText("shine").className).toContain("text-gradient");
  });
  it("Badge renders tone variants", () => {
    render(<Badge tone="cyan">Now — Lead CSM @ LinkedIn</Badge>);
    expect(screen.getByText("Now — Lead CSM @ LinkedIn")).toBeDefined();
  });
  it("SectionLabel renders uppercase eyebrow", () => {
    render(<SectionLabel>01 — THE STORY</SectionLabel>);
    expect(screen.getByText("01 — THE STORY")).toBeDefined();
  });
});
