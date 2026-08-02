"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, apiUrl, formatPrice, getUser } from "@/lib/api";
import { Badge } from "@/components/ui";

export default function AdminPage() {
  return <AdminMain />;
}

function AdminMain() {
  const [tab, setTab] = useState("dashboard");
  const [dash, setDash] = useState<any>(null);
  const [orders, setOrders] = useState<any>(null);
  const [sellers, setSellers] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState({ status: "", paymentStatus: "" });
  const [err, setErr] = useState("");
  const [proof, setProof] = useState<string | null>(null);

  useEffect(() => {
    if (getUser()?.role !== "ADMIN") {
      setErr("ليس لديك صلاحية الوصول — يستخدم الأدمن فقط");
      return;
    }
    api<any>("/api/admin/dashboard").then(setDash).catch((e) => setErr(e.message));
    loadOrders();
    api<any>("/api/admin/sellers").then((d) => setSellers(d.items)).catch(() => {});
    api<any>("/api/admin/payouts").then((d) => setPayouts(d.items)).catch(() => {});
    api<any>("/api/admin/products").then((d) => setProducts(d.items)).catch(() => {});
  }, []);

  function loadOrders() {
    const q = new URLSearchParams();
    if (filter.status) q.set("status", filter.status);
    if (filter.paymentStatus) q.set("paymentStatus", filter.paymentStatus);
    api<any>(`/api/admin/orders?${q}`).then(setOrders).catch((e) => setErr(e.message));
  }

  async function setOrderStatus(id: string, status: string, trackingCode?: string) {
    await api(`/api/admin/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status, trackingCode }) });
    loadOrders();
  }

  async function paymentAction(id: string, action: "confirm" | "reject") {
    let reason: string | undefined;
    if (action === "reject") {
      reason = prompt("سبب رفض الدفع:") || "الدفع مرفوض";
    }
    await api(`/api/admin/orders/${id}/payment`, { method: "POST", body: JSON.stringify({ action, reason }) });
    loadOrders();
  }

  async function sellerStatus(id: string, status: string) {
    await api(`/api/admin/sellers/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });
    api<any>("/api/admin/sellers").then((d) => setSellers(d.items));
  }

  async function payPayout(id: string) {
    await api(`/api/admin/payouts/${id}/pay`, { method: "POST", body: JSON.stringify({}) });
    api<any>("/api/admin/payouts").then((d) => setPayouts(d.items));
  }

  const tabs: [string, string][] = [
    ["dashboard", "لوحة التحكم"],
    ["orders", "الطلبات"],
    ["sellers", "البائعون"],
    ["payouts", "السحوبات"],
    ["products", "المنتجات"],
  ];

  return (
    <>
      <div className="spread wrap" style={{ marginTop: 16 }}>
        <h2>🗂️ لوحة الأدمن</h2>
        <Link href="/admin/settings" className="btn btn-primary btn-sm">⚙️ الإعدادات</Link>
      </div>
      {err && <div className="error-box mt">{err}</div>}

      <div className="tabbar">
        {tabs.map(([t, label]) => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{label}</button>
        ))}
      </div>

      {tab === "dashboard" && dash && (
        <>
          <div className="kpi">
            <div className="card"><span className="muted small">الطلبات</span><b>{dash.stats.orders}</b></div>
            <div className="card"><span className="muted small">الإيرادات</span><b>{formatPrice(dash.stats.revenue)}</b></div>
            <div className="card"><span className="muted small">المنتجات</span><b>{dash.stats.products}</b></div>
            <div className="card"><span className="muted small">البائعون</span><b>{dash.stats.sellers}</b></div>
            <div className="card"><span className="muted small">بانتظار موافقة</span><b style={{ color: "var(--amber)" }}>{dash.stats.pendingSellers}</b></div>
          </div>
          <div className="section">
            <h3>أحدث الطلبات</h3>
            <table className="table">
              <thead><tr><th>الطلب</th><th>العميل</th><th>الحالة</th><th>الدفع</th><th>المبلغ</th></tr></thead>
              <tbody>
                {dash.recentOrders.map((o: any) => (
                  <tr key={o.id}>
                    <td><b>{o.orderNumber}</b></td>
                    <td>{o.User?.name || "—"}</td>
                    <td><Badge value={o.status} /></td>
                    <td><Badge value={o.paymentStatus} /></td>
                    <td>{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "orders" && (
        <>
          <div className="admin-toolbar">
            <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
              <option value="">كل الحالات</option>
              {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filter.paymentStatus} onChange={(e) => setFilter({ ...filter, paymentStatus: e.target.value })}>
              <option value="">كل حالات الدفع</option>
              {["UNPAID", "PENDING_VERIFICATION", "PAID", "FAILED"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn btn-outline btn-sm" onClick={() => { setFilter({ status: "", paymentStatus: "" }); setTimeout(loadOrders, 0); }}>تصفير</button>
          </div>

          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>الطلب</th><th>العميل</th><th>المبلغ</th><th>الحالة</th><th>الدفع</th>
                  <th>فودافون كاش</th><th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {(orders?.items || []).map((o: any) => (
                  <tr key={o.id}>
                    <td><b>{o.orderNumber}</b></td>
                    <td className="small">{o.User?.name}<br /><span className="muted">{o.User?.phone}</span></td>
                    <td>{formatPrice(o.total)}</td>
                    <td><Badge value={o.status} /></td>
                    <td><Badge value={o.paymentStatus} /></td>
                    <td>
                      {o.paymentMethod === "VODAFONE_CASH" ? (
                        <div className="small">
                          {o.paymentProof ? (
                            <a href="#" onClick={(e) => { e.preventDefault(); setProof(`${apiUrl}${o.paymentProof}`); }} style={{ color: "var(--primary)" }}>مشاهدة الصورة</a>
                          ) : "—"}
                          {o.walletPhone && <div className="muted">{o.walletPhone}</div>}
                          {o.paymentStatus === "PENDING_VERIFICATION" && (
                            <div className="row mt-sm">
                              <button className="btn btn-success btn-sm" onClick={() => paymentAction(o.id, "confirm")}>تأكيد</button>
                              <button className="btn btn-danger btn-sm" onClick={() => paymentAction(o.id, "reject")}>رفض</button>
                            </div>
                          )}
                          {o.paymentStatus === "FAILED" && <div className="muted small">{o.paymentRejectReason}</div>}
                        </div>
                      ) : (
                        <span className="small muted">—</span>
                      )}
                    </td>
                    <td>
                      <select
                        className="small"
                        value={o.status}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "SHIPPED") setOrderStatus(o.id, v);
                          else setOrderStatus(o.id, v);
                        }}
                        style={{ padding: 6, borderRadius: 8, border: "1px solid var(--border)" }}
                      >
                        {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {o.trackingCode && <div className="small muted mt-sm">تتبع: {o.trackingCode}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "sellers" && (
        <div className="card">
          <table className="table">
            <thead><tr><th>المتجر</th><th>المالك</th><th>التواصل</th><th>الحالة</th><th>عمولة</th><th></th></tr></thead>
            <tbody>
              {sellers.map((s) => (
                <tr key={s.id}>
                  <td><b>{s.storeName}</b></td>
                  <td>{s.User?.name}</td>
                  <td className="small">{s.User?.email}<br />{s.User?.phone}</td>
                  <td><Badge value={s.status} /></td>
                  <td>{Math.round(Number(s.commissionRate) * 100)}%</td>
                  <td>
                    {s.status === "PENDING" && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => sellerStatus(s.id, "APPROVED")}>موافقة</button>{" "}
                        <button className="btn btn-danger btn-sm" onClick={() => sellerStatus(s.id, "REJECTED")}>رفض</button>
                      </>
                    )}
                    {s.status === "APPROVED" && <button className="btn btn-outline btn-sm" onClick={() => sellerStatus(s.id, "SUSPENDED")}>إيقاف</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "payouts" && (
        <div className="card">
          <table className="table">
            <thead><tr><th>المتجر</th><th>المبلغ</th><th>الحالة</th><th></th></tr></thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td><b>{p.Seller?.storeName || "—"}</b></td>
                  <td>{formatPrice(p.amount)}</td>
                  <td><Badge value={p.status} /></td>
                  <td>
                    {p.status === "PENDING" && <button className="btn btn-success btn-sm" onClick={() => payPayout(p.id)}>تسديد</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "products" && (
        <div className="card">
          <table className="table">
            <thead><tr><th>المنتج</th><th>البائع</th><th>الفئة</th><th>السعر</th><th>الحالة</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><b>{p.title}</b></td>
                  <td className="small muted">{p.Seller?.storeName || "—"}</td>
                  <td>{p.Category?.name || "—"}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td><Badge value={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {proof && <ProoFModal img={proof} onClose={() => setProof(null)} />}
    </>
  );
}

function ProoFModal({ img, onClose }: { img: string; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", padding: 16, borderRadius: 14, maxWidth: 480 }}>
        <div className="spread"><b>صورة التحويل</b><button onClick={onClose} className="btn btn-outline btn-sm">إغلاق</button></div>
        <img src={img} alt="proof" style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: 10, marginTop: 8 }} />
      </div>
    </div>
  );
}