import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const svgImage = (emoji: string, from: string, to: string, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><text x="300" y="200" font-size="150" text-anchor="middle" dominant-baseline="middle">${emoji}</text><text x="300" y="330" font-size="28" text-anchor="middle" font-family="Segoe UI, sans-serif" fill="rgba(255,255,255,0.95)" font-weight="bold">${label}</text></svg>`
  )}`;

const ITEMS = [
  // ==== المشاريع الأصلية (9) ====
  {
    slug: "store",
    title: "متجر إلكتروني للملابس",
    category: "متجر",
    emoji: "🛍️",
    colors: ["#f97316", "#f43f5e"],
    desc: "متجر ملابس كامل: كتالوج منتجات، فلترة بالألوان والمقاسات، سلة، دفع إلكتروني، ولوحة تحكم لإدارة الطلبات والمخزون.",
    tags: ["Next.js", "React", "Node.js", "Paymob"],
    featured: true,
  },
  {
    slug: "food",
    title: "تطبيق توصيل طلبات المطاعم",
    category: "تطبيق",
    emoji: "🛵",
    colors: ["#8b5cf6", "#6366f1"],
    desc: "تطبيق موبايل لمطعم: قائمة طعام تفاعلية، طلب مباشر، تتبع الطلب Live على الخريطة، وإشعارات فورية بالحالة.",
    tags: ["Flutter", "Firebase", "Maps"],
    featured: true,
  },
  {
    slug: "bot-wa",
    title: "بوت واتساب لاستقبال الطلبات",
    category: "بوت",
    emoji: "🤖",
    colors: ["#10b981", "#059669"],
    desc: "بوت واتساب بيستقبل طلبات عملائك تلقائياً: تأكيد الأسعار، حساب الإجمالي، وتحويل المحادثة لموظف عند الحاجة.",
    tags: ["WhatsApp API", "Node.js"],
    featured: true,
  },
  {
    slug: "booking",
    title: "موقع حجز مواعيد عيادة أسنان",
    category: "موقع",
    emoji: "🦷",
    colors: ["#06b6d4", "#0ea5e9"],
    desc: "حجز مواعيد أونلاين 24 ساعة: اختيار الطبيب والموعد، تذكير تلقائي على واتساب، وملف طبي لكل مريض.",
    tags: ["React", "Node.js", "PostgreSQL"],
    featured: true,
  },
  {
    slug: "inventory",
    title: "لوحة تحكم إدارة مخازن",
    category: "لوحة تحكم",
    emoji: "📦",
    colors: ["#f59e0b", "#d97706"],
    desc: "نظام مخازن شامل: إدخال وصرف، تنبيهات انخفاض المخزون، دعم الباركود، وتقارير مبيعات لحظية.",
    tags: ["Next.js", "Prisma", "Charts"],
    featured: false,
  },
  {
    slug: "contractor",
    title: "موقع تعريفي لشركة مقاولات",
    category: "موقع",
    emoji: "🏗️",
    colors: ["#64748b", "#334155"],
    desc: "موقع شركات المقاولات: معرض مشاريع منفذة، نظام طلب عروض أسعار، وصفحات احترافية ترفع مصداقية الشركة.",
    tags: ["Next.js", "Tailwind CSS"],
    featured: false,
  },
  {
    slug: "bot-tg",
    title: "بوت تيليجرام لإدارة الكورسات",
    category: "بوت",
    emoji: "🎓",
    colors: ["#3b82f6", "#2563eb"],
    desc: "بوت تيليجرام لمنصة تعليمية: تسجيل الطلاب في الكورسات، تفعيل كوبونات خصم، وإشعارات بالمحاضرات الجديدة.",
    tags: ["Telegram Bot", "Node.js"],
    featured: false,
  },
  {
    slug: "tasks",
    title: "تطبيق إدارة المشاريع للفريلانسرز",
    category: "تطبيق",
    emoji: "📋",
    colors: ["#14b8a6", "#0d9488"],
    desc: "تطبيق يدير مهامك ومشاريعك: تتبع الوقت لكل مهمة، مهام يومية، وفواتير جاهزة لكل عميل.",
    tags: ["Flutter", "REST API", "SQLite"],
    featured: false,
  },
  {
    slug: "pos",
    title: "نظام كاشير لمقهى",
    category: "أخرى",
    emoji: "☕",
    colors: ["#a16207", "#854d0e"],
    desc: "نظام كاشير شامل: فواتير سريعة بلمسة، شاشة مينيو، تقارير يومية للمبيعات، وإدارة العاملين.",
    tags: ["React", "Node.js", "Print"],
    featured: false,
  },
  // ==== المشاريع الجديدة (11) ====
  {
    slug: "lms",
    title: "منصة تعليمية أونلاين",
    category: "موقع",
    emoji: "📚",
    colors: ["#7c3aed", "#6d28d9"],
    desc: "منصة كورسات كاملة: تسجيل الطلاب، تتبع تقدم التعلم، اختبارات، وشهادات إتمام تلقائية.",
    tags: ["Next.js", "Stripe", "PostgreSQL"],
    featured: false,
  },
  {
    slug: "hotel",
    title: "نظام حجوزات فندق",
    category: "موقع",
    emoji: "🏨",
    colors: ["#0ea5e9", "#0284c7"],
    desc: "حجز فنادق أونلاين: اختيار التواريخ والغرف، حساب الليالي تلقائياً، وتأكيد الحجز على واتساب.",
    tags: ["React", "Node.js", "Paymob"],
    featured: false,
  },
  {
    slug: "grocery",
    title: "متجر سوبر ماركت أونلاين",
    category: "متجر",
    emoji: "🥬",
    colors: ["#22c55e", "#15803d"],
    desc: "سوبر ماركت إلكتروني: تصفح بالفئات، سلة مشتريات، وتوصيل سريع بنفس اليوم.",
    tags: ["Next.js", "Node.js", "Maps"],
    featured: false,
  },
  {
    slug: "jobs",
    title: "منصة توظيف",
    category: "موقع",
    emoji: "💼",
    colors: ["#6366f1", "#4338ca"],
    desc: "منصة وظائف: نشر الوظائف، فلترة بالموقع والنوع، تقديم الطلبات، ولوحة تحكم للشركات.",
    tags: ["React", "Node.js", "PostgreSQL"],
    featured: false,
  },
  {
    slug: "school",
    title: "نظام إدارة المدارس",
    category: "لوحة تحكم",
    emoji: "🏫",
    colors: ["#eab308", "#ca8a04"],
    desc: "إدارة كاملة للمدرسة: الطلاب والدرجات، جداول الحصص، أولياء الأمور، والتقارير الفصلية.",
    tags: ["Next.js", "Prisma", "Charts"],
    featured: false,
  },
  {
    slug: "support",
    title: "بوت خدمة العملاء الذكي",
    category: "بوت",
    emoji: "🎧",
    colors: ["#f43f5e", "#e11d48"],
    desc: "بوت رد آلي على استفسارات العملاء: شحن، مرتجعات، دفع — بيفهم الأسئلة ويرد فوراً، وبيحول لموظف عند الحاجة.",
    tags: ["LLM", "WhatsApp API", "Node.js"],
    featured: false,
  },
  {
    slug: "ride",
    title: "تطبيق مشاركة الرحلات",
    category: "تطبيق",
    emoji: "🚕",
    colors: ["#06b6d4", "#0891b2"],
    desc: "تطبيق رحلات كامل: طلب رحلة، اختيار النوع، متابعة السواق مباشرة، والدفع من المحفظة.",
    tags: ["Flutter", "Firebase", "Maps"],
    featured: false,
  },
  {
    slug: "gym",
    title: "تطبيق الجيم وتتبع التمارين",
    category: "تطبيق",
    emoji: "💪",
    colors: ["#ef4444", "#b91c1c"],
    desc: "تطبيق لياقة: برامج تمارين أسبوعية، تتبع الإنجاز، إحصائيات، وتذكيرات بالتمرين.",
    tags: ["Flutter", "Firebase"],
    featured: false,
  },
  {
    slug: "realestate",
    title: "منصة عقارات",
    category: "موقع",
    emoji: "🏙️",
    colors: ["#f59e0b", "#b45309"],
    desc: "منصة عقارات: إعلانات شقق وفيلات ومحلات، فلترة بالسعر والموقع، معاينات وحفظ مفضلة.",
    tags: ["Next.js", "Mapbox", "Node.js"],
    featured: false,
  },
  {
    slug: "salon",
    title: "نظام حجز صالون",
    category: "موقع",
    emoji: "💇",
    colors: ["#ec4899", "#be185d"],
    desc: "حجز خدمات الصالون: اختيار الخدمة والكوافير والوقت، تأكيد فوري، وتذكير قبل الموعد.",
    tags: ["React", "Node.js", "PostgreSQL"],
    featured: false,
  },
  {
    slug: "budget",
    title: "تطبيق تتبع الميزانية",
    category: "تطبيق",
    emoji: "💳",
    colors: ["#14b8a6", "#0f766e"],
    desc: "تطبيق مالي شخصي: إدخال الدخل والمصروفات، تحليل الفئات، وتنبيهات تجاوز الميزانية.",
    tags: ["Flutter", "SQLite", "Charts"],
    featured: false,
  },
];

async function main() {
  console.log("🧹 مسح البورتفوليو الحالي...");
  await prisma.portfolioItem.deleteMany();

  console.log(`💼 إضافة ${ITEMS.length} مشروع...`);
  for (const it of ITEMS) {
    await prisma.portfolioItem.create({
      data: {
        title: it.title,
        description: it.desc,
        image: svgImage(it.emoji, it.colors[0], it.colors[1], it.title),
        category: it.category,
        tags: it.tags,
        featured: it.featured,
        link: `/demo/${it.slug}`,
      },
    });
  }
  console.log(`✅ تمت إضافة ${ITEMS.length} مشاريع مع روابط تجريبية`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
