# Personal Branding Website — Design Spec

**Date:** 2026-07-20
**Owner:** Shaun Lee Wei Rong
**Status:** Approved pending final user review
**Working title:** shaunlee.com (domain TBD)

## 1. Purpose & Goals

- **Primary goal:** Build authority and audience — position Shaun as a voice worth following at the intersection of building products, growing businesses, and leading revenue teams.
- **Secondary goal:** General credibility — a polished destination to point anyone to.
- **Primary CTAs:** "Contact Me" (form) and "Connect on LinkedIn" (LinkedIn is the main channel today).
- **Non-goals (v1):** Selling products, hosting real blog content (stubbed only), newsletter.

Success looks like: a visitor scrolls the full page, comes away thinking *"this person builds things that work,"* and connects on LinkedIn or sends a message.

## 2. Positioning & Narrative

**One-liner (hero):** *"I build things that work — products, businesses, teams."*

**Story frame:** Trained in psychology → 12+ years in sales & marketing (big tech: LinkedIn, Amazon, ByteDance) → exited founder → prolific after-hours builder. Marketing is one arena, **not** the identity. The big-tech *present* (Lead CSM @ LinkedIn since 2024) must be immediately apparent.

**Verified fact inventory** (user-confirmed, publishable):

| Fact | Detail | Notes |
|---|---|---|
| Current role | Lead Client Solutions Manager, LinkedIn Marketing Solutions, since 2024 | Show as "Now" badge in hero + Tour of Duty card |
| Exit | ONE exit: B2B marketing media company sold together with Insight Tag Tracker | **Do NOT name the company** — refer to "my media company" / "a B2B marketing media company" |
| Insight Tag Tracker | 20k+ marketers/month at peak, 100+ countries, built solo, sold with the company | Hero build card, "Sold with the company" badge |
| Big-tech run | ByteDance Digital Marketing Lead 2023–24 · Amazon Digital Marketing Manager (APAC Lead) 2022–23 · LinkedIn Account Director 2021–23 · LinkedIn Sr CSM 2019–21 | Timeline collapses LinkedIn 2019–23 into one entry |
| Numbers (OK to publish) | $1.27M pipeline vs $1M goal (ByteDance) · +42% qualified leads YoY (Amazon) · 120% / 130% / 101% quota (LinkedIn) · 5.7M impressions & 11k monthly readers, zero ad spend (media co) | From resume; user approved public use |
| Teams | Coached 8 CSMs (LinkedIn), 3 strategists (Amazon), sales reps (ByteDance) | "Teams" story card |
| Products | 20+ shipped; featured: Insight Tag Tracker ⭐, FullShot, Options Trading Platform, Guidely, GymTab | "+15 more builds" line conveys volume |
| Education hook | BA Psychology, Grad Dip Organisational Psychology | Story headline: "Trained in psychology. Fluent in revenue. Compulsive about shipping." |

**Privacy rules:** No phone number, no raw email address anywhere on the site (contact form + LinkedIn only). No employer-confidential data beyond the resume numbers listed above. Location not shown in hero.

## 3. Visual Design (approved via mockups)

**Direction: "Pure C — Futuristic Builder"** — chosen over Monochrome Authority (A), Bold Editorial (B), and a C×B hybrid. Mockups preserved in `.superpowers/brainstorm/51261-1784468402/content/` (`fullpage-v2.html` is the approved reference, minus corrections in §2).

- **Canvas:** deep space `#05060f`; fine 40px grid lines at 2.5% white; drifting radial glow fields.
- **Accents:** purple `#7c3aed`/`#a78bfa` + cyan `#06b6d4`/`#22d3ee`; gradient text for emphasis lines; gradient pill for primary CTA.
- **Surfaces:** glass cards — `rgba(255,255,255,0.03)` fill, 7% white 1px border, 12px radius; dashed borders for "coming soon" states.
- **Typography:** Geist (via `next/font`), tight tracking (−0.02 to −0.04em) for headings; small uppercase letterspaced labels (cyan) for section eyebrows ("01 — THE STORY").
- **Photo:** user's 2024 profile photo in hero — rounded glass frame, slight rotation, purple/cyan glow shadow, 3D orb accent overlapping the corner; caption strip "BUILDER · OPERATOR · PSYCHOLOGY NERD".
- **Feel target:** premium AI-era builder — Vercel/Linear restraint with Igloo-flavored depth. Never gimmicky; credibility is the backstop.

### Motion & 3D system (intensity: 1–3 of 5)

| Element | Behavior |
|---|---|
| Hero orb | Real-time 3D shader blob (R3F): slow morph, reacts to cursor proximity and scroll; the single "3D centerpiece" |
| Load | Headline staggers in word-by-word; badges/CTAs fade up |
| Scroll | Sections reveal with soft rise-and-fade; glow fields parallax at different speeds; smooth scroll (Lenis) |
| Stats | Count up on viewport entry |
| Cards (story/builds/timeline) | Subtle 3D tilt toward cursor; border glow on hover |
| Logos/wordmarks | Gray → lit on hover |
| Mobile | Single column; orb simplified (capped DPR, reduced geometry, paused off-viewport); hover effects become scroll-triggered |
| Reduced motion / no WebGL | Static gradient replaces orb; reveals become simple fades or none (`prefers-reduced-motion`) |

## 4. Page Structure & Copy (single page + stub blog route)

Approved copy below; placeholders marked ⟨⟩ are content to drop in during build.

0. **Nav** — "SLWR" monogram; anchors: Story · Builds · Writing · Contact.
1. **Hero** — eyebrow "SHAUN LEE WEI RONG"; badges: "Now — Lead CSM @ LinkedIn" + "Exited Founder"; H1: *"I build things that work — products, businesses, teams."*; subline: "12+ years driving revenue inside LinkedIn, Amazon and ByteDance. Sold my media company. Shipped 20+ products on the side — one reached 20,000 marketers a month."; CTAs: Contact Me (gradient) + Connect on LinkedIn (ghost); photo right.
2. **Stats band** — 12+ YEARS IN REVENUE · 3 TECH GIANTS · 20+ PRODUCTS SHIPPED · 20K+ MONTHLY USERS AT PEAK.
3. **01 — The Story** — H2: "Trained in psychology. Fluent in revenue. Compulsive about shipping."; intro: "Everything I do starts with the same question: what makes people act? I've answered it three ways — by building products, growing businesses, and leading teams."; three glass cards:
   - **PRODUCTS:** "20+ shipped nights and weekends. Insight Tag Tracker reached 20,000+ marketers a month across 100+ countries — and sold alongside my company."
   - **BUSINESSES:** "Co-founded a B2B marketing media company — 5.7M impressions and 11k monthly readers with zero ad spend. Exited."
   - **TEAMS:** "Coached 8 client solutions managers at LinkedIn, 3 strategists at Amazon, sales reps at ByteDance — while beating my own quota: 120%, 130%, 101%."
4. **02 — The Tour of Duty** — "Currently" highlight card: Lead Client Solutions Manager — LinkedIn Marketing Solutions (since 2024), "Growing Singapore's top advertisers with campaign strategy that proves ROI."; timeline cards: ByteDance 2023–24 ($1.27M pipeline vs $1M goal) · Amazon 2022–23 (+42% qualified leads YoY) · LinkedIn 2019–23 (Account Director — 120–130% quota) · 2016–19 Co-Founder, media company (built & sold).
5. **03 — The Builds** — H2: "Built after hours. Used worldwide."; intro: "Every product started as my own problem — then turned out to be everyone else's too."; hero card: **Insight Tag Tracker** (badges: "SOLD WITH THE COMPANY", "20K+ marketers / month") + ⟨product visual⟩; grid: **FullShot** (Chrome extension — scrolling capture, annotate & edit in the browser), **Options Trading Platform** (personal trading engine, compounding real profits), **Guidely** (step-by-step guide, SOP & screenshot maker), **GymTab** (strength-training tracker and guide); closer: "+ 15 more builds →" ⟨links when available⟩.
6. **04 — The Notes** — H2: "Field notes on building, selling & shipping."; sub: "Essays launching soon — the early versions go out on LinkedIn first."; three dashed "COMING SOON" cards with draft titles (placeholders, replaceable): "What selling for LinkedIn taught me about building products" · "How I ship a product a month with a full-time big-tech job" · "Psychology of the buying brain — from my degree to my quota". Blog route (`/writing`) renders its own coming-soon page (same three cards) until real content lands — it never redirects, so the URL is shareable from day one.
7. **05 — Say Hello** — H2: "Let's build something worth talking about."; sub: "Open to conversations about products, growth and everything between."; contact form (name, email, message) + Connect on LinkedIn button.
8. **Footer** — "© 2026 Shaun Lee Wei Rong" · "Built by hand, like everything else here."

## 5. Architecture

**Stack (approach A, user-approved):**

- **Next.js (App Router) + TypeScript**, static-first rendering; deployed on **Vercel**.
- **Tailwind CSS** for styling; design tokens (colors, glows, radii) as CSS variables.
- **React Three Fiber + drei** for the hero orb (custom shader material), in an isolated, lazy-loaded client component.
- **Motion (Framer Motion)** for reveals/stagger/tilt; **Lenis** for smooth scroll.
- **MDX** for the future blog (content directory + `/writing` route, empty-state aware).
- **Contact form:** server action + **Resend** email delivery to shaunleeweirong@gmail.com (pending user's OK; until the API key exists, the form is env-gated to a "connect on LinkedIn" fallback so the site never ships a dead form).

**Component boundaries** (each unit independently understandable/testable):

```
app/
  page.tsx              — assembles section components in order
  writing/page.tsx      — blog index (empty state → section anchor)
  actions/contact.ts    — server action: validate → send → result
components/
  three/OrbCanvas.tsx   — ONLY R3F code; lazy-loaded; props: intensity, paused
  sections/             — Hero, StatsBand, Story, TourOfDuty, Builds, Writing, Contact, Footer
  ui/                   — GlassCard, GradientText, Badge, TiltCard, CountUp, Reveal, SectionLabel
lib/
  content.ts            — ALL copy/data from §4 as typed objects (single source of truth)
  motion.ts             — shared variants, reduced-motion helpers
```

Rule: section components consume `lib/content.ts` and `ui/` primitives only — copy changes never touch layout code; the 3D dependency stays quarantined in `components/three/`.

## 6. Performance, Accessibility, SEO

- **LCP:** hero text + photo are server-rendered; orb loads after hydration (`next/dynamic`, no SSR) and never blocks paint. Target: Lighthouse mobile ≥ 90 perf, ≥ 95 a11y/BP/SEO.
- **Images:** `next/image`, AVIF/WebP, the profile photo pre-sized.
- **Mobile 3D budget:** DPR capped at 1.5, geometry LOD reduced, `IntersectionObserver` pauses the canvas off-screen; battery-friendly by design.
- **Accessibility:** semantic landmarks, one `h1`, visible focus states, form labels + error text, body text contrast ≥ AA on `#05060f`, full `prefers-reduced-motion` path.
- **SEO:** per-page metadata, OG image (dark-canvas card with name + one-liner), JSON-LD `Person` schema (jobTitle, alumniOf, sameAs → LinkedIn), sitemap + robots.

## 7. Error Handling

- **Contact form:** client + server validation (zod), honeypot anti-spam, explicit success/failure states, form never loses typed content on error; delivery failure logs server-side and shows LinkedIn fallback.
- **WebGL unavailable / crash:** error boundary around `OrbCanvas` → static gradient hero background.
- **Blog:** `/writing` with zero posts renders the coming-soon state (never a 404/empty grid).

## 8. Testing

- **Playwright smoke suite:** all sections render with expected copy; form validates and submits (mocked delivery); reduced-motion renders static fallback; mobile viewport renders single column.
- **Lighthouse CI** against the targets in §6.
- **Manual pass:** iOS Safari + Android Chrome (real devices) for 3D perf and scroll feel.

## 9. Open Items (not blockers)

1. **Domain** — user to confirm owned/desired domain; connect on Vercel at deploy.
2. **Resend account/API key** — for live contact delivery (form ships env-gated until then).
3. **Product visuals** — screenshots for Insight Tag Tracker + build cards.
4. **"+15 more builds" list** — names/links to be provided later; line ships without a target page in v1 if absent.
5. **Real essays** — replace coming-soon titles when writing begins.
