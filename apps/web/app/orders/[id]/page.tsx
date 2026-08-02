"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, apiUrl, formatPrice, getUser } from "@/lib/api";
import { Badge } from "@/components/ui";

export default function OrderDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load().catch((e) => setErr(e.message));
  }, [id]);

  async function load() {
    const d = await api<any>(`/api/orders/${id}`);
    setOrder(d.order);
  }

  async function uploadProof(f: File) {
    setUploading(true);
    setErr(""); setMsg("");
    try {
      if (!f.type.startsWith("image/")) throw new Error("اختر صورة");
      const dataUrl: string = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(new Error("تعذر قراءة الصورة"));
        r.readAsDataURL(f);
      });
      await api(`/api/orders/${id}/proof`, { method: "POST", body: JSON.stringify({ image: dataUrl }) });
      setMsg("تم رفع صورة التحويل — بانتظار مراجعة الأدمن");
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function cancelOrder() {
    if (!confirm("هل تريد إلغاء الطلب؟")) return;
    try {
      await api(`/api/orders/${id}/cancel`, { method: "POST", body: JSON.stringify({}) });
      await load();
    } catch (e: any) { setErr(e.message); }
  }

  if (!order) {
    return <div className="onboarding"><div className="card">{err || "جارٍ التحميل…"}</div></div>;
  }

  const needProof =
    order.paymentMethod === "VODAFONE_CASH" &&
    (order.paymentStatus === "PENDING_VERIFICATION" || order.paymentStatus === "FAILED");

  return (
    <>
      <div className="section-title"><h2>الطلب {order.orderNumber}</h2></div>
      {err && <div className="error-box">{err}</div>}
      {msg && <div className="ok-box">{msg}</div>}

      <div className="grid-2 grid">
        <div className="section">
          <h3>تفاصيل الطلب</h3>
          <div className="spread small"><span>الطلب</span><b>{order.orderNumber}</b></div>
          <div className="spread small"><span>التاريخ</span><span>{new Date(order.createdAt).toLocaleString("ar-EG")}</span></div>
          <div className="spread small"><span>الحالة</span><Badge value={order.status} /></div>
          <div className="spread small"><span>الدفع</span><Badge value={order.paymentMethod} /></div>
          <div className="spread small"><span>حالة الدفع</span><Badge value={order.paymentStatus} /></div>
          {order.trackingCode && <div className="spread small"><span>رقم التتبع</span><b style={{ color: "var(--primary)" }}>{order.trackingCode}</b></div>}
          {order.paymentRejectReason && (
            <div className="error-box mt">الدفع مرفوض: {order.paymentRejectReason}</div>
          )}
          <div className="spread mt" style={{ fontSize: 20, fontWeight: 800 }}>
            <span>الإجمالي</span><span style={{ color: "var(--primary)" }}>{formatPrice(order.total)}</span>
          </div>
          {["PENDING", "CONFIRMED"].includes(order.status) && (
            <button className="btn btn-danger btn-sm mt" onClick={cancelOrder}>إلغاء الطلب</button>
          )}
        </div>

        <div className="section">
          <h3>المنتجات</h3>
          {(order.OrderItem || []).map((i: any) => (
            <div key={i.id} className="row" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ flex: 1 }}><b>{i.title}</b><div className="small muted">× {i.quantity}</div></div>
              <b>{formatPrice(i.price * i.quantity)}</b>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2 grid">
        <div className="section">
          <h3>عنوان الشحن</h3>
          <pre style={{ font: "inherit", whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{formatAddress(order.shippingAddress)}</pre>
        </div>

        {order.paymentMethod === "VODAFONE_CASH" && (
          <div className="section">
            <h3>دفع فودافون كاش</h3>
            {needProof && (
              <>
                <div className="ok-box mt-sm">
                  <b>حوّل المبلغ إلى محفظة زوفادري:</b>
                  <div style={{ fontSize: 20, fontWeight: 800, direction: "ltr" }}>{order.vodafoneWallet || "01012345678"}</div>
                </div>
                <p className="small muted mt-sm">رقم محفظتك: {order.walletPhone} — ارفع صورة شاشة التحويل:</p>
                <div className="upload-zone mt">
                  <div>🖼️ اسحب الصورة هنا أو</div>
                  <button type="button" className="btn btn-primary btn-sm mt" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    {uploading ? "جارٍ الرفع…" : "اختر صورة التحويل"}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadProof(e.target.files[0])} />
                </div>
              </>
            )}
            {order.paymentProof && (
              <>
                <p className="small muted mt">صورة التحويل المرفوعة:</p>
                <img src={`${apiUrl}${order.paymentProof}`} alt="proof" className="proof-thumb" />
              </>
            )}
            {(order.walletPhone || order.paymentReference) && (
              <p className="small muted mt-sm">
                محفظة المرسل: {order.walletPhone || "—"} | المرجع: {order.paymentReference || "—"}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function formatAddress(a: any) {
  if (!a) return "—";
  return [a.fullName, a.phone, a.governorate, a.city, a.district, a.street, a.building, a.floor, a.apartment].filter(Boolean).join("، ");
}