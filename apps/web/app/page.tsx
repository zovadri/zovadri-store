"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/ui";

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [s, setS] = useState<any>({});

  useEffect(() => {
    api("/api/products/featured").then((d: any) => setFeatured(d.items)).catch(() => {});
    api("/api/categories").then((d: any) => setCategories(d.items)).catch(() => {});
    api("/api/settings/public").then((d: any) => setS(d.settings || {})).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <h1>أهلاً بك في {s.name || "زوفادري"}</h1>
        <p>{s.tagline || "تسوّق كل ما تحتاجه في مكان واحد — منتجات أصلية، بائعو جهة أخرى، وشحن لكل المحافظات."}</p>
        <Link href="/products" className="btn btn-outline mt">تسوّق الآن</Link>
      </section>

      <div className="grid-4 grid">
        {categories.slice(0, 4).map((c) => (
          <Link key={c.id} href={`/products?category=${c.id}`} className="card" style={{ padding: 18, textAlign: "center" }}>
            <div style={{ fontSize: 34 }}>{c.icon || "📦"}</div>
            <b>{c.name}</b>
            <div className="small muted">{c.productCount || 0} منتج</div>
          </Link>
        ))}
      </div>

      <div className="section-title">
        <h2>منتجات مميزة</h2>
        <Link href="/products" className="small" style={{ color: "var(--primary)" }}>عرض الكل ←</Link>
      </div>
      <div className="grid grid-4">
        {featured.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </>
  );
}