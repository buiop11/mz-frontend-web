import Link from "next/link";

const NAV = [
  { href: "/new", label: "[NEW]" },
  { href: "/popular", label: "[POPULAR]" },
  { href: "/media", label: "[BY CATEGORY]" },
  { href: "/support/contact", label: "[CONTACT]" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-mz-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full bg-mz-coral font-display text-[22px] font-bold text-white"
            aria-hidden
          >
            M
          </span>
          <span className="font-display text-lg font-bold text-mz-ink">
            Matjzing Market.
          </span>
        </Link>
        <nav
          className="flex max-w-[65%] flex-wrap items-center justify-end gap-x-4 gap-y-2 text-[11px] font-medium text-mz-ink sm:text-[13px] md:max-w-none md:gap-8"
          aria-label="주요 메뉴"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-opacity hover:opacity-70"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
