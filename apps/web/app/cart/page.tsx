"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, formatPrice, getUser } from "@/lib/api";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    const d = await api<any>("/api/cart");
    setItems(d.items);
    setLoaded(true);
  }

  useEffect(() => { load().catch(() => setLoaded(true)); }, []);

  const total = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);

  async function updateQty(id: string, delta: number) {
    const item = items.find((x) => x.id === id);
    if (!item) return;
    const q = item.quantity + delta;
    if (q < 1) return;
    await api(`/api/cart/${id}`, { method: "PATCH", body: JSON.stringify({ quantity: q }) });
    load();
  }

  async function remove(id: string) {
    await api(`/api/cart/${id}`, { method: "DELETE" });
    load();
  }

  const user = getUser();

  return (
    <>
      <div className="section-title"><h2>سلة التسوق</h2></div>
      {!loaded ? (
        <div className="muted">جارٍ التحميل…</div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <p>السلة فارغة</p>
          <Link href="/products" className="btn btn-primary mt">تسوّق الآن</Link>
        </div>
      ) : (
        <>
          <div className="grid-2 grid">
            <div className="section">
              {items.map((i) => (
                <div key={i.id} className="row" style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  {i.product?.images?.[0] && (
                    <img src={i.product.images[0]} alt="" style={{ width: 70, height: 70, objectFit: "contain", borderRadius: 8 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <Link href={`/products/${i.product.slug}`}><b>{i.product.title}</b></Link>
                    <div className="small muted">{formatPrice(i.product.price)}</div>
                  </div>
                  <div className="row">
                    <button className="btn btn-outline btn-sm" onClick={() => updateQty(i.id, -1)}>-</button>
                    <b>{i.quantity}</b>
                    <button className="btn btn-outline btn-sm" onClick={() => updateQty(i.id, 1)}>+</button>
                  </div>
                  <b style={{ minWidth: 90, textAlign: "center" }}>{formatPrice(i.lineTotal)}</b>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(i.id)}>حذف</button>
                </div>
              ))}
            </div>
            <div className="section" style={{ alignSelf: "start" }}>
              <h3>ملخص الطلب</h3>
              <div className="spread small muted mb"><span>المجموع</span><span>{formatPrice(total)}</span></div>
              <div className="spread small muted mb"><span>الشحن</span><span>يُحسب عند الدفع</span></div>
              <div className="spread mt" style={{ fontSize: 20, fontWeight: 800 }}>
                <span>الإجمالي</span><span>{formatPrice(total)}</span>
              </div>
              {user ? (
                <Link href="/checkout" className="btn btn-primary" style={{ width: "100%", marginTop: 16 }}>إتمام الطلب</Link>
              ) : (
                <Link href="/login?next=/checkout" className="btn btn-primary" style={{ width: "100%", marginTop: 16 }}>سجّل الدخول للمتابعة</Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}