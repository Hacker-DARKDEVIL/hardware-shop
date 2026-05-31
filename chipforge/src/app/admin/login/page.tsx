"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HudFrame } from "@/components/ui/HudFrame";
import { useAdminAuthStore } from "@/store/adminAuth";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { adminLogin, isLoading } = useAdminAuthStore();
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    if (!form.username || !form.password) {
      setError("Both fields are required.");
      return;
    }
    const res = await adminLogin(form.username, form.password);
    if (res.success) router.push("/admin");
    else setError(res.error || "Login failed.");
  };

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <main className="min-h-screen flex items-center justify-center px-6 hud-grid bg-[color:var(--bg)]">
      <div className="w-full max-w-sm">
        {/* Logo / branding */}
        <div className="text-center mb-10">
          <Link href="/" className="font-sans font-extrabold text-2xl tracking-tight">
            Chip<span className="text-[color:var(--accent)]">Forge</span>
          </Link>
          <div className="font-mono text-[0.52rem] uppercase tracking-[0.3em] text-[color:var(--accent2)] mt-1">
            Admin Console Access
          </div>
          <div className="mt-3 flex justify-center">
            <div className="flex items-center gap-1.5 border border-[rgba(124,58,237,0.35)] bg-[rgba(124,58,237,0.07)] rounded-sm px-3 py-1">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="1" y="4" width="8" height="5.5" rx="0.8" stroke="var(--accent2)" strokeWidth="1"/>
                <path d="M3 4V3a2 2 0 0 1 4 0v1" stroke="var(--accent2)" strokeWidth="1"/>
              </svg>
              <span className="font-mono text-[0.5rem] uppercase tracking-[0.22em] text-[color:var(--accent2)]">
                Restricted Area
              </span>
            </div>
          </div>
        </div>

        <div className="relative card-surface p-8">
          <HudFrame corner="tl" className="absolute top-3 left-3 text-[color:var(--accent2)] opacity-40" />
          <HudFrame corner="tr" className="absolute top-3 right-3 text-[color:var(--accent2)] opacity-40" />
          <HudFrame corner="bl" className="absolute bottom-3 left-3 text-[color:var(--accent2)] opacity-40" />
          <HudFrame corner="br" className="absolute bottom-3 right-3 text-[color:var(--accent2)] opacity-40" />

          <div className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-[color:var(--muted)] mb-6 text-center">
            Administrator Login
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-mono text-[0.52rem] uppercase tracking-[0.22em] text-[color:var(--muted)] block mb-1.5">
                Admin Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
                placeholder="Enter admin username"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoComplete="username"
                className="w-full bg-[color:var(--bg)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent2)] transition-colors placeholder:text-[color:var(--muted)] text-[color:var(--fg)]"
              />
            </div>

            <div>
              <label className="font-mono text-[0.52rem] uppercase tracking-[0.22em] text-[color:var(--muted)] block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="••••••••••••"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  autoComplete="current-password"
                  className="w-full bg-[color:var(--bg)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 pr-10 rounded-sm focus:outline-none focus:border-[color:var(--accent2)] transition-colors placeholder:text-[color:var(--muted)] text-[color:var(--fg)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1l12 12M6 3.2A5.5 5.5 0 0 1 13 7a5.45 5.45 0 0 1-1.5 2.5M3.5 3.5A5.5 5.5 0 0 0 1 7c1 2.5 3.5 4.5 6 4.5a5.4 5.4 0 0 0 2.5-.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7c1-3 3.5-5 6-5s5 2 6 5c-1 3-3.5 5-6 5S2 10 1 7z" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="7" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="font-mono text-[0.58rem] text-[color:var(--danger)] border border-[rgba(255,61,107,0.3)] bg-[rgba(255,61,107,0.06)] px-3 py-2 rounded-sm flex items-center gap-2">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke="var(--danger)" strokeWidth="1"/>
                  <path d="M5 3v2.5M5 7h.01" stroke="var(--danger)" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading || !form.username || !form.password}
              className="w-full font-mono text-[0.62rem] uppercase tracking-[0.18em] bg-[color:var(--accent2)] text-white py-3 rounded-sm disabled:opacity-40 hover:opacity-85 transition-opacity mt-2 relative overflow-hidden"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating…
                </span>
              ) : (
                "Access Admin Panel"
              )}
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-[color:var(--border2)] text-center">
            <Link
              href="/auth"
              className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
            >
              ← Back to Customer Login
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center font-mono text-[0.48rem] uppercase tracking-[0.18em] text-[color:var(--muted)] opacity-50">
          Unauthorized access attempts are logged
        </div>
      </div>
    </main>
  );
}
