import { COMPARE_ROWS } from "@/lib/data";

export function ComparisonTable() {
  const highlight = "esp32s3";

  return (
    <section
      id="compare"
      className="border-y border-[color:var(--border2)] bg-[color:var(--bg2)]"
    >
      <div className="px-10 py-16">
        <div className="flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--accent)] mb-4">
          <span className="block w-6 h-px bg-[color:var(--accent)]" />
          MCU Comparison
        </div>
        <h2 className="font-sans font-extrabold text-[clamp(2rem,4vw,3rem)] leading-[0.95] tracking-tight mb-3">
          Pick the right<br />chip for the job.
        </h2>
        <p className="font-mono text-[0.68rem] leading-[1.9] tracking-[0.04em] text-[color:var(--muted)] max-w-[48ch] mb-12">
          Side-by-side specs so you stop context-switching between datasheets.
        </p>
      </div>

      <div className="overflow-x-auto px-10 pb-16">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr>
              <th className="font-mono text-[0.58rem] uppercase tracking-[0.25em] text-[color:var(--muted)] text-left py-3 pr-4 border-b border-[color:var(--border2)] w-[30%]">
                Spec
              </th>
              <th className="font-mono text-[0.58rem] uppercase tracking-[0.25em] text-[color:var(--accent)] text-left py-3 px-4 border-b border-[color:var(--border2)]">
                ESP32-S3 ★
              </th>
              <th className="font-mono text-[0.58rem] uppercase tracking-[0.25em] text-[color:var(--muted)] text-left py-3 px-4 border-b border-[color:var(--border2)]">
                STM32F407
              </th>
              <th className="font-mono text-[0.58rem] uppercase tracking-[0.25em] text-[color:var(--muted)] text-left py-3 pl-4 border-b border-[color:var(--border2)]">
                RP2350
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row) => {
              const isPrice = row.spec === "Price (unit)";
              return (
                <tr key={row.spec} className="group">
                  <td className="font-mono text-[0.62rem] tracking-[0.1em] text-[color:var(--fg)] py-3 pr-4 border-b border-[color:var(--border2)] group-last:border-0 uppercase">
                    {row.spec}
                  </td>
                  {(["esp32s3", "stm32f407", "rp2350"] as const).map((col) => {
                    const isHighlight = col === "esp32s3";
                    const val = row[col];
                    const isCheck = val.startsWith("✓");
                    const isCross = val.startsWith("✗");
                    const textColor = isHighlight
                      ? isPrice
                        ? "#22c55e"
                        : "var(--accent)"
                      : isCheck
                      ? "#22c55e"
                      : isCross
                      ? "var(--muted)"
                      : "var(--muted)";

                    return (
                      <td
                        key={col}
                        className="font-mono text-[0.62rem] tracking-[0.06em] py-3 px-4 border-b border-[color:var(--border2)] group-last:border-0"
                        style={{ color: textColor }}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
