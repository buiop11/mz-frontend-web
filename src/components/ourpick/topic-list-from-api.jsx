"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  FALLBACK_TOPICS,
  parseTopicApiResponse,
} from "@/lib/api/topic";

/**
 * `GET /api/topic?currentPage=1` 또는 `…&categorySeq=…` (Next 프록시) → 토픽 목록.
 */
export function TopicListFromApi({ searchParams }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState(FALLBACK_TOPICS);

  const query = new URLSearchParams();
  const sp = searchParams ?? { currentPage: 1 };
  for (const [k, v] of Object.entries(sp)) {
    if (v != null && v !== "") query.set(k, String(v));
  }
  const qs = query.toString();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const path = "/api/topic";
        const suffix = qs ? `?${qs}` : "";
        const res = await fetch(`${path}${suffix}`, {
          headers: { Accept: "*/*" },
        });
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

  if (loading) {
    return (
      <ul className="mt-5 space-y-3 px-4">
        {[1, 2].map((i) => (
          <li
            key={i}
            className="h-24 animate-pulse rounded-3xl bg-pick-chip/80"
          />
        ))}
      </ul>
    );
  }

  return (
    <ul className="mt-5 space-y-3 px-4">
      {rows.map((row) => (
        <li key={row.href}>
          <Link
            href={row.href}
            className="flex items-start justify-between gap-3 rounded-3xl border border-pick-line bg-pick-card p-4 shadow-sm transition hover:border-pick-mint/40"
          >
            <div className="min-w-0 flex-1">
              <p className="font-display text-[15px] font-bold text-pick-ink">
                {row.title}
              </p>
              {row.sub ? (
                <p className="mt-1 text-xs text-pick-muted">{row.sub}</p>
              ) : null}
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${row.tagClass}`}
            >
              {row.tag}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
