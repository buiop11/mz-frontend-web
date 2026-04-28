/**
 * JSON fetch 헬퍼. 클라이언트 SWR 등에서 재사용할 수 있습니다.
 * @param {string} url
 * @param {RequestInit} [options]
 */
export async function fetcher(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = `API 요청 실패: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}
