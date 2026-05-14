/**
 * 안건(토픽) 목록 — 백엔드 `GET /api/topic`
 * 응답 필드명이 조금 달라도 매핑되도록 여러 후보 키를 봅니다.
 *
 * @see docs/backend-api-integration.md
 */

import { resolveBackendApiRoot } from "@/lib/api/category";

export const FALLBACK_TOPICS = [
  {
    topicSeq: "studio",
    title: "스튜디오 예약",
    sub: "후보 4 · 댓글 12 · 마감 D-2",
    tag: "투표 중",
    tagClass: "bg-pick-mint/15 text-pick-mint",
    tagVariant: "mint",
    emoji: "🍼",
    href: "/vote/studio",
  },
  {
    topicSeq: "invite",
    title: "식당 최종 선택",
    sub: "결정자: 아진 · 2024.05.02",
    tag: "Pick!",
    tagClass: "bg-pick-ink text-white",
    tagVariant: "neutral",
    emoji: "💌",
    href: "/vote/invite",
  },
];

/**
 * @param {Record<string, unknown>} item
 */
export function normalizeTopicRow(item) {
  const topicSeq =
    item.topicSeq ?? item.topicId ?? item.id ?? item.agendaSeq ?? null;

  const title = String(
    item.title ?? item.topicTitle ?? item.name ?? item.agendaTitle ?? "",
  ).trim();

  const sub = String(
    item.sub ??
      item.subtitle ??
      item.description ??
      item.summary ??
      item.subText ??
      "",
  ).trim();

  let tag = String(
    item.tag ?? item.statusLabel ?? item.statusName ?? item.badge ?? "",
  ).trim();

  const status = String(item.status ?? "").toUpperCase();
  if (!tag) {
    if (
      status === "PICK" ||
      status === "DONE" ||
      status === "CONFIRMED" ||
      status === "COMPLETED"
    ) {
      tag = "Pick!";
    } else if (
      status === "VOTING" ||
      status === "IN_PROGRESS" ||
      status === "OPEN"
    ) {
      tag = "투표 중";
    } else {
      tag = "진행";
    }
  }

  let tagClass = item.tagClass;
  if (typeof tagClass !== "string" || !tagClass.trim()) {
    if (/pick/i.test(tag) || status === "PICK" || status === "DONE") {
      tagClass = "bg-pick-ink text-white";
    } else {
      tagClass = "bg-pick-mint/15 text-pick-mint";
    }
  } else {
    tagClass = tagClass.trim();
  }

  const tvRaw = String(item.tagVariant ?? "").toLowerCase();
  /** @type {"mint" | "neutral" | null} */
  let tagVariant =
    tvRaw === "neutral" || tvRaw === "mint" ? tvRaw : null;
  if (!tagVariant) {
    if (
      /pick/i.test(tag) ||
      status === "PICK" ||
      status === "DONE" ||
      status === "CONFIRMED" ||
      status === "COMPLETED"
    ) {
      tagVariant = "neutral";
    } else {
      tagVariant = "mint";
    }
  }

  const rawEmoji =
    item.emoji ?? item.emojiIcon ?? item.iconEmoji ?? item.topicEmoji ?? null;
  let emoji = "";
  if (typeof rawEmoji === "string") {
    emoji = rawEmoji.trim();
  } else if (rawEmoji != null) {
    const s = String(rawEmoji).trim();
    if (s) emoji = s;
  }

  let href = typeof item.href === "string" ? item.href.trim() : "";
  if (!href) {
    if (topicSeq != null && String(topicSeq).length > 0) {
      href = `/vote/${encodeURIComponent(String(topicSeq))}`;
    } else if (typeof item.slug === "string" && item.slug.trim()) {
      href = `/vote/${encodeURIComponent(item.slug.trim())}`;
    } else {
      href = "/vote/new";
    }
  }

  return {
    topicSeq: topicSeq != null ? String(topicSeq) : href,
    title,
    sub,
    tag,
    tagClass,
    tagVariant,
    emoji,
    href,
  };
}

/**
 * `data.list` 등에서 원시 행 배열을 꺼냅니다.
 * @param {Record<string, unknown>} data
 */
function rawTopicRowsFromData(data) {
  const raw =
    data.list ?? data.topics ?? data.items ?? data.rows;
  return Array.isArray(raw) ? raw : [];
}

/**
 * 투표 상단 등 — `GET /api/topic?topicSeq=…` 응답에서 해당 토픽 제목·부제를 고릅니다.
 * 목록(`list[]`) 또는 `data` 단일 객체 형태 모두 처리합니다.
 *
 * @param {unknown} json
 * @param {number|string} topicSeq
 * @returns {{ title: string, sub: string } | null}
 */
export function pickTopicSummaryForSeq(json, topicSeq) {
  if (json?.code !== "SUC001" || json?.data == null || typeof json.data !== "object") {
    return null;
  }
  const data = /** @type {Record<string, unknown>} */ (json.data);
  const arr = rawTopicRowsFromData(data);
  const want = String(topicSeq);

  if (arr.length > 0) {
    const rows = arr
      .map((row) => normalizeTopicRow(row))
      .filter((r) => r.title);
    const row =
      rows.find((r) => String(r.topicSeq) === want) ?? rows[0] ?? null;
    if (row?.title) {
      return { title: row.title, sub: row.sub };
    }
    return null;
  }

  const row = normalizeTopicRow(data);
  if (row.title) {
    return { title: row.title, sub: row.sub };
  }
  return null;
}

export function parseTopicApiResponse(json) {
  if (json?.code !== "SUC001" || json?.data == null) {
    return { list: FALLBACK_TOPICS, fromApi: false };
  }

  const raw =
    json.data.list ?? json.data.topics ?? json.data.items ?? json.data.rows;
  const arr = Array.isArray(raw) ? raw : [];
  const list = arr.map((row) => normalizeTopicRow(row)).filter((r) => r.title);

  if (list.length === 0) {
    return { list: FALLBACK_TOPICS, fromApi: false };
  }

  return { list, fromApi: true };
}

/**
 * 서버에서 직접 백엔드 호출할 때 (선택)
 * @param {{ search?: Record<string, string | number> }} [opts]
 */
export async function getTopics(opts = {}) {
  const root = resolveBackendApiRoot();
  if (!root) {
    return { list: FALLBACK_TOPICS, fromApi: false };
  }

  const q = new URLSearchParams();
  const search = opts.search ?? { currentPage: 1 };
  for (const [k, v] of Object.entries(search)) {
    if (v != null && v !== "") q.set(k, String(v));
  }
  const qs = q.toString();
  const url = `${root}/api/topic${qs ? `?${qs}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "*/*" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return parseTopicApiResponse(json);
  } catch {
    return { list: FALLBACK_TOPICS, fromApi: false };
  }
}
