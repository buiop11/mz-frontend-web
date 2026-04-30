import Link from "next/link";

import {
  CALENDAR_META,
  CALENDAR_WEEKS,
  MINI_CALENDAR_LINES,
} from "@/lib/mock/calendar";

export const metadata = { title: "CALENDAR" };

export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-3 py-6 md:px-6">
      <section className="rounded-2xl bg-mz-cream">
        <div className="flex flex-wrap items-center justify-between gap-4 px-3 pb-4 md:px-6">
          <div>
            <h1 className="font-display text-4xl font-bold text-mz-ink">
              {CALENDAR_META.monthLabel}
            </h1>
            <p className="body5 text-mz-muted">{CALENDAR_META.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-[#ede4d8] px-3 py-2 caption font-bold text-[#5e554a]">
              월간
            </button>
            <button className="rounded-full bg-mz-coral px-3 py-2 caption font-bold text-white">
              주간
            </button>
            <button className="rounded-full bg-[#ede4d8] px-3 py-2 caption font-bold text-[#5e554a]">
              일간
            </button>
            <button className="rounded-full bg-mz-teal px-3 py-2 caption font-bold text-mz-ink">
              일정 추가
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
          <aside className="rounded-xl bg-[#ede4d8] p-4">
            <h2 className="font-display text-2xl font-bold text-mz-ink">
              {CALENDAR_META.monthLabel}
            </h2>
            <p className="mt-3 caption font-semibold text-[#7a6e60]">
              {CALENDAR_META.weekdayHeader.join("   ")}
            </p>
            <div className="mt-1 space-y-1">
              {MINI_CALENDAR_LINES.map((line) => (
                <p key={line} className="caption text-[#7a6e60]">
                  {line}
                </p>
              ))}
            </div>

            <h3 className="mt-5 font-display text-sm font-bold text-mz-ink">캘린더</h3>
            <ul className="mt-2 space-y-1 caption text-[#7a6e60]">
              <li>✓ [기본] 내 캘린더</li>
              <li>✓ 내 할 일</li>
              <li>✓ 네이버 예약</li>
            </ul>

            <button className="mt-4 w-full rounded-lg bg-mz-coral px-3 py-2 body5 font-bold text-white">
              전체 일정 보기
            </button>
          </aside>

          <section className="space-y-2">
            <div className="rounded-lg bg-[#ede4d8] px-3 py-2 caption font-bold text-[#7a6e60]">
              {CALENDAR_META.weekdayHeader.map((day) => (
                <span key={day} className="inline-block w-[14.28%]">
                  {day}
                </span>
              ))}
            </div>

            {CALENDAR_WEEKS.map((week) => (
              <div key={week[0]?.date ?? week.map((cell) => cell.date).join("-")} className="grid grid-cols-7 gap-2">
                {week.map((cell) => (
                  <Link
                    key={cell.date}
                    href={`/calendar/${cell.date}`}
                    className="min-h-[110px] rounded-lg bg-[#ede4d8] p-2 transition-colors hover:bg-[#e6ddcf]"
                  >
                    <p
                      className={`caption font-semibold ${
                        cell.sunday ? "text-mz-coral" : "text-[#7a6e60]"
                      }`}
                    >
                      {cell.day}
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {cell.events?.map((event) => (
                        <p key={event} className="caption text-[#6fa8e3]">
                          {event}
                        </p>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            ))}

            <div className="flex items-center justify-between rounded-lg bg-[#ede4d8] px-3 py-2">
              <p className="caption font-bold text-[#5e554a]">선택한 날짜 보기</p>
              <p className="caption font-bold text-mz-coral">-&gt; 일자 상세페이지</p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
