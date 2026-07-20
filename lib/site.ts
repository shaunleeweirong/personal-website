// Canonical site URL — single source of truth for metadata, sitemap, robots.
// Override at deploy by setting NEXT_PUBLIC_SITE_URL (e.g. a custom domain).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://personal-branding-website-sigma.vercel.app";
