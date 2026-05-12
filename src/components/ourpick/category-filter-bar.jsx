"use client";

import { useState } from "react";

/**
 * 백엔드에서 받은 카테고리 목록을 칩으로 표시합니다. (클릭 시 활성 탭만 전환)
 *
 * @param {{ categories: { categorySeq: number, name: string, iconUrl: string | null }[] }} props
 */
export function CategoryFilterBar({ categories }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!categories?.length) {
    return (
      <p className="mt-2 text-sm text-pick-muted">표시할 카테고리가 없습니다.</p>
    );
  }

  return (
    <div
      className="mt-2 flex flex-wrap gap-2"
      role="tablist"
      aria-label="분야 필터"
    >
      {categories.map((cat, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={`${cat.categorySeq}-${index}-${cat.name}`}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setActiveIndex(index)}
            className={
              active
                ? "inline-flex items-center gap-1.5 rounded-full bg-pick-mint px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm"
                : "inline-flex items-center gap-1.5 rounded-full bg-pick-chip px-3.5 py-1.5 text-sm font-medium text-pick-muted transition hover:bg-white"
            }
          >
            {cat.iconUrl ? (
              // 외부 CDN URL이 가변적이라 next/image 대신 일반 img 사용
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cat.iconUrl}
                alt=""
                width={16}
                height={16}
                className="size-4 shrink-0 rounded object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : null}
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
