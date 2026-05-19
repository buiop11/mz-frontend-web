const TOKEN_KEY = "ourpick_access_token";
const MEMBER_SEQ_KEY = "ourpick_member_seq";
const PROFILE_KEY = "ourpick_profile";

/** @returns {string | null} */
export function getAccessToken() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** @returns {number | null} */
export function getMemberSeq() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MEMBER_SEQ_KEY);
    if (raw == null || raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

/** @returns {Record<string, unknown> | null} */
export function getStoredProfile() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * @param {{ accessToken: string, memberSeq?: number | null, profile?: Record<string, unknown> | null }} session
 */
export function setSession({ accessToken, memberSeq, profile }) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (memberSeq != null) {
      localStorage.setItem(MEMBER_SEQ_KEY, String(memberSeq));
    }
    if (profile && typeof profile === "object") {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
  } catch {
    /* private mode 등 */
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(MEMBER_SEQ_KEY);
    localStorage.removeItem(PROFILE_KEY);
  } catch {
    /* ignore */
  }
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

/** @returns {Record<string, string>} */
export function getAuthHeaders() {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
