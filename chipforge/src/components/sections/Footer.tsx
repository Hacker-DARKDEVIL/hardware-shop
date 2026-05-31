const FOOTER_COLS = [
  {
    title: "Products",
    links: ["Microcontrollers", "Dev Boards", "Wireless Modules", "Sensors", "Power ICs"],
  },
  {
    title: "Resources",
    links: ["Datasheets", "Pinout Diagrams", "Project Gallery", "Firmware Tools"],
  },
  {
    title: "Company",
    links: ["About", "Shipping Policy", "Returns", "Contact"],
  },
];

export function Footer() {
  return (
    <footer>
      <div className="grid grid-cols-2 md:grid-cols-[1.5fr_repeat(3,1fr)] gap-8 px-10 py-14 border-t border-[color:var(--border2)]">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="font-sans font-extrabold text-[1.1rem] tracking-tight mb-3">
            Chip<span className="text-[color:var(--accent)]">Forge</span>
          </div>
          <p className="font-mono text-[0.6rem] leading-[1.9] tracking-[0.05em] text-[color:var(--muted)] max-w-[28ch]">
            Hardware for engineers who build things that matter. Based in Chennai,
            shipping across India.
          </p>
          <div className="flex items-center gap-2 mt-5">
            <div className="pulse-dot w-1.5 h-1.5 rounded-full bg-[color:var(--accent)]" aria-hidden />
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-[color:var(--muted)]">
              All systems operational
            </span>
          </div>
        </div>

        {/* Link columns */}
        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <h4 className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[color:var(--muted)] mb-4">
              {col.title}
            </h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-mono text-[0.62rem] tracking-[0.05em] text-[color:var(--fg)]/60 hover:text-[color:var(--accent)] transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-10 py-4 border-t border-[color:var(--border2)] font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
        <span>© 2026 ChipForge Electronics Pvt. Ltd.</span>
        <span className="opacity-40 tracking-[0.3em]">CHIP/FORGE/IN</span>
        <span>All prices incl. GST</span>
      </div>
    </footer>
  );
}
