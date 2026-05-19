import { GoogleSignInButton } from "@/components/ourpick/google-sign-in-button";

export const metadata = {
  title: "로그인 · 우리결정",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden px-5 pb-10 pt-12">
      <div
        className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full bg-pick-mint/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-32 size-64 rounded-full bg-pick-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="relative z-[1] flex flex-1 flex-col">
        <div className="animate-pick-fade-up">
          <div className="inline-flex size-16 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-pick-mint to-[#4a918c] shadow-lg ring-4 ring-white/80">
            <span className="font-display text-2xl font-extrabold text-white">
              우
            </span>
          </div>
          <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-pick-ink">
            우리결정에
            <br />
            <span className="text-pick-mint">오신 걸 환영해요</span>
          </h1>
          <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-pick-muted">
            둘이 함께 고르는 결정 대기실이에요.
            <br />
            Google 계정으로 간편하게 시작하세요.
          </p>
        </div>

        <div className="mt-auto animate-pick-fade-up pt-10 [animation-delay:80ms]">
          <section className="rounded-[1.75rem] border border-pick-line/90 bg-white/85 p-6 shadow-[0_24px_60px_-32px_rgba(51,45,43,0.35)] backdrop-blur-sm">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-pick-muted">
              시작하기
            </p>
            <GoogleSignInButton className="mt-4" />
            <p className="mt-5 text-center text-[11px] leading-relaxed text-pick-muted">
              로그인 시 서비스 이용약관 및 개인정보 처리방침에
              <br />
              동의하는 것으로 간주됩니다.
            </p>
          </section>

          <ul className="mt-8 space-y-3 px-1">
            <Feature text="안건을 만들고 후보를 모아요" />
            <Feature text="투표로 가볍게 결정해요" />
            <Feature text="둘만의 결정 로그를 남겨요" />
          </ul>
        </div>
      </div>
    </div>
  );
}

function Feature({ text }) {
  return (
    <li className="flex items-center gap-3 text-sm text-pick-ink/90">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pick-mint-soft text-xs font-bold text-pick-mint">
        ✓
      </span>
      {text}
    </li>
  );
}
