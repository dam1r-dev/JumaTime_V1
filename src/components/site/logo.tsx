export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="15" stroke="currentColor" strokeOpacity="0.25" />
        <path
          d="M20.5 6.5a10 10 0 1 0 0 19 8.5 8.5 0 1 1 0-19Z"
          fill="currentColor"
        />
        <path
          d="M22.5 11.2l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z"
          fill="var(--jt-gold-500)"
        />
      </svg>
      <span className="font-semibold tracking-tight text-lg leading-none">
        Jumma<span className="text-[var(--jt-gold-500)]">Time</span>
      </span>
    </span>
  );
}
