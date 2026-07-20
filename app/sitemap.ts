import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), priority: 1 },
    { url: `${BASE}/writing`, lastModified: new Date(), priority: 0.6 },
  ];
}
