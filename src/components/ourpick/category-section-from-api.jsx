"use client";

import { useEffect, useState } from "react";

import {
  FALLBACK_CATEGORIES,
  parseCategoryApiResponse,
} from "@/lib/api/category";

import { CategoryFilterBar } from "./category-filter-bar";

/**
 * 브라우저에서 `GET /api/category`(Next 프록시)를 호출하므로
 * 개발자 도구 → 네트워크에 요청이 보입니다.
 *
 * @param {{ onCategorySeqChange?: (categorySeq: number | null) => void }} [props]
 */
export function CategorySectionFromApi({ onCategorySeqChange }) {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/category?currentPage=1", {
          headers: { Accept: "*/*" },
        });

        const json = await res.json();
        const parsed = parseCategoryApiResponse(json);

        if (cancelled) return;

        if (!res.ok && res.status === 503) {
          setCategories(FALLBACK_CATEGORIES);
          setFromApi(false);
          return;
        }

        setCategories(parsed.list);
        setFromApi(parsed.fromApi);
      } catch {
        if (!cancelled) {
          setCategories(FALLBACK_CATEGORIES);
          setFromApi(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-9 w-16 animate-pulse rounded-full bg-pick-chip"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <CategoryFilterBar
        categories={categories}
        onCategorySeqChange={onCategorySeqChange}
      />
      {!fromApi ? (
        <p className="mt-2 text-[11px] leading-relaxed text-pick-muted">
          <code className="rounded bg-pick-chip px-1 py-0.5">
            BACKEND_API_URL
          </code>{" "}
          또는{" "}
          <code className="rounded bg-pick-chip px-1 py-0.5">
            NEXT_PUBLIC_API_URL
          </code>
          를{" "}
          <code className="rounded bg-pick-chip px-1 py-0.5">.env.local</code>에
          두고{" "}
          <strong className="text-pick-ink">npm run dev 재시작</strong> 후 다시
          열어 주세요. 네트워크 탭에는 동일 출처{" "}
          <code className="rounded bg-pick-chip px-1 py-0.5">
            /api/category
          </code>{" "}
          요청이 보입니다.
        </p>
      ) : null}
    </>
  );
}
