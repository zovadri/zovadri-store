"use client";

import { useState } from "react";
import { DemoShell, btn, btnGreen, btnOutline, inputStyle, card, ChipRow } from "./shared";

// ============ متجر إلكتروني للملابس ============
const CLOTHES = [
  { id: 1, name: "تيشيرت قطني", price: 250, emoji: "👕", sizes: ["M", "L", "XL"] },
  { id: 2, name: "جينز أزرق", price: 650, emoji: "👖" },
  { id: 3, name: "سنيكرز", price: 1200, emoji: "👟" },
  { id: 4, name: "حقيبة جلد", price: 850, emoji: "👜" },
  { id: 5, name: "نظارة شمس", price: 400, emoji: "🕶️" },
  { id: 6, name: "ساعة أنيقة", price: 1500, emoji: "⌚" },
];

export function StoreDemo() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);

  const total = Object.entries(cart).reduce((s, [id, q]) => s + (CLOTHES.find((c) => c.id === Number(id))?.price || 0) * q, 0);
  const count = Object.values(cart).reduce((s, q) => s + q, 0);

  return (
    <DemoShell title="متجر إلكتروني للملابس">
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
        <div style={{ ...card, flex: 1, minWidth: 200 }}>
          <b>🛒 عربتك ({count})</b>
          <div style={{ fontSize: ".85rem", color: "#6b7280" }}>
            {Object.entries(cart).map(([id, q]) => {
              const c = CLOTHES.find((x) => x.id === Number(id));
              return c ? `${c.name} × ${q}، ` : "";
            })}
            {count === 0 && "فاضية"}
          </div>
          <div style={{ fontWeight: 900, marginTop: 6 }}>الإجمالي: {total.toLocaleString("ar-EG")} ج</div>
        </div>
        {done && <div style={{ ...card, color: "#166534", background: "#dcfce7", fontWeight: 800 }}>🎉 تم تأكيد طلبك! هنرد عليك للتأكيد على واتساب</div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
        {CLOTHES.map((c) => (
          <div key={c.id} style={card}>
            <div style={{ fontSize: "2.2rem", textAlign: "center" }}>{c.emoji}</div>
            <div style={{ fontWeight: 800, fontSize: ".9rem" }}>{c.name}</div>
            <div style={{ color: "#6b7280", fontSize: ".85rem" }}>{c.price.toLocaleString("ar-EG")} ج</div>
            {c.sizes && <div style={{ fontSize: ".72rem", color: "#6b7280" }}>مقاسات: {c.sizes.join("، ")}</div>}
            <button style={{ ...btn, width: "100%", marginTop: 8 }} onClick={() => setCart((x) => ({ ...x, [c.id]: (x[c.id] || 0) + 1 }))}>
              + ضيف للعربة
            </button>
          </div>
        ))}
      </div>
      <button style={{ ...btnGreen, marginTop: 14 }} disabled={count === 0} onClick={() => { setDone(true); setCart({}); }}>
        💳 إتمام الشراء
      </button>
    </DemoShell>
  );
}

// ============ متجر سوبر ماركت ============
const GROCERY = [
  { id: 1, cat: "خضار", name: "طماطم (كيلو)", price: 20, emoji: "🍅" },
  { id: 2, cat: "خضار", name: "خيار (كيلو)", price: 15, emoji: "🥒" },
  { id: 3, cat: "فاكهة", name: "موز (كيلو)", price: 35, emoji: "🍌" },
  { id: 4, cat: "فاكهة", name: "تفاح (كيلو)", price: 45, emoji: "🍎" },
  { id: 5, cat: "ألبان", name: "حليب 1لتر", price: 38, emoji: "🥛" },
  { id: 6, cat: "ألبان", name: "جبنة بيضاء", price: 60, emoji: "🧀" },
  { id: 7, cat: "مخبوزات", name: "عيش بلدي", price: 10, emoji: "🥖" },
  { id: 8, cat: "مخبوزات", name: "كرواسون", price: 25, emoji: "🥐" },
];

export function GroceryDemo() {
  const [cat, setCat] = useState("الكل");
  const [cart, setCart] = useState<Record<number, number>>({});
  const cats = ["الكل", ...Array.from(new Set(GROCERY.map((g) => g.cat)))];
  const items = GROCERY.filter((g) => cat === "الكل" || g.cat === cat);
  const total = Object.entries(cart).reduce((s, [id, q]) => s + (GROCERY.find((g) => g.id === Number(id))?.price || 0) * q, 0);

  return (
    <DemoShell title="متجر سوبر ماركت أونلاين">
      <ChipRow>
        {cats.map((c) => (
          <button key={c} style={cat === c ? btn : btnOutline} onClick={() => setCat(c)}>{c}</button>
        ))}
      </ChipRow>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginTop: 12 }}>
        {items.map((g) => (
          <div key={g.id} style={card}>
            <div style={{ fontSize: "2rem", textAlign: "center" }}>{g.emoji}</div>
            <div style={{ fontWeight: 800, fontSize: ".85rem" }}>{g.name}</div>
            <div style={{ color: "#6b7280", fontSize: ".8rem" }}>{g.price} ج</div>
            <button style={{ ...btn, width: "100%", marginTop: 6, padding: "7px 10px", fontSize: ".82rem" }} onClick={() => setCart((x) => ({ ...x, [g.id]: (x[g.id] || 0) + 1 }))}>
              + {cart[g.id] || ""}
            </button>
          </div>
        ))}
      </div>
      <div style={{ ...card, marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <b>الإجمالي: {total} ج</b>
        <button style={btnGreen} disabled={total === 0}>🛒 توصيل خلال ساعة</button>
      </div>
    </DemoShell>
  );
}

// ============ لوحة تحكم إدارة مخازن ============
type Stock = { id: number; name: string; qty: number; min: number };

export function InventoryDemo() {
  const [items, setItems] = useState<Stock[]>([
    { id: 1, name: "موبايل سامسونج", qty: 25, min: 10 },
    { id: 2, name: "لابتوب HP", qty: 8, min: 5 },
    { id: 3, name: "سماعة بلوتوث", qty: 3, min: 10 },
    { id: 4, name: "شاحن سريع", qty: 60, min: 20 },
  ]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");

  return (
    <DemoShell title="لوحة تحكم إدارة المخازن">
      <div style={{ maxWidth: 640 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input style={inputStyle} placeholder="اسم الصنف" value={name} onChange={(e) => setName(e.target.value)} />
          <input style={{ ...inputStyle, maxWidth: 100 }} placeholder="الكمية" type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
          <button style={btn} onClick={() => { if (name && qty) { setItems((x) => [...x, { id: Date.now(), name, qty: Number(qty), min: 10 }]); setName(""); setQty(""); } }}>+ إضافة</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 12, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#12203a", color: "white" }}>
              <th style={{ padding: 10, textAlign: "right" }}>الصنف</th>
              <th style={{ padding: 10 }}>الكمية</th>
              <th style={{ padding: 10 }}>الحالة</th>
              <th style={{ padding: 10 }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: 10, fontWeight: 700 }}>{it.name}</td>
                <td style={{ padding: 10, textAlign: "center", fontWeight: 800, color: it.qty < it.min ? "#dc2626" : "#16a34a" }}>{it.qty}</td>
                <td style={{ padding: 10, textAlign: "center" }}>
                  {it.qty < it.min ? <span style={{ background: "#fee2e2", color: "#991b1b", padding: "2px 10px", borderRadius: 999, fontSize: ".75rem", fontWeight: 800 }}>⚠️ منخفض</span> : <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 10px", borderRadius: 999, fontSize: ".75rem", fontWeight: 800 }}>ممتاز</span>}
                </td>
                <td style={{ padding: 10, textAlign: "center" }}>
                  <button style={btnOutline} onClick={() => setItems((x) => x.map((i) => (i.id === it.id ? { ...i, qty: i.qty + 1 } : i)))}>+1</button>{" "}
                  <button style={btnOutline} onClick={() => setItems((x) => x.map((i) => (i.id === it.id ? { ...i, qty: Math.max(0, i.qty - 1) } : i)))}>−1</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 8, fontSize: ".8rem", color: "#6b7280" }}>إجمالي الأصناف: {items.length} · الأصناف المنخفضة: {items.filter((i) => i.qty < i.min).length}</div>
      </div>
    </DemoShell>
  );
}

// ============ نظام كاشير لمقهى ============
const POS_MENU = [
  { name: "اسبريسو", price: 40, emoji: "☕" },
  { name: "كابتشينو", price: 60, emoji: "☕" },
  { name: "لاتيه", price: 65, emoji: "🥛" },
  { name: "شاي بالنعناع", price: 30, emoji: "🍵" },
  { name: "كيك شوكولاتة", price: 80, emoji: "🍰" },
  { name: "سانتوتشي", price: 90, emoji: "🥪" },
];

export function PosDemo() {
  const [bill, setBill] = useState<Record<string, number>>({});
  const [receipt, setReceipt] = useState(false);

  const total = Object.entries(bill).reduce((s, [name, q]) => s + (POS_MENU.find((m) => m.name === name)?.price || 0) * q, 0);

  return (
    <DemoShell title="نظام كاشير لمقهى">
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 }}>
            {POS_MENU.map((m) => (
              <button key={m.name} style={{ ...btnOutline, flexDirection: "column", gap: 2, padding: "10px 6px" }} onClick={() => setBill((b) => ({ ...b, [m.name]: (b[m.name] || 0) + 1 }))}>
                <span style={{ fontSize: "1.5rem" }}>{m.emoji}</span>
                <span style={{ fontSize: ".78rem" }}>{m.name}</span>
                <span style={{ fontSize: ".75rem", color: "#6b7280" }}>{m.price}ج</span>
              </button>
            ))}
          </div>
          <button style={{ ...btnGreen, marginTop: 10 }} disabled={total === 0} onClick={() => { setReceipt(true); }}>
            🧾 إصدار الفاتورة ({total}ج)
          </button>
        </div>
        <div style={card}>
          <b>الفاتورة الحالية</b>
          {Object.entries(bill).length === 0 && <div style={{ color: "#6b7280", fontSize: ".85rem" }}>الفاتورة فاضية</div>}
          {Object.entries(bill).map(([name, q]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem", marginTop: 6 }}>
              <span>{name} × {q}</span>
              <b>{(POS_MENU.find((m) => m.name === name)?.price || 0) * q}ج</b>
            </div>
          ))}
          <hr style={{ margin: "10px 0", border: "1px dashed #e5e7eb" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900 }}>
            <span>الإجمالي</span><span>{total}ج</span>
          </div>
        </div>
      </div>
      {receipt && (
        <div style={{ ...card, marginTop: 14, textAlign: "center", background: "#fefce8" }}>
          <b>🧾 الفاتورة</b>
          <div style={{ fontFamily: "monospace", fontSize: ".85rem", marginTop: 6, lineHeight: 1.8 }}>
            {Object.entries(bill).map(([name, q]) => `${name} × ${q} = ${(POS_MENU.find((m) => m.name === name)?.price || 0) * q}ج`).join("\n")}
            <br />─────────────────<br />الإجمالي: {total}ج · شكراً لزيارتكم ☕
          </div>
          <button style={btnOutline} onClick={() => { setBill({}); setReceipt(false); }}>فاتورة جديدة</button>
        </div>
      )}
    </DemoShell>
  );
}

// ============ موقع حجز مواعيد عيادة أسنان ============
const DOCTORS = [
  { name: "د. أحمد عادل — أسنان تجميل", emoji: "🦷" },
  { name: "د. سارة مصطفى — تقويم", emoji: "🪥" },
  { name: "د. عمر خالد — زراعة أسنان", emoji: "🦷" },
];
const SLOTS = ["10:00", "11:00", "12:00", "1:00", "5:00", "6:00"];

export function BookingDemo() {
  const [doc, setDoc] = useState(0);
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState<string | null>(null);

  return (
    <DemoShell title="موقع حجز مواعيد عيادة أسنان">
      <div style={{ maxWidth: 520, display: "grid", gap: 12 }}>
        <ChipRow>
          {DOCTORS.map((d, i) => (
            <button key={d.name} style={doc === i ? btn : btnOutline} onClick={() => { setDoc(i); setSlot(""); setDone(null); }}>{d.emoji} {d.name}</button>
          ))}
        </ChipRow>
        <div>
          <b>اختر الموعد:</b>
          <ChipRow>
            {SLOTS.map((s) => (
              <button key={s} style={slot === s ? btnGreen : btnOutline} onClick={() => setSlot(s)}>{s}</button>
            ))}
          </ChipRow>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={inputStyle} placeholder="اسمك" value={name} onChange={(e) => setName(e.target.value)} />
          <input style={inputStyle} placeholder="رقم الموبايل" dir="ltr" />
        </div>
        <button style={btnGreen} disabled={!slot || !name} onClick={() => setDone(`تم حجز موعدك مع ${DOCTORS[doc].name} الساعة ${slot} 🎉\nهنتذكرك على واتساب قبل الموعد`)}>
          📅 تأكيد الحجز
        </button>
        {done && <div style={{ ...card, background: "#dcfce7", color: "#166534", fontWeight: 800, whiteSpace: "pre-line" }}>{done}</div>}
      </div>
    </DemoShell>
  );
}

// ============ نظام حجوزات فندق ============
const ROOMS = [
  { name: "غرفة ستاندرد", price: 1200, emoji: "🛏️" },
  { name: "جناح ديلوكس", price: 2200, emoji: "🛋️" },
  { name: "جناح رئاسي", price: 4000, emoji: "👑" },
];

export function HotelDemo() {
  const [room, setRoom] = useState(0);
  const [inDate, setInDate] = useState("2026-08-10");
  const [outDate, setOutDate] = useState("2026-08-13");
  const [done, setDone] = useState(false);

  const nights = Math.max(1, Math.round((new Date(outDate).getTime() - new Date(inDate).getTime()) / 86400000));
  const total = ROOMS[room].price * nights;

  return (
    <DemoShell title="نظام حجوزات فندق">
      <div style={{ maxWidth: 520, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div>
            <b>الوصول:</b>
            <input type="date" style={inputStyle} value={inDate} onChange={(e) => setInDate(e.target.value)} />
          </div>
          <div>
            <b>المغادرة:</b>
            <input type="date" style={inputStyle} value={outDate} onChange={(e) => setOutDate(e.target.value)} />
          </div>
        </div>
        <ChipRow>
          {ROOMS.map((r, i) => (
            <button key={r.name} style={{ ...btnOutline, flexDirection: "column", gap: 2 }} onClick={() => setRoom(i)}>
              <span style={{ fontSize: "1.4rem" }}>{r.emoji}</span>
              <span>{r.name}</span>
              <span style={{ fontSize: ".8rem", color: "#6b7280" }}>{r.price}ج/ليلة</span>
            </button>
          ))}
        </ChipRow>
        <div style={card}>
          <b>{ROOMS[room].name} × {nights} ليلة</b>
          <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#16a34a" }}>{total.toLocaleString("ar-EG")} ج</div>
          <button style={{ ...btnGreen, width: "100%", marginTop: 8 }} disabled={done} onClick={() => setDone(true)}>
            ✅ احجز الآن
          </button>
          {done && <div style={{ marginTop: 8, fontSize: ".85rem", fontWeight: 700, color: "#166534" }}>تم تأكيد الحجز — الفاتورة اتسلمت لك على واتساب 🎉</div>}
        </div>
      </div>
    </DemoShell>
  );
}

// ============ نظام حجز صالون ============
const SALON_SERVICES = [
  { name: "قص شعر", price: 150, emoji: "💇" },
  { name: "قص + استشوار", price: 250, emoji: "💇‍♀️" },
  { name: "صبغة", price: 400, emoji: "🎨" },
  { name: "تنظيف بشرة", price: 350, emoji: "✨" },
];
const STYLISTS = ["محمود", "كريم", "سلمى"];
const TIMES = ["11 ص", "1 م", "3 م", "5 م", "7 م"];

export function SalonDemo() {
  const [svc, setSvc] = useState(0);
  const [stylist, setStylist] = useState(0);
  const [time, setTime] = useState("");
  const [done, setDone] = useState(false);

  return (
    <DemoShell title="نظام حجز صالون">
      <div style={{ maxWidth: 520, display: "grid", gap: 12 }}>
        <ChipRow>
          {SALON_SERVICES.map((s, i) => (
            <button key={s.name} style={svc === i ? btn : btnOutline} onClick={() => setSvc(i)}>{s.emoji} {s.name} — {s.price}ج</button>
          ))}
        </ChipRow>
        <ChipRow>
          {STYLISTS.map((s, i) => (
            <button key={s} style={stylist === i ? btnGreen : btnOutline} onClick={() => setStylist(i)}>💆 {s}</button>
          ))}
        </ChipRow>
        <ChipRow>
          {TIMES.map((t) => (
            <button key={t} style={time === t ? btn : btnOutline} onClick={() => setTime(t)}>{t}</button>
          ))}
        </ChipRow>
        <button style={btnGreen} disabled={!time} onClick={() => setDone(true)}>📅 تأكيد الحجز</button>
        {done && <div style={{ ...card, background: "#dcfce7", color: "#166534", fontWeight: 800 }}>اتحجزلك {SALON_SERVICES[svc].name} مع {STYLISTS[stylist]} الساعة {time} — مستنيينك 🌟</div>}
      </div>
    </DemoShell>
  );
}

// ============ موقع شركة مقاولات ============
export function ContractorDemo() {
  const [sent, setSent] = useState(false);

  return (
    <DemoShell title="موقع تعريفي لشركة مقاولات">
      <div style={{ maxWidth: 640, display: "grid", gap: 12 }}>
        <div style={{ background: "linear-gradient(135deg,#334155,#0f172a)", color: "white", borderRadius: 12, padding: 24, textAlign: "center" }}>
          <h3 style={{ fontWeight: 900, fontSize: "1.4rem" }}>بناء المبانى — ثقة تبنيها سنة بسنة 🏗️</h3>
          <p style={{ fontSize: ".9rem", opacity: .85 }}>تشطيبات فاخرة · إنشاءات كاملة · إشراف هندسي — 15 سنة خبرة و120 مشروع منفذ</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
          {[
            ["🏗️", "إنشاءات كاملة"],
            ["🎨", "تشطيبات فاخرة"],
            ["📐", "إشراف هندسي"],
            ["🔨", "مقاولات عامة"],
          ].map(([e, t]) => (
            <div key={t} style={card} className="z-center">
              <div style={{ fontSize: "1.8rem" }}>{e}</div>
              <b style={{ fontSize: ".85rem" }}>{t}</b>
            </div>
          ))}
        </div>
        <div style={card}>
          <b>اطلب عرض سعر مجاني 📋</b>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <input style={inputStyle} placeholder="اسمك" />
            <input style={inputStyle} placeholder="رقم الموبايل" dir="ltr" />
            <input style={inputStyle} placeholder="نوع المشروع (تشطيب/بناء...)" />
            <button style={btn} onClick={() => setSent(true)}>إرسال الطلب</button>
          </div>
          {sent && <div style={{ marginTop: 8, color: "#166534", fontWeight: 800 }}>✅ تم استلام طلبك — هنتواصل معاك خلال 24 ساعة</div>}
        </div>
      </div>
    </DemoShell>
  );
}

// ============ منصة عقارات ============
const PROPS = [
  { id: 1, type: "شقة", name: "شقة 120م — التجمع الخامس", price: 4200000, emoji: "🏢" },
  { id: 2, type: "شقة", name: "شقة 90م — مدينة نصر", price: 2100000, emoji: "🏢" },
  { id: 3, type: "فيلا", name: "فيلا 300م — الشيخ زايد", price: 9500000, emoji: "🏡" },
  { id: 4, type: "فيلا", name: "فيلا 400م — الساحل الشمالي", price: 18000000, emoji: "🏡" },
  { id: 5, type: "محل", name: "محل 40م — وسط البلد", price: 1500000, emoji: "🏪" },
];

export function RealestateDemo() {
  const [filter, setFilter] = useState("الكل");
  const [favs, setFavs] = useState<number[]>([]);
  const items = PROPS.filter((p) => filter === "الكل" || p.type === filter);

  return (
    <DemoShell title="منصة عقارات">
      <div style={{ maxWidth: 640 }}>
        <ChipRow>
          {["الكل", "شقة", "فيلا", "محل"].map((f) => (
            <button key={f} style={filter === f ? btn : btnOutline} onClick={() => setFilter(f)}>{f}</button>
          ))}
          <span style={{ fontSize: ".85rem", color: "#6b7280", alignSelf: "center" }}>⭐ محفوظة: {favs.length}</span>
        </ChipRow>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginTop: 12 }}>
          {items.map((p) => (
            <div key={p.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "2rem" }}>{p.emoji}</span>
                <button style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer" }} onClick={() => setFavs((f) => (f.includes(p.id) ? f.filter((x) => x !== p.id) : [...f, p.id]))}>
                  {favs.includes(p.id) ? "⭐" : "☆"}
                </button>
              </div>
              <b style={{ fontSize: ".88rem" }}>{p.name}</b>
              <div style={{ fontWeight: 900, color: "#16a34a" }}>{p.price.toLocaleString("ar-EG")} ج</div>
              <button style={{ ...btn, width: "100%", marginTop: 8, padding: "8px" }}>📞 حجز معاينة</button>
            </div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

// ============ منصة تعليمية أونلاين ============
const COURSES = [
  { id: 1, name: "JavaScript للمبتدئين", lessons: 24, emoji: "📘" },
  { id: 2, name: "React.js", lessons: 30, emoji: "⚛️" },
  { id: 3, name: "Python", lessons: 28, emoji: "🐍" },
  { id: 4, name: "تصميم UI/UX", lessons: 18, emoji: "🎨" },
];

export function LmsDemo() {
  const [mine, setMine] = useState<Record<number, number>>({ 1: 45, 2: 20 });

  const enroll = (id: number) => setMine((m) => (m[id] !== undefined ? m : { ...m, [id]: 0 }));
  const next = (id: number) => setMine((m) => ({ ...m, [id]: Math.min(100, (m[id] || 0) + 10) }));

  return (
    <DemoShell title="منصة تعليمية أونلاين">
      <div style={{ maxWidth: 640 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {COURSES.map((c) => {
            const prog = mine[c.id];
            return (
              <div key={c.id} style={card}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "1.8rem" }}>{c.emoji}</span>
                  {prog !== undefined && <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 10px", borderRadius: 999, fontSize: ".72rem", fontWeight: 800 }}>{prog}%</span>}
                </div>
                <b>{c.name}</b>
                <div style={{ fontSize: ".8rem", color: "#6b7280" }}>{c.lessons} درس</div>
                {prog === undefined ? (
                  <button style={{ ...btn, width: "100%", marginTop: 8 }} onClick={() => enroll(c.id)}>🎓 سجل في الكورس</button>
                ) : prog >= 100 ? (
                  <div style={{ marginTop: 8, fontSize: ".85rem", fontWeight: 800, color: "#166534" }}>✅ اكتمل — أحسنت!</div>
                ) : (
                  <button style={{ ...btnGreen, width: "100%", marginTop: 8 }} onClick={() => next(c.id)}>▶ تابع التعلم ({c.lessons * (prog / 100) | 0}/{c.lessons} درس)</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DemoShell>
  );
}

// ============ منصة توظيف ============
const JOBS = [
  { id: 1, title: "مطور Frontend", company: "شركة سوفت ووركس", salary: "15,000ج", type: "عن بعد", emoji: "💻" },
  { id: 2, title: "مصمم UI/UX", company: "استوديو بيكسل", salary: "12,000ج", type: "دوام كامل", emoji: "🎨" },
  { id: 3, title: "محاسب أول", company: "مجموعة النور", salary: "10,000ج", type: "دوام كامل", emoji: "🧮" },
  { id: 4, title: "تسويق إلكتروني", company: "أجينسى ماركت", salary: "9,000ج", type: "عن بعد", emoji: "📣" },
];

export function JobsDemo() {
  const [filter, setFilter] = useState("الكل");
  const [applied, setApplied] = useState<number[]>([]);
  const items = JOBS.filter((j) => filter === "الكل" || j.type === filter);

  return (
    <DemoShell title="منصة توظيف">
      <div style={{ maxWidth: 600 }}>
        <ChipRow>
          {["الكل", "عن بعد", "دوام كامل"].map((f) => (
            <button key={f} style={filter === f ? btn : btnOutline} onClick={() => setFilter(f)}>{f}</button>
          ))}
          <span style={{ fontSize: ".85rem", color: "#6b7280", alignSelf: "center" }}>طلباتك: {applied.length}</span>
        </ChipRow>
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {items.map((j) => (
            <div key={j.id} style={{ ...card, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: "1.6rem" }}>{j.emoji}</span>
              <div style={{ flex: 1, minWidth: 160 }}>
                <b>{j.title}</b>
                <div style={{ fontSize: ".8rem", color: "#6b7280" }}>{j.company} · {j.salary}</div>
              </div>
              <button style={applied.includes(j.id) ? btnGreen : btn} disabled={applied.includes(j.id)} onClick={() => setApplied((a) => [...a, j.id])}>
                {applied.includes(j.id) ? "✅ اتم التقديم" : "📄 قدم الآن"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

// ============ نظام إدارة المدارس ============
type Student = { id: number; name: string; cls: string; grade: number };

export function SchoolDemo() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "عمر أحمد", cls: "3/أ", grade: 88 },
    { id: 2, name: "ملك محمد", cls: "3/أ", grade: 95 },
    { id: 3, name: "يوسف علي", cls: "3/ب", grade: 72 },
  ]);
  const [name, setName] = useState("");
  const [cls, setCls] = useState("3/أ");

  const avg = Math.round(students.reduce((s, x) => s + x.grade, 0) / Math.max(1, students.length));

  return (
    <DemoShell title="نظام إدارة المدارس">
      <div style={{ maxWidth: 620 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <input style={inputStyle} placeholder="اسم الطالب" value={name} onChange={(e) => setName(e.target.value)} />
          <select style={{ ...inputStyle, maxWidth: 90 }} value={cls} onChange={(e) => setCls(e.target.value)}>
            {["3/أ", "3/ب", "4/أ"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <button style={btn} onClick={() => { if (name) { setStudents((s) => [...s, { id: Date.now(), name, cls, grade: 70 }]); setName(""); } }}>+ إضافة طالب</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 12, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#12203a", color: "white" }}>
              <th style={{ padding: 10, textAlign: "right" }}>الطالب</th>
              <th style={{ padding: 10 }}>الفصل</th>
              <th style={{ padding: 10 }}>الدرجة</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: 10, fontWeight: 700 }}>{s.name}</td>
                <td style={{ padding: 10, textAlign: "center" }}>{s.cls}</td>
                <td style={{ padding: 10, textAlign: "center" }}>
                  <input type="number" min={0} max={100} value={s.grade} style={{ ...inputStyle, maxWidth: 80, textAlign: "center", padding: "6px" }} onChange={(e) => setStudents((x) => x.map((st) => (st.id === s.id ? { ...st, grade: Number(e.target.value) } : st)))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 8, fontWeight: 800, color: avg >= 85 ? "#166534" : "#b45309" }}>📊 متوسط الفصل: {avg}%</div>
      </div>
    </DemoShell>
  );
}
