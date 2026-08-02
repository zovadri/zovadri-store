"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, setToken, setUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "CUSTOMER" });
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      const d = await api("/api/auth/register", { method: "POST", body: JSON.stringify(form) });
      setToken(d.token);
      setUser(d.user);
      router.push("/");
    } catch (e: any) { setErr(e.message); }
  }

  return (
    <div className="onboarding">
      <form onSubmit={submit} className="card">
        <h2 style={{ marginBottom: 18 }}>إنشاء حساب</h2>
        {err && <div className="error-box">{err}</div>}
        <div className="field">
          <label>الاسم</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label>الإيميل</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="field">
          <label>المحمول</label>
          <input dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        </div>
        <div className="field">
          <label>كلمة المرور</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <div className="field">
          <label>نوع الحساب</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="CUSTOMER">عميل</option>
            <option value="SELLER">بائع</option>
          </select>
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }}>إنشاء الحساب</button>
        <div className="small muted mt">لديك حساب؟ <Link href="/login" style={{ color: "var(--primary)" }}>سجّل الدخول</Link></div>
      </form>
    </div>
  );
}