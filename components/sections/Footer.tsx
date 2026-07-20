import { site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-1 border-t border-white/[0.06] px-6 py-5 text-[10px] text-gray-600 sm:flex-row sm:px-12 lg:px-20">
      <span>{site.footer.copyright}</span>
      <span>{site.footer.tagline}</span>
    </footer>
  );
}
