export function CloudMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} fill="currentColor" aria-hidden>
      <path d="M16 38C7.7 38 2 32.6 2 25.6 2 19 7 14 13.4 13.4 15.6 6.6 21.8 2 29.2 2c7.6 0 13.9 5 15.8 11.9C46.6 13.3 48.3 13 50 13c6.9 0 12 5.4 12 12.4C62 32.4 56.7 38 49.6 38H16Z" />
      <circle cx="25" cy="24" r="3" fill="var(--color-ink)" />
      <circle cx="39" cy="24" r="3" fill="var(--color-ink)" />
    </svg>
  );
}
