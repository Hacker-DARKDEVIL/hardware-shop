"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { HudFrame } from "@/components/ui/HudFrame";

// ── Hero chip animation (drawn on canvas, no external images needed) ──
const TOTAL_FRAMES = 80;

function drawChipFrame(
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  progress: number
) {
  ctx.clearRect(0, 0, cw, ch);

  const cx = cw / 2;
  const cy = ch / 2;
  const baseR = Math.min(cw, ch) * 0.22;
  const t = progress;

  // Outer rotating ring
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(t * Math.PI * 2 * 0.3);
  ctx.strokeStyle = `rgba(0,212,255,${0.08 + t * 0.06})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, baseR * 1.6, 0, Math.PI * 2);
  ctx.stroke();

  // Dashes on outer ring
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const r1 = baseR * 1.55;
    const r2 = baseR * 1.65;
    ctx.strokeStyle = `rgba(0,212,255,${0.3 + Math.sin(angle + t * 6) * 0.15})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
    ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
    ctx.stroke();
  }
  ctx.restore();

  // Inner ring (counter-rotate)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-t * Math.PI * 2 * 0.5);
  ctx.strokeStyle = `rgba(0,212,255,${0.12 + t * 0.08})`;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, baseR * 1.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // IC body
  ctx.save();
  ctx.translate(cx, cy);
  const bodySize = baseR * 0.95;
  const bodyOpacity = 0.55 + t * 0.2;
  ctx.fillStyle = `rgba(14,16,21,${bodyOpacity})`;
  ctx.strokeStyle = `rgba(0,212,255,${0.3 + t * 0.25})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-bodySize, -bodySize, bodySize * 2, bodySize * 2, 6);
  ctx.fill();
  ctx.stroke();

  // Die (inner square)
  const dieSize = bodySize * 0.55;
  ctx.fillStyle = `rgba(0,212,255,${0.06 + t * 0.04})`;
  ctx.strokeStyle = `rgba(0,212,255,${0.25 + t * 0.2})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(-dieSize, -dieSize, dieSize * 2, dieSize * 2, 3);
  ctx.fill();
  ctx.stroke();

  // Core glow dot
  const glowR = dieSize * 0.22;
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR * 3);
  grad.addColorStop(0, `rgba(0,212,255,${0.9 + Math.sin(t * Math.PI * 4) * 0.1})`);
  grad.addColorStop(0.4, `rgba(0,212,255,0.35)`);
  grad.addColorStop(1, "rgba(0,212,255,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, glowR * 3, 0, Math.PI * 2);
  ctx.fill();

  // IC pins (left & right)
  const pinCount = 6;
  const pinSpacing = (bodySize * 1.4) / (pinCount + 1);
  const pinLen = bodySize * 0.28;
  const pinY0 = -bodySize * 0.7;

  for (let i = 0; i < pinCount; i++) {
    const py = pinY0 + i * pinSpacing;
    const pinOpacity = 0.25 + (t * 0.4 * i) / pinCount;
    ctx.strokeStyle = `rgba(0,212,255,${pinOpacity})`;
    ctx.lineWidth = 1.5;
    // left pins
    ctx.beginPath();
    ctx.moveTo(-bodySize, py);
    ctx.lineTo(-bodySize - pinLen, py);
    ctx.stroke();
    // right pins
    ctx.beginPath();
    ctx.moveTo(bodySize, py);
    ctx.lineTo(bodySize + pinLen, py);
    ctx.stroke();
  }

  // Die circuit lines
  ctx.strokeStyle = `rgba(0,212,255,${0.12 + t * 0.08})`;
  ctx.lineWidth = 0.75;
  const lineData = [
    [-dieSize * 0.6, -dieSize * 0.6, dieSize * 0.6, -dieSize * 0.6],
    [-dieSize * 0.6, 0, dieSize * 0.6, 0],
    [-dieSize * 0.6, dieSize * 0.6, dieSize * 0.6, dieSize * 0.6],
    [-dieSize * 0.6, -dieSize * 0.6, -dieSize * 0.6, dieSize * 0.6],
    [dieSize * 0.6, -dieSize * 0.6, dieSize * 0.6, dieSize * 0.6],
  ];
  lineData.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  ctx.restore();
}

// ── Stats that animate in ──
const STATS = [
  { val: "3,200+", label: "SKUs in stock" },
  { val: "24h",    label: "Dispatch time" },
  { val: "₹149",   label: "Free ship above" },
];

export function Hero() {
  const sectionRef     = useRef<HTMLElement | null>(null);
  const canvasRef      = useRef<HTMLCanvasElement | null>(null);
  const heroTextRef    = useRef<HTMLDivElement | null>(null);
  const progressRef    = useRef<HTMLDivElement | null>(null);
  const powerRef       = useRef<HTMLSpanElement | null>(null);
  const frameRef       = useRef(0);
  const rafRef         = useRef<number>(0);
  const tickingRef     = useRef(false);
  const [ready, setReady] = useState(false);

  // Resize canvas
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width  = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width / (window.devicePixelRatio || 1);
    const ch = canvas.height / (window.devicePixelRatio || 1);
    frameRef.current = (frameRef.current + 1) % TOTAL_FRAMES;
    const progress = frameRef.current / TOTAL_FRAMES;
    drawChipFrame(ctx, cw, ch, progress);
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    rafRef.current = requestAnimationFrame(animate);
    setReady(true);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(rafRef.current);
    };
  }, [resizeCanvas, animate]);

  // Scroll-driven text fade + progress bar
  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        tickingRef.current = false;
        const section = sectionRef.current;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const p = scrollable <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / scrollable));

        if (heroTextRef.current) {
          const op = Math.max(0, 1 - p / 0.35);
          heroTextRef.current.style.opacity = String(op);
          heroTextRef.current.style.transform = `translateY(${(1 - op) * 16}px)`;
        }
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${p})`;
        }
        if (powerRef.current) {
          const pwr = 87.3 + Math.sin(p * Math.PI * 4) * 5.2;
          powerRef.current.textContent = pwr.toFixed(1) + "%";
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="scroll-section relative">
      <div
        className="sticky top-0 w-full overflow-hidden bg-[color:var(--bg)]"
        style={{ height: "100dvh" }}
      >
        {/* Animated canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: "contents" }}
        />

        {/* Radial vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 10%, transparent 30%, rgba(7,8,10,0.5) 70%, rgba(7,8,10,0.92) 100%)",
          }}
        />

        {/* HUD grid overlay */}
        <div className="hud-grid pointer-events-none absolute inset-0 opacity-60" />

        {/* HUD corners */}
        {(["tl", "tr", "bl", "br"] as const).map((c) => (
          <div
            key={c}
            className={`pointer-events-none absolute text-[color:var(--accent)] ${
              c === "tl" ? "top-20 left-10"  :
              c === "tr" ? "top-20 right-10" :
              c === "bl" ? "bottom-14 left-10" :
                           "bottom-14 right-10"
            }`}
          >
            <HudFrame corner={c} size={28} />
          </div>
        ))}

        {/* Top telemetry bar */}
        <div className="pointer-events-none absolute left-10 top-[4.5rem] flex items-center gap-2 z-10">
          <div className="h-px w-8 bg-[color:var(--accent)]/60" />
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
            Telemetry — Live
          </span>
        </div>
        <div className="pointer-events-none absolute right-10 top-[4.5rem] flex items-center gap-2 z-10">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
            Arc Reactor
          </span>
          <span ref={powerRef} className="font-mono text-[0.58rem] tracking-[0.2em] text-[color:var(--accent)]">
            87.3%
          </span>
          <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-[color:var(--accent)]" aria-hidden />
        </div>

        {/* Hero text */}
        <div
          ref={heroTextRef}
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-5 px-10 pb-24 md:pb-28"
          style={{ transition: "opacity 80ms linear" }}
        >
          <EyebrowBadge>
            ChipForge // Hardware Platform // Online
          </EyebrowBadge>

          <h1 className="font-sans font-extrabold text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] tracking-[-0.04em] text-[color:var(--fg)] max-w-[12ch]">
            Build <span className="text-[color:var(--accent)]">real</span>{" "}
            <span className="text-[color:var(--fg)]/30">hardware,</span>{" "}
            faster.
          </h1>

          <p className="font-mono text-[0.72rem] leading-[2] tracking-[0.06em] text-[color:var(--muted)] max-w-[44ch]">
            ESP32, STM32, Arduino, Raspberry Pi and 3,200+ SKUs — hand-picked
            silicon for engineers who build serious things.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="#products"
              className="font-mono text-[0.62rem] uppercase tracking-[0.18em] font-bold bg-[color:var(--accent)] text-black px-6 py-3 rounded-sm hover:opacity-85 transition-opacity"
            >
              Shop Now
            </a>
            <a
              href="#compare"
              className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[color:var(--fg)] px-6 py-3 rounded-sm border border-[color:var(--border2)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-all"
            >
              Compare MCUs
            </a>
          </div>
        </div>

        {/* Floating stat cards */}
        <div className="pointer-events-none absolute right-10 bottom-1/2 translate-y-1/2 hidden lg:flex flex-col gap-4 z-10">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="card-surface px-5 py-4 min-w-[150px] animate-fade-in-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="font-sans font-bold text-[1.6rem] leading-none text-[color:var(--accent)]">
                {s.val}
              </div>
              <div className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-[color:var(--muted)] mt-1.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute inset-x-10 bottom-[3.2rem] h-px bg-white/5 z-10">
          <div
            ref={progressRef}
            className="h-full origin-left bg-[color:var(--accent)]"
            style={{ transform: "scaleX(0)", transition: "transform 80ms linear" }}
          />
        </div>
        <div className="absolute inset-x-10 bottom-8 flex justify-between font-mono text-[0.52rem] uppercase tracking-[0.22em] text-[color:var(--muted)]/50 z-10">
          <span>SKU/001/IN</span>
          <span>Inventory Live</span>
          <span>Scroll ↓</span>
        </div>
      </div>
    </section>
  );
}
