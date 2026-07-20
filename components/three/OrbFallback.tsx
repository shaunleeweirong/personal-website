export function OrbFallback() {
  return (
    <div
      aria-hidden
      className="absolute -right-4 -top-6 h-28 w-28 rounded-full opacity-90"
      style={{
        background:
          "radial-gradient(circle at 32% 28%, rgba(167,139,250,0.9), rgba(109,40,217,0.55) 45%, rgba(9,9,25,0.9) 78%)",
        boxShadow: "0 0 70px rgba(124,58,237,0.45), inset -12px -14px 40px rgba(6,182,212,0.35)",
      }}
    />
  );
}
