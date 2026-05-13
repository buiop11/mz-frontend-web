import Link from "next/link";

import { OngoingAgendasFromApi } from "@/components/ourpick/ongoing-agendas-from-api";

export const metadata = {
  title: "결정 대기실",
};

export default function HomePage() {
  return (
    <div className="relative flex flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-pick-mint/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 top-40 size-56 rounded-full bg-pick-accent/10 blur-3xl"
        aria-hidden
      />

      <header className="relative z-[1] flex items-start justify-between gap-3 px-4 pb-2 pt-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-pick-line/80 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-pick-muted shadow-sm backdrop-blur-sm">
            <span className="font-display text-pick-mint">OurPick</span>
            <span aria-hidden>·</span>
            <span>2인 모드</span>
          </div>
          <h1 className="mt-3 max-w-[16rem] font-display text-[1.35rem] font-extrabold leading-snug tracking-tight text-pick-ink">
            우리의 결정
            <span className="text-pick-mint"> 대기실</span>
          </h1>
        </div>
        <button
          type="button"
          className="relative z-[1] rounded-2xl border border-pick-line/80 bg-white/80 p-2.5 text-pick-ink shadow-sm backdrop-blur-sm transition hover:bg-white"
          aria-label="알림"
        >
          <BellIcon />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-pick-accent ring-2 ring-white" />
        </button>
      </header>

      <div className="relative z-[1] px-4 pb-2">
        <section
          className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-pick-mint via-[#4f9e9a] to-[#3d8580] p-[1px] shadow-[0_20px_50px_-28px_rgba(51,45,43,0.45)]"
          aria-labelledby="hero-title"
        >
          <div className="relative rounded-[1.7rem] bg-gradient-to-br from-pick-mint/95 to-[#3d8580] px-5 pb-6 pt-6 text-white">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "18px 18px",
              }}
              aria-hidden
            />
            <p
              id="hero-title"
              className="relative font-display text-lg font-extrabold leading-snug drop-shadow-sm"
            >
              아진님, 이번 주 3개의 중대 의결사항이 있어요!
            </p>
            <p className="relative mt-2 text-sm leading-relaxed text-white/92">
              링크를 붙여 넣고 후보를 모아, 투표로 가볍게 결정해요.
            </p>
            <div className="relative mt-5 flex flex-wrap gap-2">
              <Link
                href="/create"
                className="inline-flex items-center justify-center rounded-2xl bg-pick-ink px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
              >
                안건 만들기
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-white/75 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                초대하기
              </button>
            </div>
          </div>
        </section>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-pick-line/90 bg-white/70 p-3 shadow-sm backdrop-blur-sm">
          <Stat label="진행 중" value="2" />
          <Stat label="이번 주" value="3" accent />
          <Stat label="Pick 완료" value="5" />
        </div>
      </div>

      <section
        className="relative z-[1] px-4 pb-6 pt-2"
        aria-labelledby="ongoing-heading"
      >
        <div className="mb-3 flex items-end justify-between gap-2">
          <h2
            id="ongoing-heading"
            className="font-display text-base font-extrabold text-pick-ink"
          >
            진행 중 안건
          </h2>
          <Link
            href="/category"
            className="text-xs font-bold text-pick-mint hover:underline"
          >
            전체 보기
          </Link>
        </div>
        <OngoingAgendasFromApi limit={10} searchParams={{ currentPage: 1 }} />
      </section>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="text-center">
      <p
        className={`font-display text-xl font-extrabold tabular-nums ${accent ? "text-pick-mint" : "text-pick-ink"}`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-semibold text-pick-muted">{label}</p>
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 14h18c0-7-3-7-3-14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
