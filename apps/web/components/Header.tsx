"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, getUser, logout, apiUrl } from "@/lib/api";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [siteName, setSiteName] = useState("زوفادري");
  const [cartCount, setCartCount] = useState(0);

  const refreshUser = () => {
    setUser(getUser());
  };

  useEffect(() => {
    refreshUser();
    fetch(`${apiUrl}/api/settings/public`)
      .then((r) => r.json())
      .then((d) => d?.settings?.name && setSiteName(d.settings.name))
      .catch(() => {});
    const t = getToken();
    if (t) {
      fetch(`${apiUrl}/api/cart`, { headers: { Authorization: `Bearer ${t}` } })
        .then((r) => r.json())
        .then((d) => setCartCount(d.count ?? 0))
        .catch(() => {});
    }
    const onStorage = () => refreshUser();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="brand">🛒 {siteName}</Link>
        <Link href="/products" className="small muted">كل المنتجات</Link>
        <Link href="/wishlist" className="small muted">المفضلة</Link>
        <Link href="/cart" className="cart-btn small">
          السلة
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
        <div className="spread" style={{ flex: 1 }} />
        <nav className="nav">
          {!user ? (
            <>
              <Link href="/login">دخول</Link>
              <Link href="/register" className="btn btn-primary btn-sm">حساب جديد</Link>
            </>
          ) : user.role === "ADMIN" ? (
            <>
              <Link href="/admin">الأدمن</Link>
              <button onClick={logout}>خروج</button>
            </>
          ) : user.role === "SELLER" ? (
            <>
              <Link href="/seller">متجري</Link>
              <Link href="/account">حسابي</Link>
              <button onClick={logout}>خروج</button>
            </>
          ) : (
            <>
              <Link href="/seller/apply">بيع معنا</Link>
              <Link href="/account">حسابي</Link>
              <button onClick={logout}>خروج</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("zovadri_token");
}

function dout() {
  localStorage.removeItem("zovadri_token");
  localStorage.removeItem("zovadri_user");
  window.location.href = "/login";
}