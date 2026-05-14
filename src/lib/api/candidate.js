/**
 * 후보(안건) 목록·건수 API 응답 정규화
 * @see docs/backend-api-integration.md (프록시 패턴)
 */

/** @param {unknown} v */
function toNum(v) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** @param {unknown} row @param {number} fallbackIdx */
function normalizeCandidateRow(row, fallbackIdx = 0) {
  if (!row || typeof row !== "object") return null;
  const o = /** @type {Record<string, unknown>} */ (row);
  const idRaw =
    o.candidateSeq ?? o.seq ?? o.id ?? o.candidateId ?? o.idx;
  const id =
    idRaw !== undefined && idRaw !== null ? String(idRaw).trim() : "";
  const nameRaw = o.name ?? o.title ?? o.candidateName ?? o.productName;
  const name =
    typeof nameRaw === "string" ? nameRaw.trim() : String(nameRaw ?? "").trim();

  let infoText = "";
  const info = o.info;
  if (typeof info === "string") {
    infoText = info.trim();
  } else if (info != null && typeof info === "object") {
    try {
      infoText = JSON.stringify(info, null, 2);
    } catch {
      infoText = String(info);
    }
  } else if (info != null) {
    infoText = String(info).trim();
  }

  const descRaw = o.desc ?? o.description ?? o.summary;
  const desc =
    typeof descRaw === "string" ? descRaw.trim() : String(descRaw ?? "").trim();

  const priceRaw = o.price ?? o.priceText ?? o.amountLabel;
  const price =
    typeof priceRaw === "string"
      ? priceRaw.trim()
      : priceRaw != null && Number.isFinite(Number(priceRaw))
        ? `${Number(priceRaw).toLocaleString("ko-KR")}원`
        : "";

  let commentCount = 0;
  if (typeof o.commentCount === "number" || typeof o.commentCount === "string") {
    commentCount = toNum(o.commentCount);
  } else if (typeof o.comments === "number") {
    commentCount = toNum(o.comments);
  } else if (Array.isArray(o.comments)) {
    commentCount = o.comments.length;
  } else if (typeof o.replyCount === "number" || typeof o.replyCount === "string") {
    commentCount = toNum(o.replyCount);
  }

  const imageUrl =
    typeof o.imageUrl === "string" && o.imageUrl.trim()
      ? o.imageUrl.trim()
      : typeof o.thumbnailUrl === "string" && o.thumbnailUrl.trim()
        ? o.thumbnailUrl.trim()
        : null;

  const linkUrl =
    typeof o.linkUrl === "string" && o.linkUrl.trim()
      ? o.linkUrl.trim()
      : null;

  const fixed = Boolean(o.fixed);

  if (!id && !name) return null;

  return {
    id: id || `idx-${fallbackIdx}`,
    name: name || "(이름 없음)",
    infoText,
    desc,
    price,
    commentCount,
    imageUrl,
    linkUrl,
    fixed,
    raw: row,
  };
}

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   infoText: string,
 *   desc: string,
 *   price: string,
 *   commentCount: number,
 *   imageUrl: string | null,
 *   linkUrl: string | null,
 *   fixed: boolean,
 *   raw: unknown,
 * }} NormalizedCandidate
 */

/**
 * @param {unknown} json
 * @returns {{
 *   list: NormalizedCandidate[],
 *   isLastPage: boolean,
 *   pageNum: number,
 *   pageSize: number,
 *   totalCount: number,
 *   fromApi: boolean,
 * }}
 */
export function parseCandidateListResponse(json) {
  const data = json?.data;
  if (json?.code !== "SUC001" || data == null || typeof data !== "object") {
    return {
      list: [],
      isLastPage: true,
      pageNum: 1,
      pageSize: 0,
      totalCount: 0,
      fromApi: false,
    };
  }

  /** @type {unknown[]} */
  let rawList = [];
  /** @type {Record<string, unknown>} */
  let meta = {};

  if (Array.isArray(data)) {
    rawList = data;
    meta = {};
  } else {
    const d = /** @type {Record<string, unknown>} */ (data);
    meta = d;
    const nested = d.list ?? d.items ?? d.rows ?? d.candidates;
    rawList = Array.isArray(nested) ? nested : [];
  }

  const list = rawList
    .map((row, idx) => normalizeCandidateRow(row, idx))
    .filter(Boolean);

  const pageNum = toNum(meta.pageNum ?? meta.currentPage ?? 1) || 1;
  const pageSize = toNum(
    meta.pageSize ?? meta.size ?? (Array.isArray(data) ? list.length : 0),
  );
  let isLastPage = true;
  if (typeof meta.isLastPage === "boolean") {
    isLastPage = meta.isLastPage;
  } else if (meta.isLastPage === "N" || meta.isLastPage === "n") {
    isLastPage = false;
  } else if (Array.isArray(data)) {
    isLastPage = true;
  } else if (pageSize > 0 && list.length < pageSize) {
    isLastPage = true;
  }

  const totalCount = toNum(
    meta.totalCount ?? meta.total ?? list.length,
  );

  return {
    list: /** @type {NormalizedCandidate[]} */ (list),
    isLastPage,
    pageNum,
    pageSize: pageSize || list.length,
    totalCount: totalCount || list.length,
    fromApi: true,
  };
}

/**
 * @param {unknown} json
 * @returns {{ count: number, fromApi: boolean }}
 */
export function parseCandidateCountResponse(json) {
  if (json?.code !== "SUC001") {
    return { count: 0, fromApi: false };
  }
  const data = json?.data;
  if (typeof data === "number") {
    return { count: data, fromApi: true };
  }
  if (Array.isArray(data)) {
    return { count: data.length, fromApi: true };
  }
  if (data && typeof data === "object") {
    const d = /** @type {Record<string, unknown>} */ (data);
    const count = toNum(
      d.totalCount ?? d.count ?? d.candidateCount ?? d.size ?? 0,
    );
    return { count, fromApi: true };
  }
  return { count: 0, fromApi: true };
}
