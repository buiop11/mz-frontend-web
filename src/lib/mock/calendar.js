export const CALENDAR_META = {
  monthLabel: "2026.05",
  subtitle: "Matjzing Calendar",
  weekdayHeader: ["일", "월", "화", "수", "목", "금", "토"],
};

export const MINI_CALENDAR_LINES = [
  "26  27  28  29  30   1   2",
  " 3   4   5   6   7   8   9",
  "10  11  12  13  14  15  16",
  "17  18  19  20  21  22  23",
  "24  25  26  27  28  29  30",
  "31   1   2   3   4   5   6",
];

export const CALENDAR_WEEKS = [
  [
    { date: "2026-04-26", day: 26, outside: true, sunday: true },
    { date: "2026-04-27", day: 27, outside: true },
    { date: "2026-04-28", day: 28, outside: true },
    { date: "2026-04-29", day: 29, outside: true },
    { date: "2026-04-30", day: 30, outside: true },
    { date: "2026-05-01", day: "1 노동절", sunday: true, events: ["오전 11:00 팀 워크샵"] },
    { date: "2026-05-02", day: 2, events: ["오후 03:00 데일리"] },
  ],
  [
    { date: "2026-05-03", day: 3, sunday: true },
    { date: "2026-05-04", day: 4, events: ["오전 10:30 영자 미팅"] },
    { date: "2026-05-05", day: "5 어린이날", sunday: true },
    { date: "2026-05-06", day: 6 },
    { date: "2026-05-07", day: 7 },
    { date: "2026-05-08", day: 8, events: ["오후 03:00 홈약속"] },
    { date: "2026-05-09", day: 9, events: ["오후 11:00 머머니"] },
  ],
  [
    { date: "2026-05-10", day: 10, sunday: true },
    { date: "2026-05-11", day: 11 },
    { date: "2026-05-12", day: 12 },
    { date: "2026-05-13", day: 13 },
    { date: "2026-05-14", day: 14, events: ["워크샵 (오후 01:00)"] },
    { date: "2026-05-15", day: 15 },
    { date: "2026-05-16", day: 16, events: ["오후 05:00 오버네비"] },
  ],
  [
    { date: "2026-05-17", day: 17, sunday: true },
    { date: "2026-05-18", day: 18, events: ["웅 어머님 생신"] },
    { date: "2026-05-19", day: 19 },
    { date: "2026-05-20", day: 20, events: ["오후 05:00 내 출첵"] },
    { date: "2026-05-21", day: 21 },
    { date: "2026-05-22", day: 22, events: ["오후 01:30 kdw 시"] },
    { date: "2026-05-23", day: 23, events: ["오후 03:00 예비생"] },
  ],
  [
    { date: "2026-05-24", day: 24, sunday: true },
    { date: "2026-05-25", day: 25, sunday: true },
    { date: "2026-05-26", day: 26 },
    { date: "2026-05-27", day: 27, events: ["아빠 생신"] },
    { date: "2026-05-28", day: 28 },
    { date: "2026-05-29", day: 29 },
    { date: "2026-05-30", day: 30, events: ["오후 02:00 유정언니"] },
  ],
];

const DETAIL_MAP = {
  "2026-05-14": {
    dateLabel: "2026.05.14 (목)",
    title: "팀 워크샵 준비 미팅",
    place: "성수 코워킹 라운지 B룸",
    dateTime: "2026.05.14 (목) 오후 01:00 - 03:00",
    description:
      "이번 주 진행할 캠페인 일정과 역할을 최종 확인하고 발표 자료와 체크리스트를 점검합니다.",
    checklist: ["발표자료 최종본 정리", "장소/장비 체크", "참석자 안내 메시지 발송"],
  },
};

const DEFAULT_DETAIL = {
  dateLabel: "2026.05.14 (목)",
  title: "일정 제목",
  place: "장소 정보 없음",
  dateTime: "일시 정보 없음",
  description: "캘린더에서 선택한 일자의 상세 내용을 확인할 수 있습니다.",
  checklist: ["해야 할 일을 추가해 주세요."],
};

export function getCalendarDetail(date) {
  return DETAIL_MAP[date] ?? DEFAULT_DETAIL;
}
