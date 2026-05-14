"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  parseCandidateCountResponse,
  parseCandidateListResponse,
} from "@/lib/api/candidate";
import { pickTopicSummaryForSeq } from "@/lib/api/topic";

/**
 * @param {string | string[] | undefined} raw
 * @returns {number | null}
 */
function parseTopicSeq(raw) {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (s == null || String(s).trim() === "" || String(s).toLowerCase() === "new") {
    return null;
  }
  const n = Number.parseInt(String(s), 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export default function VotePage() {
  const params = useParams();
  const topicSeq = useMemo(() => parseTopicSeq(params?.id), [params?.id]);

  const [totalRegistered, setTotalRegistered] = useState(0);
  const [countLoading, setCountLoading] = useState(false);

  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [indexInPage, setIndexInPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(true);
  const [pageSize, setPageSize] = useState(0);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(/** @type {string | null} */ (null));
  const [jumpToLastAfterLoad, setJumpToLastAfterLoad] = useState(false);

  const [topicSummary, setTopicSummary] = useState(null);

  const loadCount = useCallback(async (seq) => {
    setCountLoading(true);
    try {
      const qs = new URLSearchParams({ topicSeq: String(seq) }).toString();
      const res = await fetch(`/api/candidate/count?${qs}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        credentials: "include",
      });
      const json = await res.json();
      const { count } = parseCandidateCountResponse(json);
      setTotalRegistered(count);
    } catch {
      setTotalRegistered(0);
    } finally {
      setCountLoading(false);
    }
  }, []);

  const loadList = useCallback(async (seq, page) => {
    setListLoading(true);
    setListError(null);
    try {
      const qs = new URLSearchParams({
        topicSeq: String(seq),
        currentPage: String(page),
      }).toString();
      const res = await fetch(`/api/candidate/list?${qs}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        setListError(json?.message ?? `요청 실패 (${res.status})`);
        setList([]);
        setIsLastPage(true);
        setPageSize(0);
        return;
      }
      const parsed = parseCandidateListResponse(json);
      if (!parsed.fromApi) {
        setListError(
          typeof json?.message === "string" && json.message.trim()
            ? json.message.trim()
            : "후보 목록을 불러오지 못했습니다.",
        );
        setList([]);
        setIsLastPage(true);
        setPageSize(0);
        return;
      }
      setList(parsed.list);
      setIsLastPage(parsed.isLastPage);
      setPageSize(parsed.pageSize);
    } catch (e) {
      setListError(String(e?.message ?? e));
      setList([]);
      setIsLastPage(true);
      setPageSize(0);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    if (topicSeq == null) return;
    loadCount(topicSeq);
  }, [topicSeq, loadCount]);

  useEffect(() => {
    if (topicSeq == null) return;
    loadList(topicSeq, currentPage);
  }, [topicSeq, currentPage, loadList]);

  useEffect(() => {
    if (topicSeq == null) return;
    let cancelled = false;
    setTopicSummary(null);

    (async () => {
      try {
        const qs = new URLSearchParams({
          topicSeq: String(topicSeq),
          currentPage: "1",
        }).toString();
        const res = await fetch(`/api/topic?${qs}`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
          credentials: "include",
        });
        const json = await res.json();
        if (cancelled) return;
        setTopicSummary(pickTopicSummaryForSeq(json, topicSeq));
      } catch {
        if (!cancelled) setTopicSummary(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [topicSeq]);

  useEffect(() => {
    if (!jumpToLastAfterLoad || list.length === 0) return;
    setIndexInPage(Math.max(0, list.length - 1));
    setJumpToLastAfterLoad(false);
  }, [jumpToLastAfterLoad, list]);

  useEffect(() => {
    if (topicSeq == null) return;
    setCurrentPage(1);
    setIndexInPage(0);
    setJumpToLastAfterLoad(false);
  }, [topicSeq]);

  useEffect(() => {
    if (list.length === 0) {
      setIndexInPage(0);
      return;
    }
    setIndexInPage((idx) => Math.min(idx, list.length - 1));
  }, [list]);

  const cur = list[indexInPage];
  const totalOnPage = list.length;

  const stride =
    pageSize > 0 ? pageSize : Math.max(totalOnPage, 1);
  let positionInTopic =
    (currentPage - 1) * stride + indexInPage + 1;
  if (totalRegistered > 0) {
    positionInTopic = Math.min(positionInTopic, totalRegistered);
  }

  const canPrev = indexInPage > 0 || currentPage > 1;
  const canNext =
    totalOnPage > 0 &&
    (indexInPage < totalOnPage - 1 || !isLastPage);

  const handlePrev = () => {
    if (indexInPage > 0) {
      setIndexInPage((v) => v - 1);
      return;
    }
    if (currentPage > 1) {
      setJumpToLastAfterLoad(true);
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNext = () => {
    if (indexInPage < totalOnPage - 1) {
      setIndexInPage((v) => v + 1);
      return;
    }
    if (!isLastPage) {
      setCurrentPage((p) => p + 1);
      setIndexInPage(0);
    }
  };

  if (topicSeq == null) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-pick-bg px-6 py-10">
        <p className="text-center text-sm font-semibold text-pick-ink">
          투표하려면 숫자 형태의 주제 번호(topicSeq)가 필요합니다.
        </p>
        <p className="text-center text-xs text-pick-muted">
          URL 예: <span className="font-mono">/vote/2</span>
        </p>
        <Link
          href="/category"
          className="rounded-2xl bg-pick-accent px-5 py-2.5 text-sm font-bold text-white"
        >
          분야 선택으로
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-pick-bg">
      <header className="flex items-center gap-2 border-b border-pick-line bg-pick-bg/90 px-2 py-2 backdrop-blur">
        <Link
          href="/category"
          className="rounded-full p-2 text-pick-ink hover:bg-white/70"
          aria-label="뒤로"
        >
          <BackIcon />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold text-pick-ink">비교 · 투표</p>
          <p className="truncate text-xs font-semibold text-pick-ink">
            {topicSummary?.title ?? `토픽 #${topicSeq}`}
          </p>
          {topicSummary?.sub ? (
            <p className="mt-0.5 line-clamp-2 text-[11px] text-pick-muted">{topicSummary.sub}</p>
          ) : null}
        </div>
        <span className="shrink-0 rounded-full bg-pick-chip px-2.5 py-1 text-xs font-bold text-pick-ink">
          {totalOnPage > 0
            ? `${positionInTopic}/${totalRegistered > 0 ? totalRegistered : "…"}`
            : "—"}
        </span>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pick-line bg-pick-card/40 px-3 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wide text-pick-muted">
            등록된 후보
          </p>
          <p className="font-display text-sm font-bold text-pick-ink">
            {countLoading ? (
              <span className="text-pick-muted">불러오는 중…</span>
            ) : (
              <>
                총{" "}
                <span className="text-pick-accent">{totalRegistered}</span>건
              </>
            )}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
          <button
            type="button"
            className="rounded-xl border border-pick-line bg-white px-3 py-2 text-xs font-semibold text-pick-ink shadow-sm disabled:opacity-40"
            disabled={!canPrev || listLoading}
            onClick={handlePrev}
          >
            이전
          </button>
          <button
            type="button"
            className="rounded-xl border border-pick-line bg-white px-3 py-2 text-xs font-semibold text-pick-ink shadow-sm disabled:opacity-40"
            disabled={!canNext || listLoading}
            onClick={handleNext}
          >
            다음
          </button>
          <Link
            href={`/vote/${topicSeq}/candidates`}
            className="rounded-xl bg-pick-mint px-3 py-2 text-xs font-bold text-pick-ink shadow-sm ring-1 ring-pick-mint/40 hover:opacity-95"
          >
            + 후보 추가
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 pb-32">
        {listLoading && (
          <p className="text-center text-sm text-pick-muted">후보 정보를 불러오는 중…</p>
        )}
        {listError && !listLoading && (
          <div className="rounded-2xl border border-pick-line bg-white p-4 text-center">
            <p className="text-sm text-pick-ink">{listError}</p>
            <button
              type="button"
              className="mt-3 rounded-xl bg-pick-chip px-4 py-2 text-xs font-bold text-pick-ink"
              onClick={() => loadList(topicSeq, currentPage)}
            >
              다시 시도
            </button>
          </div>
        )}

        {!listLoading && !listError && totalOnPage === 0 && (
          <div className="rounded-2xl border border-dashed border-pick-line bg-pick-chip/30 p-6 text-center">
            <p className="text-sm font-semibold text-pick-ink">등록된 후보가 없습니다.</p>
            <p className="mt-1 text-xs text-pick-muted">
              아래 버튼으로 후보(안건)를 추가해 보세요.
            </p>
            <Link
              href={`/create?topicSeq=${encodeURIComponent(String(topicSeq))}`}
              className="mt-4 inline-flex rounded-2xl bg-pick-accent px-5 py-2.5 text-sm font-bold text-white"
            >
              후보 추가하기
            </Link>
          </div>
        )}

        {cur && (
          <>
            <article className="rounded-[1.75rem] border border-pick-line bg-pick-card p-4 shadow-sm">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-pick-mint-soft">
                {cur.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cur.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl text-pick-muted/50">
                    📷
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <h2 className="min-w-0 flex-1 font-display text-lg font-bold leading-snug text-pick-ink">
                  {cur.name}
                </h2>
                {cur.fixed ? (
                  <span className="shrink-0 rounded-full bg-pick-ink px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    고정
                  </span>
                ) : null}
              </div>

              {cur.price ? (
                <p className="mt-2 text-xl font-bold tabular-nums text-pick-accent">
                  {cur.price}
                </p>
              ) : null}

              {cur.desc ? (
                <p className="mt-1 text-sm text-pick-muted">{cur.desc}</p>
              ) : null}

              {cur.linkUrl ? (
                <a
                  href={cur.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-pick-mint/50 bg-pick-mint/15 py-2.5 text-sm font-bold text-pick-ink transition hover:bg-pick-mint/25"
                >
                  🔗 링크에서 자세히 보기
                </a>
              ) : null}

              {cur.infoText ? (
                <section className="mt-4 rounded-2xl border border-pick-line bg-pick-chip/50 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-pick-mint">
                    상세 정보
                  </p>
                  <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-pick-ink">
                    {cur.infoText}
                  </pre>
                </section>
              ) : null}

              <section className="mt-4 rounded-2xl border border-pick-mint/35 bg-pick-mint/10 p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-pick-mint">
                    댓글
                  </p>
                  <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-pick-ink shadow-sm">
                    {cur.commentCount}개
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-pick-muted">
                  {cur.commentCount > 0
                    ? "댓글 목록 API가 연결되면 여기에서 대화를 이어갈 수 있어요."
                    : "아직 댓글이 없어요."}
                </p>
              </section>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-pick-line bg-white py-2.5 text-sm font-semibold text-pick-ink"
                >
                  <HeartIcon /> 좋아요
                </button>
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-pick-line bg-white py-2.5 text-sm font-semibold text-pick-ink"
                >
                  💬 댓글 {cur.commentCount}
                </button>
              </div>
            </article>

            <section className="rounded-3xl bg-pick-mint/12 px-4 py-3">
              <p className="text-xs font-bold text-pick-mint">참여자 투표 현황</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Pill>나: 미투표</Pill>
                <Pill>상대: 확인</Pill>
              </div>
            </section>

            <p className="text-center text-xs text-pick-muted">
              👉 카드를 좌우로 스와이프해 후보를 비교해요
            </p>
          </>
        )}
      </div>

      <div className="sticky bottom-0 flex gap-2 border-t border-pick-line bg-pick-bg/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          className="flex-1 rounded-2xl border border-pick-line bg-pick-chip py-3.5 text-sm font-bold text-pick-ink"
        >
          보류
        </button>
        <button
          type="button"
          className="flex-1 rounded-2xl bg-pick-accent py-3.5 text-sm font-bold text-white shadow-sm"
        >
          이걸로 Pick!
        </button>
      </div>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-pick-ink shadow-sm">
      {children}
    </span>
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

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="#e55039"
        opacity="0.9"
      />
    </svg>
  );
}
