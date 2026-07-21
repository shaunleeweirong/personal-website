import { test, expect } from "@playwright/test";

test("home renders all sections with expected copy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("I grow revenue");
  await expect(page.getByText("01 — THE STORY")).toBeVisible();
  await expect(page.getByText("02 — THE TOUR OF DUTY")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Insight Tag Tracker" })).toBeVisible();
  await expect(page.getByText("04 — THE NOTES")).toBeVisible();
  await expect(page.getByText("05 — SAY HELLO")).toBeVisible();
  await expect(page.getByText("Built by hand, like everything else here.")).toBeVisible();
});

test("privacy invariants hold on the rendered page", async ({ page }) => {
  await page.goto("/");
  const html = await page.content();
  expect(html.toLowerCase()).not.toContain("theb2bhouse");
  expect(html).not.toMatch(/\+65\s?\d{4}\s?\d{4}/);
});

test("contact area offers LinkedIn (form is env-gated off in dev)", async ({ page }) => {
  await page.goto("/#contact");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator("#contact").getByRole("link", { name: /connect on linkedin/i })).toBeVisible();
});

test("/writing renders coming-soon, not 404", async ({ page }) => {
  const res = await page.goto("/writing");
  expect(res!.status()).toBe(200);
  await expect(page.getByText("COMING SOON").first()).toBeVisible();
});

test("h1 count is exactly one", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
});

test("reduced motion never mounts the 3D canvas", async ({ page }) => {
  test.skip(test.info().project.name !== "reduced-motion", "reduced-motion project only");
  await page.goto("/");
  await page.mouse.move(200, 200);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(500);
  await expect(page.locator("canvas")).toHaveCount(0);
});
