export const site = {
  name: "Shaun Lee Wei Rong",
  monogram: "SLWR",
  linkedInUrl: "https://www.linkedin.com/in/shaunleeweirong",
  nav: [
    { label: "Story", href: "/#story" },
    { label: "Builds", href: "/#builds" },
    { label: "Writing", href: "/#writing" },
    { label: "Contact", href: "/#contact" },
  ],
  footer: {
    copyright: "© 2026 Shaun Lee Wei Rong",
    tagline: "Built by hand, like everything else here.",
  },
} as const;

export const hero = {
  eyebrow: "SHAUN LEE WEI RONG",
  badges: ["Now — Lead CSM @ LinkedIn", "Exited Founder"],
  headline: "I grow revenue —",
  headlineGradient: "and build what scales it.",
  subline:
    "12+ years driving revenue inside LinkedIn, Amazon and ByteDance. Sold my media company. Shipped 20+ products on the side — one reached 20,000 marketers a month.",
  ctaPrimary: "Contact Me",
  ctaSecondary: "Connect on LinkedIn",
  photoAlt: "Shaun Lee Wei Rong",
  photoCaption: "BUILDER · OPERATOR · OWNER",
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
  headline: "Grows revenue. Builds product.",
  headlineGradient: "Thinks like an owner.",
  intro:
    "I do three things well: grow revenue and businesses, build and ship products, and lead the teams that scale both. I own the result end to end.",
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
    "Growing revenue like you own the business",
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
