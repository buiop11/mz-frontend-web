"use client";

import { usePathname } from "next/navigation";

import { BootSplash } from "./boot-splash";
import { BottomNav } from "./bottom-nav";

export function PickShell({ children }) {
  const pathname = usePathname() ?? "";
  const hideNav =
    pathname.startsWith("/create") || pathname.startsWith("/vote");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-pick-bg shadow-[0_0_0_1px_rgba(0,0,0,0.04)] md:my-4 md:min-h-[calc(100dvh-2rem)] md:rounded-3xl md:shadow-lg">
      <BootSplash />
      <div
        className={
          hideNav
            ? "flex min-h-0 flex-1 flex-col"
            : "flex min-h-0 flex-1 flex-col pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]"
        }
      >
        {children}
      </div>
      {!hideNav ? <BottomNav /> : null}
    </div>
  );
}
