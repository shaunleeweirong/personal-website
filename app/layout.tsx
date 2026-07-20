import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
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
  metadataBase: new URL("https://shaunlee.example.com"),
  title: "Shaun Lee Wei Rong — I build things that work",
  description:
    "Products, businesses, teams. 12+ years driving revenue inside LinkedIn, Amazon and ByteDance. Exited founder. 20+ products shipped.",
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
              alumniOf: ["James Cook University", "City University of New York"],
              sameAs: ["https://www.linkedin.com/in/shaunleeweirong"],
              description: "Builder of products, businesses and teams. Exited founder. 20+ products shipped.",
            }),
          }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
