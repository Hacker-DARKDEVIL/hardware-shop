"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { CATEGORIES } from "@/lib/data";
import type { Product } from "@/lib/data";
import { useAdminAuthStore } from "@/store/adminAuth";
import { useProductsStore } from "@/store/products";

const BLANK: Omit<Product, "id"> = {
  name: "", brand: "", brandColor: "#00d4ff", category: "mcu",
  price: 0, inStock: true, description: "", specs: [], tags: [], image: "",
};

type AdminTab = "products" | "add" | "analytics";

export default function AdminPage() {
  const { isAdminAuthenticated, adminLogout } = useAdminAuthStore();
  const { products, addProduct, updateProduct, deleteProduct } = useProductsStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isAdminAuthenticated, router]);

  if (!isAdminAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Redirecting…
        </div>
      </main>
    );
  }

  const [tab, setTab] = useState<AdminTab>("products");
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(BLANK);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const update = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (editing) {
      updateProduct(editing.id, form);
    } else {
      addProduct(form);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setEditing(null); setForm(BLANK); setTab("products"); }, 1500);
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, brand: p.brand, brandColor: p.brandColor, category: p.category, price: p.price, inStock: p.inStock, description: p.description, specs: p.specs, tags: p.tags || [], badge: p.badge, image: p.image || "" });
    setTab("add");
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = products.reduce((s, p) => s + p.price, 0);
  const inStockCount = products.filter((p) => p.inStock).length;

  const TABS: { id: AdminTab; label: string }[] = [
    { id: "products",  label: "Products" },
    { id: "add",       label: editing ? "Edit Product" : "Add Product" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[60px]">
        {/* Admin header */}
        <section className="border-b border-[color:var(--border2)] px-6 md:px-10 py-6 bg-[rgba(124,58,237,0.04)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--accent2)] mb-1 flex items-center gap-1.5">
                <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-[color:var(--accent2)]" />
                Admin Console · ChipForge
              </div>
              <h1 className="font-sans font-extrabold text-2xl tracking-tight">Store Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="font-mono text-[0.58rem] uppercase tracking-[0.16em] border border-[color:var(--border2)] text-[color:var(--muted)] px-4 py-2 rounded-sm hover:text-[color:var(--fg)] transition-colors">
                ← Storefront
              </Link>
              <button
                onClick={() => { adminLogout(); router.push("/admin/login"); }}
                className="font-mono text-[0.58rem] uppercase tracking-[0.16em] border border-[rgba(255,61,107,0.4)] text-[color:var(--danger)] px-4 py-2 rounded-sm hover:bg-[rgba(255,61,107,0.08)] transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <div className="border-b border-[color:var(--border2)] px-6 md:px-10 py-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total SKUs",    value: products.length },
              { label: "In Stock",      value: inStockCount },
              { label: "Out of Stock",  value: products.length - inStockCount },
              { label: "Avg Price",     value: `₹${Math.round(totalValue / products.length).toLocaleString("en-IN")}` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-sans font-extrabold text-xl text-[color:var(--accent2)]">{s.value}</div>
                <div className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
          {/* Tabs */}
          <div className="flex gap-0 border-b border-[color:var(--border2)] mb-8">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); if (t.id !== "add") { setEditing(null); setForm(BLANK); } }}
                className={`font-mono text-[0.58rem] uppercase tracking-[0.18em] px-5 py-3 border-b-2 transition-colors ${tab === t.id ? "border-[color:var(--accent2)] text-[color:var(--accent2)]" : "border-transparent text-[color:var(--muted)] hover:text-[color:var(--fg)]"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Products list */}
          {tab === "products" && (
            <div>
              <div className="flex gap-3 mb-5">
                <input
                  type="text"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-[color:var(--bg2)] border border-[color:var(--border2)] text-[color:var(--fg)] font-mono text-[0.65rem] px-3 py-2 rounded-sm focus:outline-none focus:border-[color:var(--accent2)] transition-colors placeholder:text-[color:var(--muted)]"
                />
                <button
                  onClick={() => setTab("add")}
                  className="font-mono text-[0.58rem] uppercase tracking-[0.15em] bg-[color:var(--accent2)] text-white px-5 py-2 rounded-sm hover:opacity-85 transition-opacity"
                >
                  + Add Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[color:var(--border2)]">
                      {["Image", "Product", "Brand", "Category", "Price", "Stock", "Actions"].map((h) => (
                        <th key={h} className="font-mono text-[0.52rem] uppercase tracking-[0.22em] text-[color:var(--muted)] text-left py-3 px-3 first:pl-0">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id} className="border-b border-[color:var(--border2)] hover:bg-[color:var(--bg2)] transition-colors">
                        <td className="py-3 px-3 pl-0 w-14">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 object-contain rounded-sm border border-[color:var(--border2)] bg-[color:var(--bg2)] p-1"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-sm border border-[color:var(--border2)] bg-[color:var(--bg2)] flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <rect x="1" y="2" width="12" height="10" rx="1" stroke="var(--muted)" strokeWidth="1"/>
                                <circle cx="4.5" cy="5.5" r="1" stroke="var(--muted)" strokeWidth="1"/>
                                <path d="M1 10l3-3 2 2 3-4 4 5" stroke="var(--muted)" strokeWidth="1" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-sans font-semibold text-[0.85rem]">{p.name}</div>
                          {p.badge && <span className="font-mono text-[0.48rem] uppercase tracking-[0.14em] text-[color:var(--accent)]">{p.badge}</span>}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-[0.58rem]" style={{ color: p.brandColor }}>{p.brand}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[color:var(--muted)]">{p.category}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-sans font-bold text-[0.9rem] text-[color:var(--accent)]">₹{p.price.toLocaleString("en-IN")}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`font-mono text-[0.52rem] uppercase tracking-[0.14em] ${p.inStock ? "text-[color:var(--success)]" : "text-[color:var(--danger)]"}`}>
                            {p.inStock ? "● In Stock" : "● OOS"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(p)}
                              className="font-mono text-[0.52rem] uppercase tracking-[0.14em] border border-[color:var(--border2)] text-[color:var(--muted)] px-2.5 py-1 rounded-sm hover:border-[color:var(--accent2)] hover:text-[color:var(--accent2)] transition-colors"
                            >
                              Edit
                            </button>
                            {deleteConfirm === p.id ? (
                              <div className="flex gap-1">
                                <button onClick={() => handleDelete(p.id)} className="font-mono text-[0.52rem] uppercase tracking-[0.14em] bg-[color:var(--danger)] text-white px-2 py-1 rounded-sm">Confirm</button>
                                <button onClick={() => setDeleteConfirm(null)} className="font-mono text-[0.52rem] uppercase tracking-[0.14em] border border-[color:var(--border2)] text-[color:var(--muted)] px-2 py-1 rounded-sm">Cancel</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(p.id)}
                                className="font-mono text-[0.52rem] uppercase tracking-[0.14em] border border-[color:var(--border2)] text-[color:var(--muted)] px-2.5 py-1 rounded-sm hover:border-[color:var(--danger)] hover:text-[color:var(--danger)] transition-colors"
                              >
                                Del
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add/Edit product form */}
          {tab === "add" && (
            <div className="max-w-2xl">
              <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--accent2)] mb-6">
                {editing ? `Editing: ${editing.name}` : "New Product"}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Product Name", key: "name",  placeholder: "ESP32-S3-WROOM-1" },
                    { label: "Brand",        key: "brand", placeholder: "Espressif" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-[color:var(--muted)] block mb-1.5">{f.label}</label>
                      <input
                        type="text"
                        value={String((form as Record<string, unknown>)[f.key] || "")}
                        onChange={(e) => update(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full bg-[color:var(--bg2)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent2)] transition-colors placeholder:text-[color:var(--muted)] text-[color:var(--fg)]"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-[color:var(--muted)] block mb-1.5">Price (₹)</label>
                    <input
                      type="number"
                      value={form.price || ""}
                      onChange={(e) => update("price", Number(e.target.value))}
                      className="w-full bg-[color:var(--bg2)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent2)] transition-colors text-[color:var(--fg)]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-[color:var(--muted)] block mb-1.5">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => update("category", e.target.value)}
                      className="w-full bg-[color:var(--bg2)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent2)] transition-colors text-[color:var(--fg)]"
                    >
                      {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-[color:var(--muted)] block mb-1.5">Brand Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={form.brandColor}
                        onChange={(e) => update("brandColor", e.target.value)}
                        className="w-10 h-[38px] bg-transparent border border-[color:var(--border2)] rounded-sm cursor-pointer"
                      />
                      <span className="font-mono text-[0.6rem] text-[color:var(--muted)]">{form.brandColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-[color:var(--muted)] block mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    className="w-full bg-[color:var(--bg2)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent2)] transition-colors text-[color:var(--fg)] resize-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-[color:var(--muted)] block mb-1.5">Product Image URL</label>
                  <div className="flex gap-3 items-start">
                    <input
                      type="text"
                      value={(form as Record<string, unknown>).image as string || ""}
                      onChange={(e) => update("image", e.target.value)}
                      placeholder="https://example.com/product.jpg"
                      className="flex-1 bg-[color:var(--bg2)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent2)] transition-colors placeholder:text-[color:var(--muted)] text-[color:var(--fg)]"
                    />
                    {((form as Record<string, unknown>).image as string) && (
                      <div className="w-16 h-16 rounded-sm border border-[color:var(--border2)] bg-[color:var(--bg2)] flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={(form as Record<string, unknown>).image as string}
                          alt="Preview"
                          className="w-full h-full object-contain p-1"
                          onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="font-mono text-[0.48rem] uppercase tracking-[0.16em] text-[color:var(--muted)] mt-1 opacity-60">
                    Paste a direct image URL — preview updates live
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-[color:var(--muted)] block mb-1.5">Badge</label>
                    <select
                      value={form.badge || ""}
                      onChange={(e) => update("badge", e.target.value || undefined)}
                      className="w-full bg-[color:var(--bg2)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent2)] transition-colors text-[color:var(--fg)]"
                    >
                      <option value="">None</option>
                      <option value="new">New</option>
                      <option value="popular">Popular</option>
                      <option value="sale">Sale</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-2.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => update("inStock", !form.inStock)}
                        className={`w-5 h-5 border rounded-sm flex items-center justify-center transition-colors ${form.inStock ? "bg-[color:var(--success)] border-[color:var(--success)]" : "border-[color:var(--border2)]"}`}
                      >
                        {form.inStock && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5L4.5 7.5L8 3" stroke="black" strokeWidth="1.5" fill="none"/></svg>}
                      </div>
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">In Stock</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={!form.name || !form.brand || !form.price}
                    className={`font-mono text-[0.6rem] uppercase tracking-[0.15em] px-6 py-3 rounded-sm transition-all disabled:opacity-40 ${saved ? "bg-[rgba(34,197,94,0.2)] border border-[rgba(34,197,94,0.4)] text-[color:var(--success)]" : "bg-[color:var(--accent2)] text-white hover:opacity-85"}`}
                  >
                    {saved ? "Saved ✓" : (editing ? "Save Changes" : "Create Product")}
                  </button>
                  <button
                    onClick={() => { setTab("products"); setEditing(null); setForm(BLANK); }}
                    className="font-mono text-[0.6rem] uppercase tracking-[0.15em] border border-[color:var(--border2)] text-[color:var(--muted)] px-5 py-3 rounded-sm hover:text-[color:var(--fg)] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics */}
          {tab === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-surface p-6">
                <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--accent2)] mb-4">Products by Category</div>
                {CATEGORIES.map((cat) => {
                  const count = products.filter((p) => p.category === cat.id).length;
                  const pct = Math.round((count / products.length) * 100);
                  return (
                    <div key={cat.id} className="mb-3">
                      <div className="flex justify-between font-mono text-[0.58rem] uppercase tracking-[0.12em] mb-1">
                        <span className="text-[color:var(--muted)]">{cat.icon} {cat.name}</span>
                        <span className="text-[color:var(--fg)]">{count}</span>
                      </div>
                      <div className="h-1 bg-[color:var(--bg2)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[color:var(--accent2)] transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="card-surface p-6">
                <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--accent2)] mb-4">Price Range Distribution</div>
                {[
                  { label: "Under ₹500",     filter: (p: Product) => p.price < 500 },
                  { label: "₹500–₹1,000",    filter: (p: Product) => p.price >= 500 && p.price < 1000 },
                  { label: "₹1,000–₹5,000",  filter: (p: Product) => p.price >= 1000 && p.price < 5000 },
                  { label: "₹5,000+",        filter: (p: Product) => p.price >= 5000 },
                ].map((range) => {
                  const count = products.filter(range.filter).length;
                  const pct = Math.round((count / products.length) * 100);
                  return (
                    <div key={range.label} className="mb-3">
                      <div className="flex justify-between font-mono text-[0.58rem] uppercase tracking-[0.12em] mb-1">
                        <span className="text-[color:var(--muted)]">{range.label}</span>
                        <span className="text-[color:var(--fg)]">{count}</span>
                      </div>
                      <div className="h-1 bg-[color:var(--bg2)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[color:var(--accent)] transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="card-surface p-6 md:col-span-2">
                <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--accent2)] mb-4">Stock Status</div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="font-sans font-extrabold text-3xl text-[color:var(--success)]">{inStockCount}</div>
                    <div className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-[color:var(--muted)] mt-1">Available</div>
                  </div>
                  <div>
                    <div className="font-sans font-extrabold text-3xl text-[color:var(--danger)]">{products.length - inStockCount}</div>
                    <div className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-[color:var(--muted)] mt-1">Out of Stock</div>
                  </div>
                  <div>
                    <div className="font-sans font-extrabold text-3xl text-[color:var(--accent)]">{Math.round((inStockCount / products.length) * 100)}%</div>
                    <div className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-[color:var(--muted)] mt-1">Fill Rate</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
