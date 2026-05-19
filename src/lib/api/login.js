/**
 * Google 로그인 API 응답 정규화
 * @param {unknown} json
 */
export function parseLoginResponse(json) {
  const root = json && typeof json === "object" ? json : {};
  const data =
    root.data && typeof root.data === "object" ? root.data : root;

  const accessToken =
    data.accessToken ??
    data.access_token ??
    data.token ??
    data.jwt ??
    root.accessToken ??
    root.token;

  const memberSeqRaw =
    data.memberSeq ?? data.member_seq ?? data.memberId ?? data.member_id;

  const memberSeq =
    memberSeqRaw != null && memberSeqRaw !== ""
      ? Number(memberSeqRaw)
      : null;

  const profile = {
    name:
      data.name ??
      data.nickname ??
      data.memberName ??
      data.member_name ??
      null,
    email: data.email ?? null,
    picture: data.picture ?? data.profileImageUrl ?? data.profile_image_url ?? null,
  };

  return {
    ok: Boolean(accessToken),
    accessToken: accessToken ? String(accessToken) : null,
    memberSeq: Number.isFinite(memberSeq) ? memberSeq : null,
    profile,
    code: root.code ?? null,
    message: root.message ?? null,
  };
}

/**
 * Google ID 토큰으로 로그인 (브라우저 → Next `/api/login/google` → 백엔드)
 * @param {string} idToken Google GIS credential (JWT)
 */
export async function loginWithGoogle(idToken) {
  const res = await fetch("/api/login/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  let json;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  const parsed = parseLoginResponse(json);

  if (!res.ok || !parsed.ok) {
    const msg =
      parsed.message ||
      (typeof json?.message === "string" ? json.message : null) ||
      `로그인에 실패했습니다. (${res.status})`;
    throw new Error(msg);
  }

  return parsed;
}
