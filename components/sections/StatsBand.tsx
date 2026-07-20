import { stats } from "@/lib/content";
import { CountUp } from "@/components/ui/CountUp";

export function StatsBand() {
  return (
    <section aria-label="Career statistics" className="border-y border-white/[0.06]">
      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-y-6 px-6 py-7 sm:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`text-center ${i > 0 ? "sm:border-l sm:border-white/[0.06]" : ""}`}>
            <dd className={`text-2xl font-extrabold ${"gradient" in s && s.gradient ? "text-gradient" : "text-white"}`}>
              <CountUp value={s.value} suffix={s.suffix} />
            </dd>
            <dt className="mt-1 text-[10px] tracking-[0.1em] text-dim">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
