"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, formatPrice, getUser, getToken } from "@/lib/api";
import { ProductCard, Stars, Badge } from "@/components/ui";

export default function ProductDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [p, setP] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [review, setReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    api(`/api/products/${slug}`)
      .then((d: any) => { setP(d.product); setRelated(d.related); })
      .catch(() => setErr("المنتج غير موجود"));
    api(`/api/reviews/product/${slug}`).then((d: any) => setReviews(d.items || [])).catch(() => {});
  }, [slug]);

  async function addToCart() {
    setErr(""); setOk("");
    const user = getUser();
    if (!user) { router.push(`/login?next=/products/${slug}`); return; }
    try {
      await api("/api/cart", { method: "POST", body: JSON.stringify({ productId: p.id, quantity: qty }) });
      setOk("تمت الإضافة إلى السلة");
    } catch (e: any) { setErr(e.message); }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setOk("");
    try {
      await api("/api/reviews/", { method: "POST", body: JSON.stringify({ productId: p.id, rating: review.rating, comment: review.comment }) });
      setOk("تم إرسال تقييمك");
      setReview({ rating: 5, comment: "" });
      const d = await api(`/api/reviews/product/${p.id}`);
      setReviews(d.items);
    } catch (e: any) { setErr(e.message); }
  }

  if (!p) {
    return <div className="onboarding"><div className="card">{err || "جارٍ التحميل…"}</div></div>;
  }

  return (
    <div style={{ marginTop: 20 }}>
      <div className="detail-layout">
        <div className="card" style={{ padding: 20 }}>
          {p.images?.[0] ? (
            <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: 420, objectFit: "contain" }} />
          ) : (
            <div style={{ height: 420, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, color: "var(--muted)" }}>🛍️</div>
          )}
        </div>
        <div>
          <h1 style={{ fontSize: 24 }}>{p.title}</h1>
          <div className="row" style={{ margin: "8px 0" }}>
            <Stars value={p.rating} count={p.ratingCount} />
            <span className="small muted">المبيعات: {p.soldCount || 0}</span>
          </div>
          <div className="row mt" style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)" }}>{formatPrice(p.price)}</span>
            {p.compareAtPrice && <span className="pcard-old" style={{ fontSize: 18 }}>{formatPrice(p.compareAtPrice)}</span>}
          </div>
          <div className="row">
            <Badge value={p.status} />
            <span className={p.stock > 0 ? "badge badge-green" : "badge badge-red"}>
              {p.stock > 0 ? `متوفر (${p.stock})` : "غير متوفر"}
            </span>
          </div>
          <div className="row mt" style={{ marginTop: 18 }}>
            <input
              type="number" min={1} max={Math.max(1, p.stock)} value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              style={{ width: 70, padding: "10px", border: "1px solid var(--border)", borderRadius: 10, textAlign: "center" }}
            />
            <button className="btn btn-primary" onClick={addToCart}>أضف إلى السلة</button>
          </div>
          {err && <div className="error-box mt">{err}</div>}
          {ok && <div className="ok-box mt">{ok}</div>}
          <div className="section mt">
            <h3>وصف المنتج</h3>
            <p className="muted" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{p.description || "لا يوجد وصف"}</p>
          </div>
          {p.Seller?.storeName && (
            <div className="section small muted">البائع: <b style={{ color: "var(--text)" }}>{p.Seller.storeName}</b></div>
          )}
        </div>
      </div>

      <div className="section-title"><h2>منتجات مشابهة</h2></div>
      <div className="grid grid-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>

      <div className="section-title"><h2>التقييمات ({reviews.length})</h2></div>
      <form onSubmit={submitReview} className="section" style={{ maxWidth: 560 }}>
        <h3>قيّم هذا المنتج</h3>
        <div className="row">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r} type="button"
              onClick={() => setReview({ ...review, rating: r })}
              style={{ border: "none", background: "none", fontSize: 24 }}
            >
              <span className={r <= review.rating ? "stars" : "stars-empty"}>★</span>
            </button>
          ))}
        </div>
        <div className="field mt">
          <textarea
            placeholder="اكتب رأيك…"
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            rows={3}
          />
        </div>
        {err && <div className="error-box">{err}</div>}
        {ok && <div className="ok-box">{ok}</div>}
        <button className="btn btn-primary">نشر التقييم</button>
      </form>

      <div className="grid-2 grid" style={{ marginBottom: 30 }}>
        {reviews.map((r: any) => (
          <div key={r.id} className="card" style={{ padding: 16 }}>
            <div className="spread">
              <b>{r.userName}</b>
              <Stars value={r.rating} />
            </div>
            <p className="muted mt-sm small">{r.comment || "بدون تعليق"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}