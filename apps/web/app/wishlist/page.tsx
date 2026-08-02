"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, formatPrice } from "@/lib/api";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    const d = await api<any>("/api/wishlist");
    setItems(d.items);
  }

  useEffect(() => { load().catch(() => {}); }, []);

  async function remove(productId: string) {
    await api(`/api/wishlist/${productId}`, { method: "DELETE" });
    load();
  }

  return (
    <>
      <div className="section-title"><h2>المفضلة ({items.length})</h2></div>
      {items.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <p className="muted">لا توجد منتجات في المفضلة</p>
          <Link href="/products" className="btn btn-primary btn-sm mt">تصفح المنتجات</Link>
        </div>
      ) : (
        <div className="card">
          {items.map((w) => {
            const p = w.product;
            return (
              <div key={w.id} className="row" style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
                {p.images?.[0] && <img src={p.images[0]} alt="" style={{ width: 60, height: 60, objectFit: "contain" }} />}
                <div style={{ flex: 1 }}>
                  <Link href={`/products/${p.slug}`}><b>{p.title}</b></Link>
                  <div className="small muted">{formatPrice(p.price)}</div>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => remove(w.product.id)}>حذف</button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}