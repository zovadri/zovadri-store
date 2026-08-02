"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { asset } from "@/lib/ref";
import snapshot from "@/data/snapshot.json";

const SERVICES = [
  { icon: "🖥️", title: "موقع تعريفي", desc: "موقع احترافي لشركتك أو نشاطك يعرض خدماتك ويرفع مصداقيتك." },
  { icon: "🛒", title: "متجر إلكتروني", desc: "متجر كامل ببوابة دفع وسلة مشتريات وشحن — ابدأ البيع أونلاين." },
  { icon: "📱", title: "تطبيق موبايل", desc: "تطبيق Android و iOS لفكرتك — متجر، تطبيق توصيل، أو خدمة." },
  { icon: "🤖", title: "بوتات واتساب وتيليجرام", desc: "بوتات تستقبل الطلبات والاستفسارات تلقائياً وتخدّم عملاءك 24/7." },
  { icon: "📊", title: "لوحات تحكم", desc: "داشبورد لإدارة عملك: طلبات، مخزون، تقارير، وفريق العمل." },
  { icon: "⚙️", title: "مشروع مخصص", desc: "عندك فكرة مختلفة؟ بنسمعك وبنحولها لمنتج حقيقي يشتغل." },
];

const STEPS = [
  { num: "1", title: "كلمنا", desc: "شارك فكرتك معانا على واتساب أو من الفورم بالأسفل." },
  { num: "2", title: "اتفقنا", desc: "نحدد معاك المطلوب بالتفصيل والسعر والمدة." },
  { num: "3", title: "بننفذ", desc: "فريقنا يبني مشروعك ويوصلك تحديثات مستمرة." },
  { num: "4", title: "تسليم وتشغيل", desc: "نسلمك المشروع متشغلاً ومتدربك عليه — وبضمان." },
];

export default function Home() {
  const [site, setSite] = useState<any>({});
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", service: "موقع تعريفي", budget: "", details: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [catFilter, setCatFilter] = useState("الكل");

  useEffect(() => {
    (async () => {
      try {
        const [s, p] = await Promise.all([api("/api/site"), api("/api/portfolio")]);
        setSite(s.site || {});
        setPortfolio(p.items || []);
      } catch (e) {
        console.error(e);
        setSite((snapshot as any).site || {});
        setPortfolio((snapshot as any).portfolio || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const wa = site.whatsapp || "201039866876";
  const waDisplay = site.phoneDisplay || "01039866876";
  const fb = site.facebook || "https://www.facebook.com/people/Zovadri/61591990170275/";
  const CATEGORIES = ["الكل", "موقع", "متجر", "تطبيق", "بوت", "لوحة تحكم", "أخرى"];
  const filteredPortfolio = catFilter === "الكل" ? portfolio : portfolio.filter((p) => p.category === catFilter);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    const msg = encodeURIComponent(
      `مرحباً زوفادري 👋\nأنا ${form.name}\nعايز أطلب: ${form.service}\nالميزانية: ${form.budget || "مش محدد"}\nالتفاصيل: ${form.details}`
    );
    try {
      await api("/api/orders", {
        method: "POST",
        body: JSON.stringify(form),
      });
    } catch (e) {
      console.warn("order save failed (static mode):", e);
    }
    try {
      window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
    } catch { /* ignore */ }
    setDone(true);
    setSending(false);
  };

  const set = (k: string) => (e: React.ChangeEvent<any>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      {/* Hero */}
      <section className="z-hero">
        <img src={asset("/logo.png")} alt="Zovadri" className="z-hero-logo" />
        <h1>
          نبني مشروعك البرمجي <span className="z-hero-accent">من الفكرة للتسليم</span>
        </h1>
        <p className="z-hero-tagline">{site.tagline || "زوفادري: فريق برمجي مصري بينفذلك مواقع، متاجر، تطبيقات، وبوتات — بجودة عالية وبأسعار منطقية."}</p>
        <div className="z-hero-actions">
          <a href="#order" className="btn btn-primary">🚀 اطلب مشروعك</a>
          <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn z-btn-wa">💬 كلمنا واتساب</a>
        </div>
        <div className="z-hero-stats">
          <div className="z-stat"><strong>+20</strong><span>مشروع منفذ</span></div>
          <div className="z-stat"><strong>6</strong><span>مجالات برمجية</span></div>
          <div className="z-stat"><strong>24h</strong><span>استجابة سريعة</span></div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="z-section">
        <h2 className="z-section-title">خدماتنا</h2>
        <p className="z-section-sub">مهما كان مشروعك — عندنا اللي يجهزهولك</p>
        <div className="z-services-grid">
          {SERVICES.map((s) => (
            <div key={s.title} className="z-service-card">
              <div className="z-service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <a href="#order" className="z-service-link">اطلبه دلوقتي ←</a>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="z-section" style={{ background: "white", maxWidth: "none" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px" }}>
          <h2 className="z-section-title">أعمالنا</h2>
          <p className="z-section-sub">مشاريع بنيناها — ومعظمها عندها عرض حي تقدر تجربه بنفسك</p>

          <div className="z-filter-row">
            {CATEGORIES.map((c) => (
              <button key={c} className={`z-filter-btn ${catFilter === c ? "active" : ""}`} onClick={() => setCatFilter(c)}>
                {c === "الكل" ? "🧾 الكل" : c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="z-empty"><div className="z-icon">⏳</div><p>جاري التحميل...</p></div>
          ) : filteredPortfolio.length === 0 ? (
            <div className="z-empty">
              <div className="z-icon">💼</div>
              <p>{catFilter === "الكل" ? "مفيش مشاريع معروضة حالياً" : `مفيش مشاريع في قسم "${catFilter}"`}</p>
            </div>
          ) : (
            <div className="z-portfolio-grid">
              {filteredPortfolio.map((p) => (
                <div key={p.id} className="z-portfolio-card">
                  <div className="z-portfolio-img-wrap">
                    <img src={p.image || "/logo.png"} alt={p.title} className="z-portfolio-img" loading="lazy" decoding="async" />
                    {p.featured && <span className="z-portfolio-badge z-badge-featured">⭐ مميز</span>}
                    {p.link && <span className="z-portfolio-badge z-badge-live">● عرض حي</span>}
                  </div>
                  <div className="z-portfolio-body">
                    <span className="z-portfolio-cat">{p.category}</span>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <div className="z-portfolio-tags">
                      {(p.tags || []).map((t: string) => (
                        <span key={t} className="z-tag">{t}</span>
                      ))}
                    </div>
                    {p.link ? (
                      <Link href={p.link} className="btn btn-success btn-sm" style={{ width: "100%" }}>
                        ⚡ جرّب المشروع حي الآن
                      </Link>
                    ) : (
                      <Link href="#order" className="btn btn-outline btn-sm" style={{ width: "100%" }}>
                        اطلب زي المشروع ده
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="z-section">
        <h2 className="z-section-title">ازاي بنشتغل؟</h2>
        <p className="z-section-sub">4 خطوات بسيطة وتستلم مشروعك جاهز</p>
        <div className="z-steps">
          {STEPS.map((s) => (
            <div key={s.num} className="z-step">
              <div className="z-step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Order */}
      <section id="order" className="z-section" style={{ background: "white", maxWidth: "none" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px" }}>
          <h2 className="z-section-title">اطلب مشروعك</h2>
          <p className="z-section-sub">املا الفورم — وهنرد عليك في أسرع وقت</p>
          <div className="z-order-grid">
            <div className="z-order-info">
              <h3>📞 أو كلمنا مباشرة</h3>
              <p>تفضل التواصل معانا على أي منصة، وبنرد خلال ساعات.</p>
              <div className="z-contact-item">💬 <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">{waDisplay}</a></div>
              <div className="z-contact-item">👍 <a href={fb} target="_blank" rel="noopener noreferrer">Zovadri على فيسبوك</a></div>
              <div className="z-contact-item">⚡ <span>استجابة سريعة طوال أيام الأسبوع</span></div>
              <h3 style={{ marginTop: 20 }}>💡 ليه تطلب من زوفادري؟</h3>
              <p>ضمان على الشغل، تسليم بموعد محدد، ودعم فني بعد التسليم.</p>
            </div>

            {done ? (
              <div className="z-alert z-alert-success" style={{ alignSelf: "center", fontSize: "1rem" }}>
                ✅ تم إرسال طلبك بنجاح! فتحنا لك واتساب لتأكيد الطلب — لو مش اتفتح، كلمنا على {waDisplay}
                <br />
                <a href="#order" onClick={() => setDone(false)} style={{ display: "inline-block", marginTop: 10, fontWeight: 800, color: "#15803d" }}>
                  ← إرسال طلب تاني
                </a>
              </div>
            ) : (
              <form className="z-form" onSubmit={submit}>
                <div className="z-field">
                  <label>اسمك *</label>
                  <input className="z-input" value={form.name} onChange={set("name")} required placeholder="الاسم بالكامل" />
                </div>
                <div className="z-field">
                  <label>رقم الواتساب *</label>
                  <input className="z-input" value={form.phone} onChange={set("phone")} required placeholder="01xxxxxxxxx" dir="ltr" style={{ textAlign: "right" }} />
                </div>
                <div className="z-field">
                  <label>نوع المشروع *</label>
                  <select className="z-select" value={form.service} onChange={set("service")} required>
                    {["موقع تعريفي", "متجر إلكتروني", "تطبيق موبايل", "بوت واتساب / تيليجرام", "لوحة تحكم", "مشروع مخصص"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="z-field">
                  <label>الميزانية التقريبية</label>
                  <input className="z-input" value={form.budget} onChange={set("budget")} placeholder="مثال: 5000 - 10000 جنيه" />
                </div>
                <div className="z-field">
                  <label>تفاصيل المشروع *</label>
                  <textarea className="z-textarea" value={form.details} onChange={set("details")} required placeholder="اشرح لينا مشروعك: المطلوب، الصفحات، الأفكار، أي حاجة..." />
                </div>
                {error && <div className="z-alert z-alert-error">{error}</div>}
                <button type="submit" className="btn btn-primary" disabled={sending}>
                  {sending ? "جاري الإرسال..." : "🚀 إرسال الطلب"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
