"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, getUser, logout, formatPrice } from "@/lib/api";
import { Badge } from "@/components/ui";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    api("/api/auth/me").then((d: any) => setUser((prev: any) => ({ ...prev, ...d.user }))).catch(() => {});
    api<any>("/api/orders").then((d: any) => setOrders(d.items)).catch(() => {});
  }, []);

  if (!user) {
    return <div className="onboarding"><div className="card"><p>سجّل دخولك أولاً</p><Link href="/login" className="btn btn-primary mt">دخول</Link></div></div>;
  }

  return (
    <>
      <div className="section-title"><h2>حسابي</h2></div>
      <div className="section">
        <div className="row wrap">
          <div style={{ fontSize: 40 }}>👤</div>
          <div style={{ flex: 1 }}>
            <b>{user.name}</b>
            <div className="small muted">{user.email} • {user.phone}</div>
          </div>
          <Badge value={user.role} />
        </div>
        {user.role === "SELLER" && !user.seller && (
          <Link href="/seller/apply" className="btn btn-primary btn-sm mt">أكمل بيانات متجرك</Link>
        )}
      </div>

      <div className="section-title"><h2>طلباتي ({orders.length})</h2></div>
      {orders.length === 0 ? (
        <div className="card" style={{ padding: 30, textAlign: "center" }}>
          <p className="muted">لا توجد طلبات بعد</p>
          <Link href="/products" className="btn btn-primary btn-sm mt">تسوّق الآن</Link>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead><tr><th>الطلب</th><th>التاريخ</th><th>الحالة</th><th>الدفع</th><th>الإجمالي</th><th></th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><b>{o.orderNumber}</b></td>
                  <td className="small muted">{new Date(o.createdAt).toLocaleDateString("ar-EG")}</td>
                  <td><Badge value={o.status} /></td>
                  <td><Badge value={o.paymentStatus} /></td>
                  <td><b>{formatPrice(o.total)}</b></td>
                  <td><Link href={`/orders/${o.id}`} className="small" style={{ color: "var(--primary)" }}>التفاصيل</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}