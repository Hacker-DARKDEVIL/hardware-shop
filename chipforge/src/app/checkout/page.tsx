"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { HudFrame } from "@/components/ui/HudFrame";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";

type Step = "details" | "payment" | "success";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/auth?redirect=/checkout");
  }, [user, router]);

  if (!user) return null;

  const [step, setStep] = useState<Step>("details");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", address: "", city: "", pincode: "", state: ""
  });
  const [orderId] = useState(() => `CF-${Math.floor(10000 + Math.random() * 90000)}`);

  const update = (k: keyof FormData, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const subtotal = total();
  const shipping = subtotal > 999 ? 0 : 49;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + shipping + gst;

  const handleRazorpay = () => {
    setLoading(true);
    // Load Razorpay SDK dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      const options = {
        key: "rzp_test_REPLACE_WITH_YOUR_KEY", // Replace with your Razorpay test key
        amount: grandTotal * 100, // in paise
        currency: "INR",
        name: "ChipForge",
        description: `Order ${orderId}`,
        image: "",
        order_id: "", // In production: from your backend /orders endpoint
        prefill: { name: form.name, email: form.email, contact: form.phone },
        notes: { address: form.address },
        theme: { color: "#00d4ff" },
        handler: () => {
          setLoading(false);
          clearCart();
          setStep("success");
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    };
    script.onerror = () => {
      setLoading(false);
      // Demo fallback: simulate success
      setTimeout(() => { clearCart(); setStep("success"); }, 1000);
    };
    document.body.appendChild(script);
  };

  if (items.length === 0 && step !== "success") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-[60px] flex items-center justify-center">
          <div className="text-center">
            <div className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[color:var(--muted)] mb-4">Your cart is empty</div>
            <Link href="/products" className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[color:var(--accent)] hover:underline">Browse Products →</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[60px]">
        {/* Header */}
        <section className="border-b border-[color:var(--border2)] px-6 md:px-10 py-6 hud-grid">
          <div className="max-w-5xl mx-auto">
            <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--accent)] mb-1 flex items-center gap-1.5">
              <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-[color:var(--accent)]" />
              Secure Checkout
            </div>
            <h1 className="font-sans font-extrabold text-2xl tracking-tight">Complete Your Order</h1>
          </div>
        </section>

        {step === "success" ? (
          <div className="max-w-md mx-auto px-6 py-20 text-center">
            <div className="relative card-surface p-10 mb-6">
              <HudFrame corner="tl" className="absolute top-3 left-3 text-[color:var(--success)] opacity-50" />
              <HudFrame corner="tr" className="absolute top-3 right-3 text-[color:var(--success)] opacity-50" />
              <HudFrame corner="bl" className="absolute bottom-3 left-3 text-[color:var(--success)] opacity-50" />
              <HudFrame corner="br" className="absolute bottom-3 right-3 text-[color:var(--success)] opacity-50" />
              <div className="w-14 h-14 rounded-full bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.4)] flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <div className="font-sans font-extrabold text-2xl mb-2">Order Placed!</div>
              <div className="font-mono text-[0.65rem] text-[color:var(--muted)] mb-4">
                Your order <span className="text-[color:var(--accent)]">{orderId}</span> has been confirmed.
              </div>
              <div className="font-mono text-[0.58rem] text-[color:var(--muted)]">
                Expected delivery: 3–5 business days across India
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/account" className="font-mono text-[0.6rem] uppercase tracking-[0.15em] border border-[color:var(--border)] text-[color:var(--accent)] px-5 py-2.5 rounded-sm hover:bg-[color:var(--accent-dim)] transition-colors">
                View Orders
              </Link>
              <Link href="/products" className="font-mono text-[0.6rem] uppercase tracking-[0.15em] bg-[color:var(--accent)] text-black px-5 py-2.5 rounded-sm hover:opacity-85 transition-opacity">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step indicator */}
              <div className="flex items-center gap-4 mb-6">
                {["details", "payment"].map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[0.55rem] font-bold transition-colors ${step === s || (step === "payment" && s === "details") ? "bg-[color:var(--accent)] border-[color:var(--accent)] text-black" : "border-[color:var(--border2)] text-[color:var(--muted)]"}`}>
                      {i + 1}
                    </div>
                    <span className={`font-mono text-[0.55rem] uppercase tracking-[0.18em] ${step === s ? "text-[color:var(--accent)]" : "text-[color:var(--muted)]"}`}>
                      {s === "details" ? "Delivery" : "Payment"}
                    </span>
                    {i < 1 && <span className="text-[color:var(--border2)] mx-1">—</span>}
                  </div>
                ))}
              </div>

              {step === "details" && (
                <div className="card-surface p-6">
                  <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--accent)] mb-5">Delivery Information</div>
                  <div className="grid grid-cols-2 gap-4">
                    {([
                      { label: "Full Name",  key: "name",    placeholder: "Arjun Mehta",       col: 2 },
                      { label: "Email",      key: "email",   placeholder: "you@example.com",   col: 1 },
                      { label: "Phone",      key: "phone",   placeholder: "+91 98765 43210",   col: 1 },
                      { label: "Address",    key: "address", placeholder: "123, Gandhi Nagar", col: 2 },
                      { label: "City",       key: "city",    placeholder: "Bengaluru",         col: 1 },
                      { label: "PIN Code",   key: "pincode", placeholder: "560001",            col: 1 },
                      { label: "State",      key: "state",   placeholder: "Karnataka",         col: 1 },
                    ] as { label: string; key: keyof FormData; placeholder: string; col: 1 | 2 }[]).map((f) => (
                      <div key={f.key} className={f.col === 2 ? "col-span-2" : ""}>
                        <label className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-[color:var(--muted)] block mb-1.5">{f.label}</label>
                        <input
                          type="text"
                          value={form[f.key]}
                          onChange={(e) => update(f.key, e.target.value)}
                          placeholder={f.placeholder}
                          className="w-full bg-[color:var(--bg)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent)] transition-colors placeholder:text-[color:var(--muted)] text-[color:var(--fg)]"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep("payment")}
                    disabled={!form.name || !form.email || !form.address || !form.city || !form.pincode}
                    className="w-full mt-5 font-mono text-[0.62rem] uppercase tracking-[0.15em] bg-[color:var(--accent)] text-black py-3 rounded-sm disabled:opacity-40 hover:opacity-85 transition-opacity"
                  >
                    Continue to Payment →
                  </button>
                </div>
              )}

              {step === "payment" && (
                <div className="card-surface p-6">
                  <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--accent)] mb-5">Payment Method</div>

                  <div className="border border-[color:var(--border)] rounded-sm p-4 mb-5 bg-[color:var(--accent-dim)]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-[color:var(--accent)]" />
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[color:var(--accent)]">Razorpay — All UPI, Cards & Netbanking</span>
                    </div>
                    <p className="font-mono text-[0.55rem] text-[color:var(--muted)]">
                      Pay securely via Razorpay. Supports UPI (GPay, PhonePe, BHIM), cards, netbanking, and wallets.
                    </p>
                  </div>

                  <div className="text-center py-6 border border-dashed border-[color:var(--border2)] rounded-sm mb-5">
                    <div className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[color:var(--muted)] mb-1">Grand Total</div>
                    <div className="font-sans font-extrabold text-4xl text-[color:var(--accent)]">₹{grandTotal.toLocaleString("en-IN")}</div>
                  </div>

                  <button
                    onClick={handleRazorpay}
                    disabled={loading}
                    className="w-full font-mono text-[0.62rem] uppercase tracking-[0.15em] bg-[color:var(--accent)] text-black py-3 rounded-sm hover:opacity-85 transition-opacity relative overflow-hidden"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Opening Razorpay…
                      </span>
                    ) : (
                      <>Pay ₹{grandTotal.toLocaleString("en-IN")} via Razorpay</>
                    )}
                  </button>

                  <button onClick={() => setStep("details")} className="w-full mt-3 font-mono text-[0.58rem] uppercase tracking-[0.15em] text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors">
                    ← Back to Delivery
                  </button>
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="card-surface p-6 h-fit sticky top-20">
              <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--accent)] mb-4">Order Summary</div>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <div>
                      <div className="font-sans font-semibold text-[0.8rem] leading-tight">{item.product.name}</div>
                      <div className="font-mono text-[0.52rem] text-[color:var(--muted)]">× {item.qty}</div>
                    </div>
                    <span className="font-mono text-[0.65rem] text-[color:var(--fg)]">₹{(item.product.price * item.qty).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[color:var(--border2)] pt-3 space-y-2">
                {[
                  { label: "Subtotal", value: `₹${subtotal.toLocaleString("en-IN")}` },
                  { label: shipping === 0 ? "Shipping (free)" : "Shipping", value: shipping === 0 ? "Free" : `₹${shipping}` },
                  { label: "GST (18%)", value: `₹${gst.toLocaleString("en-IN")}` },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between font-mono text-[0.58rem] text-[color:var(--muted)]">
                    <span>{r.label}</span>
                    <span className="text-[color:var(--fg)]">{r.value}</span>
                  </div>
                ))}
                <div className="flex justify-between font-mono text-[0.62rem] font-bold border-t border-[color:var(--border2)] pt-2">
                  <span className="text-[color:var(--fg)]">Total</span>
                  <span className="text-[color:var(--accent)]">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
              {subtotal < 999 && (
                <div className="mt-3 font-mono text-[0.52rem] text-[color:var(--muted)] text-center">
                  Add ₹{(999 - subtotal).toLocaleString("en-IN")} more for free shipping
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
