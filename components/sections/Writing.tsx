import { writing } from "@/lib/content";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

export function Writing() {
  return (
    <section id={writing.id} className="border-t border-white/[0.06] px-6 py-16 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionLabel>{writing.label}</SectionLabel>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{writing.headline}</h2>
          <p className="mt-1.5 text-xs text-dim">{writing.sub}</p>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {writing.comingSoon.map((title, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <GlassCard dashed className="h-full">
                <p className="mb-2 text-[9px] tracking-[0.12em] text-dim">COMING SOON</p>
                <p className="text-[13px] font-semibold leading-snug text-gray-400">{title}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
