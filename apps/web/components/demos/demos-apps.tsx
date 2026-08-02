"use client";

import { useEffect, useState } from "react";
import { DemoShell, btn, btnGreen, btnOutline, inputStyle, card } from "./shared";

// ============ تطبيق توصيل طلبات المطاعم ============
const FOOD_MENU = [
  { id: 1, name: "بيتزا مارغريتا", price: 150, emoji: "🍕" },
  { id: 2, name: "برجر لحم", price: 120, emoji: "🍔" },
  { id: 3, name: "فراخ مشوية", price: 180, emoji: "🍗" },
  { id: 4, name: "سلطة سيزر", price: 90, emoji: "🥗" },
  { id: 5, name: "مياه غازية", price: 25, emoji: "🥤" },
];

const TRACK_STEPS = ["تم استلام الطلب ✅", "بيتحضر دلوقتي 👨‍🍳", "السواق في الطريق 🛵", "وصل — بالهنا والشفا 🎉"];

export function FoodAppDemo() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [tracking, setTracking] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!tracking) return;
    setStep(0);
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= TRACK_STEPS.length - 1) {
          clearInterval(t);
          setTracking(false);
          setCart({});
          return s;
        }
        return s + 1;
      });
    }, 1800);
    return () => clearInterval(t);
  }, [tracking]);

  const total = Object.entries(cart).reduce((sum, [id, q]) => sum + (FOOD_MENU.find((f) => f.id === Number(id))?.price || 0) * q, 0);

  return (
    <DemoShell title="تطبيق توصيل طلبات المطاعم">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        {FOOD_MENU.map((f) => (
          <div key={f.id} style={card}>
            <div style={{ fontSize: "2.4rem", textAlign: "center" }}>{f.emoji}</div>
            <div style={{ fontWeight: 800 }}>{f.name}</div>
            <div style={{ color: "#6b7280", fontSize: ".85rem" }}>{f.price} جنيه</div>
            <div style={{ display: "flex", gap: 6, marginTop: 8, alignItems: "center" }}>
              <button style={btnOutline} onClick={() => setCart((c) => ({ ...c, [f.id]: Math.max(0, (c[f.id] || 0) - 1) }))}>−</button>
              <span style={{ fontWeight: 800 }}>{cart[f.id] || 0}</span>
              <button style={btn} onClick={() => setCart((c) => ({ ...c, [f.id]: (c[f.id] || 0) + 1 }))}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...card, marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <b>الإجمالي: {total} جنيه</b>
          <div style={{ fontSize: ".78rem", color: "#6b7280" }}>مبلغ الحساب + 20ج توصيل</div>
        </div>
        <button style={btnGreen} disabled={total === 0} onClick={() => setTracking(true)}>
          🛵 اطلب دلوقتي
        </button>
      </div>
      {tracking && (
        <div style={{ ...card, marginTop: 14, textAlign: "center" }}>
          <b style={{ fontSize: "1.05rem" }}>{TRACK_STEPS[step]}</b>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10 }}>
            {TRACK_STEPS.map((_, i) => (
              <span key={i} style={{ width: 40, height: 6, borderRadius: 4, background: i <= step ? "#22c55e" : "#e5e7eb" }} />
            ))}
          </div>
        </div>
      )}
    </DemoShell>
  );
}

// ============ تطبيق مشاركة الرحلات ============
export function RideAppDemo() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [kind, setKind] = useState<"اقتصادية" | "VIP">("اقتصادية");
  const [state, setState] = useState<"idle" | "searching" | "driver" | "done">("idle");
  const [eta, setEta] = useState(12);

  useEffect(() => {
    if (state !== "driver") return;
    const t = setInterval(() => {
      setEta((e) => {
        if (e <= 1) {
          clearInterval(t);
          setState("done");
          return 0;
        }
        return e - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [state]);

  const price = kind === "VIP" ? 75 : 40;

  return (
    <DemoShell title="تطبيق مشاركة الرحلات">
      <div style={{ maxWidth: 440, display: "grid", gap: 12 }}>
        <input style={inputStyle} placeholder="منين؟ (مثال: المعادي)" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input style={inputStyle} placeholder="لين؟ (مثال: وسط البلد)" value={to} onChange={(e) => setTo(e.target.value)} />
        <div style={{ display: "flex", gap: 8 }}>
          {(["اقتصادية", "VIP"] as const).map((k) => (
            <button key={k} style={kind === k ? btn : btnOutline} onClick={() => setKind(k)}>
              {k === "VIP" ? "⭐ VIP" : "🚗 اقتصادية"} {k === "VIP" ? "75ج" : "40ج"}
            </button>
          ))}
        </div>
        {state === "idle" && (
          <button style={btnGreen} disabled={!from || !to} onClick={() => setState("searching")}>
            🚕 اطلب رحلتك
          </button>
        )}
        {state === "searching" && (
          <div style={card}>
            <b>🔍 بندور على سواق قريب...</b>
            <button style={btnOutline} onClick={() => setState("driver")}>أوليفر (موديل 2024) — 3 دقايق</button>
          </div>
        )}
        {state === "driver" && (
          <div style={card}>
            <b>👨‍✈️ السواق: محمد — شيفروليه أبيض</b>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#22c55e" }}>{eta} دقيقة</div>
            <div style={{ fontSize: ".85rem", color: "#6b7280" }}>{from} → {to} · {price} جنيه</div>
          </div>
        )}
        {state === "done" && (
          <div style={card} className="z-center">
            <div style={{ fontSize: "2rem" }}>🎉</div>
            <b>وصلت بأمان — شكراً لركوبك معانا!</b>
            <div style={{ fontSize: ".85rem", color: "#6b7280" }}>تم خصم {price} جنيه من محفظتك</div>
            <button style={btnOutline} onClick={() => { setState("idle"); setFrom(""); setTo(""); }}>رحلة جديدة</button>
          </div>
        )}
      </div>
    </DemoShell>
  );
}

// ============ تطبيق الجيم ============
const WORKOUTS = [
  { day: "السبت", items: ["ضغط صدر", "كتف", "تراي"] },
  { day: "الاثنين", items: ["ظهر", "بايس", "بطن"] },
  { day: "الأربعاء", items: ["رجلي", "سمانة", "كارديو"] },
];

export function GymAppDemo() {
  const [done, setDone] = useState<Record<number, number[]>>({});

  const toggle = (d: number, i: number) =>
    setDone((x) => {
      const arr = x[d] || [];
      return { ...x, [d]: arr.includes(i) ? arr.filter((v) => v !== i) : [...arr, i] };
    });

  return (
    <DemoShell title="تطبيق الجيم — تتبع التمرين">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {WORKOUTS.map((w, d) => {
          const pct = Math.round(((done[d] || []).length / w.items.length) * 100);
          return (
            <div key={w.day} style={card}>
              <b>{w.day}</b>
              <div style={{ background: "#e5e7eb", height: 8, borderRadius: 6, margin: "8px 0" }}>
                <div style={{ background: "#22c55e", height: 8, borderRadius: 6, width: `${pct}%` }} />
              </div>
              <div style={{ fontSize: ".8rem", color: "#6b7280", marginBottom: 8 }}>{pct}%</div>
              {w.items.map((it, i) => (
                <button
                  key={it}
                  style={{ ...btnOutline, width: "100%", marginBottom: 6, background: (done[d] || []).includes(i) ? "#dcfce7" : "white", color: (done[d] || []).includes(i) ? "#166534" : "#12203a" }}
                  onClick={() => toggle(d, i)}
                >
                  {(done[d] || []).includes(i) ? "✅ " : "⬜ "}{it}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </DemoShell>
  );
}

// ============ تطبيق إدارة المشاريع ============
export function TasksAppDemo() {
  const [tasks, setTasks] = useState<{ id: number; name: string; done: boolean; seconds: number }[]>([]);
  const [name, setName] = useState("");
  const [running, setRunning] = useState<number | null>(null);

  useEffect(() => {
    if (running === null) return;
    const t = setInterval(() => {
      setTasks((ts) => ts.map((x) => (x.id === running ? { ...x, seconds: x.seconds + 1 } : x)));
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <DemoShell title="تطبيق إدارة المشاريع">
      <div style={{ maxWidth: 520, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={inputStyle} placeholder="اسم المهمة..." value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && name.trim() && setTasks((t) => [...t, { id: Date.now(), name: name.trim(), done: false, seconds: 0 }]) && setName("")} />
          <button style={btn} onClick={() => { if (name.trim()) { setTasks((t) => [...t, { id: Date.now(), name: name.trim(), done: false, seconds: 0 }]); setName(""); } }}>+ إضافة</button>
        </div>
        {tasks.length === 0 && <div style={{ ...card, textAlign: "center", color: "#6b7280" }}>ضيف أول مهمة ليك 🚀</div>}
        {tasks.map((t) => (
          <div key={t.id} style={{ ...card, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button style={{ background: t.done ? "#22c55e" : "white", border: "2px solid #e5e7eb", width: 26, height: 26, borderRadius: 8, cursor: "pointer", fontSize: ".8rem" }} onClick={() => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}>
              {t.done ? "✓" : ""}
            </button>
            <span style={{ flex: 1, fontWeight: 700, textDecoration: t.done ? "line-through" : "none", color: t.done ? "#6b7280" : "#1f2937" }}>{t.name}</span>
            <span style={{ fontFamily: "monospace", fontSize: ".85rem" }}>⏱ {fmt(t.seconds)}</span>
            <button style={running === t.id ? btnOutline : btnGreen} onClick={() => setRunning(running === t.id ? null : t.id)}>
              {running === t.id ? "⏸ إيقاف" : "▶ بدء"}
            </button>
          </div>
        ))}
      </div>
    </DemoShell>
  );
}

// ============ تطبيق تتبع الميزانية ============
type Tx = { id: number; label: string; amount: number; type: "دخل" | "مصروف" };

export function BudgetAppDemo() {
  const [txs, setTxs] = useState<Tx[]>([
    { id: 1, label: "راتب", amount: 8000, type: "دخل" },
    { id: 2, label: "إيجار", amount: 2500, type: "مصروف" },
  ]);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"دخل" | "مصروف">("مصروف");

  const balance = txs.reduce((s, t) => s + (t.type === "دخل" ? t.amount : -t.amount), 0);
  const spend = txs.filter((t) => t.type === "مصروف").reduce((s, t) => s + t.amount, 0);

  return (
    <DemoShell title="تطبيق تتبع الميزانية">
      <div style={{ maxWidth: 520, display: "grid", gap: 10 }}>
        <div style={{ ...card, textAlign: "center" }}>
          <div style={{ fontSize: ".8rem", color: "#6b7280" }}>الرصيد الحالي</div>
          <div style={{ fontSize: "1.7rem", fontWeight: 900, color: balance >= 0 ? "#16a34a" : "#dc2626" }}>{balance.toLocaleString("ar-EG")} ج</div>
          <div style={{ fontSize: ".8rem", color: "#dc2626" }}>إجمالي المصروفات: {spend.toLocaleString("ar-EG")} ج</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={inputStyle} placeholder="الوصف (مثال: أكل)" value={label} onChange={(e) => setLabel(e.target.value)} />
          <input style={{ ...inputStyle, maxWidth: 120 }} placeholder="المبلغ" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <select style={{ ...inputStyle, maxWidth: 110 }} value={type} onChange={(e) => setType(e.target.value as any)}>
            <option>مصروف</option>
            <option>دخل</option>
          </select>
          <button style={btn} onClick={() => { if (label && amount) { setTxs((t) => [...t, { id: Date.now(), label, amount: Number(amount), type }]); setLabel(""); setAmount(""); } }}>
            +
          </button>
        </div>
        {txs.map((t) => (
          <div key={t.id} style={{ ...card, display: "flex", justifyContent: "space-between", padding: "10px 14px" }}>
            <span style={{ fontWeight: 700 }}>{t.label}</span>
            <span style={{ fontWeight: 800, color: t.type === "دخل" ? "#16a34a" : "#dc2626" }}>
              {t.type === "دخل" ? "+" : "-"}{t.amount.toLocaleString("ar-EG")} ج
            </span>
          </div>
        ))}
      </div>
    </DemoShell>
  );
}
