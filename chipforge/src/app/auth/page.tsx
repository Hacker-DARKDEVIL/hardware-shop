"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { HudFrame } from "@/components/ui/HudFrame";
import { useAuthStore } from "@/store/auth";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login, signup, isLoading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const handleSubmit = async () => {
    setError("");
    if (mode === "login") {
      const res = await login(form.email, form.password);
      if (res.success) router.push(redirectTo);
      else setError(res.error || "Login failed");
    } else {
      if (!form.name) { setError("Name is required"); return; }
      const res = await signup(form.name, form.email, form.password);
      if (res.success) router.push(redirectTo);
      else setError(res.error || "Signup failed");
    }
  };

  const update = (k: string, v: string) => {
    // Secret admin entry — type %%admin%% in the email field
    if (k === "email" && v === "%%admin%%") {
      router.push("/admin/login");
      return;
    }
    setForm((p) => ({ ...p, [k]: v }));
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-[60px] flex items-center justify-center px-6 hud-grid">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="font-sans font-extrabold text-2xl tracking-tight">
              Chip<span className="text-[color:var(--accent)]">Forge</span>
            </Link>
            <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--muted)] mt-1">
              Engineer Login Portal
            </div>
            {redirectTo !== "/account" && (
              <div className="mt-3 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[color:var(--accent)] border border-[rgba(0,212,255,0.3)] bg-[rgba(0,212,255,0.06)] px-3 py-2 rounded-sm">
                Sign in to continue your purchase
              </div>
            )}
          </div>

          <div className="relative card-surface p-8">
            <HudFrame corner="tl" className="absolute top-3 left-3 text-[color:var(--accent)] opacity-40" />
            <HudFrame corner="tr" className="absolute top-3 right-3 text-[color:var(--accent)] opacity-40" />
            <HudFrame corner="bl" className="absolute bottom-3 left-3 text-[color:var(--accent)] opacity-40" />
            <HudFrame corner="br" className="absolute bottom-3 right-3 text-[color:var(--accent)] opacity-40" />

            {/* Toggle */}
            <div className="flex mb-6 border border-[color:var(--border2)] rounded-sm overflow-hidden">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); }}
                  className={`flex-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] py-2.5 transition-colors ${mode === m ? "bg-[color:var(--accent)] text-black" : "text-[color:var(--muted)] hover:text-[color:var(--fg)]"}`}
                >
                  {m === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-[color:var(--muted)] block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Arjun Mehta"
                    className="w-full bg-[color:var(--bg)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent)] transition-colors placeholder:text-[color:var(--muted)] text-[color:var(--fg)]"
                  />
                </div>
              )}
              <div>
                <label className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-[color:var(--muted)] block mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-[color:var(--bg)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent)] transition-colors placeholder:text-[color:var(--muted)] text-[color:var(--fg)]"
                />
              </div>
              <div>
                <label className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-[color:var(--muted)] block mb-1.5">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-[color:var(--bg)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent)] transition-colors placeholder:text-[color:var(--muted)] text-[color:var(--fg)]"
                />
              </div>

              {error && (
                <div className="font-mono text-[0.58rem] text-[color:var(--danger)] border border-[rgba(255,61,107,0.3)] bg-[rgba(255,61,107,0.06)] px-3 py-2 rounded-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading || !form.email || !form.password}
                className="w-full font-mono text-[0.62rem] uppercase tracking-[0.18em] bg-[color:var(--accent)] text-black py-3 rounded-sm disabled:opacity-40 hover:opacity-85 transition-opacity mt-2 relative overflow-hidden"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
                    Authenticating…
                  </span>
                ) : (
                  mode === "login" ? "Sign In" : "Create Account"
                )}
              </button>
            </div>

            {mode === "login" && (
              <div className="mt-4 text-center font-mono text-[0.52rem] text-[color:var(--muted)]">
                Demo: arjun@example.com / password123
              </div>
            )}
          </div>
        </div>

      </main>
    </>
  );
}
