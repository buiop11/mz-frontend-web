"use client";

import { useEffect, useState } from "react";

import {
  FALLBACK_TOPICS,
  parseTopicApiResponse,
} from "@/lib/api/topic";
import { apiFetch } from "@/lib/auth/api-fetch";

import { AgendaCard } from "./agenda-card";

/**
 * 홈 「진행 중 안건」— `GET /api/topic?currentPage=1` 상위 N건
 */
export function OngoingAgendasFromApi({
  limit = 10,
  searchParams = { currentPage: 1 },
}) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState(FALLBACK_TOPICS);

  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams ?? {})) {
    if (v != null && v !== "") query.set(k, String(v));
  }
  const qs = query.toString();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const suffix = qs ? `?${qs}` : "";
        const res = await apiFetch(`/api/topic${suffix}`);
        const json = await res.json();
        const parsed = parseTopicApiResponse(json);

        if (cancelled) return;

        if (!res.ok && res.status === 503) {
          setRows(FALLBACK_TOPICS);
          return;
        }

        setRows(parsed.list);
      } catch {
        if (!cancelled) setRows(FALLBACK_TOPICS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [qs]);

  const visible = rows.slice(0, limit);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: limit }, (_, i) => (
          <div
            key={i}
            className="h-[11.5rem] animate-pulse rounded-3xl bg-pick-chip/80"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {visible.map((row, i) => (
        <AgendaCard
          key={`${row.topicSeq ?? "t"}-${row.href}-${i}`}
          title={row.title}
          tag={row.tag}
          tagVariant={row.tagVariant ?? "mint"}
          href={row.href}
          emoji={row.emoji}
        />
      ))}
    </div>
  );
}
