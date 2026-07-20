import type { ReactNode } from "react";
import Image from "next/image";
import { hero, site } from "@/lib/content";
import { Badge } from "@/components/ui/Badge";
import { GradientText } from "@/components/ui/GradientText";
import { Reveal } from "@/components/ui/Reveal";

export function Hero({ orbSlot }: { orbSlot?: ReactNode }) {
  return (
    <section className="bg-grid relative overflow-hidden px-6 pb-16 pt-28 sm:px-12 lg:px-20">
      {/* glow fields */}
      <div aria-hidden className="pointer-events-none absolute -top-24 right-16 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.25),transparent_65%)]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-10 h-80 w-96 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.16),transparent_65%)]" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-10 lg:flex-row lg:items-center">
        <div className="flex-[1.4]">
          <Reveal>
            <p className="mb-4 text-xs tracking-[0.18em] text-[#67e8f9]">{hero.eyebrow}</p>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="cyan">{hero.badges[0]}</Badge>
              <Badge tone="purple">{hero.badges[1]}</Badge>
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              {hero.headline}
              <br />
              <GradientText>{hero.headlineGradient}</GradientText>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-body">{hero.subline}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
              >
                {hero.ctaPrimary}
              </a>
              <a
                href={site.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-gray-300 transition-colors hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
              >
                {hero.ctaSecondary} ↗
              </a>
            </div>
          </Reveal>
        </div>

        <div className="relative w-full max-w-[260px] flex-1">
          {orbSlot}
          <Reveal delay={0.15}>
            <figure className="relative rotate-[1.5deg] overflow-hidden rounded-2xl border border-[#a78bfa]/35 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(124,58,237,0.25)]">
              <Image
                src="/profile.jpg"
                alt={hero.photoAlt}
                width={520}
                height={640}
                priority
                sizes="(max-width: 1024px) 100vw, 260px"
                className="h-[320px] w-full object-cover object-[center_20%]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#05060f]/90 to-transparent px-4 pb-3 pt-8 text-[10px] tracking-[0.12em] text-[#c4b5fd]">
                {hero.photoCaption}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
