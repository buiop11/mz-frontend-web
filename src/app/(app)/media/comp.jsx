import Image from "next/image";
import Link from "next/link";

export default function MediaContents({ data, activeCategory }) {
  const products = Array.isArray(data?.products) ? data.products : [];

  return (
    <div className="bg-mz-cream">
      <section className="px-6 pb-2 pt-0 md:px-12">
        <div className="mx-auto max-w-[1200px] overflow-hidden bg-mz-teal">
          <div className="flex min-h-[200px] items-center justify-between px-6 md:px-12">
            <div className="space-y-3">
              <h1 className="font-display text-[40px] font-bold leading-[1.05] text-mz-ink md:text-[44px]">
                {(data?.hero?.title ?? "FIND YOUR\nDAILY JOYLOG").split("\n").map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </h1>
              <Link href="/media" className="inline-flex h-9 items-center rounded-full bg-mz-coral px-4 text-[11px] font-bold text-white">BROWSE COLLECTION</Link>
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="h-1.5 w-1.5 rounded-full bg-mz-coral" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              </div>
            </div>
            <div className="hidden h-[160px] w-[160px] rounded-sm bg-[#C8E8D8] md:block" />
          </div>
        </div>
      </section>

      <section className="px-6 py-8 md:px-12">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10">
          {products.map((item) => {
            const selected = activeCategory && (activeCategory === item.slug || activeCategory.toLowerCase() === item.name.toLowerCase());
            return (
              <Link key={item.slug} href={`/media/${item.slug}`} className="group flex flex-col items-center gap-3">
                <p className={`font-display text-sm font-bold ${selected ? "text-mz-coral" : "text-mz-ink"}`}>{item.badge}</p>
                <div className="relative h-40 w-40 overflow-hidden rounded-full" style={{ backgroundColor: item.tone ?? "#EDE4D8" }}>
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill unoptimized className="object-cover transition-transform group-hover:scale-105" sizes="160px" />
                  ) : null}
                </div>
                <div className="flex w-full max-w-[220px] items-center justify-between text-xs">
                  <span className="font-semibold text-mz-ink">{item.name}</span>
                  <span className="text-mz-muted">{item.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
