export function StarRating({ note }: { note: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-(--color-terracotta)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2l2.9 6.26 6.9.6-5.2 4.53 1.57 6.77L12 16.9l-6.17 3.26 1.57-6.77-5.2-4.53 6.9-.6L12 2z" />
      </svg>
      {note}
    </span>
  );
}