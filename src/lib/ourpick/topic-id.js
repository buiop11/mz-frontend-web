/**
 * 투표/후보 라우트 `[id]` 파라미터 정규화
 * - 양의 정수 → 숫자 topicSeq (백엔드 연동)
 * - `"new"` → 초안 플로우(세션 스토리지와 함께 사용)
 * - 그 외 문자열 → 슬러그/문자 topic 식별자(폴백 목록 등)
 *
 * @param {string | string[] | undefined} raw
 * @returns {number | "new" | string | null}
 */
export function parseVoteTopicParam(raw) {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (s == null || String(s).trim() === "") return null;
  const str = String(s).trim();
  if (str.toLowerCase() === "new") return "new";
  const n = Number.parseInt(str, 10);
  if (Number.isFinite(n) && n > 0 && String(n) === str) return n;
  return str;
}

/**
 * 후보 API 등에 넘길 숫자 topicSeq만 필요할 때
 * @param {ReturnType<typeof parseVoteTopicParam>} v
 * @returns {number | null}
 */
export function asNumericTopicSeq(v) {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
