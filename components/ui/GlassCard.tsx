export function GlassCard({
  children,
  className = "",
  dashed = false,
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  dashed?: boolean;
  padded?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border ${padded ? "p-5" : ""} ${
        dashed
          ? "border-dashed border-white/15 bg-white/[0.02]"
          : "border-white/[0.07] bg-white/[0.03]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
