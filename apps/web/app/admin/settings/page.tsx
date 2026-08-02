"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getUser } from "@/lib/api";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [governorates, setGovernorates] = useState<Record<string, number>>({});
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    if (getUser()?.role !== "ADMIN") {
      router.replace("/admin");
      return;
    }
    api<any>("/api/admin/settings")
      .then((d) => {
        const s = d.settings || {};
        setForm({
          "site.name": s["site.name"] || "",
          "site.tagline": s["site.tagline"] || "",
          "contact.whatsapp": s["contact.whatsapp"] || "",
          "contact.phone": s["contact.phone"] || "",
          "contact.email": s["contact.email"] || "",
          "contact.vodafoneWallet": s["contact.vodafoneWallet"] || "",
          "shipping.freeThreshold": s["shipping.freeThreshold"] || "1500",
          "shipping.codFee": s["shipping.codFee"] || "20",
          "seller.commissionRate": s["seller.commissionRate"] || "0.1",
        });
        const g = s["shipping.governorates"];
        if (typeof g === "string") {
          try { setGovernorates(JSON.parse(g)); } catch { setGovernorates({}); }
        } else if (g && typeof g === "object") {
          setGovernorates(g);
        }
      })
      .catch((e) => setErr(e.message));
  }, []);

  function setV(key: string, value: string) {
    setForm((f: any) => ({ ...f, [key]: value }));
  }
  function setGov(name: string, value: string) {
    setGovernorates((g) => ({ ...g, [name]: Number(value) || 0 }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setOk("");
    try {
      await api("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({
          settings: {
            ...form,
            "shipping.governorates": JSON.stringify(governorates),
          },
        }),
      });
      setOk("تم حفظ الإعدادات بنجاح ✓");
    } catch (er: any) { setErr(er.message); }
  }

  if (!form) {
    return <div className="onboarding"><div className="card">جارٍ التحميل…</div></div>;
  }

  return (
    <>
      <div className="section-title"><h2>⚙️ إعدادات السوق</h2></div>
      {err && <div className="error-box">{err}</div>}
      {ok && <div className="ok-box">{ok}</div>}

      <form onSubmit={save}>
        <div className="section">
          <h3>الهوية</h3>
          <div className="grid-2 grid">
            <div className="field"><label>اسم الموقع</label>
              <input value={form["site.name"]} onChange={(e) => setV("site.name", e.target.value)} /></div>
            <div className="field"><label>الشعار بالرواية (انجليزي/عربي)</label>
              <input value={form["site.tagline"]} onChange={(e) => setV("site.tagline", e.target.value)} /></div>
          </div>
        </div>

        <div className="section">
          <h3>أرقام التواصل</h3>
          <div className="grid-2 grid">
            <div className="field"><label>واتساب (بدون +)</label>
              <input dir="ltr" value={form["contact.whatsapp"]} onChange={(e) => setV("contact.whatsapp", e.target.value)} /></div>
            <div className="field"><label>هاتف الدعم</label>
              <input dir="ltr" value={form["contact.phone"]} onChange={(e) => setV("contact.phone", e.target.value)} /></div>
            <div className="field"><label>إيميل الدعم</label>
              <input dir="ltr" value={form["contact.email"]} onChange={(e) => setV("contact.email", e.target.value)} /></div>
            <div className="field"><label>💳 محفظة فودافون كاش</label>
              <input dir="ltr" value={form["contact.vodafoneWallet"]} onChange={(e) => setV("contact.vodafoneWallet", e.target.value)} /></div>
          </div>
        </div>

        <div className="section">
          <h3>الشحن والعمولات</h3>
          <div className="grid-3 grid">
            <div className="field"><label>شحن مجاني فوق (ج.م)</label>
              <input type="number" value={form["shipping.freeThreshold"]} onChange={(e) => setV("shipping.freeThreshold", e.target.value)} /></div>
            <div className="field"><label>رسوم كاش عند الاستلام (ج.م)</label>
              <input type="number" value={form["shipping.codFee"]} onChange={(e) => setV("shipping.codFee", e.target.value)} /></div>
            <div className="field"><label>عمولة السوق (مثال 0.1 = 10%)</label>
              <input type="number" step="0.01" value={form["seller.commissionRate"]} onChange={(e) => setV("seller.commissionRate", e.target.value)} /></div>
          </div>
          <h3 style={{ marginTop: 16 }}>أسعار الشحن حسب المحافظة (ج.م)</h3>
          <div className="grid-4 grid">
            {Object.keys(governorates).sort().map((g) => (
              <div key={g} className="field">
                <label>{g}</label>
                <input type="number" value={governorates[g]} onChange={(e) => setGov(g, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary">حفظ كل الإعدادات</button>
      </form>
    </>
  );
}