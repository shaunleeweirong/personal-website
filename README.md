# Shaun Lee Wei Rong — Personal Site

Personal branding site — builder of products, businesses, and teams.

A mobile-first, single-page site with a dark, futuristic aesthetic: a real-time 3D hero,
scroll-triggered reveals, and buttery smooth scrolling — engineered to stay fast and
accessible (Lighthouse mobile 93–95 perf / 96 a11y / 100 best-practices / 100 SEO).

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **React Three Fiber** — hero 3D orb (lazy-loaded, quarantined, with reduced-motion / no-WebGL fallbacks)
- **Motion** + **Lenis** — animation and smooth scroll
- **Resend** — contact form delivery (server action, env-gated)
- Tested with **Vitest** (unit) and **Playwright** (e2e), deployed on **Vercel**

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm test           # unit tests (Vitest)
npm run test:e2e   # end-to-end (Playwright)
```

## Structure

- `app/` — routes, layout, SEO (sitemap, robots, OG image, JSON-LD), contact server action
- `components/sections/` — page sections (Hero, Story, Tour of Duty, Builds, Writing, Contact)
- `components/three/` — isolated 3D (the only place that imports Three.js)
- `components/ui/` — shared primitives (glass cards, reveals, count-up, tilt)
- `lib/content.ts` — all site copy, in one place

## Configuration

Copy `.env.example` to `.env.local` and fill in to enable the contact form:

```
RESEND_API_KEY=      # from resend.com
CONTACT_TO_EMAIL=    # where contact submissions are delivered
```

Without these, the contact section shows a "Connect on LinkedIn" fallback.
