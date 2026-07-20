import { site } from "@/lib/content";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#05060f]/70 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5 sm:px-12">
        <a href="#top" className="text-xs font-bold tracking-[0.06em] text-white">
          {site.monogram}
        </a>
        <ul className="flex gap-5 sm:gap-8">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-[11px] text-gray-500 transition-colors hover:text-white sm:text-xs">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
