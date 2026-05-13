import Link from "next/link";

import { CategoryTopicPanel } from "@/components/ourpick/category-topic-panel";

export const metadata = {
  title: "카테고리",
};

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

      <CategoryTopicPanel />

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

function PlusIcon({ large = false }) {
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
