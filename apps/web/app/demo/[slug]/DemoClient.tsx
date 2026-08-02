"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { DEMOS } from "@/components/demos";
import { GenericDemo } from "@/components/demos/GenericDemo";

function Loading() {
  return (
    <div style={{ background: "linear-gradient(135deg,#12203a,#1c2f52)", borderRadius: 18, padding: 40, textAlign: "center", color: "white" }}>
      <div style={{ fontSize: 40 }}>⚡</div>
      <p style={{ fontWeight: 800 }}>جاري تحميل العرض التجريبي...</p>
    </div>
  );
}

export default function DemoClient({ slug }: { slug: string }) {
  const demo = DEMOS[slug];
  const [item, setItem] = useState<any>(null);
  const [itemState, setItemState] = useState<"loading" | "found" | "missing">(demo ? "found" : "loading");

  useEffect(() => {
    if (demo) return;
    let active = true;
    api(`/api/portfolio/by-slug/${slug}`)
      .then((r) => {
        if (!active) return;
        setItem(r.item || null);
        setItemState(r.item ? "found" : "missing");
      })
      .catch(() => {
        if (!active) return;
        try {
          const snap = require("@/data/snapshot.json");
          const found = (snap.portfolio || []).find((p: any) => p.link === `/demo/${slug}`);
          if (found) {
            setItem(found);
            setItemState("found");
          } else {
            setItemState("missing");
          }
        } catch {
          setItemState("missing");
        }
      });
    return () => {
      active = false;
    };
  }, [demo, slug]);

  if (!demo && itemState !== "found") {
    return (
      <div className="z-section">
        <div className="z-empty">
          <div className="z-icon">🤔</div>
          {itemState === "loading" ? <p>جاري البحث عن المشروع...</p> : <p>العرض التجريبي ده مش موجود</p>}
          <Link href="/#portfolio" className="btn btn-primary" style={{ marginTop: 12 }}>
            ← رجوع للأعمال
          </Link>
        </div>
      </div>
    );
  }

  const Demo = demo ? React.lazy(demo.component) : null;

  return (
    <div className="z-section" style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <Link href="/#portfolio" style={{ fontWeight: 800, color: "var(--primary-dark)" }}>
          ← رجوع للأعمال
        </Link>
        <Link href="/#order" className="btn btn-primary btn-sm">
          🚀 اطلب زي المشروع ده
        </Link>
      </div>
      {Demo ? (
        <Suspense fallback={<Loading />}>
          <Demo />
        </Suspense>
      ) : (
        <GenericDemo title={item.title} description={item.description} category={item.category} tags={item.tags} image={item.image} pages={item.pages} />
      )}
      <div className="z-alert z-alert-info" style={{ marginTop: 16 }}>
        💡 ده عرض تجريبي حي بيشتغل فعلاً — لو عايز مشروع زي ده بالظبط ليك، اضغط "اطلب زي المشروع ده" وبنبني نسختك الخاصة.
      </div>
    </div>
  );
}