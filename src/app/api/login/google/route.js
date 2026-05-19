import { NextResponse } from "next/server";

import { resolveBackendApiRoot } from "@/lib/api/category";

/**
 * 브라우저 → `POST /api/login/google` → 백엔드 `POST /api/login/google`
 * Body: { idToken: string } (Google GIS credential)
 */
export async function POST(request) {
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

  const url = `${root}/api/login/google`;
  const contentType =
    request.headers.get("Content-Type") || "application/json; charset=utf-8";
  const body = await request.text();

  if (process.env.NODE_ENV === "development") {
    console.info("[api/login/google proxy] →", url);
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": contentType,
      },
      body,
      cache: "no-store",
    });

    const resBody = await res.text();
    const resContentType =
      res.headers.get("Content-Type") || "application/json; charset=utf-8";

    return new NextResponse(resBody, {
      status: res.status,
      headers: { "Content-Type": resContentType },
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
