import { CATEGORIES } from "@/lib/data";

export function Categories() {
  return (
    <section className="px-10 py-24">
      <div className="flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--accent)] mb-4">
        <span className="block w-6 h-px bg-[color:var(--accent)]" />
        Browse by Category
      </div>
      <h2 className="font-sans font-extrabold text-[clamp(2rem,4vw,3rem)] leading-[0.95] tracking-tight mb-14">
        Every layer<br />of the stack.
      </h2>

      <div
        className="grid gap-px"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          background: "var(--border2)",
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className="group bg-[color:var(--bg2)] px-6 py-8 text-center hover:bg-[rgba(0,212,255,0.04)] transition-colors duration-200 cursor-pointer"
          >
            <span className="block text-3xl mb-3 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
              {cat.icon}
            </span>
            <span className="block font-sans font-bold text-[0.95rem] mb-1.5">
              {cat.name}
            </span>
            <span className="block font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[color:var(--muted)]">
              {cat.count} products
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
