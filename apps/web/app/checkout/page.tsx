"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [site, setSite] = useState<any>(null);
  const [method, setMethod] = useState("CASH_ON_DELIVERY");
  const [coupon, setCoupon] = useState("");
  const [couponInfo, setCouponInfo] = useState<any>(null);
  const [couponErr, setCouponErr] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [walletPhone, setWalletPhone] = useState("");
  const [form, setForm] = useState({ fullName: "", phone: "", governorate: "", city: "", district: "", street: "", building: "", floor: "", apartment: "", landmark: "" });

  useEffect(() => {
    Promise.all([api<any>("/api/cart"), api<any>("/api/settings/public")])
      .then(([c, s]) => {
        setCart(c);
        setSite(s.settings);
        setForm((f) => ({ ...f, governorate: Object.keys(s.settings.governorates || {})[0] || "" }));
      })
      .catch(() => setErr("تعذر تحميل السلة. سجّل الدخول أولاً"));
  }, []);

  const subtotal = (cart?.items || []).reduce((s: number, i: any) => s + Number(i.product.price) * i.quantity, 0);
  const hasCoupon = coupon.trim().length > 0;
  const discount = couponInfo ? Number(couponInfo.value) : 0;
  const shipping = subtotal - discount >= (site?.freeShippingThreshold || 1500) ? 0 : site?.governorates?.[form.governorate] || 0;
  const codFee = method === "CASH_ON_DELIVERY" ? Number(site?.codFee || 20) : 0;
  const total = Math.max(0, subtotal - discount) + shipping + codFee;

  async function validateCoupon() {
    setCouponErr("");
    setCouponInfo(null);
    if (!coupon.trim()) return;
    try {
      const d = await api<any>(`/api/coupons/validate?code=${encodeURIComponent(coupon)}`);
      setCouponInfo(d.coupon);
    } catch (e: any) {
      setCouponErr(e.message);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      const body = {
        ...form,
        paymentMethod: method,
        couponCode: hasCoupon ? coupon : "",
        walletPhone: method === "VODAFONE_CASH" ? walletPhone : undefined,
      };
      const d = await api<any>("/api/checkout", { method: "POST", body: JSON.stringify(body) });
      router.push(`/orders/${d.order.id}`);
    } catch (e: any) {
      setErr(e.message);
      setSubmitting(false);
    }
  }

  const cur = (n: number) => `${Math.round((n || 0) * 100) / 100} ج.م`;

  if (!cart) {
    return <div className="onboarding"><div className="card">{err || "جارٍ التحميل…"}</div></div>;
  }
  if (cart.items.length === 0) {
    return <div className="onboarding"><div className="card"><p>السلة فارغة</p></div></div>;
  }

  return (
    <>
      <div className="section-title"><h2>إتمام الطلب</h2></div>
      {err && <div className="error-box">{err}</div>}
      <form onSubmit={submit} className="grid-2 grid" style={{ alignItems: "start" }}>
        <div>
          <div className="section">
            <h3>بيانات الشحن</h3>
            <div className="field"><label>الاسم كاملاً</label>
              <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></div>
            <div className="field"><label>رقم الهاتف</label>
              <input dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
            <div className="field"><label>المحافظة</label>
              <select value={form.governorate} onChange={(e) => setForm({ ...form, governorate: e.target.value })} required>
                {Object.keys(site?.governorates || {}).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select></div>
            <div className="field"><label>المدينة</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div className="field"><label>الحي</label>
              <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></div>
            <div className="field"><label>الشارع والمنزل</label>
              <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required /></div>
            <div className="grid-3 grid">
              <div className="field"><label>وحدة</label><input value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} /></div>
              <div className="field"><label>دور</label><input value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} /></div>
              <div className="field"><label>شقة</label><input value={form.apartment} onChange={(e) => setForm({ ...form, apartment: e.target.value })} /></div>
            </div>
          </div>

          <div className="section">
            <h3>طريقة الدفع</h3>
            {[
              { id: "CASH_ON_DELIVERY", label: "كاش عند الاستلام", desc: `رسوم استلام ${site?.codFee || 20} ج.م` },
              { id: "CARD", label: "بطاقة دفع", desc: "دفع مباشر عبر البطاقة" },
              { id: "VODAFONE_CASH", label: "فودافون كاش", desc: "تحويل سريع + رفع صورة التحويل" },
            ].map((m) => (
              <label key={m.id} className="card" style={{ padding: 14, marginBottom: 10, display: "flex", gap: 12, cursor: "pointer", border: method === m.id ? "2px solid var(--primary)" : "1px solid var(--border)" }}>
                <input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} />
                <div>
                  <b>{m.label}</b>
                  <div className="small muted">{m.desc}</div>
                </div>
              </label>
            ))}

            {method === "VODAFONE_CASH" && (
              <div className="ok-box mt">
                <b>حوّل المبلغ إلى محفظة زوفادري:</b>
                <div style={{ fontSize: 22, fontWeight: 800, direction: "ltr", margin: "4px 0" }}>
                  {site?.vodafoneWallet || "01012345678"}
                </div>
                <div className="small mt-sm">ثم أدخل رقم محفظتك (المُرْسِل) حتى يطابقها الأدمن:</div>
                <input
                  dir="ltr" value={walletPhone} onChange={(e) => setWalletPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                  style={{ marginTop: 8, width: "100%", padding: "10px 12px", border: "1px solid var(--primary)", borderRadius: 10 }}
                />
                <div className="small muted mt-sm">بعد إنشاء الطلب ستظهر لك مساحة رفع صورة التحويل.</div>
              </div>
            )}
          </div>
        </div>

        <div className="section" style={{ position: "sticky", top: 80 }}>
          <h3>ملخص الطلب</h3>
          {cart.items.map((i: any) => (
            <div key={i.id} className="spread small" style={{ padding: "6px 0" }}>
              <span>{i.product.title} × {i.quantity}</span>
              <b>{Number(i.lineTotal).toLocaleString("en-US")} ج.م</b>
            </div>
          ))}
          <div className="row mt">
            <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="كوبون الخصم"
              style={{ flex: 1, padding: "9px 12px", border: "1px solid var(--border)", borderRadius: 10 }} />
            <button type="button" className="btn btn-outline btn-sm" onClick={validateCoupon}>تطبيق</button>
          </div>
          {couponInfo && <div className="ok-box small mt-sm">كوبون مطبق — خصم {Number(couponInfo.value).toLocaleString("en-US")}{couponInfo.discountType === "PERCENT" ? "%" : " ج.م"}</div>}
          {couponErr && <div className="error-box small mt-sm">{couponErr}</div>}

          <div className="spread small mt"><span>المجموع الفرعي</span><span>{cur(subtotal)}</span></div>
          {discount > 0 && <div className="spread small" style={{ color: "var(--green)" }}><span>الخصم</span><span>- {cur(discount)}</span></div>}
          <div className="spread small"><span>الشحن ({form.governorate || "—"})</span><span>{shipping === 0 ? "مجاني 🎉" : cur(shipping)}</span></div>
          {method === "CASH_ON_DELIVERY" && codFee > 0 && <div className="spread small"><span>رسوم الاستلام</span><span>{cur(codFee)}</span></div>}
          <div className="spread" style={{ fontSize: 20, fontWeight: 800, borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 12 }}>
            <span>الإجمالي</span><span style={{ color: "var(--primary)" }}>{cur(total)}</span>
          </div>
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 16 }} disabled={submitting}>
            {method === "VODAFONE_CASH" ? "إنشاء الطلب والانتقال لرفع صورة التحويل" : "تأكيد الطلب"}
          </button>
        </div>
      </form>
    </>
  );
}