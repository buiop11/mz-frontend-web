export const metadata = {
  title: "로그",
};

const items = [
  {
    date: "2024.05.02",
    title: "청첩장 최종 선택",
    actor: "결정자: 윤아",
    note: "후보 3건 중 Pick 완료",
  },
  {
    date: "2024.04.18",
    title: "스튜디오 예약",
    actor: "결정자: 민수",
    note: "투표 후 일정 캘린더 반영",
  },
];

export default function LogPage() {
  return (
    <div className="flex flex-col px-4 pb-6">
      <header className="py-3">
        <h1 className="font-display text-lg font-bold text-pick-ink">로그</h1>
        <p className="mt-1 text-sm text-pick-muted">
          날짜 · 낙찰 항목 · 결정자 순으로 기록돼요.
        </p>
      </header>

      <div className="relative pl-3">
        <div
          className="absolute bottom-2 left-[7px] top-2 w-px bg-pick-line"
          aria-hidden
        />
        <ul className="space-y-5">
          {items.map((row) => (
            <li key={row.date + row.title} className="relative pl-6">
              <span
                className="absolute left-0 top-1.5 size-2 rounded-full bg-pick-mint ring-4 ring-pick-mint/20"
                aria-hidden
              />
              <p className="text-xs font-semibold text-pick-muted">{row.date}</p>
              <p className="mt-1 font-display text-base font-bold text-pick-ink">
                {row.title}
              </p>
              <p className="mt-0.5 text-sm text-pick-muted">{row.actor}</p>
              <p className="mt-1 text-xs text-pick-muted/90">{row.note}</p>
            </li>
          ))}
        </ul>
      </div>

      <section className="mt-8 rounded-3xl border border-dashed border-pick-line bg-white/50 p-4 text-center text-sm text-pick-muted">
        캘린더 뷰는 다음 단계에서 붙일 수 있어요.
      </section>
    </div>
  );
}
