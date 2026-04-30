import Link from "next/link";
import PropTypes from "prop-types";

import { getCalendarDetail } from "@/lib/mock/calendar";

export function generateMetadata({ params }) {
  return { title: `CALENDAR ${params.date}` };
}

export default function CalendarDetailPage({ params }) {
  const detail = getCalendarDetail(params.date);

  return (
    <div className="mx-auto max-w-[1200px] px-3 py-6 md:px-6">
      <div className="mb-4">
        <Link href="/calendar" className="caption font-semibold text-mz-muted hover:text-mz-ink">
          ← 캘린더로 돌아가기
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl bg-[#ede4d8] p-5">
          <h2 className="font-display text-2xl font-bold text-mz-ink">오늘의 스티커</h2>
          <div className="mt-4 space-y-2">
            <span className="inline-block rounded-lg bg-mz-coral px-3 py-2 caption font-bold text-white">
              🍒 중요 일정
            </span>
            <span className="inline-block rounded-lg bg-mz-teal px-3 py-2 caption font-bold text-mz-ink">
              ☕ 루틴
            </span>
            <span className="inline-block rounded-lg bg-[#f5d8b0] px-3 py-2 caption font-bold text-mz-ink">
              🧁 나만의 즐거움
            </span>
          </div>
          <p className="mt-4 caption leading-relaxed text-[#7a6e60]">
            스티커를 일정에 붙이면 캘린더에서 빠르게 구분할 수 있어요.
          </p>
        </aside>

        <article className="rounded-2xl bg-white p-5">
          <h1 className="font-display text-4xl font-bold text-mz-ink">{detail.dateLabel}</h1>

          <div className="mt-5 space-y-3">
            <Field label="제목" value={detail.title} />
            <Field label="장소" value={detail.place} />
            <Field label="일시" value={detail.dateTime} />
            <Field label="설명" value={detail.description} multiline />

            <section>
              <h2 className="body5 mb-2 font-display font-bold text-[#5e554a]">체크리스트</h2>
              <div className="rounded-lg bg-mz-cream px-3 py-3">
                <ul className="space-y-1">
                  {detail.checklist.map((item, index) => (
                    <li key={item} className="body5 font-semibold text-mz-ink">
                      {index < 2 ? "☑" : "☐"} {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </article>
      </section>
    </div>
  );
}

function Field({ label, value, multiline = false }) {
  return (
    <section>
      <h2 className="body5 mb-2 font-display font-bold text-[#5e554a]">{label}</h2>
      <div className="rounded-lg bg-mz-cream px-3 py-3">
        <p
          className={`body5 font-semibold text-mz-ink ${
            multiline ? "leading-relaxed text-[#4e4640]" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </section>
  );
}

CalendarDetailPage.propTypes = {
  params: PropTypes.shape({
    date: PropTypes.string,
  }).isRequired,
};

Field.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  multiline: PropTypes.bool,
};
