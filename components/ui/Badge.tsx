const tones = {
  purple: "border-[#a78bfa]/40 bg-[#7c3aed]/10 text-[#c4b5fd]",
  cyan: "border-[#22d3ee]/40 bg-[#06b6d4]/10 text-[#67e8f9]",
} as const;

export function Badge({ children, tone }: { children: React.ReactNode; tone: keyof typeof tones }) {
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-[11px] ${tones[tone]}`}>
      {children}
    </span>
  );
}
