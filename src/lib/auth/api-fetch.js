import { clearSession, getAuthHeaders } from "@/lib/auth/session";

/**
 * 인증이 필요한 클라이언트 API 호출. Authorization: Bearer 를 자동 부착합니다.
 * @param {string} url
 * @param {RequestInit} [options]
 */
export async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "*/*",
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401 && typeof window !== "undefined") {
    clearSession();
    const path = window.location.pathname;
    if (path !== "/login") {
      window.location.replace("/login");
    }
  }

  return response;
}
