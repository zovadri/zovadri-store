"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getUser, clearSession } from "@/lib/api";
import { StatusBadge, formatDate, formatDateTime } from "@/components/ui";

const SERVICE_OPTIONS = ["موقع تعريفي", "متجر إلكتروني", "تطبيق موبايل", "بوت واتساب / تيليجرام", "لوحة تحكم", "مشروع مخصص"];
const DEMO_TEMPLATES = [
  { slug: "store", label: "🛍️ متجر إلكتروني" },
  { slug: "grocery", label: "🥬 سوبر ماركت" },
  { slug: "food", label: "🛵 تطبيق توصيل طلبات" },
  { slug: "bot-wa", label: "🤖 بوت واتساب" },
  { slug: "bot-tg", label: "🎓 بوت تيليجرام" },
  { slug: "support", label: "🎧 بوت خدمة عملاء" },
  { slug: "booking", label: "🦷 حجوزات عيادة" },
  { slug: "inventory", label: "📦 لوحة مخازن" },
  { slug: "pos", label: "☕ نظام كاشير" },
  { slug: "lms", label: "📚 منصة تعليمية" },
  { slug: "hotel", label: "🏨 حجوزات فندق" },
  { slug: "salon", label: "💇 حجوزات صالون" },
  { slug: "jobs", label: "💼 منصة توظيف" },
  { slug: "school", label: "🏫 نظام مدارس" },
  { slug: "contractor", label: "🏗️ موقع مقاولات" },
  { slug: "realestate", label: "🏙️ منصة عقارات" },
  { slug: "tasks", label: "📋 تطبيق مهام" },
  { slug: "ride", label: "🚕 تطبيق رحلات" },
  { slug: "gym", label: "💪 تطبيق جيم" },
  { slug: "budget", label: "💳 تطبيق ميزانية" },
];

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<"overview" | "orders" | "portfolio" | "settings">("overview");

  const [stats, setStats] = useState<any>({});
  const [orders, setOrders] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [editOrder, setEditOrder] = useState<any>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [itemForm, setItemForm] = useState({ title: "", description: "", category: "موقع", tags: "", link: "", image: "", featured: false });
  const [pages, setPages] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadStats = () => api("/api/admin/dashboard").then((r) => setStats(r.stats)).catch(() => {});
  const loadOrders = () => api(`/api/admin/orders?status=${statusFilter}`).then((r) => setOrders(r.orders)).catch(() => {});
  const loadPortfolio = () => api("/api/admin/portfolio").then((r) => setPortfolio(r.items)).catch(() => {});
  const loadSettings = () => api("/api/admin/settings").then((r) => setSettings(r.settings)).catch(() => {});

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
  }, [router]);

  useEffect(() => {
    if (!user) return;
    loadStats();
    loadOrders();
    loadPortfolio();
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, statusFilter]);

  const updateOrder = async (id: string, status: string) => {
    try {
      await api(`/api/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      loadOrders();
      loadStats();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("تحذف الطلب ده؟")) return;
    try {
      await api(`/api/admin/orders/${id}`, { method: "DELETE" });
      loadOrders();
      loadStats();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const body = {
        ...itemForm,
        tags: itemForm.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        featured: Boolean(itemForm.featured),
        pages: pages.map((p) => ({ name: p.name, icon: p.icon || "", sections: p.sections.split("\n").filter(Boolean) })),
      };
      if (editItem) {
        await api(`/api/admin/portfolio/${editItem.id}`, { method: "PATCH", body: JSON.stringify(body) });
      } else {
        await api("/api/admin/portfolio", { method: "POST", body: JSON.stringify(body) });
      }
      setSaved(true);
      setEditItem(null);
      setItemForm({ title: "", description: "", category: "موقع", tags: "", link: "", image: "", featured: false });
      setPages([]);
      loadPortfolio();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("تحذف المشروع ده؟")) return;
    try {
      await api(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      loadPortfolio();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await api("/api/admin/settings", { method: "PUT", body: JSON.stringify(settings) });
      setSettings(r.settings);
      setSaved(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const logout = () => {
    clearSession();
    router.push("/");
  };

  if (!user) return <div className="z-empty"><div className="z-icon">⏳</div><p>جاري التحميل...</p></div>;

  return (
    <div className="z-section z-admin">
      <aside className="z-admin-nav">
        <h3>لوحة التحكم</h3>
        <button className={`z-admin-link ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>📊 نظرة عامة</button>
        <button className={`z-admin-link ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>📋 الطلبات ({stats.orders ?? 0})</button>
        <button className={`z-admin-link ${tab === "portfolio" ? "active" : ""}`} onClick={() => setTab("portfolio")}>💼 الأعمال ({stats.portfolio ?? 0})</button>
        <button className={`z-admin-link ${tab === "settings" ? "active" : ""}`} onClick={() => setTab("settings")}>⚙️ الإعدادات</button>
        <button className="z-admin-link" onClick={logout} style={{ marginTop: 10 }}>🚪 خروج</button>
      </aside>

      <div className="z-admin-content">
        {tab === "overview" && (
          <>
            <h2>نظرة عامة</h2>
            <div className="z-stat-grid">
              <div className="z-stat-card"><strong>{stats.orders ?? 0}</strong><span>طلبات المشاريع</span></div>
              <div className="z-stat-card"><strong>{stats.portfolio ?? 0}</strong><span>مشاريع معروضة</span></div>
              <div className="z-stat-card"><strong>{stats.users ?? 0}</strong><span>حسابات</span></div>
              <div className="z-stat-card"><strong>{stats.settings ?? 0}</strong><span>إعدادات</span></div>
            </div>
            <p style={{ color: "var(--muted)" }}>أهلاً {user.name} 👋 — من هنا تدير طلبات العملاء وأعمالك وإعدادات الموقع.</p>
          </>
        )}

        {tab === "orders" && (
          <>
            <h2>طلبات المشاريع</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              {["ALL", "NEW", "CONTACTED", "IN_PROGRESS", "DELIVERED", "CANCELLED"].map((s) => (
                <button key={s} className={`btn btn-sm ${statusFilter === s ? "btn-primary" : "btn-outline"}`} onClick={() => setStatusFilter(s)}>
                  {s === "ALL" ? "الكل" : s}
                </button>
              ))}
            </div>
            {orders.length === 0 ? (
              <div className="z-empty"><div className="z-icon">📭</div><p>مفيش طلبات هنا</p></div>
            ) : (
              <div className="z-table-wrap">
                <table className="z-table">
                  <thead>
                    <tr>
                      <th>رقم</th><th>العميل</th><th>الخدمة</th><th>الميزانية</th><th>التفاصيل</th><th>التاريخ</th><th>الحالة</th><th>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td><strong>{o.orderNumber}</strong></td>
                        <td>
                          {o.name}<br />
                          <a href={`https://wa.me/2${o.phone.replace(/^0/, "")}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--primary)" }}>واتساب: {o.phone}</a>
                        </td>
                        <td>{o.service}</td>
                        <td>{o.budget || "—"}</td>
                        <td style={{ maxWidth: 220, whiteSpace: "normal" }}>{o.details}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{formatDateTime(o.createdAt)}</td>
                        <td><StatusBadge status={o.status} /></td>
                        <td>
                          <div className="z-actions">
                            {editOrder === o.id ? (
                              <select className="z-select" style={{ width: 150 }} defaultValue={o.status} onChange={(e) => { updateOrder(o.id, e.target.value); setEditOrder(null); }} autoFocus>
                                {["NEW", "CONTACTED", "IN_PROGRESS", "DELIVERED", "CANCELLED"].map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            ) : (
                              <button className="btn btn-outline btn-sm" onClick={() => setEditOrder(o.id)}>تغيير الحالة</button>
                            )}
                            <button className="btn btn-danger btn-sm" onClick={() => deleteOrder(o.id)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === "portfolio" && (
          <>
            <h2>{editItem ? "تعديل مشروع" : "إضافة مشروع جديد"}</h2>
            <form className="z-form-inline" onSubmit={saveItem}>
              <div className="z-field">
                <label>العنوان *</label>
                <input className="z-input" required value={itemForm.title} onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })} />
              </div>
              <div className="z-field">
                <label>التصنيف</label>
                <select className="z-select" value={itemForm.category} onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}>
                  {["موقع", "متجر", "تطبيق", "بوت", "لوحة تحكم", "أخرى"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="z-field z-field-full">
                <label>الوصف *</label>
                <textarea className="z-textarea" required value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} />
              </div>
              <div className="z-field">
                <label>نموذج الديمو الجاهز</label>
                <select
                  className="z-select"
                  value={itemForm.link.startsWith("demo/") ? itemForm.link.slice(6) : "__none"}
                  onChange={(e) => setItemForm({ ...itemForm, link: `/demo/${e.target.value}` })}
                >
                  <option value="__none">تلقائي (حسب التصنيف) ✨</option>
                  {DEMO_TEMPLATES.map((d) => (
                    <option key={d.slug} value={d.slug}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div className="z-field">
                <label>الرابط التجريبي (دليل: /demo/store)</label>
                <input className="z-input" dir="ltr" value={itemForm.link} onChange={(e) => setItemForm({ ...itemForm, link: e.target.value })} placeholder="/demo/store" />
                <span style={{ fontSize: 12, color: "var(--muted)" }}>أي رابط جديد بـ /demo/... بيشتغل تلقائياً كعرض تجريبي حي.</span>
              </div>
              <div className="z-field">
                <label>صورة (رابط أو data URI)</label>
                <input className="z-input" dir="ltr" value={itemForm.image} onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })} placeholder="https://... أو data:image/svg+xml" />
              </div>
              <div className="z-field">
                <label>التقنيات (مفصولة بفاصلة)</label>
                <input className="z-input" value={itemForm.tags} onChange={(e) => setItemForm({ ...itemForm, tags: e.target.value })} placeholder="Next.js, Node.js" />
              </div>
              <div className="z-field">
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={itemForm.featured} onChange={(e) => setItemForm({ ...itemForm, featured: e.target.checked })} />
                  مشروع مميز (يظهر الأول)
                </label>
              </div>
              <div className="z-field z-field-full">
                <label>صفحات المشروع (زي Next.js — كل صفحة بتبقى صفحة مستقلة)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                  {pages.map((pg, i) => (
                    <div key={i} style={{ border: "2px solid #e5e7eb", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 8, background: "#f8fafc" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input className="z-input" style={{ flex: 0.35 }} placeholder="اسم الصفحة (مثال: الرئيسية)" value={pg.name} onChange={(e) => { const c = pages.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)); setPages(c); }} />
                        <input className="z-input" style={{ flex: 0.12 }} placeholder="أيقونة (🏠)" value={pg.icon} onChange={(e) => { const c = pages.map((x, j) => (j === i ? { ...x, icon: e.target.value } : x)); setPages(c); }} />
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => setPages(pages.filter((_, j) => j !== i))}>حذف</button>
                      </div>
                      <textarea className="z-textarea" style={{ minHeight: 90, fontFamily: "monospace", direction: "rtl" }} placeholder={"سطر لكل ميزة/قسم في الصفحة\nمثال:\nحجز فوري على مدار الساعة\nمقارنة أسعار بين 50+ شركة\nإلغاء مجاني حتى 24 ساعة"} value={pg.sections} onChange={(e) => { const c = pages.map((x, j) => (j === i ? { ...x, sections: e.target.value } : x)); setPages(c); }} />
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => setPages([...pages, { name: "", icon: "", sections: "" }])}>
                    + إضافة صفحة جديدة
                  </button>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>لو سبتهم فارغين، العرض التجريبي هيشتغل تلقائياً حسب التصنيف.</span>
                </div>
              </div>
              <div className="z-actions">
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? "جاري الحفظ..." : editItem ? "حفظ التعديلات" : "إضافة المشروع"}
                </button>
                {editItem && (
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEditItem(null); setItemForm({ title: "", description: "", category: "موقع", tags: "", link: "", image: "", featured: false }); setPages([]); }}>
                    إلغاء
                  </button>
                )}
              </div>
              {saved && <div className="z-alert z-alert-success" style={{ gridColumn: "1 / -1", margin: 0 }}>✅ تم الحفظ</div>}
            </form>

            <h2 style={{ marginTop: 26 }}>الأعمال الحالية ({portfolio.length})</h2>
            {portfolio.length === 0 ? (
              <div className="z-empty"><div className="z-icon">💼</div><p>مفيش أعمال</p></div>
            ) : (
              <div className="z-table-wrap">
                <table className="z-table">
                  <thead>
                    <tr><th></th><th>العنوان</th><th>التصنيف</th><th>الرابط</th><th>التاريخ</th><th>إجراءات</th></tr>
                  </thead>
                  <tbody>
                    {portfolio.map((p) => (
                      <tr key={p.id}>
                        <td><img src={p.image || "/logo.png"} alt="" style={{ width: 52, height: 36, objectFit: "cover", borderRadius: 8 }} /></td>
                        <td>
                          {p.title} {p.featured && <span className="z-tag">⭐ مميز</span>}
                          <div style={{ fontSize: 12, color: "var(--muted)" }}>{(p.tags || []).join(", ")}</div>
                        </td>
                        <td>{p.category}</td>
                        <td dir="ltr" style={{ fontSize: 12 }}>{p.link || "—"}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{formatDate(p.createdAt)}</td>
                        <td>
                          <div className="z-actions">
                            {p.link && (
                              <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-sm">
                                ⚡ جرّب
                              </a>
                            )}
                            <button className="btn btn-outline btn-sm" onClick={() => { setEditItem(p); setItemForm({ title: p.title, description: p.description, category: p.category, tags: (p.tags || []).join(", "), link: p.link || "", image: p.image || "", featured: p.featured }); setPages((p.pages || []).map((x: any) => ({ name: x.name || "", icon: x.icon || "", sections: Array.isArray(x.sections) ? x.sections.join("\n") : "" }))); setSaved(false); }}>
                              تعديل
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteItem(p.id)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === "settings" && (
          <>
            <h2>إعدادات الموقع</h2>
            <form className="z-form" onSubmit={saveSettings}>
              <div className="z-field">
                <label>رقم الواتساب (دولي بدون +)</label>
                <input className="z-input" dir="ltr" value={settings.whatsapp || ""} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="201039866876" />
              </div>
              <div className="z-field">
                <label>الرقم المعروض</label>
                <input className="z-input" value={settings.phoneDisplay || ""} onChange={(e) => setSettings({ ...settings, phoneDisplay: e.target.value })} placeholder="01039866876" />
              </div>
              <div className="z-field">
                <label>رابط الفيسبوك</label>
                <input className="z-input" dir="ltr" value={settings.facebook || ""} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })} />
              </div>
              <div className="z-field">
                <label>الوصف المختصر (يظهر في أول الصفحة)</label>
                <textarea className="z-textarea" value={settings.tagline || ""} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
              </div>
              {saved && <div className="z-alert z-alert-success" style={{ margin: 0 }}>✅ تم حفظ الإعدادات</div>}
              <button type="submit" className="btn btn-primary">حفظ الإعدادات</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
