"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { loginWithGoogle } from "@/lib/api/login";
import { setSession } from "@/lib/auth/session";

const GSI_SRC = "https://accounts.google.com/gsi/client";

function loadGsiScript() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.accounts?.id) return Promise.resolve();

  const existing = document.querySelector(`script[src="${GSI_SRC}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Google 로그인 스크립트를 불러오지 못했습니다.")),
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Google 로그인 스크립트를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });
}

/**
 * @param {{ onSuccess?: () => void, className?: string }} props
 */
export function GoogleSignInButton({ onSuccess, className = "" }) {
  const router = useRouter();
  const btnRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gsiReady, setGsiReady] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";

  const handleCredential = useCallback(
    async (response) => {
      const credential = response?.credential;
      if (!credential) {
        setError("Google 인증 정보를 받지 못했습니다.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const result = await loginWithGoogle(credential);
        setSession({
          accessToken: result.accessToken,
          memberSeq: result.memberSeq,
          profile: result.profile,
        });
        onSuccess?.();
        router.replace("/");
        router.refresh();
      } catch (e) {
        setError(e?.message ?? "로그인에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, router],
  );

  useEffect(() => {
    if (!clientId) return undefined;

    let cancelled = false;

    (async () => {
      try {
        await loadGsiScript();
        if (cancelled || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (btnRef.current) {
          window.google.accounts.id.renderButton(btnRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "pill",
            width: Math.min(320, btnRef.current.offsetWidth || 320),
            locale: "ko",
          });
        }

        if (!cancelled) setGsiReady(true);
      } catch (e) {
        if (!cancelled) {
          setError(e?.message ?? "Google 로그인을 준비하지 못했습니다.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clientId, handleCredential]);

  if (!clientId) {
    return (
      <p className="rounded-2xl border border-pick-accent/30 bg-pick-accent/5 px-4 py-3 text-center text-xs leading-relaxed text-pick-accent">
        `.env.local`에{" "}
        <code className="font-mono text-[11px]">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>
        를 설정한 뒤 dev 서버를 재시작해 주세요.
      </p>
    );
  }

  return (
    <div className={className}>
      <div
        ref={btnRef}
        className={`flex min-h-[48px] w-full items-center justify-center ${loading ? "pointer-events-none opacity-60" : ""}`}
        aria-busy={loading}
      />

      {!gsiReady && !error ? (
        <p className="mt-2 text-center text-[11px] text-pick-muted">
          Google 로그인 준비 중…
        </p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-pick-accent/25 bg-pick-accent/5 px-3 py-2 text-center text-xs text-pick-accent"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
