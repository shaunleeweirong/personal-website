import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Builds } from "@/components/sections/Builds";
import { Writing } from "@/components/sections/Writing";
import { Footer } from "@/components/sections/Footer";

describe("Builds", () => {
  it("renders the featured build with both badges", () => {
    render(<Builds />);
    expect(screen.getByText("Insight Tag Tracker")).toBeDefined();
    expect(screen.getByText("SOLD WITH THE COMPANY")).toBeDefined();
    expect(screen.getByText("20K+ marketers / month")).toBeDefined();
  });
  it("renders the 4 grid builds and the more line", () => {
    render(<Builds />);
    for (const name of ["FullShot", "Options Trading Platform", "Guidely", "GymTab"]) {
      expect(screen.getByText(name)).toBeDefined();
    }
    expect(screen.getByText("+ 15 more builds →")).toBeDefined();
  });
});

describe("Writing", () => {
  it("renders three coming-soon cards", () => {
    render(<Writing />);
    expect(screen.getAllByText("COMING SOON")).toHaveLength(3);
  });
});

describe("Footer", () => {
  it("renders copyright and tagline", () => {
    render(<Footer />);
    expect(screen.getByText("© 2026 Shaun Lee Wei Rong")).toBeDefined();
    expect(screen.getByText("Built by hand, like everything else here.")).toBeDefined();
  });
});
