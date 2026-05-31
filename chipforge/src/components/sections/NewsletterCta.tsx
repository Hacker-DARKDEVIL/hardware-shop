"use client";

import { useState } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";

export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="relative border-t border-[color:var(--border2)] bg-[color:var(--bg2)] py-24 text-center overflow-hidden">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,212,255,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto px-6">
        <EyebrowBadge className="mx-auto mb-6">Stay in the loop</EyebrowBadge>

        <h2 className="font-sans font-extrabold text-[clamp(1.8rem,4vw,2.8rem)] leading-[0.95] tracking-tight mb-3">
          New drops. Stock alerts.<br />Build inspiration.
        </h2>
        <p className="font-mono text-[0.68rem] leading-[1.9] tracking-[0.05em] text-[color:var(--muted)] mb-8">
          Join 4,200+ engineers getting weekly hardware drops.
        </p>

        {submitted ? (
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--accent)]">
            ✓ You&apos;re on the list. Welcome aboard.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex max-w-[420px] mx-auto border border-[color:var(--border)]"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 bg-transparent border-none outline-none text-[color:var(--fg)] font-mono text-[0.68rem] tracking-[0.08em] px-4 py-3 placeholder:text-[color:var(--muted)]"
              required
            />
            <button
              type="submit"
              className="font-mono text-[0.58rem] uppercase tracking-[0.2em] bg-[color:var(--accent)] text-black px-5 py-3 font-bold shrink-0 hover:opacity-85 transition-opacity"
            >
              Subscribe →
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
