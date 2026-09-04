/** Monograma do buffet: a cúpula de servir sobre a linha da mesa. */
export function Wordmark({ size = 38 }: { size?: number }) {
  return (
    <svg
      className="wordmark"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="64" height="64" rx="14" fill="var(--espresso)" />
      <circle cx="32" cy="16.5" r="2.8" fill="var(--saffron)" />
      <path d="M32 19.5v3.2" stroke="var(--saffron)" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M12.5 43.5a19.5 19.5 0 0 1 39 0"
        fill="none"
        stroke="var(--saffron)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path d="M8 47.5h48" stroke="var(--ivory)" strokeWidth="3.6" strokeLinecap="round" />
    </svg>
  );
}
