"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { parseCommentListResponse } from "@/lib/api/comment";

/**
 * @param {{ raw?: unknown, id: string, commentCount?: number }} cur
 * @returns {string | null}
 */
function resolveCandidateSeq(cur) {
  if (!cur) return null;
  const raw = cur.raw;
  if (raw && typeof raw === "object") {
    const o = /** @type {Record<string, unknown>} */ (raw);
    const cs = o.candidateSeq ?? o.seq ?? o.candidateId;
    if (cs != null && String(cs).trim() !== "") return String(cs).trim();
  }
  if (cur.id && /^\d+$/.test(String(cur.id))) return String(cur.id);
  return null;
}

/**
 * @typedef {{ commentSeq: string, content: string, author: string, createdAt: string }} CommentRow
 */

/**
 * @param {{ topicSeq: number, cur: { id: string, raw?: unknown, commentCount?: number } }} props
 */
export function CandidateCommentsPanel({ topicSeq, cur }) {
  const candidateSeq = useMemo(() => resolveCandidateSeq(cur), [cur]);

  /** @type {[CommentRow[], import("react").Dispatch<import("react").SetStateAction<CommentRow[]>>]} */
  const [rows, setRows] = useState(() => []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(/** @type {string | null} */ (null));
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingSeq, setEditingSeq] = useState(/** @type {string | null} */ (null));
  const [editDraft, setEditDraft] = useState("");

  const loadList = useCallback(async () => {
    if (candidateSeq == null) {
      setRows([]);
      setError("후보 번호(candidateSeq)를 알 수 없어 댓글을 불러올 수 없습니다.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({
        topicSeq: String(topicSeq),
        candidateSeq,
        currentPage: "1",
      }).toString();
      const res = await fetch(`/api/comment/list?${qs}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(
          typeof json?.message === "string" && json.message.trim()
            ? json.message.trim()
            : `댓글 목록 실패 (${res.status})`,
        );
        setRows([]);
        return;
      }
      const parsed = parseCommentListResponse(json);
      if (!parsed.fromApi) {
        setError(
          typeof json?.message === "string" && json.message.trim()
            ? json.message.trim()
            : "댓글 목록을 불러오지 못했습니다.",
        );
        setRows([]);
        return;
      }
      setRows(parsed.list);
    } catch (e) {
      setError(String(e?.message ?? e));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [topicSeq, candidateSeq]);

  useEffect(() => {
    setEditingSeq(null);
    setEditDraft("");
    setNewText("");
    loadList();
  }, [loadList]);

  const countLabel = rows.length > 0 ? rows.length : cur?.commentCount ?? 0;

  async function handleAdd(e) {
    e.preventDefault();
    const text = newText.trim();
    if (!text || candidateSeq == null) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          topicSeq,
          candidateSeq,
          content: text,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof json?.message === "string" && json.message.trim()
            ? json.message.trim()
            : `등록 실패 (${res.status})`,
        );
        return;
      }
      if (json?.code != null && json.code !== "SUC001") {
        setError(
          typeof json?.message === "string" && json.message.trim()
            ? json.message.trim()
            : "등록에 실패했습니다.",
        );
        return;
      }
      setNewText("");
      await loadList();
    } catch (err) {
      setError(String(err?.message ?? err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveEdit() {
    if (editingSeq == null) return;
    const text = editDraft.trim();
    if (!text) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/comment", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          commentSeq: editingSeq,
          topicSeq,
          candidateSeq,
          content: text,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof json?.message === "string" && json.message.trim()
            ? json.message.trim()
            : `수정 실패 (${res.status})`,
        );
        return;
      }
      if (json?.code != null && json.code !== "SUC001") {
        setError(
          typeof json?.message === "string" && json.message.trim()
            ? json.message.trim()
            : "수정에 실패했습니다.",
        );
        return;
      }
      setEditingSeq(null);
      setEditDraft("");
      await loadList();
    } catch (err) {
      setError(String(err?.message ?? err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentSeq) {
    const ok = window.confirm("이 댓글을 삭제할까요?");
    if (!ok) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/comment/${encodeURIComponent(commentSeq)}`,
        {
          method: "DELETE",
          headers: { Accept: "application/json" },
          credentials: "include",
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof json?.message === "string" && json.message.trim()
            ? json.message.trim()
            : `삭제 실패 (${res.status})`,
        );
        return;
      }
      if (json?.code != null && json.code !== "SUC001") {
        setError(
          typeof json?.message === "string" && json.message.trim()
            ? json.message.trim()
            : "삭제에 실패했습니다.",
        );
        return;
      }
      if (editingSeq === commentSeq) {
        setEditingSeq(null);
        setEditDraft("");
      }
      await loadList();
    } catch (err) {
      setError(String(err?.message ?? err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-4 rounded-2xl border border-pick-mint/35 bg-pick-mint/10 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-pick-mint">
          댓글
        </p>
        <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-pick-ink shadow-sm">
          {countLabel}개
        </span>
      </div>

      {error ? (
        <p className="mt-2 text-xs leading-relaxed text-red-700">{error}</p>
      ) : null}

      {loading ? (
        <p className="mt-2 text-xs text-pick-muted">댓글을 불러오는 중…</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {rows.length === 0 && !error ? (
            <li className="text-xs leading-relaxed text-pick-muted">아직 댓글이 없어요.</li>
          ) : null}
          {rows.map((row) => (
            <li
              key={row.commentSeq}
              className="rounded-xl border border-pick-line/80 bg-white/90 px-2.5 py-2 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-pick-muted">
                    {row.author}
                    {row.createdAt ? (
                      <span className="ml-1 font-normal text-pick-muted/80">
                        · {row.createdAt}
                      </span>
                    ) : null}
                  </p>
                  {editingSeq === row.commentSeq ? (
                    <textarea
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      rows={3}
                      className="mt-1 w-full resize-y rounded-lg border border-pick-line bg-pick-bg px-2 py-1.5 text-xs text-pick-ink outline-none ring-pick-mint/25 focus:ring-2"
                    />
                  ) : (
                    <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-relaxed text-pick-ink">
                      {row.content}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  {editingSeq === row.commentSeq ? (
                    <>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={handleSaveEdit}
                        className="rounded-md bg-pick-mint px-2 py-0.5 text-[10px] font-bold text-pick-ink disabled:opacity-50"
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => {
                          setEditingSeq(null);
                          setEditDraft("");
                        }}
                        className="rounded-md border border-pick-line bg-white px-2 py-0.5 text-[10px] font-semibold text-pick-muted disabled:opacity-50"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={submitting || row.commentSeq.startsWith("idx-")}
                        onClick={() => {
                          setEditingSeq(row.commentSeq);
                          setEditDraft(row.content);
                        }}
                        className="rounded-md border border-pick-line bg-white px-2 py-0.5 text-[10px] font-semibold text-pick-ink hover:bg-pick-chip/40 disabled:opacity-40"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        disabled={submitting || row.commentSeq.startsWith("idx-")}
                        onClick={() => handleDelete(row.commentSeq)}
                        className="rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700 hover:bg-red-100 disabled:opacity-40"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="mt-3 space-y-2 border-t border-pick-mint/25 pt-3">
        <label className="block text-[10px] font-bold text-pick-mint">댓글 작성</label>
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          rows={2}
          placeholder="내용을 입력해 주세요"
          disabled={submitting || candidateSeq == null}
          className="w-full resize-y rounded-xl border border-pick-line bg-white px-3 py-2 text-xs text-pick-ink outline-none ring-pick-mint/25 placeholder:text-pick-muted focus:ring-2 disabled:bg-pick-chip/40"
        />
        <button
          type="submit"
          disabled={submitting || !newText.trim() || candidateSeq == null}
          className="w-full rounded-xl bg-pick-ink py-2 text-xs font-bold text-white shadow-sm hover:opacity-90 disabled:opacity-40"
        >
          등록
        </button>
      </form>
    </section>
  );
}
