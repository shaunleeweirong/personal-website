import { builds } from "@/lib/content";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

export function Builds() {
  return (
    <section id={builds.id} className="relative overflow-hidden border-t border-white/[0.06] px-6 py-16 sm:px-12 lg:px-20">
      <div aria-hidden className="pointer-events-none absolute -right-16 top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.1),transparent_65%)]" />
      <div className="relative mx-auto max-w-5xl">
        <Reveal>
          <SectionLabel>{builds.label}</SectionLabel>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {builds.headline} <GradientText>{builds.headlineGradient}</GradientText>
          </h2>
          <p className="mt-2 max-w-md text-sm text-body">{builds.intro}</p>
        </Reveal>

        <Reveal className="mt-7">
          <div className="relative overflow-hidden rounded-2xl border border-[#a78bfa]/30 bg-gradient-to-br from-[#7c3aed]/[0.14] to-[#06b6d4]/[0.08] p-6">
            <div aria-hidden className="pointer-events-none absolute -right-5 -top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.25),transparent_70%)]" />
            <div className="relative max-w-md">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-3 py-1 text-[10px] font-bold tracking-[0.08em] text-white">
                  {builds.featured.badges[0]}
                </span>
                <span className="rounded-full border border-[#22d3ee]/40 px-3 py-1 text-[10px] text-[#67e8f9]">
                  {builds.featured.badges[1]}
                </span>
              </div>
              <h3 className="mb-1.5 text-xl font-extrabold">{builds.featured.name}</h3>
              <p className="text-[13px] leading-relaxed text-gray-400">{builds.featured.body}</p>
            </div>
          </div>
        </Reveal>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {builds.grid.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.08}>
              <TiltCard>
                <GlassCard className="h-full">
                  <h3 className="mb-1 text-sm font-bold">{b.name}</h3>
                  <p className="text-xs leading-relaxed text-gray-500">{b.body}</p>
                </GlassCard>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-[#a78bfa]">{builds.more}</p>
      </div>
    </section>
  );
}
