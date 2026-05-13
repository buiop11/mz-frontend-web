import Link from "next/link";

/**
 * @param {{
 *   title: string;
 *   tag: string;
 *   tagVariant?: "mint" | "neutral";
 *   href: string;
 *   emoji?: string;
 * }} props
 */
export function AgendaCard({ title, tag, tagVariant = "mint", href, emoji }) {
  const tagClass =
    tagVariant === "mint"
      ? "bg-pick-mint/12 text-pick-mint ring-1 ring-pick-mint/25"
      : "bg-pick-chip text-pick-muted ring-1 ring-pick-line";
  const displayEmoji = emoji?.trim() ? emoji.trim() : "📌";
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-pick-line/90 bg-pick-card p-4 shadow-[0_14px_36px_-28px_rgba(51,45,43,0.35)] transition hover:-translate-y-0.5 hover:border-pick-mint/35 hover:shadow-lg"
    >
      <span className="text-2xl drop-shadow-sm">{displayEmoji}</span>
      <span
        className={`mb-2 mt-3 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold ${tagClass}`}
      >
        {tag}
      </span>
      <span className="font-display text-sm font-extrabold leading-snug text-pick-ink group-hover:text-pick-mint">
        {title}
      </span>
      <span className="mt-2 text-[11px] font-semibold text-pick-muted opacity-0 transition group-hover:opacity-100">
        탭하여 비교 · 투표 →
      </span>
    </Link>
  );
}
