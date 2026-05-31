"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";

const NAV_LINKS = [
  { label: "Microcontrollers", href: "/products?category=mcu" },
  { label: "Dev Boards",       href: "/products?category=wireless" },
  { label: "Sensors",          href: "/products?category=sensors" },
  { label: "All Products",     href: "/products" },
];

export function Navbar() {
  const { count, openCart } = useCartStore();
  const { user } = useAuthStore();

  // Prevent hydration mismatch — localStorage data only available client-side
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const itemCount = mounted ? count() : 0;
  const resolvedUser = mounted ? user : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-[60px] border-b border-[color:var(--border2)] bg-[rgba(7,8,10,0.75)] backdrop-blur-lg">
      {/* Logo */}
      <Link href="/" className="font-sans font-extrabold text-[1.1rem] tracking-tight text-[color:var(--fg)] shrink-0">
        Chip<span className="text-[color:var(--accent)]">Forge</span>
      </Link>

      {/* Nav links */}
      <ul className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[color:var(--muted)] hover:text-[color:var(--accent)] transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right actions */}
      <div className="flex items-center gap-3 shrink-0">
        {resolvedUser ? (
          <Link
            href="/account"
            className="hidden md:flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[color:var(--muted)] hover:text-[color:var(--accent)] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)]" />
            {resolvedUser.name.split(" ")[0]}
          </Link>
        ) : (
          <Link
            href="/auth"
            className="hidden md:block font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[color:var(--muted)] hover:text-[color:var(--accent)] transition-colors"
          >
            Sign In
          </Link>
        )}

        <button
          onClick={openCart}
          className="relative font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[color:var(--muted)] hover:text-[color:var(--accent)] transition-colors duration-200"
          aria-label="Open cart"
        >
          Cart
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-3 w-4 h-4 rounded-full bg-[color:var(--accent)] text-black text-[9px] font-bold flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
