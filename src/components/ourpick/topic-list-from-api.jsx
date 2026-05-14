"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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
          credentials: "include",
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

  const handleDelete = useCallback(async (row) => {
    const ok = window.confirm(`「${row.title}」안건을 삭제할까요?`);
    if (!ok) return;
    try {
      const res = await fetch(
        `/api/topic?topicSeq=${encodeURIComponent(String(row.topicSeq))}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { Accept: "application/json" },
        },
      );
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json?.code === "SUC001" || res.status === 200)) {
        setRows((prev) => prev.filter((r) => r.href !== row.href));
        return;
      }
      if (res.status === 503) {
        window.alert(
          "백엔드 URL이 없어 삭제 요청을 보낼 수 없습니다. .env.local 을 확인해 주세요.",
        );
        return;
      }
      window.alert(
        typeof json?.message === "string" && json.message.trim()
          ? json.message.trim()
          : `삭제에 실패했습니다. (${res.status})`,
      );
    } catch (e) {
      window.alert(String(e?.message ?? e));
    }
  }, []);

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
          <div className="overflow-hidden rounded-3xl border border-pick-line bg-pick-card shadow-sm">
            <Link
              href={row.href}
              className="flex items-start justify-between gap-3 p-4 transition hover:bg-white/40"
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
            <div className="flex justify-end gap-2 border-t border-pick-line bg-pick-bg/50 px-4 py-2.5">
              <Link
                href={`/create?topicSeq=${encodeURIComponent(String(row.topicSeq))}`}
                className="rounded-xl border border-pick-line bg-white px-3 py-1.5 text-xs font-bold text-pick-ink shadow-sm hover:bg-pick-chip/50"
              >
                수정
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(row)}
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 shadow-sm hover:bg-red-100"
              >
                삭제
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
