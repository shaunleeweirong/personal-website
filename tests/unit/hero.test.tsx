import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";

describe("Hero", () => {
  it("renders the one h1 with the one-liner", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain("I grow revenue");
    expect(h1.textContent).toContain("and build what scales it.");
  });
  it("renders both badges and both CTAs", () => {
    render(<Hero />);
    expect(screen.getByText("Now — Lead CSM @ LinkedIn")).toBeDefined();
    expect(screen.getByText("Exited Founder")).toBeDefined();
    expect(screen.getByRole("link", { name: /contact me/i })).toBeDefined();
    expect(screen.getByRole("link", { name: /connect on linkedin/i })).toBeDefined();
  });
});

describe("StatsBand", () => {
  it("renders all four stat labels", () => {
    render(<StatsBand />);
    for (const label of ["YEARS IN REVENUE", "TECH GIANTS", "PRODUCTS SHIPPED", "MONTHLY USERS AT PEAK"]) {
      expect(screen.getByText(label)).toBeDefined();
    }
  });
});
