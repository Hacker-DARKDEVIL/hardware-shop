interface EyebrowBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function EyebrowBadge({ children, className = "" }: EyebrowBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--accent)] border border-[color:var(--border)] px-3 py-1.5 rounded-sm ${className}`}
    >
      <span
        className="pulse-dot w-1.5 h-1.5 rounded-full bg-[color:var(--accent)]"
        aria-hidden
      />
      {children}
    </span>
  );
}
