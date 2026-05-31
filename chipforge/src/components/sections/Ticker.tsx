import { TICKER_ITEMS } from "@/lib/data";

export function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="border-y border-[color:var(--border2)] overflow-hidden py-3 bg-[rgba(0,212,255,0.02)]">
      <div className="ticker-scroll flex gap-16 w-max">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[color:var(--muted)] whitespace-nowrap"
          >
            <span className="text-[color:var(--accent)]">●</span>
            {item.label}
            <span className="text-[color:var(--accent)]">—</span>
            <span className="text-[color:var(--accent)]">{item.note}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
