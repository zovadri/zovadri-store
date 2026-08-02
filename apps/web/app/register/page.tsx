"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, setToken, setUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await api("/api/auth/register", { method: "POST", body: JSON.stringify(form) });
      setToken(r.token);
      setUser(r.user);
      router.push("/admin");
    } catch (e: any) {
      setError(e.message || "حصل خطأ في التسجيل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-auth-wrap">
      <h1>حساب جديد</h1>
      <form className="z-form" onSubmit={submit}>
        <div className="z-field">
          <label>الاسم</label>
          <input className="z-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اسمك بالكامل" />
        </div>
        <div className="z-field">
          <label>الإيميل</label>
          <input className="z-input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div className="z-field">
          <label>رقم الواتساب</label>
          <input className="z-input" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01xxxxxxxxx" />
        </div>
        <div className="z-field">
          <label>كلمة السر</label>
          <input className="z-input" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="6 أحرف على الأقل" />
        </div>
        {error && <div className="z-alert z-alert-error">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "جاري الإنشاء..." : "إنشاء الحساب"}</button>
      </form>
      <p className="z-auth-alt">
        عندك حساب؟ <Link href="/login">سجل دخول</Link>
      </p>
    </div>
  );
}
