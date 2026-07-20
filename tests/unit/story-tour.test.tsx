import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Story } from "@/components/sections/Story";
import { TourOfDuty } from "@/components/sections/TourOfDuty";

describe("Story", () => {
  it("renders the three archetype cards", () => {
    render(<Story />);
    for (const label of ["PRODUCTS", "BUSINESSES", "TEAMS"]) {
      expect(screen.getByText(label)).toBeDefined();
    }
  });
  it("never leaks the exited company name", () => {
    const { container } = render(<Story />);
    expect(container.textContent!.toLowerCase()).not.toContain("theb2bhouse");
  });
});

describe("TourOfDuty", () => {
  it("renders the current-role card and 4 timeline entries", () => {
    render(<TourOfDuty />);
    expect(screen.getByText(/Lead Client Solutions Manager/)).toBeDefined();
    for (const co of ["ByteDance", "Amazon", "Media Co-Founder"]) {
      expect(screen.getByText(co)).toBeDefined();
    }
  });
});
