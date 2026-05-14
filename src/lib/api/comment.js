/**
 * 댓글 API 응답 정규화 (`GET /api/comment/list` 등)
 */

/** @param {unknown} v */
function toStr(v) {
  if (v == null) return "";
  return String(v).trim();
}

/**
 * @param {unknown} row
 * @param {number} idx
 * @returns {{ commentSeq: string, content: string, author: string, createdAt: string } | null}
 */
export function normalizeCommentRow(row, idx = 0) {
  if (!row || typeof row !== "object") return null;
  const o = /** @type {Record<string, unknown>} */ (row);
  const seqRaw =
    o.commentSeq ?? o.seq ?? o.id ?? o.replySeq ?? o.commentId;
  const commentSeq =
    seqRaw != null && String(seqRaw).trim() !== ""
      ? String(seqRaw).trim()
      : `idx-${idx}`;

  const content = toStr(
    o.content ?? o.comment ?? o.body ?? o.text ?? o.commentBody,
  );
  const author = toStr(
    o.writerName ??
      o.memberNick ??
      o.author ??
      o.nickname ??
      o.userName ??
      o.name,
  );
  const createdAt = toStr(
    o.regDt ?? o.createdAt ?? o.createDate ?? o.regDate ?? o.updatedAt,
  );

  if (!content) return null;

  return {
    commentSeq,
    content,
    author: author || "익명",
    createdAt,
  };
}

/**
 * @param {unknown} json
 * @returns {{
 *   list: ReturnType<typeof normalizeCommentRow>[],
 *   fromApi: boolean,
 *   totalCount: number,
 * }}
 */
export function parseCommentListResponse(json) {
  if (json?.code !== "SUC001" || json?.data == null) {
    return { list: [], fromApi: false, totalCount: 0 };
  }

  const data = json.data;
  /** @type {unknown[]} */
  let rawList = [];
  /** @type {Record<string, unknown>} */
  let meta = {};

  if (Array.isArray(data)) {
    rawList = data;
  } else if (typeof data === "object") {
    const d = /** @type {Record<string, unknown>} */ (data);
    meta = d;
    const nested = d.list ?? d.items ?? d.rows ?? d.comments;
    rawList = Array.isArray(nested) ? nested : [];
  }

  const list = rawList
    .map((row, i) => normalizeCommentRow(row, i))
    .filter(Boolean);

  const totalCount = (() => {
    if (typeof meta.totalCount === "number") return meta.totalCount;
    if (typeof meta.total === "number") return meta.total;
    const tc = meta.totalCount ?? meta.total;
    const n = typeof tc === "string" ? Number.parseInt(tc, 10) : Number(tc);
    if (Number.isFinite(n) && n >= 0) return n;
    return list.length;
  })();

  return {
    list: /** @type {NonNullable<ReturnType<typeof normalizeCommentRow>>[]} */ (
      list
    ),
    fromApi: true,
    totalCount,
  };
}
