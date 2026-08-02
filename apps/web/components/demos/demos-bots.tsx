"use client";

import { useState } from "react";
import { DemoShell, ChatBubble, ChipRow, btn, btnGreen, btnOutline, inputStyle } from "./shared";

// ============ بوت واتساب لاستقبال الطلبات ============
type WaMsg = { from: "bot" | "user"; text: string };

export function BotWhatsAppDemo() {
  const [msgs, setMsgs] = useState<WaMsg[]>([
    { from: "bot", text: "أهلاً بيك 👋 في مطعم الطازج\nعايز تطلب إيه النهارده؟" },
  ]);
  const [menuOpen, setMenuOpen] = useState(false);

  const push = (from: "bot" | "user", text: string) => setMsgs((m) => [...m, { from, text }]);

  const order = (item: string, price: number) => {
    push("user", `عايز ${item}`);
    push("bot", `تمام! 🍕 ${item} = ${price} جنيه\nالطلب هيوصلك خلال 45 دقيقة. تأكيد؟`);
  };

  return (
    <DemoShell title="بوت واتساب لاستقبال الطلبات">
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14, maxWidth: 520 }}>
        <div style={{ background: "#efeae2", borderRadius: 14, padding: 14, minHeight: 280 }}>
          {msgs.map((m, i) => (
            <ChatBubble key={i} from={m.from} text={m.text} />
          ))}
        </div>
        <ChipRow>
          {!menuOpen && (
            <button style={btn} onClick={() => { setMenuOpen(true); push("user", "🍕 المنيو"); push("bot", "المنيو متاح:\n1️⃣ مارغريتا = 150ج\n2️⃣ بيبروني = 180ج\n3️⃣ خضار = 160ج\n4️⃣ فواكه البحر = 220ج"); }}>
              🍕 عايز أطلب
            </button>
          )}
          <button style={btnOutline} onClick={() => { push("user", "الأسعار"); push("bot", "الأسعار من 150ج لـ 220ج حسب النوع 🍕، والتوصيل 20ج"); }}>
            💰 الأسعار
          </button>
          <button style={btnOutline} onClick={() => { push("user", "حسابي"); push("bot", "حسابك: 01012345678\nعندك 3 طلبات قديمة ✅"); }}>
            👤 حسابي
          </button>
        </ChipRow>
        {menuOpen && (
          <ChipRow>
            {[
              ["مارغريتا 🍕", 150],
              ["بيبروني 🍕", 180],
              ["خضار 🥗", 160],
              ["فواكه البحر 🦐", 220],
            ].map(([name, price]) => (
              <button key={name} style={btnGreen} onClick={() => order(String(name), Number(price))}>
                {name} = {price}ج
              </button>
            ))}
          </ChipRow>
        )}
      </div>
    </DemoShell>
  );
}

// ============ بوت تيليجرام لإدارة الكورسات ============
type TgMsg = { from: "bot" | "user"; text: string };

export function BotTelegramDemo() {
  const [msgs, setMsgs] = useState<TgMsg[]>([
    { from: "bot", text: "أهلاً بك في أكاديمية كود 🎓\nاضغط /start للبدء" },
  ]);

  const push = (from: "bot" | "user", text: string) => setMsgs((m) => [...m, { from, text }]);

  return (
    <DemoShell title="بوت تيليجرام لإدارة الكورسات">
      <div style={{ maxWidth: 520 }}>
        <div style={{ background: "#e9f4ff", borderRadius: 14, padding: 14, minHeight: 240 }}>
          {msgs.map((m, i) => (
            <ChatBubble key={i} from={m.from} text={m.text} />
          ))}
        </div>
        <ChipRow>
          <button style={btn} onClick={() => { push("user", "/start"); push("bot", "اهلاً! 👋\nالكورسات المتاحة:\n1️⃣ JavaScript للمبتدئين — 500ج\n2️⃣ React — 800ج\n3️⃣ Python — 650ج"); }}>
            /start
          </button>
          <button style={btnOutline} onClick={() => { push("user", "/enroll 2"); push("bot", "تم تسجيلك في كورس React 🎉\nالكوبون: ZOV20 = خصم 20%\nاضغط /redeem لتفعيله"); }}>
            📝 التسجيل في كورس
          </button>
          <button style={btnOutline} onClick={() => { push("user", "/redeem"); push("bot", "✅ تم تفعيل كوبون ZOV20 — أصبحت رسوم الكورس 640ج بدلاً من 800ج"); }}>
            🎟️ كوبون خصم
          </button>
        </ChipRow>
      </div>
    </DemoShell>
  );
}

// ============ بوت خدمة العملاء ============
export function SupportBotDemo() {
  const [msgs, setMsgs] = useState<{ from: "bot" | "user"; text: string }[]>([
    { from: "bot", text: "أهلاً بك في خدمة عملاء زوفادري 💬\nاكتب سؤالك أو اختر من الأسئلة" },
  ]);
  const [text, setText] = useState("");

  const answer = (q: string): string => {
    if (q.includes("شحن") || q.includes("توصيل")) return "🚚 التوصيل خلال 3-5 أيام عمل، ومتاح لجميع المحافظات.";
    if (q.includes("مرجع") || q.includes("استرجاع")) return "🔄 الاسترجاع مجاني خلال 14 يوم من الاستلام.";
    if (q.includes("دفع") || q.includes("كاش")) return "💵 بنوفر الدفع عند الاستلام وبطاقات بنكية.";
    if (q.includes("مشروع") || q.includes("برمجة")) return "💻 أضغط على \"اطلب مشروعك\" في الموقع وسنرد خلال ساعات.";
    return "🤔 مش فاهم سؤالك — هحولك لموظف خدمة العملاء حالاً.";
  };

  const send = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { from: "user", text: q }]);
    setTimeout(() => setMsgs((m) => [...m, { from: "bot", text: answer(q) }]), 400);
    setText("");
  };

  return (
    <DemoShell title="بوت خدمة العملاء الذكي">
      <div style={{ maxWidth: 520 }}>
        <div style={{ background: "#f0fdf4", borderRadius: 14, padding: 14, minHeight: 240 }}>
          {msgs.map((m, i) => (
            <ChatBubble key={i} from={m.from} text={m.text} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input style={inputStyle} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(text)} placeholder="اكتب سؤالك هنا..." />
          <button style={btn} onClick={() => send(text)}>إرسال</button>
        </div>
        <ChipRow>
          {["🚚 الشحن والتوصيل", "🔄 الاسترجاع", "💵 طرق الدفع", "💻 طلب مشروع"].map((c) => (
            <button key={c} style={btnOutline} onClick={() => send(c)}>{c}</button>
          ))}
        </ChipRow>
      </div>
    </DemoShell>
  );
}
