"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, setToken, setUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      const d = await api("/api/auth/login", { method: "POST", body: JSON.stringify(form) });
      setToken(d.token);
      setUser(d.user);
      const next = new URLSearchParams(window.location.search).get("next") || (d.user.role === "ADMIN" ? "/admin" : d.user.role === "SELLER" ? "/seller" : "/");
      router.push(next);
    } catch (e: any) { setErr(e.message); }
  }

  return (
    <div className="onboarding">
      <form onSubmit={submit} className="card">
        <h2 style={{ marginBottom: 18 }}>تسجيل الدخول</h2>
        {err && <div className="error-box">{err}</div>}
        <div className="field">
          <label>الإيميل</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="field">
          <label>كلمة المرور</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }}>دخول</button>
        <div className="small muted mt">ليس لديك حساب؟ <Link href="/register" style={{ color: "var(--primary)" }}>سجّل الآن</Link></div>
      </form>
    </div>
  );
}