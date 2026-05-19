"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { isAuthenticated } from "@/lib/auth/session";

const PUBLIC_PATHS = ["/login"];

/**
 * JWT 없으면 로그인 화면으로 보냅니다. 로그인된 상태에서 /login 이면 홈으로 보냅니다.
 */
export function AuthGuard({ children }) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  useEffect(() => {
    const authed = isAuthenticated();

    if (!authed && !isPublic) {
      router.replace("/login");
      return;
    }

    if (authed && pathname === "/login") {
      router.replace("/");
      return;
    }

    setReady(true);
  }, [pathname, isPublic, router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-pick-bg px-6">
        <div
          className="size-10 animate-pulse rounded-2xl bg-pick-mint/30"
          aria-hidden
        />
        <p className="mt-4 text-sm font-medium text-pick-muted">잠시만요…</p>
      </div>
    );
  }

  return children;
}
