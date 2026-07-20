import type { MetadataRoute } from "next";

const BASE = "https://shaunlee.example.com"; // replaced at deploy (spec §9.1)

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), priority: 1 },
    { url: `${BASE}/writing`, lastModified: new Date(), priority: 0.6 },
  ];
}
