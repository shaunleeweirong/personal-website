export function SectionLabel({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p id={id} className="mb-3 text-[11px] font-medium tracking-[0.18em] text-[#67e8f9]">
      {children}
    </p>
  );
}
