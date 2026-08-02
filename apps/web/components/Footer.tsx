"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/api";

export default function Footer() {
  const [s, setS] = useState<any>({ name: "زوفادري", phone: "", whatsapp: "" });
  useEffect(() => {
    fetch(`${apiUrl}/api/settings/public`)
      .then((r) => r.json())
      .then((d: any) => setS(d.settings || {}))
      .catch(() => {});
  }, []);
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <b>{s.name || "زوفادري"}</b>
          <div className="small muted mt-sm">سوق مصري متعدد البائعين — تسوق وبيع بسهولة</div>
        </div>
        <div className="row">
          {s.whatsapp && (
            <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer">واتساب</a>
          )}
          {s.phone && <span className="small muted">☎ {s.phone}</span>}
          {s.email && <span className="small muted">✉ {s.email}</span>}
          <Link href="/seller/apply" className="small">انضم كبائع</Link>
        </div>
      </div>
    </footer>
  );
}