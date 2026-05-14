"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CategoryNewPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(/** @type {string | null} */ (null));

  async function handleSave(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setMessage("카테고리 이름을 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmed }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json?.code === "SUC001" || res.status === 200)) {
        router.push("/create?categoryAdded=1");
        return;
      }
      if (res.status === 503) {
        router.push(`/create?categoryName=${encodeURIComponent(trimmed)}`);
        return;
      }
      setMessage(
        typeof json?.message === "string" && json.message.trim()
          ? json.message.trim()
          : `저장에 실패했습니다. (${res.status})`,
      );
    } catch (err) {
      setMessage(String(err?.message ?? err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-pick-bg">
      <header className="flex items-center gap-2 border-b border-pick-line bg-pick-bg/90 px-3 py-3 backdrop-blur">
        <Link
          href="/create"
          className="rounded-full p-2 text-pick-ink hover:bg-white/70"
          aria-label="뒤로"
        >
          <BackIcon />
        </Link>
        <h1 className="font-display text-base font-bold text-pick-ink">카테고리 추가</h1>
      </header>

      <form
        onSubmit={handleSave}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 pb-28">
          <label className="block">
            <span className="text-sm font-semibold text-pick-ink">새 카테고리 이름</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-pick-line bg-white px-4 py-3 text-sm outline-none ring-pick-mint/30 placeholder:text-pick-muted focus:ring-2"
              placeholder="예) 웨딩, 구매, 데이트"
              autoComplete="off"
            />
          </label>
          <p className="text-xs leading-relaxed text-pick-muted">
            안건을 묶을 분야를 만들면 목록에서 필터링하기 쉬워요.
          </p>
          {message ? (
            <p className="rounded-2xl border border-pick-line bg-pick-chip/50 px-3 py-2 text-xs text-pick-ink">
              {message}
            </p>
          ) : null}
        </div>

        <div className="sticky bottom-0 border-t border-pick-line bg-pick-bg/95 px-4 py-3 backdrop-blur">
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-2xl bg-pick-ink py-3.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "저장 중…" : "카테고리 저장"}
          </button>
        </div>
      </form>
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
