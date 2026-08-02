"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/ui";

export default function ProductsPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setQuery(sp.get("query") || "");
    setCategory(sp.get("category") || "");
    setReady(true);
  }, []);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("pageSize", "24");
    const d = await api(`/api/products?${params}`);
    setItems(d.items);
    setTotal(d.total);
    setPages(d.pages);
  }, [query, category, sort, page]);

  useEffect(() => {
    api("/api/categories").then((d: any) => setCategories(d.items)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!ready) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, query, category, sort, page]);

  return (
    <>
      <div className="section-title">
        <h2>المنتجات ({total})</h2>
      </div>
      <div className="row wrap" style={{ marginBottom: 16 }}>
        <input
          placeholder="ابحث عن منتج…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 10, flex: 1, maxWidth: 300 }}
        />
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          style={{ padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 10 }}
        >
          <option value="">كل الفئات</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          style={{ padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 10 }}
        >
          <option value="">الأكثر مبيعاً</option>
          <option value="price_asc">السعر: الأقل أولاً</option>
          <option value="price_desc">السعر: الأعلى أولاً</option>
          <option value="newest">الأحدث</option>
        </select>
      </div>

      {items.length === 0 ? (
        <div className="section muted" style={{ textAlign: "center", padding: 40 }}>لا توجد منتجات مطابقة</div>
      ) : (
        <div className="grid grid-4">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}

      {pages > 1 && (
        <div className="cen mt">
          <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>السابق</button>
          <span className="small m-2">صفحة {page} من {pages}</span>
          <button className="btn btn-outline btn-sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>التالي</button>
        </div>
      )}
    </>
  );
}