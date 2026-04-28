"use client";

import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";

const SIZES = ["Small", "Medium", "Large"];
const RECOMMEND_TONES = ["#E2D4C7", "#EADBA7", "#E2CFE2"];

export default function DetailContents({ product }) {
  const [size, setSize] = useState("Medium");
  const stars = useMemo(() => Array.from({ length: 5 }, (_, i) => i), []);

  return (
    <div className="bg-mz-cream px-6 py-4 md:px-12 md:py-8">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 md:flex-row md:gap-10">
        <div className="relative h-[420px] w-full overflow-hidden rounded-2xl bg-[#EDE4D8] md:h-[480px] md:w-[460px]">
          {product?.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 460px"
            />
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <h1 className="font-display text-4xl font-bold leading-[1.1] text-mz-ink md:text-[44px]">
            {(product?.name ?? "SWEET CHERRY LOG SOCKS").toUpperCase()}
          </h1>

          <div className="flex items-center gap-1" aria-label="별점 5점">
            {stars.map((star) => (
              <span key={star} className="text-lg text-[#F5C030]">
                ★
              </span>
            ))}
          </div>

          <p className="max-w-[420px] whitespace-pre-line text-sm leading-relaxed text-[#5A5550]">
            {product?.description ??
              "Cozy socks featuring our custom cherry print.\nPerfect for a happy life log."}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <p className="font-display text-[32px] font-bold text-mz-ink">
              ${Number(product?.price ?? 12).toFixed(2)}
            </p>
            <p className="text-xs text-mz-muted">/ per pair</p>
            <div className="ml-2 flex items-center gap-2">
              {SIZES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSize(item)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    size === item
                      ? "border-mz-ink bg-mz-ink text-white"
                      : "border-mz-ink/50 text-mz-ink"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="mt-1 h-12 w-full rounded-[10px] bg-mz-teal font-display text-sm font-bold text-mz-ink transition-opacity hover:opacity-90"
          >
            ADD TO BAG
          </button>

          <div className="flex items-center gap-3 rounded-xl bg-[#F5E8D8] p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mz-teal text-white">
              ✓
            </div>
            <div className="text-xs text-mz-ink">
              <p className="font-bold">WHY WE LOVE IT</p>
              <p>• [SOFT COTTON] • [CUTE PATTERN] • [MATJZING PICK]</p>
            </div>
            <div className="ml-auto flex h-16 w-14 items-center justify-center rounded-lg bg-[#E8DCCF] text-2xl">
              🧸
            </div>
          </div>

          <div className="pt-1">
            <p className="text-center text-[11px] font-bold tracking-wide text-mz-ink">
              PAIRS WELL WITH
            </p>
            <div className="mt-2 flex items-center justify-center gap-3">
              {RECOMMEND_TONES.map((tone) => (
                <span
                  key={tone}
                  className="h-9 w-9 rounded-full"
                  style={{ backgroundColor: tone }}
                />
              ))}
            </div>
          </div>

          <Link
            href="/media"
            className="mt-2 text-xs text-mz-muted underline-offset-2 hover:underline"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

DetailContents.propTypes = {
  product: PropTypes.shape({
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
};
