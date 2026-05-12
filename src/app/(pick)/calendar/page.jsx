import Link from "next/link";

export const metadata = {
  title: "캘린더",
};

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

/** 2026년 5월: 1일 = 금요일 → 앞에 5칸 패딩 */
const MAY_2026 = (() => {
  const startPad = 5;
  const daysInMonth = 31;
  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
})();

const HIGHLIGHT = new Set([5, 14, 18]);

const UPCOMING = [
  {
    title: "웨딩 스튜디오 계약",
    when: "5월 18일 · 오후 2:00",
    href: "/vote/studio",
  },
  {
    title: "유모차 픽 미팅",
    when: "5월 22일 · 오전 11:00",
    href: "/vote/stroller",
  },
];

export default function CalendarPage() {
  return (
    <div className="flex flex-col px-4 pb-6">
      <header className="flex flex-col items-center py-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pick-muted">
          Schedule
        </p>
        <h1 className="mt-1 font-display text-xl font-extrabold text-pick-ink">
          캘린더
        </h1>
        <p className="mt-1 max-w-xs text-sm text-pick-muted">
          Pick으로 확정된 일정을 한눈에 볼 수 있어요.
        </p>
      </header>

      <section className="rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-[0_12px_40px_-24px_rgba(51,45,43,0.35)] backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="rounded-full p-2 text-pick-ink hover:bg-pick-bg"
            aria-label="이전 달"
          >
            ‹
          </button>
          <p className="font-display text-base font-bold text-pick-ink">2026년 5월</p>
          <button
            type="button"
            className="rounded-full p-2 text-pick-ink hover:bg-pick-bg"
            aria-label="다음 달"
          >
            ›
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-pick-muted">
          {WEEK.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {MAY_2026.map((day, i) => {
            if (day == null) {
              return <div key={`e-${i}`} className="aspect-square" />;
            }
            const hi = HIGHLIGHT.has(day);
            return (
              <div
                key={day}
                className={`flex aspect-square items-center justify-center rounded-xl text-sm font-semibold ${
                  hi
                    ? "bg-pick-mint text-white shadow-inner ring-2 ring-pick-mint/30"
                    : "bg-pick-bg/80 text-pick-ink hover:bg-pick-mint-soft"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6" aria-labelledby="upcoming">
        <div className="mb-3 flex items-end justify-between">
          <h2 id="upcoming" className="font-display text-base font-bold text-pick-ink">
            다가오는 일정
          </h2>
          <Link href="/log" className="text-xs font-semibold text-pick-mint hover:underline">
            로그에서 보기
          </Link>
        </div>
        <ul className="space-y-3">
          {UPCOMING.map((ev) => (
            <li key={ev.title}>
              <Link
                href={ev.href}
                className="flex flex-col rounded-2xl border border-pick-line bg-pick-card p-4 shadow-sm transition hover:border-pick-mint/40 hover:shadow-md"
              >
                <span className="font-display text-[15px] font-bold text-pick-ink">
                  {ev.title}
                </span>
                <span className="mt-1 text-xs text-pick-muted">{ev.when}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
