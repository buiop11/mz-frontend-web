"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import {
  FALLBACK_CATEGORIES,
  parseCategoryApiResponse,
} from "@/lib/api/category";
import { FALLBACK_TOPICS, pickTopicSummaryForSeq } from "@/lib/api/topic";
import { apiFetch } from "@/lib/auth/api-fetch";

const TOPIC_DRAFT_KEY = "ourpick_topic_draft_v1";

/**
 * @param {unknown} json
 * @returns {number | null}
 */
function extractTopicSeqFromCreateResponse(json) {
  const d = json?.data;
  if (d == null) return null;
  if (typeof d === "number" && Number.isFinite(d) && d > 0) return d;
  if (typeof d === "object") {
    const v = d.topicSeq ?? d.topicId ?? d.id ?? d.seq;
    const n = typeof v === "number" ? v : Number.parseInt(String(v), 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

function CreateSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-pick-bg p-4">
      <div className="h-10 w-40 animate-pulse rounded-xl bg-pick-chip" />
      <div className="mt-6 h-24 animate-pulse rounded-2xl bg-pick-chip/80" />
      <div className="mt-4 h-24 animate-pulse rounded-2xl bg-pick-chip/80" />
    </div>
  );
}

function CreatePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const topicSeqParam = searchParams.get("topicSeq");
  const categoryAdded = searchParams.get("categoryAdded");
  const categoryNameHint = searchParams.get("categoryName");

  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [categorySeq, setCategorySeq] = useState(
    String(FALLBACK_CATEGORIES[0]?.categorySeq ?? ""),
  );
  const [inviteMode, setInviteMode] = useState(/** @type {"invite" | "solo"} */ ("invite"));
  const [inviteContact, setInviteContact] = useState("");
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(/** @type {string | null} */ (null));

  useEffect(() => {
    if (categoryAdded === "1") {
      setBanner("카테고리가 추가되었습니다. 목록에서 선택해 주세요.");
    }
  }, [categoryAdded]);

  useEffect(() => {
    if (typeof categoryNameHint === "string" && categoryNameHint.trim()) {
      setBanner(`방금 입력한 분야: ${decodeURIComponent(categoryNameHint.trim())}`);
    }
  }, [categoryNameHint]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingCats(true);
      try {
        const res = await apiFetch("/api/category?currentPage=1", {
          headers: { Accept: "application/json" },
        });
        const json = await res.json();
        const parsed = parseCategoryApiResponse(json);
        if (cancelled) return;
        setCategories(parsed.list);
        if (parsed.list.length > 0) {
          setCategorySeq(String(parsed.list[0].categorySeq));
        }
      } catch {
        if (!cancelled) setCategories(FALLBACK_CATEGORIES);
      } finally {
        if (!cancelled) setLoadingCats(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!topicSeqParam || !topicSeqParam.trim()) return;
    const raw = topicSeqParam.trim();
    const seq = Number.parseInt(raw, 10);
    if (Number.isFinite(seq) && seq > 0 && String(seq) === raw) {
      let cancelled = false;
      (async () => {
        try {
          const qs = new URLSearchParams({
            topicSeq: String(seq),
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
          const sum = pickTopicSummaryForSeq(json, seq);
          if (sum?.title) setTitle(sum.title);
        } catch {
          /* noop */
        }
      })();
      return () => {
        cancelled = true;
      };
    }

    const match = FALLBACK_TOPICS.find((t) => String(t.topicSeq) === raw);
    if (match?.title) setTitle(match.title);
    return undefined;
  }, [topicSeqParam]);

  const categoryLabel = useMemo(() => {
    const n = Number.parseInt(categorySeq, 10);
    const row = categories.find((c) => c.categorySeq === n);
    return row?.name ?? "";
  }, [categories, categorySeq]);

  async function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed) {
      setBanner("안건 제목을 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    setBanner(null);
    try {
      const catNum = Number.parseInt(categorySeq, 10);
      const payload = {
        title: trimmed,
        categorySeq: Number.isFinite(catNum) ? catNum : undefined,
        newCategoryName:
          typeof categoryNameHint === "string" && categoryNameHint.trim()
            ? decodeURIComponent(categoryNameHint.trim())
            : undefined,
        inviteMode: inviteMode,
        inviteContact: inviteMode === "invite" ? inviteContact.trim() : "",
      };

      const res = await apiFetch("/api/topic", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      const seq = extractTopicSeqFromCreateResponse(json);

      if (res.ok && seq != null) {
        try {
          sessionStorage.removeItem(TOPIC_DRAFT_KEY);
        } catch {
          /* noop */
        }
        router.push(`/vote/${seq}/candidates`);
        return;
      }

      sessionStorage.setItem(
        TOPIC_DRAFT_KEY,
        JSON.stringify({
          title: trimmed,
          categorySeq: catNum,
          categoryName: categoryLabel,
          inviteMode,
          inviteContact: inviteMode === "invite" ? inviteContact.trim() : "",
        }),
      );
      router.push("/vote/new/candidates");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-pick-bg">
      <header className="flex items-center gap-2 border-b border-pick-line bg-pick-bg/90 px-3 py-3 backdrop-blur">
        <Link
          href="/category"
          className="rounded-full p-2 text-pick-ink hover:bg-white/70"
          aria-label="뒤로"
        >
          <BackIcon />
        </Link>
        <h1 className="font-display text-base font-bold text-pick-ink">안건 생성</h1>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 pb-28">
        {banner ? (
          <p className="rounded-2xl border border-pick-line bg-pick-chip/50 px-3 py-2 text-xs text-pick-ink">
            {banner}
          </p>
        ) : null}

        <label className="block">
          <span className="text-sm font-semibold text-pick-ink">안건 제목</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-pick-line bg-white px-4 py-3 text-sm outline-none ring-pick-mint/30 placeholder:text-pick-muted focus:ring-2"
            placeholder="예) 유모차 구매"
          />
        </label>

        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-pick-ink">카테고리</span>
            <Link
              href="/category/new"
              className="inline-flex items-center gap-1 rounded-full border border-pick-line bg-white px-3 py-1.5 text-xs font-bold text-pick-ink shadow-sm hover:bg-pick-chip/60"
            >
              <FolderPlusIcon />
              추가
            </Link>
          </div>
          <select
            value={categorySeq}
            disabled={loadingCats}
            onChange={(e) => setCategorySeq(e.target.value)}
            className="mt-1.5 w-full appearance-none rounded-2xl border border-pick-line bg-pick-chip/50 px-4 py-3 text-sm font-semibold outline-none ring-pick-mint/30 focus:ring-2 disabled:opacity-60"
          >
            {categories.map((c) => (
              <option key={c.categorySeq} value={String(c.categorySeq)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-sm font-semibold text-pick-ink">진행 방식</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setInviteMode("invite")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
                inviteMode === "invite"
                  ? "bg-pick-mint text-white shadow-sm"
                  : "border border-pick-line bg-pick-chip/60 text-pick-ink"
              }`}
            >
              <UserPlusIcon active={inviteMode === "invite"} />
              초대
            </button>
            <button
              type="button"
              onClick={() => setInviteMode("solo")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
                inviteMode === "solo"
                  ? "bg-pick-mint text-white shadow-sm"
                  : "border border-pick-line bg-pick-chip/60 text-pick-ink"
              }`}
            >
              <UserIconMini active={inviteMode === "solo"} />
              혼자 모드
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-pick-muted">
            초대하면 참여자와 함께 후보·투표를 진행해요. 혼자 모드는 안건 등록 후 후보 등록 화면에서 링크를
            추가할 수 있어요.
          </p>
        </div>

        <div className="rounded-3xl border border-pick-line bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-pick-ink">초대 링크 / 연락처 (선택)</p>
          <input
            value={inviteContact}
            onChange={(e) => setInviteContact(e.target.value)}
            disabled={inviteMode !== "invite"}
            className="mt-2 w-full rounded-xl border border-pick-line bg-pick-bg/80 px-3 py-3 text-sm outline-none ring-pick-mint/30 placeholder:text-pick-muted focus:ring-2 disabled:opacity-50"
            placeholder="이메일 또는 휴대폰 번호"
          />
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-pick-line bg-pick-bg/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex w-full items-center justify-center rounded-2xl bg-pick-ink py-3.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "등록 중…" : "안건 등록"}
        </button>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<CreateSkeleton />}>
      <CreatePageInner />
    </Suspense>
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

function FolderPlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 11v6M9 14h6M5 4h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserPlusIcon({ active }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      stroke={active ? "#fff" : "#3A3028"}
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  );
}

function UserIconMini({ active }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      stroke={active ? "#fff" : "#3A3028"}
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
