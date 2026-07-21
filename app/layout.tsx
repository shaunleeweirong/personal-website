import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Shaun Lee Wei Rong — I grow revenue and build what scales it",
  description:
    "I grow revenue and build the products that scale it. 12+ years driving revenue inside LinkedIn, Amazon and ByteDance. Exited founder. 20+ products shipped.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Shaun Lee Wei Rong",
              jobTitle: "Lead Client Solutions Manager",
              worksFor: { "@type": "Organization", name: "LinkedIn" },
              sameAs: ["https://www.linkedin.com/in/shaunleeweirong"],
              description: "Revenue operator and builder. Grows businesses and ships products. Exited founder.",
            }),
          }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
