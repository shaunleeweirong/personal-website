export function GlassCard({
  children,
  className = "",
  dashed = false,
}: {
  children: React.ReactNode;
  className?: string;
  dashed?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        dashed
          ? "border-dashed border-white/15 bg-white/[0.02]"
          : "border-white/[0.07] bg-white/[0.03]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
