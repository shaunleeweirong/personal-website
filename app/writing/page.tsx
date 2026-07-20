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
