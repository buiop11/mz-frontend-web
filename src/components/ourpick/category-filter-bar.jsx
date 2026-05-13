"use client";

import { useEffect, useState } from "react";

/**
 * 맨 앞에 「전체」칩을 두고, 그 다음은 백엔드 카테고리 목록입니다.
 * `activeIndex === 0` → 전체 조회(`categorySeq` 없음).
 *
 * @param {{
 *   categories: { categorySeq: number, name: string, iconUrl: string | null }[];
 *   onCategorySeqChange?: (categorySeq: number | null) => void;
 * }} props
 */
export function CategoryFilterBar({ categories = [], onCategorySeqChange }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const chipCount = 1 + categories.length;

  useEffect(() => {
    if (activeIndex >= chipCount) {
      setActiveIndex(0);
      return;
    }
    if (activeIndex === 0) {
      onCategorySeqChange?.(null);
      return;
    }
    const cat = categories[activeIndex - 1];
    if (cat?.categorySeq != null) {
      onCategorySeqChange?.(cat.categorySeq);
    }
  }, [categories, activeIndex, onCategorySeqChange, chipCount]);

  return (
    <div
      className="mt-2 flex flex-wrap gap-2"
      role="tablist"
      aria-label="분야 필터"
    >
      <button
        key="all"
        type="button"
        role="tab"
        aria-selected={activeIndex === 0}
        onClick={() => setActiveIndex(0)}
        className={
          activeIndex === 0
            ? "inline-flex items-center gap-1.5 rounded-full bg-pick-mint px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm"
            : "inline-flex items-center gap-1.5 rounded-full bg-pick-chip px-3.5 py-1.5 text-sm font-medium text-pick-muted transition hover:bg-white"
        }
      >
        <span>전체</span>
      </button>

      {categories.map((cat, index) => {
        const chipIndex = index + 1;
        const active = chipIndex === activeIndex;
        return (
          <button
            key={`${cat.categorySeq}-${index}-${cat.name}`}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setActiveIndex(chipIndex)}
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
