import { describe, it, expect } from "vitest";
import * as content from "@/lib/content";

const allText = JSON.stringify(content);

describe("content invariants (spec §2 privacy + narrative rules)", () => {
  it("never names the exited company", () => {
    expect(allText.toLowerCase()).not.toContain("theb2bhouse");
  });
  it("contains no phone number or raw email", () => {
    expect(allText).not.toMatch(/\+65\s?\d{4}\s?\d{4}/);
    expect(allText).not.toMatch(/[\w.+-]+@[\w-]+\.\w+/);
  });
  it("hero one-liner is exact", () => {
    expect(content.hero.headline).toBe("I grow revenue —");
    expect(content.hero.headlineGradient).toBe("and build what scales it.");
  });
  it("has 4 stats and 5 featured builds (1 hero + 4 grid)", () => {
    expect(content.stats).toHaveLength(4);
    expect(content.builds.featured.name).toBe("Insight Tag Tracker");
    expect(content.builds.grid).toHaveLength(4);
  });
});
