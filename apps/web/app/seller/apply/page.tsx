"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, getUser } from "@/lib/api";

export default function SellerApply() {
  const router = useRouter();
  const [form, setForm] = useState({ storeName: "", description: "" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setOk("");
    try {
      const d = await api("/api/seller/apply", { method: "POST", body: JSON.stringify(form) });
      setOk("تم إرسال طلب الانضمام — بانتظار موافقة الأدمن");
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <div className="onboarding">
      <form onSubmit={submit} className="card">
        <h2 style={{ marginBottom: 6 }}>انضم كبائع 🏪</h2>
        <p className="small muted" style={{ marginBottom: 18 }}>اعرض منتجاتك وجمهور زوفادري كامل، والشحن والتسويق علينا أحياناً.</p>
        {err && <div className="error-box">{err}</div>}
        {ok && <div className="ok-box">{ok}</div>}
        <div className="field">
          <label>اسم المتجر</label>
          <input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} required />
        </div>
        <div className="field">
          <label>وصف المتجر</label>
          <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} disabled={!!ok}>إرسال الطلب</button>
      </form>
    </div>
  );
}