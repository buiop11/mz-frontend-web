import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-mz-brown text-mz-footer-muted">
      <div className="mx-auto flex min-h-20 max-w-[1200px] flex-col items-center justify-center gap-1 px-6 py-5 text-center">
        <p
          className="body4 font-normal text-mz-footer-accent opacity-90"
          aria-hidden
        >
          ℓℓℓℓℓℓℓ
        </p>
        <p className="caption font-normal">
          © 2026 MATJZING LOG SHOP. Cute & Simple.{" "}
          <Link href="/terms" className="underline-offset-2 hover:underline">
            [terms]
          </Link>{" "}
          <Link href="/privacy" className="underline-offset-2 hover:underline">
            [privacy]
          </Link>
        </p>
      </div>
    </footer>
  );
}
