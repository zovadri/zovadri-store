"use client";

import React, { useState } from "react";
import { btn, btnGreen, btnOutline, inputStyle } from "./shared";

type ItemProps = {
  title: string;
  description: string;
  category: string;
  tags?: string[];
  image?: string | null;
  pages?: { name: string; icon?: string; sections?: string[] }[];
};

const CAT = { store: "متجر", app: "تطبيق", bot: "بوت", panel: "لوحة تحكم", web: "موقع" };

const MODE_STYLES: Record<string, { gradient: string; accent: string }> = {
  [CAT.store]: { gradient: "linear-gradient(135deg,#f97316,#f43f5e)", accent: "#f97316" },
  [CAT.app]: { gradient: "linear-gradient(135deg,#8b5cf6,#6366f1)", accent: "#6366f1" },
  [CAT.bot]: { gradient: "linear-gradient(135deg,#10b981,#059669)", accent: "#059669" },
  [CAT.panel]: { gradient: "linear-gradient(135deg,#f59e0b,#d97706)", accent: "#d97706" },
  [CAT.web]: { gradient: "linear-gradient(135deg,#06b6d4,#0ea5e9)", accent: "#0ea5e9" },
};

function catOf(c: string): string {
  const cat = (c || "").trim();
  if (cat === "متجر") return CAT.store;
  if (cat === "تطبيق") return CAT.app;
  if (cat === "بوت") return CAT.bot;
  if (cat === "لوحة تحكم") return CAT.panel;
  return CAT.web;
}

const storeItems = [
  { n: "تيشيرت قطني", p: 250 },
  { n: "كوتشي رياضي", p: 900 },
  { n: "سماعة لاسلكية", p: 650 },
  { n: "شاحن سريع", p: 180 },
];

const appFeatures = [{ i: "🗂️", n: "واجهة بسيطة" }, { i: "🔔", n: "إشعارات فورية" }, { i: "📊", n: "تقارير وتحليلات" }, { i: "🔒", n: "أمان وخصوصية" }];

const chatSamples = ["أهلاً 👋 وصلت إزاي؟", "تمام، امتى هتبدأ الشغل؟", "تقدر تزوّدنا بالتفاصيل؟"];

export const GenericDemo: React.FC<ItemProps> = ({ title, description, category, tags, image, pages }) => {
  const mode = catOf(category);
  const styles = MODE_STYLES[mode] || MODE_STYLES[CAT.web];

  const multiPage = pages && pages.length > 0;
  const [activePage, setActivePage] = useState(0);

  const [cart, setCart] = useState(0);
  const [step, setStep] = useState(0);
  const [chat, setChat] = useState<{ from: "bot" | "user"; text: string }[]>([
    { from: "bot", text: `أهلاً بيك 👋 في تجربة ${title}` },
  ]);
  const [chatInput, setChatInput] = useState("");

  const send = () => {
    if (!chatInput.trim()) return;
    setChat((c) => [...c, { from: "user", text: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setChat((c) => [
        ...c,
        { from: "bot", text: "تمام ✅ شكراً ليك — لو عايز تكمل شغل زي ده، كلمنا وبنرجعلك في أسرع وقت." },
      ]);
    }, 700);
  };

  return (
    <div style={{ background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,.12)" }}>
      <div style={{ background: styles.gradient, padding: "22px 26px", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: ".72rem", fontWeight: 800, opacity: 0.85 }}>تجربة حية</div>
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 900 }}>{title}</h2>
          </div>
          <span style={{ background: "#22c55e", padding: "4px 12px", borderRadius: 999, fontSize: ".7rem", fontWeight: 800 }}>
            ● بيشتغل فعلًا
          </span>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        <p style={{ margin: "0 0 18px", color: "#475569", fontSize: ".92rem", lineHeight: 1.8 }}>
          {description}
          {image && image.startsWith("data:") && <span style={{ display: "block", fontSize: ".8rem", color: "#94a3b8", marginTop: 8 }}>(نموذج تفاعلي نابع من وصف المشروع — والمشروع الحقيقي بيتبنى بالتفاصيل)</span>}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
          {(tags?.length ? tags : ["Custom", "Tailored", "Fast"]).map((t) => (
            <span key={t} style={{ background: "#eef2ff", color: "#4338ca", fontSize: ".72rem", fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>{t}</span>
          ))}
        </div>

        {multiPage && (
          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderBottom: "2px solid #e5e7eb", paddingBottom: 12, marginBottom: 18 }}>
              {(pages || []).map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActivePage(i)}
                  style={{
                    ...btn,
                    background: i === activePage ? styles.accent : "#f1f5f9",
                    color: i === activePage ? "#fff" : "#334155",
                    border: "none",
                  }}
                >
                  {p.icon || "📄"} {p.name || `صفحة ${i + 1}`}
                </button>
              ))}
            </div>

            <div key={activePage} style={{ background: "#f8fafc", border: "2px solid #e5e7eb", borderRadius: 14, padding: 18, minHeight: 240 }}>
              <div style={{ fontWeight: 900, fontSize: "1.05rem", color: "#1e293b", marginBottom: 12 }}>
                {pages?.[activePage]?.icon || "📄"} {pages?.[activePage]?.name || `صفحة ${activePage + 1}`}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(pages?.[activePage]?.sections?.length ? pages[activePage].sections : ["محتوى هذه الصفحة بيظهر هنا — كل سطر بتكتبه في الأدمن بتبقى ميزة/قسم مستقل."]).map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: ".86rem", fontWeight: 700, color: "#334155" }}>
                    <span style={{ color: styles.accent, fontSize: "1rem" }}>✔</span>
                    {s}
                  </div>
                ))}
              </div>
              <a href="#order" target="_blank" rel="noopener noreferrer" style={{ ...btn, display: "inline-block", marginTop: 16, textDecoration: "none" }}>
                🚀 ابني صفحة زي دي ليك
              </a>
            </div>
          </div>
        )}

        {!multiPage && mode === CAT.store && (
          <div>
            <div style={{ fontWeight: 800, marginBottom: 10, color: "#1e293b" }}>🛍️ جرّب تسوّق سريع:</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: 10, marginBottom: 14 }}>
              {storeItems.map((it) => (
                <div key={it.n} style={{ border: "2px solid #e5e7eb", borderRadius: 12, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 22 }}>{["👕","👟","🎧","🔌"][storeItems.indexOf(it)]}</div>
                  <div style={{ fontWeight: 700, fontSize: ".82rem", color: "#1e293b" }}>{it.n}</div>
                  <div style={{ fontSize: ".75rem", color: styles.accent, fontWeight: 800 }}>{it.p} ج.م</div>
                  <button style={{ ...btn, marginTop: 8, width: "100%", fontSize: ".75rem", padding: "7px" }} onClick={() => setCart((c) => c + 1)}>
                    أضف للسلة
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", borderRadius: 12, padding: "10px 14px", fontWeight: 800 }}>
              <span>🛒 السلة فيها <span style={{ color: styles.accent }}>{cart}</span> منتج</span>
              <button style={btnGreen} onClick={() => setCart(0)}>إفراغ</button>
            </div>
          </div>
        )}

        {!multiPage && mode === CAT.bot && (
          <div>
            <div style={{ fontWeight: 800, marginBottom: 10, color: "#1e293b" }}>💬 جرّب الكلام مع البوت:</div>
            <div style={{ border: "2px solid #e5e7eb", borderRadius: 14, padding: 16, minHeight: 160, background: "#f8fafc", marginBottom: 12 }}>
              {chat.map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: c.from === "bot" ? "flex-start" : "flex-end", marginBottom: 8 }}>
                  <div style={{ maxWidth: "78%", background: c.from === "bot" ? "#fff" : "#d9fdd3", padding: "8px 12px", borderRadius: 12, fontSize: ".85rem", boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>{c.text}</div>
                </div>
              ))}
              {step < chatSamples.length && (
                <button style={{ ...btnOutline, marginTop: 4 }} onClick={() => { setChat((c) => [...c, { from: "user", text: chatSamples[step] }]); setStep(step + 1); setTimeout(() => setChat((c) => [...c, { from: "bot", text: "تمام ✅ مستني شرح أكتر منك." }]), 600); }}>
                  + إرسال: «{chatSamples[step]}»
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...inputStyle, flex: 1 }} value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="اكتب سؤالك هنا..." />
              <button style={btnGreen} onClick={send}>إرسال</button>
            </div>
          </div>
        )}

        {!multiPage && mode === CAT.app && (
          <div>
            <div style={{ fontWeight: 800, marginBottom: 10, color: "#1e293b" }}>📱 متضمنات التطبيق:</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10 }}>
              {appFeatures.map((f) => (
                <button key={f.n} style={{ ...btnOutline, textAlign: "right", display: "block" }} onClick={() => step === 0 && setStep(1)}>
                  {f.i} {f.n}
                  <span style={{ display: "block", fontSize: ".7rem", color: "#94a3b8", marginTop: 2 }}>{step >= 1 ? "✓ متاح" : "اضغط للتفاعل"}</span>
                </button>
              ))}
            </div>
            {step >= 1 && (
              <div style={{ marginTop: 14, background: "#f0fdf4", border: "2px solid #86efac", borderRadius: 12, padding: "12px 14px", fontWeight: 700, color: "#15803d", fontSize: ".85rem" }}>
                ✅ التطبيق جاهز بالواجهة كاملة — والتخصيص النهائي بيحصل حسب طلبك.
              </div>
            )}
          </div>
        )}

        {!multiPage && mode === CAT.panel && (
          <div>
            <div style={{ fontWeight: 800, marginBottom: 10, color: "#1e293b" }}>📊 لوحة تحكم بطريقة تفاعلية:</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 10 }}>
              {[
                { n: "طلبات", v: step === 0 ? "—" : "128" },
                { n: "عملاء", v: step === 0 ? "—" : "842" },
                { n: "مبيعات", v: step === 0 ? "—" : "45k ج" },
                { n: "تقارير", v: step === 0 ? "—" : "جاهزة" },
              ].map((x) => (
                <div key={x.n} style={{ background: "#f8fafc", border: "2px solid #e5e7eb", borderRadius: 12, padding: 14, textAlign: "center" }}>
                  <div style={{ fontWeight: 900, fontSize: ".95rem", color: styles.accent }}>{x.v}</div>
                  <div style={{ fontSize: ".78rem", color: "#64748b", fontWeight: 700 }}>{x.n}</div>
                </div>
              ))}
            </div>
            <button style={{ ...btn, marginTop: 14 }} onClick={() => setStep((s) => (s === 0 ? 1 : 0))}>
              {step === 0 ? "⚠️ عرض الأرقام" : "🙈 إخفاء الأرقام"}
            </button>
          </div>
        )}

        {!multiPage && mode === CAT.web && (
          <div>
            <div style={{ fontWeight: 800, marginBottom: 10, color: "#1e293b" }}>🌐 موقع تعريفي تفاعلي:</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 10, marginBottom: 16 }}>
              {["قسم الرئيسية", "الخدمات", "الأعمال", "تواصل معنا"].map((s, i) => (
                <div key={s} style={{ background: i === step ? "#fef3c7" : "#f8fafc", border: `2px solid ${i === step ? "#f59e0b" : "#e5e7eb"}`, borderRadius: 12, padding: 14, textAlign: "center", fontWeight: 800, fontSize: ".82rem", cursor: "pointer" }} onClick={() => setStep(i)}>
                  {s}
                  {i === step && <div style={{ fontSize: ".68rem", color: "#b45309", marginTop: 4 }}>محدد الآن</div>}
                </div>
              ))}
            </div>
            <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 14px", fontSize: ".85rem", color: "#475569" }}>
              <strong>محتوى الصفحة:</strong> صفحة {["الرئيسية", "الخدمات", "الأعمال", "التواصل"][step]} — جاهزة لتُعبّ ببياناتك الخاصة، مع تصميم متجاوب وكامل.
            </div>
          </div>
        )}

        <a href="#order" target="_blank" rel="noopener noreferrer" style={{ ...btn, width: "100%", marginTop: 20, textDecoration: "none" }}>
          🚀 اطلب مشروع زي ده علشانك
        </a>
      </div>
    </div>
  );
};