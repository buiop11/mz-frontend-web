"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { pickTopicSummaryForSeq } from "@/lib/api/topic";
import {
  asNumericTopicSeq,
  parseVoteTopicParam,
} from "@/lib/ourpick/topic-id";
import { apiFetch } from "@/lib/auth/api-fetch";

const TOPIC_DRAFT_KEY = "ourpick_topic_draft_v1";

function newRowId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `r-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * @param {string} raw
 */
function previewFromUrl(raw) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { title: "(파싱) 후보 제목", meta: "가격 · 쇼핑몰 · 요약" };
  }
  try {
    const u = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname && u.pathname !== "/" ? u.pathname : "";
    return {
      title: host + path,
      meta: "링크에서 불러온 미리보기",
    };
  } catch {
    return {
      title: "(파싱) 후보 제목",
      meta: "올바른 URL 형식인지 확인해 주세요",
    };
  }
}

export default function CandidatesRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const topicParam = useMemo(
    () => parseVoteTopicParam(params?.id),
    [params?.id],
  );
  const numericSeq = useMemo(() => asNumericTopicSeq(topicParam), [topicParam]);

  const [topicTitle, setTopicTitle] = useState(/** @type {string | null} */ (null));
  const [topicSub, setTopicSub] = useState(/** @type {string | null} */ (null));

  const [links, setLinks] = useState(() => [
    { id: newRowId(), url: "", previewTitle: "", previewMeta: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(/** @type {string | null} */ (null));

  useEffect(() => {
    if (topicParam !== "new") return;
    try {
      const raw = sessionStorage.getItem(TOPIC_DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (typeof d?.title === "string" && d.title.trim()) {
          setTopicTitle(d.title.trim());
          setTopicSub(
            typeof d?.categoryName === "string" && d.categoryName.trim()
              ? `분야: ${d.categoryName.trim()}`
              : null,
          );
          return;
        }
      }
    } catch {
      /* noop */
    }
    setTopicTitle("새 안건");
    setTopicSub(null);
  }, [topicParam]);

  useEffect(() => {
    if (topicParam === "new") return;
    if (numericSeq != null) {
      let cancelled = false;
      (async () => {
        try {
          const qs = new URLSearchParams({
            topicSeq: String(numericSeq),
            currentPage: "1",
          }).toString();
          const res = await apiFetch(`/api/topic?${qs}`, {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
            credentials: "include",
          });
          const json = await res.json();
          if (cancelled) return;
          const sum = pickTopicSummaryForSeq(json, numericSeq);
          setTopicTitle(sum?.title ?? `토픽 #${numericSeq}`);
          setTopicSub(sum?.sub ?? null);
        } catch {
          if (!cancelled) {
            setTopicTitle(`토픽 #${numericSeq}`);
            setTopicSub(null);
          }
        }
      })();
      return () => {
        cancelled = true;
      };
    }

    if (typeof topicParam === "string") {
      setTopicTitle(`토픽 ${topicParam}`);
      setTopicSub(null);
    }
    return undefined;
  }, [topicParam, numericSeq]);

  const updateLink = useCallback((id, url) => {
    const p = previewFromUrl(url);
    setLinks((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, url, previewTitle: p.title, previewMeta: p.meta } : row,
      ),
    );
  }, []);

  const addRow = useCallback(() => {
    setLinks((prev) => [
      ...prev,
      { id: newRowId(), url: "", previewTitle: "", previewMeta: "" },
    ]);
  }, []);

  const removeRow = useCallback((id) => {
    setLinks((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));
  }, []);

  const backHref =
    topicParam === "new"
      ? "/create"
      : numericSeq != null
        ? `/vote/${numericSeq}`
        : `/vote/${encodeURIComponent(String(topicParam ?? ""))}`;

  async function handleSave() {
    setFeedback(null);
    const filled = links.map((l) => l.url.trim()).filter(Boolean);
    if (filled.length === 0) {
      setFeedback("저장할 링크를 한 개 이상 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      if (numericSeq != null) {
        for (const url of filled) {
          const res = await apiFetch("/api/candidate", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              topicSeq: numericSeq,
              linkUrl: url,
            }),
          });
          const json = await res.json().catch(() => ({}));
          if (res.ok && json?.code === "SUC001") {
            continue;
          }
          if (res.status === 503) {
            setFeedback(
              "백엔드가 연결되지 않아 서버에 저장하지 못했습니다. 링크는 로컬 초안으로만 보관합니다.",
            );
            sessionStorage.setItem(
              `ourpick_local_candidates_${numericSeq}`,
              JSON.stringify(filled),
            );
            router.push(`/vote/${numericSeq}`);
            return;
          }
          setFeedback(
            typeof json?.message === "string" && json.message.trim()
              ? json.message.trim()
              : `저장 실패 (${res.status})`,
          );
          return;
        }
        router.push(`/vote/${numericSeq}`);
        return;
      }

      sessionStorage.setItem(
        "ourpick_local_candidate_links_v1",
        JSON.stringify({ topicParam, links: filled }),
      );
      setFeedback("숫자 topicSeq가 없어 서버 저장을 건너뜁니다. 카테고리로 이동합니다.");
      router.push("/category");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-pick-bg">
      <header className="flex items-center gap-2 border-b border-pick-line bg-pick-bg/90 px-3 py-3 backdrop-blur">
        <Link
          href={backHref}
          className="rounded-full p-2 text-pick-ink hover:bg-white/70"
          aria-label="뒤로"
        >
          <BackIcon />
        </Link>
        <h1 className="font-display text-base font-bold text-pick-ink">후보 등록</h1>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 pb-32">
        <p className="text-xs leading-relaxed text-pick-muted">
          선택한 안건에 후보(링크)를 붙여 넣으면 자동으로 미리보기를 채웁니다.
        </p>

        <div>
          <p className="text-sm font-semibold text-pick-ink">안건</p>
          <p className="mt-1 font-display text-[15px] font-bold text-pick-ink">
            {topicTitle ?? "…"}
          </p>
          {topicSub ? (
            <p className="mt-0.5 text-xs text-pick-muted">{topicSub}</p>
          ) : null}
        </div>

        <p className="text-sm font-semibold text-pick-ink">후보 링크</p>

        <ul className="space-y-4">
          {links.map((row) => (
            <li key={row.id} className="rounded-3xl border border-pick-line bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 rounded-2xl border border-pick-line bg-pick-bg/60 px-3 py-2">
                <span className="text-pick-muted" aria-hidden>
                  🔗
                </span>
                <input
                  value={row.url}
                  onChange={(e) => updateLink(row.id, e.target.value)}
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-pick-muted"
                  placeholder="링크를 붙여 넣어 주세요"
                  inputMode="url"
                />
              </div>
              <div className="mt-3 flex gap-3 rounded-2xl border border-dashed border-pick-line bg-pick-chip/30 p-3">
                <div className="h-16 w-16 shrink-0 rounded-xl bg-pick-mint-soft" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-pick-ink">
                    {row.url.trim() ? row.previewTitle : "(파싱) 후보 제목"}
                  </p>
                  <p className="mt-1 text-xs text-pick-muted">
                    {row.url.trim() ? row.previewMeta : "가격 · 쇼핑몰 · 요약"}
                  </p>
                </div>
              </div>
              {links.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  className="mt-2 text-xs font-semibold text-pick-muted underline decoration-dotted hover:text-pick-ink"
                >
                  이 줄 삭제
                </button>
              ) : null}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={addRow}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-pick-line bg-pick-chip py-3 text-sm font-semibold text-pick-ink hover:bg-white"
        >
          + 후보 더 추가
        </button>

        {feedback ? (
          <p className="rounded-2xl border border-pick-line bg-pick-chip/50 px-3 py-2 text-xs text-pick-ink">
            {feedback}
          </p>
        ) : null}
      </div>

      <div className="sticky bottom-0 border-t border-pick-line bg-pick-bg/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={handleSave}
          disabled={submitting}
          className="flex w-full items-center justify-center rounded-2xl bg-pick-ink py-3.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "저장 중…" : "후보 저장"}
        </button>
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
