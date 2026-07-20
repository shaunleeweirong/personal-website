export function GradientText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`text-gradient ${className}`}>{children}</span>;
}
