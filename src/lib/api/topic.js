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
 * @param {unknown} json
 * @returns {{ list: typeof FALLBACK_TOPICS, fromApi: boolean }}
 */
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
