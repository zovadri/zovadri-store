"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api";
import { asset } from "@/lib/ref";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = getUser();
    if (u) setUser(u);
  }, []);

  return (
    <header className="z-header">
      <div className="z-header-inner">
        <Link href="/" className="z-logo">
          <img src={asset("/logo.png")} alt="Zovadri" className="z-logo-img" />
          <span>زوفادري</span>
        </Link>

        <nav className="z-nav">
          <a href="#services" className="z-nav-link">خدماتنا</a>
          <a href="#portfolio" className="z-nav-link">أعمالنا</a>
          <a href="#how" className="z-nav-link">ازاي بنشتغل</a>
          <a href="#order" className="z-nav-link">اطلب مشروعك</a>
        </nav>

        <div className="z-header-actions">
          {user ? (
            <Link href="/admin" className="btn btn-primary btn-sm">لوحة التحكم</Link>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">دخول</Link>
          )}
        </div>
      </div>
    </header>
  );
}
