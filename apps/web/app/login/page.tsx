"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, setToken, setUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await api("/api/auth/login", { method: "POST", body: JSON.stringify(form) });
      setToken(r.token);
      setUser(r.user);
      router.push("/admin");
    } catch (e: any) {
      setError(e.message || "حصل خطأ في الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-auth-wrap">
      <h1>تسجيل الدخول</h1>
      <form className="z-form" onSubmit={submit}>
        <div className="z-field">
          <label>الإيميل</label>
          <input className="z-input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div className="z-field">
          <label>كلمة السر</label>
          <input className="z-input" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
        </div>
        {error && <div className="z-alert z-alert-error">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "جاري الدخول..." : "دخول"}</button>
      </form>
      <p className="z-auth-alt">
        ماعندكش حساب؟ <Link href="/register">أنشئ حساب جديد</Link>
      </p>
    </div>
  );
}
