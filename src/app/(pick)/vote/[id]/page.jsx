"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const MOCK = [
  {
    id: "1",
    name: "(후보) 파스텔 유모차 A",
    price: "289,000원",
    desc: "가벼움 · 접이식 · 리뷰 4.8",
    comments: 12,
  },
  {
    id: "2",
    name: "(후보) 절충형 유모차 B",
    price: "349,000원",
    desc: "신생아 호환 · 방향 전환",
    comments: 4,
  },
  {
    id: "3",
    name: "(후보) 휴대용 요람 C",
    price: "198,000원",
    desc: "1.9kg · 기내용",
    comments: 9,
  },
  {
    id: "4",
    name: "(후보) 디럭스 유모차 D",
    price: "520,000원",
    desc: "완충 · 대형 캐노피",
    comments: 2,
  },
];

export default function VotePage() {
  const params = useParams();
  const id = params?.id ?? "demo";
  const list = useMemo(() => MOCK, []);
  const [i, setI] = useState(0);
  const cur = list[i] ?? list[0];
  const total = list.length;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-pick-bg">
      <header className="flex items-center gap-2 border-b border-pick-line bg-pick-bg/90 px-2 py-2 backdrop-blur">
        <Link
          href="/category"
          className="rounded-full p-2 text-pick-ink hover:bg-white/70"
          aria-label="뒤로"
        >
          <BackIcon />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold text-pick-ink">비교 · 투표</p>
          <p className="text-xs text-pick-muted">안건 #{String(id)}</p>
        </div>
        <span className="rounded-full bg-pick-chip px-2.5 py-1 text-xs font-bold text-pick-ink">
          {i + 1}/{total}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 pb-32">
        <article className="rounded-[1.75rem] border border-pick-line bg-pick-card p-4 shadow-sm">
          <div className="aspect-[4/3] w-full rounded-2xl bg-pick-mint-soft" />
          <h2 className="mt-4 font-display text-lg font-bold text-pick-ink">{cur.name}</h2>
          <p className="mt-1 text-lg font-bold text-pick-accent">{cur.price}</p>
          <p className="mt-1 text-sm text-pick-muted">{cur.desc}</p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-pick-line bg-white py-2.5 text-sm font-semibold text-pick-ink"
            >
              <HeartIcon /> 좋아요
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-pick-line bg-white py-2.5 text-sm font-semibold text-pick-ink"
            >
              💬 댓글 {cur.comments}
            </button>
          </div>
        </article>

        <section className="rounded-3xl bg-pick-mint/12 px-4 py-3">
          <p className="text-xs font-bold text-pick-mint">투표 현황</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill>나: 미투표</Pill>
            <Pill>상대: 확인</Pill>
          </div>
        </section>

        <p className="text-center text-xs text-pick-muted">
          👉 카드를 좌우로 스와이프해 후보를 비교해요
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-2xl border border-pick-line bg-pick-chip px-3 py-2 text-sm font-semibold text-pick-ink disabled:opacity-40"
            disabled={i === 0}
            onClick={() => setI((v) => Math.max(0, v - 1))}
          >
            이전
          </button>
          <button
            type="button"
            className="rounded-2xl border border-pick-line bg-pick-chip px-3 py-2 text-sm font-semibold text-pick-ink disabled:opacity-40"
            disabled={i >= total - 1}
            onClick={() => setI((v) => Math.min(total - 1, v + 1))}
          >
            다음
          </button>
        </div>
      </div>

      <div className="sticky bottom-0 flex gap-2 border-t border-pick-line bg-pick-bg/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          className="flex-1 rounded-2xl border border-pick-line bg-pick-chip py-3.5 text-sm font-bold text-pick-ink"
        >
          보류
        </button>
        <button
          type="button"
          className="flex-1 rounded-2xl bg-pick-accent py-3.5 text-sm font-bold text-white shadow-sm"
        >
          이걸로 Pick!
        </button>
      </div>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-pick-ink shadow-sm">
      {children}
    </span>
  );
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="#e55039"
        opacity="0.9"
      />
    </svg>
  );
}
