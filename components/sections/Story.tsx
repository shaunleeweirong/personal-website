import { story } from "@/lib/content";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

const accentClass = { purple: "text-[#a78bfa]", cyan: "text-[#22d3ee]" } as const;

export function Story() {
  return (
    <section id={story.id} className="relative overflow-hidden px-6 py-16 sm:px-12 lg:px-20">
      <div aria-hidden className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.12),transparent_65%)]" />
      <div className="relative mx-auto max-w-5xl">
        <Reveal>
          <SectionLabel>{story.label}</SectionLabel>
          <h2 className="max-w-xl text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
            {story.headline} <GradientText>{story.headlineGradient}</GradientText>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-body">{story.intro}</p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {story.cards.map((card, i) => (
            <Reveal key={card.label} delay={i * 0.1}>
              <TiltCard>
                <GlassCard className="h-full">
                  <p className={`mb-2 text-[11px] font-bold tracking-[0.1em] ${accentClass[card.accent]}`}>
                    {card.label}
                  </p>
                  <p className="text-[13px] leading-relaxed text-gray-300">{card.body}</p>
                </GlassCard>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
