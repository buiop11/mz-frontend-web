"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { GoogleSignInButton } from "@/components/ourpick/google-sign-in-button";
import {
  clearSession,
  getMemberSeq,
  getStoredProfile,
  isAuthenticated,
} from "@/lib/auth/session";

export default function MyPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [profile, setProfile] = useState(/** @type {Record<string, unknown> | null} */ (null));
  const [memberSeq, setMemberSeq] = useState(/** @type {number | null} */ (null));

  useEffect(() => {
    setAuthed(isAuthenticated());
    setProfile(getStoredProfile());
    setMemberSeq(getMemberSeq());
  }, []);

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  const displayName =
    (typeof profile?.name === "string" && profile.name) || "회원";
  const initial = displayName.charAt(0);

  return (
    <div className="flex flex-col px-4 pb-8">
      <header className="py-3">
        <h1 className="font-display text-lg font-bold text-pick-ink">마이페이지</h1>
        <p className="mt-1 text-sm text-pick-muted">
          구글 계정으로 로그인하면 방을 공유하고 알림을 받을 수 있어요.
        </p>
      </header>

      <section className="mt-2 rounded-3xl border border-pick-line bg-pick-card p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-pick-mint-soft text-lg font-bold text-pick-mint">
            {initial}
          </div>
          <div>
            <p className="font-display text-base font-bold text-pick-ink">
              {displayName}
            </p>
            <p className="text-xs text-pick-muted">
              {authed
                ? memberSeq != null
                  ? `로그인됨 · member #${memberSeq}`
                  : "로그인됨"
                : "로그인 전"}
            </p>
          </div>
        </div>

        {authed ? (
          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 w-full rounded-2xl border border-pick-line bg-white py-3 text-sm font-semibold text-pick-ink shadow-sm transition hover:bg-pick-bg"
          >
            로그아웃
          </button>
        ) : (
          <GoogleSignInButton
            className="mt-5"
            onSuccess={() => {
              setAuthed(true);
              setProfile(getStoredProfile());
              setMemberSeq(getMemberSeq());
            }}
          />
        )}
      </section>

      <ul className="mt-6 space-y-2 text-sm">
        <Row title="알림 설정" />
        <Row title="개인정보 처리방침" href="#" />
        <Row title="이용약관" href="#" />
      </ul>
    </div>
  );
}

function Row({ title, href }) {
  if (href) {
    return (
      <li>
        <a
          href={href}
          className="flex w-full items-center justify-between rounded-2xl border border-transparent bg-white/60 px-4 py-3 text-left text-sm font-medium text-pick-ink hover:border-pick-line"
        >
          {title}
          <span className="text-pick-muted">›</span>
        </a>
      </li>
    );
  }
  return (
    <li>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-2xl border border-transparent bg-white/60 px-4 py-3 text-left text-sm font-medium text-pick-ink hover:border-pick-line"
      >
        {title}
        <span className="text-pick-muted">›</span>
      </button>
    </li>
  );
}
