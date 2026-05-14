import { NextResponse } from "next/server";

import { resolveBackendApiRoot } from "@/lib/api/category";
import { getForwardedAuthHeaders } from "@/lib/api/proxy-forward-headers";

/**
 * 브라우저 → `POST /api/comment` → 백엔드 `POST /api/comment`
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

  const url = `${root}/api/comment`;
  const contentType =
    request.headers.get("Content-Type") || "application/json; charset=utf-8";
  const body = await request.text();

  if (process.env.NODE_ENV === "development") {
    console.info("[api/comment POST proxy] →", url);
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": contentType,
        ...getForwardedAuthHeaders(request),
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

/**
 * 브라우저 → `PUT /api/comment` → 백엔드 `PUT /api/comment`
 */
export async function PUT(request) {
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

  const url = `${root}/api/comment`;
  const contentType =
    request.headers.get("Content-Type") || "application/json; charset=utf-8";
  const body = await request.text();

  if (process.env.NODE_ENV === "development") {
    console.info("[api/comment PUT proxy] →", url);
  }

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": contentType,
        ...getForwardedAuthHeaders(request),
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
