/**
 * 카테고리 분야 API — `GET /api/category?currentPage=1`
 *
 * - 브라우저에서는 Next 프록시 `GET /api/category`(Route Handler)를 호출하면
 *   개발자 도구 네트워크 탭에 요청이 보입니다.
 * - 서버 컴포넌트에서 직접 백엔드로 fetch하면 **브라우저 탭에는 안 보입니다**(Node에서 실행).
 *
 * @see docs/backend-api-integration.md
 */

export const FALLBACK_CATEGORIES = [
  { categorySeq: -1, name: "웨딩", iconUrl: null },
  { categorySeq: -2, name: "구매", iconUrl: null },
  { categorySeq: -3, name: "데이트", iconUrl: null },
  { categorySeq: -4, name: "식사", iconUrl: null },
];

/**
 * 백엔드 베이스 URL.
 * - `BACKEND_API_URL`: 서버(Route Handler·RSC)만 사용, 브라우저 번들에 안 실림.
 * - `NEXT_PUBLIC_API_URL`: 클라이언트에서도 필요할 때(직접 호출 시).
 */
export function resolveBackendApiRoot() {
  const raw = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    ""
  ).trim();
  if (!raw) return null;
  let base = raw.replace(/\/$/, "");
  if (!/^https?:\/\//i.test(base)) {
    base = `http://${base}`;
  }
  return base;
}

function normalizeList(json) {
  const list = json?.data?.list;
  if (!Array.isArray(list)) return [];
  return list
    .map((row) => ({
      categorySeq:
        typeof row?.categorySeq === "number"
          ? row.categorySeq
          : Number(row?.categorySeq) || 0,
      name: typeof row?.name === "string" ? row.name.trim() : "",
      iconUrl:
        typeof row?.iconUrl === "string" && row.iconUrl.trim()
          ? row.iconUrl.trim()
          : null,
    }))
    .filter((row) => row.name.length > 0);
}

/**
 * 클라이언트·서버 공통: JSON 본문 → 칩용 리스트
 * @returns {{ list: { categorySeq: number, name: string, iconUrl: string | null }[], fromApi: boolean }}
 */
export function parseCategoryApiResponse(json) {
  if (json?.code !== "SUC001" || !json?.data) {
    return { list: FALLBACK_CATEGORIES, fromApi: false };
  }
  const list = normalizeList(json);
  if (list.length === 0) {
    return { list: FALLBACK_CATEGORIES, fromApi: false };
  }
  return { list, fromApi: true };
}

/**
 * @param {{ currentPage?: number }} [params]
 * @returns {Promise<{ list: { categorySeq: number, name: string, iconUrl: string | null }[], fromApi: boolean }>}
 */
export async function getCategories(params = {}) {
  const currentPage = params.currentPage ?? 1;
  const root = resolveBackendApiRoot();

  if (!root) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[getCategories] 백엔드 URL이 없습니다. `.env.local`에 다음 중 하나를 설정하고 dev 서버를 재시작하세요:\n" +
          "  BACKEND_API_URL=http://localhost\n" +
          "  또는 NEXT_PUBLIC_API_URL=http://localhost",
      );
    }
    return { list: FALLBACK_CATEGORIES, fromApi: false };
  }

  const url = `${root}/api/category?currentPage=${encodeURIComponent(currentPage)}`;

  if (process.env.NODE_ENV === "development") {
    console.info("[getCategories] fetch →", url);
  }

  try {
    const res = await fetch(url, {
      headers: { Accept: "*/*" },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    return parseCategoryApiResponse(json);
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[getCategories] 실패, 폴백 사용:", e?.message ?? e);
    }
    return { list: FALLBACK_CATEGORIES, fromApi: false };
  }
}
