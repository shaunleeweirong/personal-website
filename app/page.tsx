import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { OrbSlot } from "@/components/three/OrbSlot";
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
        <Hero orbSlot={<OrbSlot />} />
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
