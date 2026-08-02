import Link from "next/link";
import { formatPrice } from "@/lib/api";

export function Stars({ value, count }: { value: number; count?: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(value || 0)));
  return (
    <span className="row">
      <span className="stars">{"★".repeat(rounded)}</span>
      <span className="stars-empty">{"★".repeat(5 - rounded)}</span>
      {count != null && <span className="small muted">({count})</span>}
    </span>
  );
}

const statusMap: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: "نشط", cls: "badge-green" },
  INACTIVE: { label: "موقوف", cls: "badge-gray" },
  DRAFT: { label: "مسودة", cls: "badge-gray" },
  PENDING: { label: "بانتظار", cls: "badge-amber" },
  CONFIRMED: { label: "مؤكد", cls: "badge-violet" },
  PROCESSING: { label: "قيد التجهيز", cls: "badge-amber" },
  SHIPPED: { label: "تم الشحن", cls: "badge-violet" },
  DELIVERED: { label: "تم التسليم", cls: "badge-green" },
  CANCELLED: { label: "ملغي", cls: "badge-red" },
  REFUNDED: { label: "مسترجع", cls: "badge-gray" },
  PAID: { label: "مدفوع", cls: "badge-green" },
  UNPAID: { label: "غير مدفوع", cls: "badge-amber" },
  PENDING_VERIFICATION: { label: "بانتظار التحقق", cls: "badge-amber" },
  FAILED: { label: "فشل الدفع", cls: "badge-red" },
  APPROVED: { label: "معتمد", cls: "badge-green" },
  REJECTED: { label: "مرفوض", cls: "badge-red" },
  SUSPENDED: { label: "موقوف", cls: "badge-gray" },
  CASH_ON_DELIVERY: { label: "كاش عند الاستلام", cls: "badge-gray" },
  CARD: { label: "بطاقة", cls: "badge-violet" },
  VODAFONE_CASH: { label: "فودافون كاش", cls: "badge-green" },
};

export function Badge({ value }: { value: string }) {
  const m = statusMap[String(value || "").toUpperCase()] || statusMap["PENDING"];
  return <span className={`badge ${m.cls}`}>{m.label}</span>;
}

export function ProductCard({ p }: { p: any }) {
  const img = p.images?.[0];
  return (
    <Link href={`/products/${p.slug}`} className="card pcard">
      <div className="pcard-media">
        {img ? (
          <img src={img} alt={p.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 40 }}>🛍️</div>
        )}
      </div>
      <div className="pcard-body">
        <div className="pcard-title">{p.title}</div>
        <Stars value={p.rating} count={p.ratingCount} />
        <div className="spread">
          <b style={{ color: "var(--primary)", fontSize: 17 }}>{formatPrice(p.price)}</b>
          {p.compareAtPrice && <span className="pcard-old">{formatPrice(p.compareAtPrice)}</span>}
        </div>
      </div>
    </Link>
  );
}