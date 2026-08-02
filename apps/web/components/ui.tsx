const STATUS_META: Record<string, { label: string; color: string }> = {
  NEW: { label: "جديد", color: "#2563eb" },
  CONTACTED: { label: "تم التواصل", color: "#d97706" },
  IN_PROGRESS: { label: "قيد التنفيذ", color: "#7c3aed" },
  DELIVERED: { label: "تم التسليم", color: "#059669" },
  CANCELLED: { label: "ملغي", color: "#dc2626" },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] || { label: status, color: "#64748b" };
  return (
    <span
      style={{
        background: `${meta.color}1a`,
        color: meta.color,
        fontWeight: 700,
        fontSize: 12,
        padding: "3px 10px",
        borderRadius: 999,
        whiteSpace: "nowrap",
      }}
    >
      {meta.label}
    </span>
  );
}

export function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(d: string | Date) {
  return new Date(d).toLocaleString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
