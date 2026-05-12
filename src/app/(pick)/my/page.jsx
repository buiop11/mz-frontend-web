export const metadata = {
  title: "마이",
};

export default function MyPage() {
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
            윤
          </div>
          <div>
            <p className="font-display text-base font-bold text-pick-ink">윤아</p>
            <p className="text-xs text-pick-muted">로그인 전 · 로컬 프로필</p>
          </div>
        </div>

        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-pick-line bg-white py-3 text-sm font-semibold text-pick-ink shadow-sm transition hover:bg-pick-bg"
        >
          <GoogleGlyph />
          Google로 계속하기
        </button>
        <p className="mt-2 text-center text-[11px] text-pick-muted">
          추후 NextAuth / Supabase 등으로 연결할 자리입니다.
        </p>
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

function GoogleGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}
