# Personal Branding Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build shaunlee.com — a mobile-first, award-caliber personal branding site for Shaun Lee Wei Rong in the "Pure C — Futuristic Builder" visual direction, per the approved spec at `docs/superpowers/specs/2026-07-20-personal-branding-website-design.md`.

**Architecture:** Static-first Next.js App Router single page assembled from isolated section components that consume a single typed content module (`lib/content.ts`). The only 3D code lives quarantined in `components/three/OrbCanvas.tsx`, lazy-loaded after paint with error/reduced-motion fallbacks. Contact is a zod-validated server action, env-gated to a LinkedIn fallback until a Resend key exists.

**Tech Stack:** Next.js 15 (App Router, TypeScript), Tailwind CSS v4, React Three Fiber + drei, Motion (framer-motion), Lenis, zod, Resend, Vitest + Testing Library, Playwright.

## Global Constraints

- Canvas color `#05060f`; accents purple `#7c3aed`/`#a78bfa`, cyan `#06b6d4`/`#22d3ee` (spec §3).
- Font: Geist via `next/font` (create-next-app default).
- **Copy rules:** all user-facing copy comes verbatim from `lib/content.ts` (Task 2), which is verbatim from spec §4. NEVER render the string "Theb2bhouse", any phone number, or a raw email address anywhere client-visible.
- One `h1` per page; semantic landmarks; visible focus states; body-text contrast ≥ AA on `#05060f` (body gray no darker than `#8890a4`).
- Full `prefers-reduced-motion` path: no orb, no reveals (content visible immediately).
- 3D budget: DPR ≤ 1.5, canvas paused when off-viewport, lazy-loaded (`next/dynamic`, `ssr: false`).
- Targets: Lighthouse mobile ≥ 90 perf, ≥ 95 a11y/best-practices/SEO.
- Node 24 / npm. Commit after every task (messages given per task).

## File Structure

```
app/
  layout.tsx            — fonts, metadata, JSON-LD, <body> shell
  page.tsx              — assembles Nav + sections + Footer
  globals.css           — Tailwind import + design tokens + base styles
  writing/page.tsx      — coming-soon blog index (never 404s)
  actions/contact.ts    — "use server" contact action (zod + honeypot + Resend)
  sitemap.ts / robots.ts
  opengraph-image.tsx   — generated OG card
components/
  three/OrbCanvas.tsx   — ALL R3F/three code; nothing else imports three
  three/OrbFallback.tsx — static gradient stand-in
  Nav.tsx
  SmoothScroll.tsx      — Lenis wrapper (client)
  sections/{Hero,StatsBand,Story,TourOfDuty,Builds,Writing,Contact,Footer}.tsx
  ui/{GlassCard,GradientText,Badge,SectionLabel,Reveal,CountUp,TiltCard}.tsx
lib/
  content.ts            — ALL copy/data (single source of truth)
  motion.ts             — shared variants + useReducedMotionSafe
tests/
  unit/*.test.tsx       — Vitest + Testing Library
  e2e/*.spec.ts         — Playwright
```

---

### Task 1: Scaffold Next.js project with design tokens

**Files:**
- Create: entire Next.js scaffold at repo root (via temp dir — repo root is non-empty)
- Modify: `app/globals.css`, `app/layout.tsx`, `.gitignore`

**Interfaces:**
- Produces: running Next.js 15 + Tailwind v4 app; CSS variables `--background`, `--accent-purple`, `--accent-purple-soft`, `--accent-cyan`, `--accent-cyan-soft`, `--text-body`, `--text-dim`; Geist font active. All later tasks assume these tokens exist.

- [ ] **Step 1: Scaffold in a temp dir and merge into repo root**

`create-next-app` refuses non-empty dirs (we have `docs/`, `.superpowers/`), so:

```bash
cd /Users/shaunlee/Desktop/apps/personal-branding-website
npx --yes create-next-app@latest /tmp/slwr-scaffold --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
rsync -a /tmp/slwr-scaffold/ ./   # overwrites .gitignore with Next's fuller one
rm -rf /tmp/slwr-scaffold
printf '\n.superpowers/\n.env*\n!.env.example\n' >> .gitignore
```

- [ ] **Step 2: Verify the app builds and runs**

```bash
npm run build
```
Expected: `✓ Compiled successfully`, static routes for `/`.

- [ ] **Step 3: Replace `app/globals.css` with design tokens**

```css
@import "tailwindcss";

:root {
  --background: #05060f;
  --accent-purple: #7c3aed;
  --accent-purple-soft: #a78bfa;
  --accent-cyan: #06b6d4;
  --accent-cyan-soft: #22d3ee;
  --text-body: #8890a4;
  --text-dim: #667;
}

@theme inline {
  --color-canvas: var(--background);
  --color-purple-soft: var(--accent-purple-soft);
  --color-cyan-soft: var(--accent-cyan-soft);
  --color-body: var(--text-body);
  --color-dim: var(--text-dim);
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--background);
  color: #fff;
  -webkit-font-smoothing: antialiased;
}

/* fine grid overlay applied per-section via .bg-grid */
.bg-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 40px 40px;
}

.text-gradient {
  background: linear-gradient(90deg, var(--accent-purple-soft), var(--accent-cyan-soft));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 4: Set base metadata in `app/layout.tsx`**

Keep the scaffold's Geist setup; replace the metadata export and body classes:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://shaunlee.example.com"), // replaced at deploy (spec §9.1)
  title: "Shaun Lee Wei Rong — I build things that work",
  description:
    "Products, businesses, teams. 12+ years driving revenue inside LinkedIn, Amazon and ByteDance. Exited founder. 20+ products shipped.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Replace scaffold `app/page.tsx` with a minimal placeholder**

```tsx
export default function Home() {
  return <main className="min-h-screen" />;
}
```

- [ ] **Step 6: Build again to verify tokens compile**

```bash
npm run build
```
Expected: `✓ Compiled successfully`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 + Tailwind v4 with Pure C design tokens"
```

### Task 2: Content model (`lib/content.ts`) + Vitest setup

**Files:**
- Create: `lib/content.ts`, `vitest.config.ts`, `tests/unit/content.test.ts`
- Modify: `package.json` (test scripts)

**Interfaces:**
- Produces: named exports `site`, `hero`, `stats`, `story`, `tour`, `builds`, `writing`, `contact` — exact shapes shown below. Every section component (Tasks 4–6) imports from `@/lib/content`; copy changes never touch layout code.

- [ ] **Step 1: Install Vitest + Testing Library**

```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", include: ["tests/unit/**/*.test.{ts,tsx}"] },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

Add to `package.json` scripts: `"test": "vitest run", "test:watch": "vitest"`.

- [ ] **Step 3: Write the failing invariant test `tests/unit/content.test.ts`**

```ts
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
    expect(content.hero.headline).toBe("I build things that work —");
    expect(content.hero.headlineGradient).toBe("products, businesses, teams.");
  });
  it("has 4 stats and 5 featured builds (1 hero + 4 grid)", () => {
    expect(content.stats).toHaveLength(4);
    expect(content.builds.featured.name).toBe("Insight Tag Tracker");
    expect(content.builds.grid).toHaveLength(4);
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run`
Expected: FAIL — `Cannot find module '@/lib/content'`.

- [ ] **Step 5: Create `lib/content.ts` (copy verbatim from spec §4)**

```ts
export const site = {
  name: "Shaun Lee Wei Rong",
  monogram: "SLWR",
  linkedInUrl: "https://www.linkedin.com/in/shaunleeweirong",
  nav: [
    { label: "Story", href: "#story" },
    { label: "Builds", href: "#builds" },
    { label: "Writing", href: "#writing" },
    { label: "Contact", href: "#contact" },
  ],
  footer: {
    copyright: "© 2026 Shaun Lee Wei Rong",
    tagline: "Built by hand, like everything else here.",
  },
} as const;

export const hero = {
  eyebrow: "SHAUN LEE WEI RONG",
  badges: ["Now — Lead CSM @ LinkedIn", "Exited Founder"],
  headline: "I build things that work —",
  headlineGradient: "products, businesses, teams.",
  subline:
    "12+ years driving revenue inside LinkedIn, Amazon and ByteDance. Sold my media company. Shipped 20+ products on the side — one reached 20,000 marketers a month.",
  ctaPrimary: "Contact Me",
  ctaSecondary: "Connect on LinkedIn",
  photoAlt: "Shaun Lee Wei Rong",
  photoCaption: "BUILDER · OPERATOR · PSYCHOLOGY NERD",
} as const;

export const stats = [
  { value: 12, suffix: "+", label: "YEARS IN REVENUE" },
  { value: 3, suffix: "", label: "TECH GIANTS" },
  { value: 20, suffix: "+", label: "PRODUCTS SHIPPED" },
  { value: 20, suffix: "K+", label: "MONTHLY USERS AT PEAK", gradient: true },
] as const;

export const story = {
  id: "story",
  label: "01 — THE STORY",
  headline: "Trained in psychology. Fluent in revenue.",
  headlineGradient: "Compulsive about shipping.",
  intro:
    "Everything I do starts with the same question: what makes people act? I've answered it three ways — by building products, growing businesses, and leading teams.",
  cards: [
    {
      label: "PRODUCTS",
      accent: "purple",
      body: "20+ shipped nights and weekends. Insight Tag Tracker reached 20,000+ marketers a month across 100+ countries — and sold alongside my company.",
    },
    {
      label: "BUSINESSES",
      accent: "cyan",
      body: "Co-founded a B2B marketing media company — 5.7M impressions and 11k monthly readers with zero ad spend. Exited.",
    },
    {
      label: "TEAMS",
      accent: "purple",
      body: "Coached 8 client solutions managers at LinkedIn, 3 strategists at Amazon, sales reps at ByteDance — while beating my own quota: 120%, 130%, 101%.",
    },
  ],
} as const;

export const tour = {
  id: "tour",
  label: "02 — THE TOUR OF DUTY",
  now: {
    kicker: "● CURRENTLY",
    role: "Lead Client Solutions Manager — LinkedIn Marketing Solutions",
    since: "since 2024",
    detail: "Growing Singapore's top advertisers with campaign strategy that proves ROI.",
    company: "LinkedIn",
  },
  timeline: [
    { years: "2023–24", company: "ByteDance", detail: "Digital Marketing Lead — $1.27M pipeline vs $1M goal" },
    { years: "2022–23", company: "Amazon", detail: "APAC Digital Lead — +42% qualified leads YoY" },
    { years: "2019–23", company: "LinkedIn", detail: "Account Director — 120–130% quota" },
    { years: "2016–19", company: "Media Co-Founder", detail: "B2B marketing media company — built & sold" },
  ],
} as const;

export const builds = {
  id: "builds",
  label: "03 — THE BUILDS",
  headline: "Built after hours.",
  headlineGradient: "Used worldwide.",
  intro: "Every product started as my own problem — then turned out to be everyone else's too.",
  featured: {
    name: "Insight Tag Tracker",
    badges: ["SOLD WITH THE COMPANY", "20K+ marketers / month"],
    body: "The LinkedIn Insight Tag validator marketers in 100+ countries relied on monthly — built solo, grown organically, exited with the company.",
  },
  grid: [
    { name: "FullShot", body: "Chrome extension for scrolling capture, annotation & editing — right in the browser." },
    { name: "Options Trading Platform", body: "My own trading engine — strategy, signals and discipline, compounding real profits." },
    { name: "Guidely", body: "Step-by-step guide, SOP & screenshot maker for teams that document as they work." },
    { name: "GymTab", body: "Strength-training tracker and guide that lives where you already are." },
  ],
  more: "+ 15 more builds →",
} as const;

export const writing = {
  id: "writing",
  label: "04 — THE NOTES",
  headline: "Field notes on building, selling & shipping.",
  sub: "Essays launching soon — the early versions go out on LinkedIn first.",
  comingSoon: [
    "What selling for LinkedIn taught me about building products",
    "How I ship a product a month with a full-time big-tech job",
    "Psychology of the buying brain — from my degree to my quota",
  ],
} as const;

export const contact = {
  id: "contact",
  label: "05 — SAY HELLO",
  headline: "Let's build something",
  headlineGradient: "worth talking about.",
  sub: "Open to conversations about products, growth and everything between.",
  ctaPrimary: "Contact Me",
  ctaSecondary: "Connect on LinkedIn",
} as const;
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run`
Expected: PASS (4 tests).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: typed content model with privacy/narrative invariant tests"
```

---

### Task 3: UI primitives + motion library

**Files:**
- Create: `lib/motion.ts`, `components/ui/GlassCard.tsx`, `components/ui/GradientText.tsx`, `components/ui/Badge.tsx`, `components/ui/SectionLabel.tsx`, `components/ui/Reveal.tsx`, `components/ui/CountUp.tsx`, `components/ui/TiltCard.tsx`, `tests/unit/ui.test.tsx`

**Interfaces:**
- Consumes: design tokens from Task 1.
- Produces (exact props):
  - `GlassCard({ children, className?, dashed? })` — glass panel div
  - `GradientText({ children, className? })` — purple→cyan gradient span
  - `Badge({ children, tone })` — `tone: "purple" | "cyan"` pill
  - `SectionLabel({ children, id? })` — cyan uppercase eyebrow
  - `Reveal({ children, delay?, className? })` — client; rise-and-fade on viewport entry; no-op under reduced motion
  - `CountUp({ value, suffix, className? })` — client; counts up on entry; renders final value immediately under reduced motion
  - `TiltCard({ children, className? })` — client; pointer tilt; inert under reduced motion / touch
  - `lib/motion.ts` exports `fadeUp` variants and `STAGGER = 0.08`

- [ ] **Step 1: Install Motion**

```bash
npm i motion
```

- [ ] **Step 2: Write failing render tests `tests/unit/ui.test.tsx`**

```tsx
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
```

Run: `npx vitest run` → Expected: FAIL (modules missing).

- [ ] **Step 3: Implement the four static primitives**

`components/ui/GlassCard.tsx`:
```tsx
export function GlassCard({
  children,
  className = "",
  dashed = false,
}: {
  children: React.ReactNode;
  className?: string;
  dashed?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        dashed
          ? "border-dashed border-white/15 bg-white/[0.02]"
          : "border-white/[0.07] bg-white/[0.03]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

`components/ui/GradientText.tsx`:
```tsx
export function GradientText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`text-gradient ${className}`}>{children}</span>;
}
```

`components/ui/Badge.tsx`:
```tsx
const tones = {
  purple: "border-[#a78bfa]/40 bg-[#7c3aed]/10 text-[#c4b5fd]",
  cyan: "border-[#22d3ee]/40 bg-[#06b6d4]/10 text-[#67e8f9]",
} as const;

export function Badge({ children, tone }: { children: React.ReactNode; tone: keyof typeof tones }) {
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-[11px] ${tones[tone]}`}>
      {children}
    </span>
  );
}
```

`components/ui/SectionLabel.tsx`:
```tsx
export function SectionLabel({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p id={id} className="mb-3 text-[11px] font-medium tracking-[0.18em] text-[#67e8f9]">
      {children}
    </p>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run` → Expected: PASS.

- [ ] **Step 5: Implement `lib/motion.ts` and the three client primitives**

`lib/motion.ts`:
```ts
export const STAGGER = 0.08;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
} as const;
```

`components/ui/Reveal.tsx`:
```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp } from "@/lib/motion";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
```

`components/ui/CountUp.tsx`:
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export function CountUp({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / 900, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className={className}>
      {reduced ? value : n}
      {suffix}
    </span>
  );
}
```

`components/ui/TiltCard.tsx`:
```tsx
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
```

- [ ] **Step 6: Verify everything still builds and tests pass**

```bash
npm run build && npx vitest run
```
Expected: build ✓, tests PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: ui primitives (glass/gradient/badge/label) + motion system (reveal/countup/tilt)"
```

### Task 4: Hero + StatsBand sections

**Files:**
- Create: `components/sections/Hero.tsx`, `components/sections/StatsBand.tsx`, `public/profile.jpg`, `tests/unit/hero.test.tsx`

**Interfaces:**
- Consumes: `hero`, `stats`, `site` from `@/lib/content`; `Badge`, `GradientText`, `Reveal`, `CountUp` from Task 3.
- Produces: `Hero({ orbSlot }: { orbSlot?: React.ReactNode })` — the `orbSlot` prop is where Task 8 injects `<OrbCanvas />`; until then the hero renders without it. `StatsBand()` no props. Page assembly (Task 7) renders `<Hero orbSlot={...} />` then `<StatsBand />`.

- [ ] **Step 1: Copy the profile photo into `public/`**

```bash
cp "/Users/shaunlee/Downloads/2024-Profile Pic v1.jpeg" public/profile.jpg
```

- [ ] **Step 2: Write failing test `tests/unit/hero.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";

describe("Hero", () => {
  it("renders the one h1 with the one-liner", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain("I build things that work");
    expect(h1.textContent).toContain("products, businesses, teams.");
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
```

Run: `npx vitest run tests/unit/hero.test.tsx` → Expected: FAIL (modules missing).

- [ ] **Step 3: Implement `components/sections/Hero.tsx`**

```tsx
import Image from "next/image";
import { hero, site } from "@/lib/content";
import { Badge } from "@/components/ui/Badge";
import { GradientText } from "@/components/ui/GradientText";
import { Reveal } from "@/components/ui/Reveal";

export function Hero({ orbSlot }: { orbSlot?: React.ReactNode }) {
  return (
    <section className="bg-grid relative overflow-hidden px-6 pb-16 pt-28 sm:px-12 lg:px-20">
      {/* glow fields */}
      <div aria-hidden className="pointer-events-none absolute -top-24 right-16 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.25),transparent_65%)]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-10 h-80 w-96 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.16),transparent_65%)]" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-10 lg:flex-row lg:items-center">
        <div className="flex-[1.4]">
          <Reveal>
            <p className="mb-4 text-xs tracking-[0.18em] text-[#67e8f9]">{hero.eyebrow}</p>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="cyan">{hero.badges[0]}</Badge>
              <Badge tone="purple">{hero.badges[1]}</Badge>
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              {hero.headline}
              <br />
              <GradientText>{hero.headlineGradient}</GradientText>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-body">{hero.subline}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
              >
                {hero.ctaPrimary}
              </a>
              <a
                href={site.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-gray-300 transition-colors hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
              >
                {hero.ctaSecondary} ↗
              </a>
            </div>
          </Reveal>
        </div>

        <div className="relative w-full max-w-[260px] flex-1">
          {orbSlot}
          <Reveal delay={0.15}>
            <figure className="relative rotate-[1.5deg] overflow-hidden rounded-2xl border border-[#a78bfa]/35 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(124,58,237,0.25)]">
              <Image
                src="/profile.jpg"
                alt={hero.photoAlt}
                width={520}
                height={640}
                priority
                className="h-[320px] w-full object-cover object-[center_20%]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#05060f]/90 to-transparent px-4 pb-3 pt-8 text-[10px] tracking-[0.12em] text-[#c4b5fd]">
                {hero.photoCaption}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement `components/sections/StatsBand.tsx`**

```tsx
import { stats } from "@/lib/content";
import { CountUp } from "@/components/ui/CountUp";

export function StatsBand() {
  return (
    <section aria-label="Career statistics" className="border-y border-white/[0.06]">
      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-y-6 px-6 py-7 sm:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`text-center ${i > 0 ? "sm:border-l sm:border-white/[0.06]" : ""}`}>
            <dd className={`text-2xl font-extrabold ${"gradient" in s && s.gradient ? "text-gradient" : "text-white"}`}>
              <CountUp value={s.value} suffix={s.suffix} />
            </dd>
            <dt className="mt-1 text-[10px] tracking-[0.1em] text-dim">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/unit/hero.test.tsx` → Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: hero and stats band sections"
```

---

### Task 5: Story + Tour of Duty sections

**Files:**
- Create: `components/sections/Story.tsx`, `components/sections/TourOfDuty.tsx`, `tests/unit/story-tour.test.tsx`

**Interfaces:**
- Consumes: `story`, `tour` from `@/lib/content`; `GlassCard`, `GradientText`, `SectionLabel`, `Reveal`, `TiltCard` from Task 3.
- Produces: `Story()` and `TourOfDuty()` — no props; sections carry `id="story"` / `id="tour"` for nav anchors.

- [ ] **Step 1: Write failing test `tests/unit/story-tour.test.tsx`**

```tsx
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
```

Run: `npx vitest run tests/unit/story-tour.test.tsx` → Expected: FAIL.

- [ ] **Step 2: Implement `components/sections/Story.tsx`**

```tsx
import { story } from "@/lib/content";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

const accentClass = { purple: "text-[#a78bfa]", cyan: "text-[#22d3ee]" } as const;

export function Story() {
  return (
    <section id={story.id} className="relative overflow-hidden px-6 py-16 sm:px-12 lg:px-20">
      <div aria-hidden className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.12),transparent_65%)]" />
      <div className="relative mx-auto max-w-5xl">
        <Reveal>
          <SectionLabel>{story.label}</SectionLabel>
          <h2 className="max-w-xl text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
            {story.headline} <GradientText>{story.headlineGradient}</GradientText>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-body">{story.intro}</p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {story.cards.map((card, i) => (
            <Reveal key={card.label} delay={i * 0.1}>
              <TiltCard>
                <GlassCard className="h-full">
                  <p className={`mb-2 text-[11px] font-bold tracking-[0.1em] ${accentClass[card.accent]}`}>
                    {card.label}
                  </p>
                  <p className="text-[13px] leading-relaxed text-gray-300">{card.body}</p>
                </GlassCard>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Implement `components/sections/TourOfDuty.tsx`**

```tsx
import { tour } from "@/lib/content";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

export function TourOfDuty() {
  return (
    <section id={tour.id} className="border-t border-white/[0.06] px-6 py-12 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionLabel>{tour.label}</SectionLabel>
          <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-[#22d3ee]/30 bg-gradient-to-br from-[#06b6d4]/10 to-[#7c3aed]/[0.08] p-5">
            <div>
              <p className="mb-1 text-[10px] tracking-[0.14em] text-[#67e8f9]">{tour.now.kicker}</p>
              <h3 className="text-sm font-bold text-white sm:text-base">
                {tour.now.role} <span className="font-normal text-body">({tour.now.since})</span>
              </h3>
              <p className="mt-1 text-xs text-body">{tour.now.detail}</p>
            </div>
            <span className="hidden whitespace-nowrap text-sm font-bold text-gray-500 sm:block">{tour.now.company}</span>
          </div>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tour.timeline.map((t, i) => (
            <Reveal key={t.company + t.years} delay={i * 0.08}>
              <GlassCard className="h-full !p-4">
                <p className="mb-1 text-[9px] tracking-[0.1em] text-dim">{t.years}</p>
                <p className="text-xs font-bold text-gray-300">{t.company}</p>
                <p className="mt-1 text-[11px] leading-snug text-gray-500">{t.detail}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/unit/story-tour.test.tsx` → Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: story and tour-of-duty sections"
```

### Task 6: Builds + Writing + Footer sections

**Files:**
- Create: `components/sections/Builds.tsx`, `components/sections/Writing.tsx`, `components/sections/Footer.tsx`, `tests/unit/builds-writing.test.tsx`

**Interfaces:**
- Consumes: `builds`, `writing`, `site` from `@/lib/content`; primitives from Task 3.
- Produces: `Builds()`, `Writing()`, `Footer()` — no props; `id="builds"` / `id="writing"` anchors.

- [ ] **Step 1: Write failing test `tests/unit/builds-writing.test.tsx`**

```tsx
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
```

Run: `npx vitest run tests/unit/builds-writing.test.tsx` → Expected: FAIL.

- [ ] **Step 2: Implement `components/sections/Builds.tsx`**

```tsx
import { builds } from "@/lib/content";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

export function Builds() {
  return (
    <section id={builds.id} className="relative overflow-hidden border-t border-white/[0.06] px-6 py-16 sm:px-12 lg:px-20">
      <div aria-hidden className="pointer-events-none absolute -right-16 top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.1),transparent_65%)]" />
      <div className="relative mx-auto max-w-5xl">
        <Reveal>
          <SectionLabel>{builds.label}</SectionLabel>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {builds.headline} <GradientText>{builds.headlineGradient}</GradientText>
          </h2>
          <p className="mt-2 max-w-md text-sm text-body">{builds.intro}</p>
        </Reveal>

        <Reveal className="mt-7">
          <div className="relative overflow-hidden rounded-2xl border border-[#a78bfa]/30 bg-gradient-to-br from-[#7c3aed]/[0.14] to-[#06b6d4]/[0.08] p-6">
            <div aria-hidden className="pointer-events-none absolute -right-5 -top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.25),transparent_70%)]" />
            <div className="relative max-w-md">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-3 py-1 text-[10px] font-bold tracking-[0.08em] text-white">
                  {builds.featured.badges[0]}
                </span>
                <span className="rounded-full border border-[#22d3ee]/40 px-3 py-1 text-[10px] text-[#67e8f9]">
                  {builds.featured.badges[1]}
                </span>
              </div>
              <h3 className="mb-1.5 text-xl font-extrabold">{builds.featured.name}</h3>
              <p className="text-[13px] leading-relaxed text-gray-400">{builds.featured.body}</p>
            </div>
          </div>
        </Reveal>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {builds.grid.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.08}>
              <TiltCard>
                <GlassCard className="h-full">
                  <h3 className="mb-1 text-sm font-bold">{b.name}</h3>
                  <p className="text-xs leading-relaxed text-gray-500">{b.body}</p>
                </GlassCard>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-[#a78bfa]">{builds.more}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Implement `components/sections/Writing.tsx`**

```tsx
import { writing } from "@/lib/content";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

export function Writing() {
  return (
    <section id={writing.id} className="border-t border-white/[0.06] px-6 py-16 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionLabel>{writing.label}</SectionLabel>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{writing.headline}</h2>
          <p className="mt-1.5 text-xs text-dim">{writing.sub}</p>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {writing.comingSoon.map((title, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <GlassCard dashed className="h-full">
                <p className="mb-2 text-[9px] tracking-[0.12em] text-dim">COMING SOON</p>
                <p className="text-[13px] font-semibold leading-snug text-gray-400">{title}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement `components/sections/Footer.tsx`**

```tsx
import { site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-1 border-t border-white/[0.06] px-6 py-5 text-[10px] text-gray-600 sm:flex-row sm:px-12 lg:px-20">
      <span>{site.footer.copyright}</span>
      <span>{site.footer.tagline}</span>
    </footer>
  );
}
```

- [ ] **Step 5: Run tests, then commit**

Run: `npx vitest run tests/unit/builds-writing.test.tsx` → Expected: PASS.

```bash
git add -A
git commit -m "feat: builds, writing and footer sections"
```

---

### Task 7: Contact section + server action

**Files:**
- Create: `app/actions/contact.ts`, `components/sections/Contact.tsx`, `tests/unit/contact-action.test.ts`, `.env.example`

**Interfaces:**
- Consumes: `contact`, `site` from `@/lib/content`; `zod`; `resend`.
- Produces: server action `submitContact(prevState: ContactState, formData: FormData): Promise<ContactState>` where `type ContactState = { status: "idle" | "success" | "error"; message: string }` — exported from `app/actions/contact.ts` along with `contactSchema`. `Contact()` section component with `id="contact"`. Env contract: `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (delivery address, never rendered client-side); when either is missing the form area renders the LinkedIn-only fallback (spec §5: never ship a dead form).

- [ ] **Step 1: Install zod + resend, create `.env.example`**

```bash
npm i zod resend
printf 'RESEND_API_KEY=\nCONTACT_TO_EMAIL=\n' > .env.example
```

- [ ] **Step 2: Write failing validation tests `tests/unit/contact-action.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { contactSchema } from "@/app/actions/contact";

describe("contact validation", () => {
  it("accepts a valid submission", () => {
    const r = contactSchema.safeParse({ name: "Ada", email: "ada@example.com", message: "Hello there, Shaun!" });
    expect(r.success).toBe(true);
  });
  it("rejects bad email and short message", () => {
    expect(contactSchema.safeParse({ name: "Ada", email: "nope", message: "Hello there!" }).success).toBe(false);
    expect(contactSchema.safeParse({ name: "Ada", email: "ada@example.com", message: "hi" }).success).toBe(false);
  });
});
```

Run: `npx vitest run tests/unit/contact-action.test.ts` → Expected: FAIL (module missing).

- [ ] **Step 3: Implement `app/actions/contact.ts`**

```ts
"use server";

import { z } from "zod";
import { Resend } from "resend";

export const contactSchema = z.object({
  name: z.string().min(2, "Please tell me your name."),
  email: z.string().email("That email doesn't look right."),
  message: z.string().min(10, "Tell me a little more — at least 10 characters."),
});

export type ContactState = { status: "idle" | "success" | "error"; message: string };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // honeypot: real users never fill this hidden field
  if (formData.get("company")) return { status: "success", message: "Thanks — I'll get back to you soon." };

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    return { status: "error", message: "The form isn't wired up yet — reach me on LinkedIn instead." };
  }

  try {
    const resend = new Resend(key);
    await resend.emails.send({
      from: "Website <onboarding@resend.dev>", // replace with verified domain sender at deploy
      to,
      replyTo: parsed.data.email,
      subject: `Website contact from ${parsed.data.name}`,
      text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
    });
    return { status: "success", message: "Thanks — I'll get back to you soon." };
  } catch (err) {
    console.error("contact delivery failed", err);
    return { status: "error", message: "Something broke on my end — reach me on LinkedIn instead." };
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/unit/contact-action.test.ts` → Expected: PASS.

- [ ] **Step 5: Implement `components/sections/Contact.tsx`**

Form keeps typed content on error (uncontrolled inputs persist across `useActionState` updates; only navigation clears them). `formConfigured` decides form vs. LinkedIn-only fallback at render time on the server.

```tsx
import { contact, site } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GradientText } from "@/components/ui/GradientText";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";

export function Contact() {
  const formConfigured = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
  return (
    <section id={contact.id} className="relative overflow-hidden border-t border-white/[0.06] px-6 py-20 text-center sm:px-12">
      <div aria-hidden className="pointer-events-none absolute -bottom-36 left-1/2 h-72 w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(124,58,237,0.2),transparent_70%)]" />
      <div className="relative mx-auto max-w-xl">
        <Reveal>
          <SectionLabel>{contact.label}</SectionLabel>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {contact.headline}
            <br />
            <GradientText>{contact.headlineGradient}</GradientText>
          </h2>
          <p className="mt-3 text-sm text-body">{contact.sub}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          {formConfigured ? (
            <ContactForm />
          ) : (
            <a
              href={site.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-7 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              {contact.ctaSecondary} ↗
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Implement `components/sections/ContactForm.tsx` (client half)**

Create `components/sections/ContactForm.tsx`:

```tsx
"use client";
import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { contact, site } from "@/lib/content";

const initial: ContactState = { status: "idle", message: "" };
const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-[#22d3ee]/60 focus:outline-none";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.status === "success") {
    return <p role="status" className="text-sm text-[#67e8f9]">{state.message}</p>;
  }

  return (
    <form action={action} className="space-y-3 text-left">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className="block text-xs text-body">
        Name
        <input name="name" required minLength={2} className={`mt-1 ${inputClass}`} placeholder="Your name" />
      </label>
      <label className="block text-xs text-body">
        Email
        <input name="email" type="email" required className={`mt-1 ${inputClass}`} placeholder="you@company.com" />
      </label>
      <label className="block text-xs text-body">
        Message
        <textarea name="message" required minLength={10} rows={4} className={`mt-1 ${inputClass}`} placeholder="What are you building?" />
      </label>
      {state.status === "error" && (
        <p role="alert" className="text-xs text-red-400">
          {state.message}{" "}
          <a href={site.linkedInUrl} className="underline" target="_blank" rel="noopener noreferrer">
            LinkedIn ↗
          </a>
        </p>
      )}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] disabled:opacity-50"
        >
          {pending ? "Sending…" : contact.ctaPrimary}
        </button>
        <a href={site.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 underline-offset-4 hover:underline">
          {contact.ctaSecondary} ↗
        </a>
      </div>
    </form>
  );
}
```

- [ ] **Step 7: Build + full test run, then commit**

```bash
npm run build && npx vitest run
```
Expected: build ✓, all tests PASS.

```bash
git add -A
git commit -m "feat: contact section with env-gated server action (zod + honeypot + resend)"
```

### Task 8: Nav + smooth scroll + page assembly

**Files:**
- Create: `components/Nav.tsx`, `components/SmoothScroll.tsx`
- Modify: `app/page.tsx`, `app/layout.tsx`

**Interfaces:**
- Consumes: `site` from `@/lib/content`; all section components (Tasks 4–7); `lenis` package.
- Produces: the assembled home page. `SmoothScroll({ children })` wraps the page in `app/layout.tsx`. `Nav()` fixed header with anchor links.

- [ ] **Step 1: Install Lenis**

```bash
npm i lenis
```

- [ ] **Step 2: Implement `components/SmoothScroll.tsx`**

```tsx
"use client";
import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.12, anchors: true });
    let raf: number;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}
```

- [ ] **Step 3: Implement `components/Nav.tsx`**

```tsx
import { site } from "@/lib/content";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#05060f]/70 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5 sm:px-12">
        <a href="#top" className="text-xs font-bold tracking-[0.06em] text-white">
          {site.monogram}
        </a>
        <ul className="flex gap-5 sm:gap-8">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-[11px] text-gray-500 transition-colors hover:text-white sm:text-xs">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Assemble `app/page.tsx`**

```tsx
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";
import { Story } from "@/components/sections/Story";
import { TourOfDuty } from "@/components/sections/TourOfDuty";
import { Builds } from "@/components/sections/Builds";
import { Writing } from "@/components/sections/Writing";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div id="top">
      <Nav />
      <main>
        <Hero />
        <StatsBand />
        <Story />
        <TourOfDuty />
        <Builds />
        <Writing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 5: Wrap children with `SmoothScroll` in `app/layout.tsx`**

In the `RootLayout` return, change the body contents to:

```tsx
<body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
  <SmoothScroll>{children}</SmoothScroll>
</body>
```

with import `import { SmoothScroll } from "@/components/SmoothScroll";`.

- [ ] **Step 6: Verify in the browser**

```bash
npm run dev
```
Open http://localhost:3000 — expect: fixed nav, all seven sections in order, smooth anchor scrolling, reveals firing on scroll, count-up stats, tilt on cards. Then `npm run build` → ✓.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: nav, lenis smooth scroll, full page assembly"
```

---

### Task 9: 3D hero orb (R3F) with fallbacks

**Files:**
- Create: `components/three/OrbCanvas.tsx`, `components/three/OrbFallback.tsx`, `components/three/OrbSlot.tsx`
- Modify: `app/page.tsx` (pass `orbSlot` to Hero)

**Interfaces:**
- Consumes: `Hero`'s `orbSlot` prop (Task 4).
- Produces: `OrbSlot()` — the ONLY export other files use; internally lazy-loads `OrbCanvas` (`next/dynamic`, `ssr: false`), renders `OrbFallback` while loading, on error, without WebGL, or under reduced motion. No file outside `components/three/` may import `three`/`@react-three/*`.

- [ ] **Step 1: Install R3F stack**

```bash
npm i three @react-three/fiber @react-three/drei
npm i -D @types/three
```

- [ ] **Step 2: Implement `components/three/OrbFallback.tsx`**

```tsx
export function OrbFallback() {
  return (
    <div
      aria-hidden
      className="absolute -right-4 -top-6 h-28 w-28 rounded-full opacity-90"
      style={{
        background:
          "radial-gradient(circle at 32% 28%, rgba(167,139,250,0.9), rgba(109,40,217,0.55) 45%, rgba(9,9,25,0.9) 78%)",
        boxShadow: "0 0 70px rgba(124,58,237,0.45), inset -12px -14px 40px rgba(6,182,212,0.35)",
      }}
    />
  );
}
```

- [ ] **Step 3: Implement `components/three/OrbCanvas.tsx`**

Distorted icosahedron with drei's `MeshDistortMaterial`; cursor proximity nudges distortion; scroll nudges rotation. DPR capped, canvas paused off-viewport via `frameloop` toggle.

```tsx
"use client";
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

function Orb() {
  const mesh = useRef<Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = t * 0.15 + window.scrollY * 0.0005 + pointer.current.y * 0.2;
    mesh.current.rotation.y = t * 0.2 + pointer.current.x * 0.3;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, 24]} />
      <MeshDistortMaterial color="#7c3aed" emissive="#2e1065" roughness={0.15} metalness={0.6} distort={0.35} speed={1.6} />
    </mesh>
  );
}

export default function OrbCanvas() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} aria-hidden className="absolute -right-8 -top-12 h-40 w-40">
      <Canvas dpr={[1, 1.5]} frameloop={visible ? "always" : "never"} camera={{ position: [0, 0, 3] }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 2, 4]} intensity={12} color="#22d3ee" />
        <pointLight position={[-3, -2, 2]} intensity={10} color="#a78bfa" />
        <Orb />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 4: Implement `components/three/OrbSlot.tsx` (gatekeeper)**

```tsx
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
```

- [ ] **Step 5: Inject into the hero in `app/page.tsx`**

```tsx
import { OrbSlot } from "@/components/three/OrbSlot";
// ...
<Hero orbSlot={<OrbSlot />} />
```

- [ ] **Step 6: Verify quarantine, build, and browser check**

```bash
grep -rl --include="*.tsx" --include="*.ts" -e "from \"three\"" -e "@react-three" app components lib | grep -v "components/three/" ; echo "quarantine check exit: $?"
```
Expected: no files listed (exit 1 from the final grep is success).

```bash
npm run build
```
Expected: ✓. In the browser: orb morphs and reacts to cursor; with DevTools → Rendering → emulate `prefers-reduced-motion` the static gradient renders instead.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: lazy-loaded R3F hero orb with reduced-motion/no-webgl/error fallbacks"
```

---

### Task 10: `/writing` route

**Files:**
- Create: `app/writing/page.tsx`

**Interfaces:**
- Consumes: `Writing`, `Nav`, `Footer` components; `writing` content.
- Produces: shareable `/writing` URL rendering the coming-soon state (spec §4.6: never redirects, never 404s).

- [ ] **Step 1: Implement `app/writing/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Writing } from "@/components/sections/Writing";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Writing — Shaun Lee Wei Rong",
  description: "Field notes on building, selling & shipping. Essays launching soon.",
};

export default function WritingPage() {
  return (
    <div>
      <Nav />
      <main className="pt-16">
        <Writing />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Verify + commit**

`npm run build` → route `/writing` listed as static ✓. Visit http://localhost:3000/writing → coming-soon cards render.

```bash
git add -A
git commit -m "feat: /writing coming-soon route"
```

---

### Task 11: SEO — metadata, OG image, JSON-LD, sitemap

**Files:**
- Create: `app/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/layout.tsx` (JSON-LD Person)

**Interfaces:**
- Consumes: `site`, `hero` content.
- Produces: OG card at `/opengraph-image`, `sitemap.xml`, `robots.txt`, `Person` structured data.

- [ ] **Step 1: Implement `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Shaun Lee Wei Rong — I build things that work";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#05060f",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, color: "#67e8f9", marginBottom: 24 }}>SHAUN LEE WEI RONG</div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>I build things that work —</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            background: "linear-gradient(90deg,#a78bfa,#22d3ee)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          products, businesses, teams.
        </div>
        <div style={{ fontSize: 24, color: "#8890a4", marginTop: 28 }}>
          LinkedIn · Amazon · ByteDance — exited founder, 20+ products shipped
        </div>
      </div>
    ),
    size
  );
}
```

- [ ] **Step 2: Implement `app/sitemap.ts` and `app/robots.ts`**

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE = "https://shaunlee.example.com"; // replaced at deploy (spec §9.1)

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), priority: 1 },
    { url: `${BASE}/writing`, lastModified: new Date(), priority: 0.6 },
  ];
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://shaunlee.example.com/sitemap.xml" };
}
```

- [ ] **Step 3: Add JSON-LD `Person` schema to `app/layout.tsx`**

Inside `<body>`, before `<SmoothScroll>`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Shaun Lee Wei Rong",
      jobTitle: "Lead Client Solutions Manager",
      worksFor: { "@type": "Organization", name: "LinkedIn" },
      alumniOf: ["James Cook University", "City University of New York"],
      sameAs: ["https://www.linkedin.com/in/shaunleeweirong"],
      description: "Builder of products, businesses and teams. Exited founder. 20+ products shipped.",
    }),
  }}
/>
```

- [ ] **Step 4: Verify + commit**

`npm run build` → routes include `/opengraph-image`, `/sitemap.xml`, `/robots.txt` ✓.

```bash
git add -A
git commit -m "feat: og image, sitemap, robots, json-ld person schema"
```

### Task 12: Playwright smoke suite

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/smoke.spec.ts`
- Modify: `package.json` (script `"test:e2e": "playwright test"`)

**Interfaces:**
- Consumes: the running site (Playwright starts the dev server itself via `webServer`).
- Produces: the regression gate from spec §8 — sections render, form/fallback behavior, reduced-motion path, mobile single column.

- [ ] **Step 1: Install Playwright**

```bash
npm i -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: { command: "npm run dev", url: "http://localhost:3000", reuseExistingServer: true },
  use: { baseURL: "http://localhost:3000" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "reduced-motion", use: { ...devices["Desktop Chrome"], contextOptions: { reducedMotion: "reduce" } } },
  ],
});
```

- [ ] **Step 3: Write `tests/e2e/smoke.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test("home renders all sections with expected copy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("I build things that work");
  await expect(page.getByText("01 — THE STORY")).toBeVisible();
  await expect(page.getByText("02 — THE TOUR OF DUTY")).toBeVisible();
  await expect(page.getByText("Insight Tag Tracker")).toBeVisible();
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
  await expect(page.locator("#contact").getByRole("link", { name: /connect on linkedin/i })).toBeVisible();
});

test("/writing renders coming-soon, not 404", async ({ page }) => {
  const res = await page.goto("/writing");
  expect(res!.status()).toBe(200);
  await expect(page.getByText("COMING SOON").first()).toBeVisible();
});

test("h1 count is exactly one", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("h1").count()).toBe(1);
});
```

- [ ] **Step 4: Run the suite**

Run: `npx playwright test`
Expected: all tests PASS across desktop/mobile/reduced-motion projects (reduced-motion project verifies content is fully visible without animation; mobile project verifies nothing overflows enough to hide sections).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: playwright smoke suite (desktop, mobile, reduced-motion)"
```

---

### Task 13: Production readiness — Lighthouse + deploy prep

**Files:**
- Modify: none expected (fixes only if audits fail)

- [ ] **Step 1: Production build + local prod server**

```bash
npm run build && npm run start &
sleep 3
```

- [ ] **Step 2: Lighthouse audit (mobile)**

```bash
npx --yes lighthouse http://localhost:3000 --preset=perf --form-factor=mobile --screenEmulation.mobile --chrome-flags="--headless" --output=json --output-path=/tmp/lh.json
node -e "const r=require('/tmp/lh.json');console.log(Object.entries(r.categories).map(([k,v])=>k+': '+Math.round(v.score*100)).join('\n'))"
```

Expected (spec §6): performance ≥ 90, accessibility ≥ 95, best-practices ≥ 95, seo ≥ 95. If a category misses, fix the flagged audits (typical culprits: image sizing → check `next/image` props; contrast → bump the failing gray one step lighter; unused JS → confirm the orb chunk is lazy) and re-run. Kill the server after: `kill %1`.

- [ ] **Step 3: Real-device manual pass (user assists)**

On iPhone (Safari) and Android (Chrome) via `npm run dev` + LAN IP: orb runs smoothly (or falls back), scroll feel is right, single column layout, tap targets comfortable. Record any jank as follow-up issues.

- [ ] **Step 4: Deploy prep checklist (execute only with user's go-ahead)**

1. `metadataBase` in `app/layout.tsx` + `BASE` in `app/sitemap.ts` + sitemap URL in `app/robots.ts` → real domain (spec §9.1, user to confirm domain).
2. Vercel: create project, set `RESEND_API_KEY` + `CONTACT_TO_EMAIL` env vars (spec §9.2, pending user's Resend account), verify sender domain in Resend, replace `onboarding@resend.dev` sender.
3. Deploy preview → user reviews → promote to production.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: production readiness fixes from lighthouse audit"
```

---

## Deferred (spec §9 — needs user input, no tasks yet)

- Product screenshots for Insight Tag Tracker + build cards (spec §9.3) — drop into `public/builds/` and extend `builds` content objects with `image` fields when available.
- "+15 more builds" target page (spec §9.4) — line ships without a link in v1.
- Real essays replacing coming-soon cards (spec §9.5) — MDX pipeline lands with the first essay (YAGNI now).

## Self-Review (completed)

1. **Spec coverage:** §2 narrative/privacy → Tasks 2, 5, 12 (invariant tests at three layers). §3 visuals/motion → Tasks 1, 3–6, 9. §4 structure/copy → Tasks 2, 4–8, 10. §5 architecture → Tasks 1–2, 7–9 (quarantine check in 9.6). §6 perf/a11y/SEO → Tasks 9, 11, 13. §7 error handling → Tasks 7 (form), 9 (orb boundary), 10 (no-404). §8 testing → Tasks 2–7 (unit), 12 (e2e), 13 (Lighthouse + manual). Gaps: none.
2. **Placeholder scan:** clean — every code step contains complete code; deploy-time substitutions (`shaunlee.example.com`, Resend sender) are explicitly marked and tracked in Task 13.4.
3. **Type consistency:** `ContactState` shape matches between action and form; `OrbSlot`/`orbSlot` prop names align between Tasks 4, 8, 9; content shapes in Task 2 match every consumer's property access (checked field-by-field).





