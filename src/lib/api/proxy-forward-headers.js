/**
 * 브라우저 → Next(Route Handler) 요청에 실린 인증 정보를 백엔드 프록시 fetch에 넘깁니다.
 * 전달하지 않으면 서버에서 백엔드로 나가는 요청은 "익명"이 되어 401이 날 수 있습니다.
 *
 * @param {Request} incoming
 * @returns {Record<string, string>}
 */
export function getForwardedAuthHeaders(incoming) {
  /** @type {Record<string, string>} */
  const out = {};
  const auth = incoming.headers.get("authorization");
  if (auth) {
    out.Authorization = auth;
  }
  const cookie = incoming.headers.get("cookie");
  if (cookie) {
    out.Cookie = cookie;
  }
  return out;
}
