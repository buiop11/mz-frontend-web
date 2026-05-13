"use client";

import { useState } from "react";

import { CategorySectionFromApi } from "./category-section-from-api";
import { TopicListFromApi } from "./topic-list-from-api";

/**
 * 「전체」는 `categorySeq` 없이 `/api/topic?currentPage=1` 만 호출합니다.
 * 특정 분야는 `…&categorySeq=…` 를 붙입니다.
 */
export function CategoryTopicPanel() {
  /** `null` = 전체(쿼리에 categorySeq 미포함) */
  const [categorySeq, setCategorySeq] = useState(null);

  const searchParams =
    categorySeq == null
      ? { currentPage: 1 }
      : { currentPage: 1, categorySeq };

  return (
    <>
      <div className="px-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-pick-muted">
          분야
        </p>
        <CategorySectionFromApi onCategorySeqChange={setCategorySeq} />
      </div>

      <TopicListFromApi searchParams={searchParams} />
    </>
  );
}
