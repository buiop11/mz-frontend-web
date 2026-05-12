import Link from "next/link";

import { CategorySectionFromApi } from "@/components/ourpick/category-section-from-api";

export const metadata = {
  title: "카테고리",
};

const rows = [
  {
    title: "스튜디오 예약",
    sub: "후보 4 · 댓글 12 · 마감 D-2",
    tag: "투표 중",
    tagClass: "bg-pick-mint/15 text-pick-mint",
    href: "/vote/studio",
  },
  {
    title: "청첩장 최종 선택",
    sub: "결정자: 윤아 · 2024.05.02",
    tag: "Pick!",
    tagClass: "bg-pick-ink text-white",
    href: "/vote/invite",
  },
];

export default function CategoryPage() {
  return (
    <div className="relative flex flex-col pb-24">
      <header className="flex items-center justify-between px-4 py-3">
        <h1 className="font-display text-lg font-bold text-pick-ink">카테고리</h1>
        <Link
          href="/create"
          className="rounded-full p-2 text-pick-ink hover:bg-white/70"
          aria-label="안건 추가"
        >
          <PlusIcon />
        </Link>
      </header>

      <div className="px-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-pick-muted">
          분야
        </p>
        <CategorySectionFromApi />
      </div>

      <ul className="mt-5 space-y-3 px-4">
        {rows.map((row) => (
          <li key={row.href}>
            <Link
              href={row.href}
              className="flex items-start justify-between gap-3 rounded-3xl border border-pick-line bg-pick-card p-4 shadow-sm transition hover:border-pick-mint/40"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15px] font-bold text-pick-ink">
                  {row.title}
                </p>
                <p className="mt-1 text-xs text-pick-muted">{row.sub}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${row.tagClass}`}
              >
                {row.tag}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="sticky bottom-36 z-30 mt-4 flex justify-end px-4 pb-2">
        <Link
          href="/create"
          className="flex size-14 items-center justify-center rounded-full bg-pick-accent text-white shadow-lg transition hover:brightness-95"
          aria-label="새 안건"
        >
          <PlusIcon large />
        </Link>
      </div>
    </div>
  );
}

function PlusIcon({ large }) {
  const s = large ? 28 : 22;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
