"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomeContents({ data }) {
  const slides = data.hero?.slides?.length ? data.hero.slides : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[index] ?? slides[0];

  return (
    <div className="bg-mz-cream">
      <section className="px-6 pb-2 pt-0 md:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="relative overflow-hidden rounded-[20px] bg-mz-teal shadow-sm">
            <div className="flex min-h-[240px] flex-col md:flex-row md:items-stretch md:justify-between">
              <div className="relative z-[1] flex flex-1 flex-col justify-center gap-3 px-8 py-10 md:max-w-[60%] md:pl-12 md:pr-6">
                {slide?.tag ? (
                  <p
                    className="text-lg text-mz-cream/70"
                    style={{ fontFamily: "var(--font-inter)" }}
                    aria-hidden
                  >
                    {slide.tag}
                  </p>
                ) : null}
                <h1 className="font-display text-[26px] font-bold leading-[1.15] tracking-tight text-mz-ink md:text-[30px]">
                  {(slide?.title ?? "").split("\n").map((line, i) => (
                    <span key={i} className="block uppercase">
                      {line}
                    </span>
                  ))}
                </h1>
                <p
                  className="max-w-[260px] text-sm leading-relaxed text-mz-brown"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {(slide?.subtitle ?? "").split("\n").map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <div>
                  <Link
                    href={slide?.ctaHref ?? "/media"}
                    className="inline-flex h-10 items-center justify-center rounded-full bg-mz-coral px-6 font-display text-xs font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
                  >
                    {slide?.ctaLabel ?? "BROWSE COLLECTION"}
                  </Link>
                </div>
                {slides.length > 1 ? (
                  <div
                    className="flex items-center gap-1.5 pt-1"
                    role="tablist"
                    aria-label="히어로 슬라이드"
                  >
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-selected={i === index}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          i === index ? "bg-mz-coral" : "bg-white/60"
                        }`}
                        onClick={() => setIndex(i)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 pt-1" aria-hidden>
                    <span className="h-2 w-2 rounded-full bg-mz-coral" />
                    <span className="h-2 w-2 rounded-full bg-white/60" />
                    <span className="h-2 w-2 rounded-full bg-white/60" />
                  </div>
                )}
              </div>

              <div className="relative h-[220px] w-full shrink-0 md:h-[240px] md:w-[220px]">
                {slide?.imageUrl ? (
                  <Image
                    src={slide.imageUrl}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover md:rounded-r-[20px]"
                    sizes="(max-width: 768px) 100vw, 220px"
                    priority
                  />
                ) : null}
                <span
                  className="pointer-events-none absolute right-6 top-5 text-[22px] text-white/80"
                  aria-hidden
                >
                  ✦
                </span>
                <span
                  className="pointer-events-none absolute right-16 top-12 text-sm text-mz-ink/50"
                  aria-hidden
                >
                  ✦
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="categories"
        className="px-6 py-8 md:px-12 md:py-8"
        aria-labelledby="categories-heading"
      >
        <h2 id="categories-heading" className="sr-only">
          추천 카테고리
        </h2>
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-6">
          {(data.categories ?? []).map((cat) => (
            <Link
              key={cat.slug || cat.name}
              href={cat.slug ? `/media?category=${encodeURIComponent(cat.slug)}` : "/media"}
              className="group flex flex-col items-center gap-4"
            >
              <p className="font-display text-[15px] font-bold text-mz-ink">
                {cat.badge}
              </p>
              <div className="relative h-[180px] w-[180px] overflow-hidden rounded-full bg-mz-cream ring-1 ring-black/5 transition-transform group-hover:scale-[1.02]">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="180px"
                  />
                ) : null}
              </div>
              <div className="flex w-full max-w-[220px] items-center justify-between px-1">
                <span className="font-display text-[15px] font-semibold text-mz-ink">
                  {cat.name}
                </span>
                <span
                  className="text-[13px] text-mz-muted"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {cat.productCount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
