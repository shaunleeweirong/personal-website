import { tour } from "@/lib/content";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

export function TourOfDuty() {
  return (
    <section id={tour.id} className="border-t border-white/[0.06] px-6 py-12 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionLabel>{tour.label}</SectionLabel>
          <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-[#22d3ee]/30 bg-gradient-to-br from-[#06b6d4]/10 to-[#7c3aed]/[0.08] p-5">
            <div>
              <p className="mb-1 text-[10px] tracking-[0.14em] text-[#67e8f9]">{tour.now.kicker}</p>
              <h3 className="text-sm font-bold text-white sm:text-base">
                {tour.now.role} <span className="font-normal text-body">({tour.now.since})</span>
              </h3>
              <p className="mt-1 text-xs text-body">{tour.now.detail}</p>
            </div>
            <span className="hidden whitespace-nowrap text-sm font-bold text-gray-500 sm:block">{tour.now.company}</span>
          </div>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tour.timeline.map((t, i) => (
            <Reveal key={t.company + t.years} delay={i * 0.08}>
              <GlassCard className="h-full !p-4">
                <p className="mb-1 text-[9px] tracking-[0.1em] text-dim">{t.years}</p>
                <p className="text-xs font-bold text-gray-300">{t.company}</p>
                <p className="mt-1 text-[11px] leading-snug text-gray-500">{t.detail}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
