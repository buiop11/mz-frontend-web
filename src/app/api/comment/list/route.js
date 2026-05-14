import { NextResponse } from "next/server";

import { resolveBackendApiRoot } from "@/lib/api/category";
import { getForwardedAuthHeaders } from "@/lib/api/proxy-forward-headers";

/**
 * 브라우저 → `GET /api/comment/list?...` → 백엔드 `GET /api/comment/list?...`
 */
export async function GET(request) {
  const root = resolveBackendApiRoot();
  if (!root) {
    return NextResponse.json(
      {
        code: "ERR_CONFIG",
        message:
          "BACKEND_API_URL 또는 NEXT_PUBLIC_API_URL 을 .env.local 에 설정하세요.",
        data: null,
      },
      { status: 503 },
    );
  }

  const q = new URL(request.url).searchParams.toString();
  const url = `${root}/api/comment/list${q ? `?${q}` : ""}`;

  if (process.env.NODE_ENV === "development") {
    console.info("[api/comment/list GET proxy] →", url);
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "*/*", ...getForwardedAuthHeaders(request) },
      cache: "no-store",
    });

    const body = await res.text();
    const contentType =
      res.headers.get("Content-Type") || "application/json; charset=utf-8";

    return new NextResponse(body, {
      status: res.status,
      headers: { "Content-Type": contentType },
    });
  } catch (e) {
    return NextResponse.json(
      {
        code: "ERR_PROXY",
        message: String(e?.message ?? e),
        data: null,
      },
      { status: 502 },
    );
  }
}
