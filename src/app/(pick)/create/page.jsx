import Link from "next/link";

export const metadata = {
  title: "안건 생성",
};

export default function CreatePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-2 border-b border-pick-line bg-pick-bg/90 px-3 py-3 backdrop-blur">
        <Link
          href="/category"
          className="rounded-full p-2 text-pick-ink hover:bg-white/70"
          aria-label="뒤로"
        >
          <BackIcon />
        </Link>
        <h1 className="font-display text-base font-bold text-pick-ink">안건 생성</h1>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 pb-28">
        <Field label="안건 제목">
          <input
            className="w-full rounded-2xl border border-pick-line bg-white px-4 py-3 text-sm outline-none ring-pick-mint/30 placeholder:text-pick-muted focus:ring-2"
            placeholder="예) 유모차 구매"
          />
        </Field>

        <Field label="카테고리">
          <select className="w-full appearance-none rounded-2xl border border-pick-line bg-white px-4 py-3 text-sm outline-none ring-pick-mint/30 focus:ring-2">
            <option>웨딩</option>
            <option>구매</option>
            <option>데이트</option>
            <option>식사</option>
          </select>
        </Field>

        <div>
          <p className="text-sm font-semibold text-pick-ink">
            후보 추가 (링크 자동 파싱)
          </p>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-pick-line bg-white px-3 py-2">
            <span className="text-pick-muted" aria-hidden>
              🔗
            </span>
            <input
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-pick-muted"
              placeholder="링크를 붙여 넣어 주세요"
            />
          </div>
          <div className="mt-3 rounded-3xl border border-dashed border-pick-line bg-pick-chip/40 p-4">
            <div className="aspect-video w-full rounded-2xl bg-pick-mint-soft" />
            <p className="mt-3 text-sm font-bold text-pick-ink">(파싱) 후보 제목</p>
            <p className="mt-1 text-xs text-pick-muted">가격 · 쇼핑몰 · 요약</p>
          </div>
          <button
            type="button"
            className="mt-3 w-full rounded-2xl border border-pick-line bg-pick-chip py-3 text-sm font-semibold text-pick-ink hover:bg-white"
          >
            + 후보 더 추가
          </button>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-pick-line bg-pick-bg/95 px-4 py-3 backdrop-blur">
        <Link
          href="/vote/new"
          className="flex w-full items-center justify-center rounded-2xl bg-pick-ink py-3.5 text-center text-sm font-bold text-white shadow-sm transition hover:opacity-90"
        >
          다음: 투표 만들기
        </Link>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-pick-ink">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
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
