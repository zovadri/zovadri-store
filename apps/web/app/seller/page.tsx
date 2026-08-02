"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, formatPrice } from "@/lib/api";
import { Badge } from "@/components/ui";

type Tab = "overview" | "products" | "orders" | "payouts";

export default function SellerPage() {
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [err, setErr] = useState("");
  const [catList, setCatList] = useState<any[]>([]);
  const [prodForm, setProdForm] = useState<any>({ title: "", price: "", categoryId: "", stock: 1, description: "" });

  function load() {
    return api<any>("/api/seller/dashboard")
      .then(setData)
      .catch((e) => setErr(e.message));
  }

  useEffect(() => {
    load();
    api<any>("/api/categories").then((d) => setCatList(d.items));
  }, []);

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api("/api/seller/products", { method: "POST", body: JSON.stringify(prodForm) });
      setProdForm({ title: "", price: "", categoryId: "", stock: 1, description: "" });
      await load();
      setTab("products");
    } catch (er: any) { setErr(er.message); }
  }

  async function deleteProduct(id: string) {
    if (!confirm("حذف المنتج؟")) return;
    await api(`/api/seller/products/${id}`, { method: "DELETE" });
    load();
  }

  async function requestPayout(amount: number) {
    try {
      await api("/api/seller/request-payout", { method: "POST", body: JSON.stringify({ amount }) });
      await load();
    } catch (e: any) { setErr(e.message); }
  }

  if (err && !data) {
    return <div className="onboarding"><div className="card"><p>{err}</p><Link href="/seller/apply" className="btn btn-primary mt">كيف أنضم؟</Link></div></div>;
  }
  if (!data) return <div className="onboarding"><div className="card">جارٍ التحميل…</div></div>;

  const s = data.stats;
  const pendingStore = data.seller.status === "PENDING";

  return (
    <>
      <div className="spread wrap" style={{ marginTop: 16 }}>
        <h2>🏪 {data.seller.storeName} <Badge value={data.seller.status} /></h2>
        <Link href="/" className="btn btn-outline btn-sm">العودة للأسواق</Link>
      </div>

      {pendingStore && (
        <div className="error-box mt">متجرك بانتظار مراجعة الأدمن — لا يمكنك إضافة منتجات حتى الآن.</div>
      )}

      <div className="tabbar">
        {([["overview", "نظرة عامة"], ["products", "المنتجات"], ["orders", "الطلبات"], ["payouts", "السحوبات"]] as [Tab, string][]).map(([t, label]) => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div className="kpi">
            <div className="card"><span className="muted small">المنتجات</span><b>{s.products}</b></div>
            <div className="card"><span className="muted small">الطلبات</span><b>{s.orders}</b></div>
            <div className="card"><span className="muted small">طلبات معلقة</span><b>{s.pendingOrders}</b></div>
            <div className="card"><span className="muted small">المبيعات</span><b>{formatPrice(s.revenue)}</b></div>
            <div className="card"><span className="muted small">الرصيد القابل للسحب</span><b style={{ color: "var(--green)" }}>{formatPrice(s.balance)}</b></div>
          </div>

          {Number(s.balance) > 0 && (
            <div className="section">
              <h3>طلب سحب الأرباح</h3>
              <div className="row">
                <input id="payoutAmt" type="number" placeholder={`المبلغ (الرصيد ${formatPrice(s.balance)})`}
                  defaultValue={s.balance} style={{ flex: 1, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 10 }} />
                <button className="btn btn-primary" onClick={() => requestPayout(Number((document.getElementById("payoutAmt") as HTMLInputElement).value))}>طلب السحب</button>
              </div>
            </div>
          )}

          <div className="section">
            <h3>آخر الطلبات</h3>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>الطلب</th><th>العميل</th><th>منتجات</th><th>الحالة</th><th>الإجمالي</th></tr></thead>
                <tbody>
                  {data.orders.slice(0, 10).map((o: any) => (
                    <tr key={o.id}>
                      <td><b>{o.orderNumber}</b></td>
                      <td>{o.User?.name || "—"}</td>
                      <td className="small">{o.OrderItem.map((x: any) => x.title).join("، ")}</td>
                      <td><Badge value={o.status} /></td>
                      <td>{formatPrice(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "products" && (
        <>
          {data.seller.status === "APPROVED" && (
            <form className="section" onSubmit={createProduct} style={{ backgroundColor: "#fbfaff" }}>
              <h3>إضافة منتج جديد</h3>
              <div className="grid-2 grid">
                <div className="field"><label>العنوان</label><input value={prodForm.title} onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })} required /></div>
                <div className="field"><label>السعر (ج.م)</label><input type="number" value={prodForm.price} onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })} required /></div>
                <div className="field"><label>الفئة</label>
                  <select value={prodForm.categoryId} onChange={(e) => setProdForm({ ...prodForm, categoryId: e.target.value })} required>
                    <option value="">اختر فئة</option>
                    {catList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select></div>
                <div className="field"><label>الكمية</label><input type="number" min={0} value={prodForm.stock} onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })} /></div>
              </div>
              <div className="field"><label>الوصف</label><textarea rows={3} value={prodForm.description} onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })} /></div>
              {err && <div className="error-box">{err}</div>}
              <button className="btn btn-primary">إضافة</button>
            </form>
          )}

          <div className="card mt">
            <table className="table">
              <thead><tr><th>المنتج</th><th>السعر</th><th>الكمية</th><th>الحالة</th><th></th></tr></thead>
              <tbody>
                {data.products.map((p: any) => (
                  <tr key={p.id}>
                    <td><Link href={`/products/${p.slug}`}><b>{p.title}</b></Link></td>
                    <td>{formatPrice(p.price)}</td>
                    <td>{p.stock}</td>
                    <td><Badge value={p.status} /></td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p.id)}>حذف</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "orders" && (
        <div className="card">
          <table className="table">
            <thead><tr><th>الطلب</th><th>العميل</th><th>الحالة</th><th>الدفع</th><th>الإجمالي</th></tr></thead>
            <tbody>
              {data.orders.map((o: any) => (
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
      )}

      {tab === "payouts" && (
        <div className="card">
          <table className="table">
            <thead><tr><th>التاريخ</th><th>المبلغ</th><th>الحالة</th></tr></thead>
            <tbody>
              {(data.payouts || []).map((p: any) => (
                <tr key={p.id}>
                  <td>{new Date(p.createdAt).toLocaleDateString("ar-EG")}</td>
                  <td>{formatPrice(p.amount)}</td>
                  <td><Badge value={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}