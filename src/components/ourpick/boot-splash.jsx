"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ourpick_boot_once";

/**
 * 첫 방문(세션) 시 짧게 보여 주는 스플래시.
 * 새로고침마다 보이게 하려면 sessionStorage 키를 제거하면 됩니다.
 */
export function BootSplash() {
  const [phase, setPhase] = useState("in");
  const [gone, setGone] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) {
        setGone(true);
        return;
      }
    } catch {
      /* private mode 등 */
    }

    const t1 = setTimeout(() => setPhase("out"), 1000);
    const t2 = setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setGone(true);
    }, 1450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-pick-bg transition-opacity duration-500 ease-out ${
        phase === "out" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-live="polite"
      aria-busy={phase === "in"}
    >
      <div className="animate-pick-pulse flex size-[5.25rem] items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-pick-mint to-[#4a918c] shadow-xl ring-4 ring-white/70">
        <span className="font-display text-3xl font-extrabold tracking-tight text-white">
          우
        </span>
      </div>
      <p className="mt-6 font-display text-xl font-extrabold tracking-tight text-pick-ink">
        우리결정
      </p>
      <p className="mt-1 text-sm font-medium text-pick-muted">OurPick · 함께 고르기</p>
      <div className="relative mt-10 h-1 w-28 overflow-hidden rounded-full bg-pick-line">
        <div className="absolute inset-y-0 w-2/5 rounded-full bg-pick-mint [animation:pickBar_1.15s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
