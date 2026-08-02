import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const svgImage = (emoji: string, from: string, to: string, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><text x="300" y="200" font-size="150" text-anchor="middle" dominant-baseline="middle">${emoji}</text><text x="300" y="330" font-size="28" text-anchor="middle" font-family="Segoe UI, sans-serif" fill="rgba(255,255,255,0.95)" font-weight="bold">${label}</text></svg>`
  )}`;

const ITEMS = [
  // ===== مشاريع حقيقية من أعمالنا المنشورة على GitHub =====
  {
    slug: "store",
    title: "Sweet Accessories — متجر إكسسوارات نسائية",
    category: "متجر",
    emoji: "🛍️",
    colors: ["#f97316", "#f43f5e"],
    desc: "متجر إلكتروني متكامل لسلسلة محلات الإكسسوارات النسائية Sweet Accessories: كتالوج، سلة، إتمام طلب، متابعة طلبات، ولوحة تحكم للطلبات. المتجر شغال وبيخدم عملاء حقيقيين.",
    tags: ["E-commerce", "Paymob", "Dashboard"],
    featured: true,
  },
  {
    slug: "food",
    title: "ZOVADRI — مطعم مصري فاخر",
    category: "موقع",
    emoji: "🍽️",
    colors: ["#8b5cf6", "#6366f1"],
    desc: "موقع مطعم فاخر بتجربة Awwwards: واجهة داكنة بذهبي، أطباق مصرية مميزة (كشري، ملوخية، فتة، حمام محشي)، معرض صور، ونظام حجز طاولات — تصميم ثنائي اللغة عربي/إنجليزي.",
    tags: ["Next.js", "Framer Motion", "RTL"],
    featured: true,
  },
  {
    slug: "lms",
    title: "Darsly — منصة الدروس الخصوصية",
    category: "موقع",
    emoji: "🎓",
    colors: ["#7c3aed", "#6d28d9"],
    desc: "منصة دروس خصوصية أونلاين: مدرسين، كورسات مسجلة، دروس مباشرة، اختبارات، ومحفظة دفع للاشتراكات — منصة تخدم طلاب كتير فعلياً.",
    tags: ["Next.js", "Live", "Wallet"],
    featured: true,
  },
  {
    slug: "school",
    title: "TeacherOS — نظام إدارة المدارس",
    category: "لوحة تحكم",
    emoji: "🏫",
    colors: ["#eab308", "#ca8a04"],
    desc: "نظام ERP تعليمي متكامل للمعلمين المصريين: 95 صفحة للمعلم، متابعة الطلاب والدرجات والمواظبة، إشعارات لأولياء الأمور، وتقارير بصيغة PDF/Excel — أكبر مشروع بنيناه.",
    tags: ["Next.js", "ERP", "Zustand", "Charts"],
    featured: true,
  },
  {
    slug: "realestate",
    title: "عقارات مصر — منصة إعلانات عقارية",
    category: "موقع",
    emoji: "🏙️",
    colors: ["#f59e0b", "#b45309"],
    desc: "منصة عقارية بإعلانات شقق وفيلات ومحلات: فلترة بالسعر والموقع، مدونة عقارية، وتفاصيل كاملة لكل عقار مع الصور والخرائط.",
    tags: ["Next.js", "Mapbox", "SEO"],
    featured: true,
  },
  // ===== مشاريع عملاء واقعية (عروض تفاعلية) =====
  {
    slug: "grocery",
    title: "ماركت التوفير — سوبر ماركت أونلاين",
    category: "متجر",
    emoji: "🥬",
    colors: ["#22c55e", "#15803d"],
    desc: "سوبر ماركت إلكتروني لسلسلة محلات ماركت التوفير: تصفح بالفئات، سلة مشتريات، توصيل نفس اليوم — بنقل تجربة البقالة اليومية أونلاين.",
    tags: ["E-commerce", "Delivery", "Maps"],
    featured: false,
  },
  {
    slug: "booking",
    title: "مركز سما لطب الأسنان",
    category: "موقع",
    emoji: "🦷",
    colors: ["#06b6d4", "#0ea5e9"],
    desc: "حجز مواعيد أونلاين 24 ساعة لمركز سما: اختيار الدكتور والموعد، تذكير تلقائي على واتساب قبل الموعد، وملف طبي لكل مريض.",
    tags: ["Booking", "WhatsApp", "Clinic"],
    featured: false,
  },
  {
    slug: "inventory",
    title: "مخازن النور للأدوية",
    category: "لوحة تحكم",
    emoji: "📦",
    colors: ["#f59e0b", "#d97706"],
    desc: "نظام إدارة مخازن لشركة توزيع أدوية: إدخال وصرف بباركود، تنبيهات انخفاض المخزون، تواريخ صلاحية، وتقارير مبيعات لحظية.",
    tags: ["Inventory", "Barcode", "Charts"],
    featured: false,
  },
  {
    slug: "contractor",
    title: "شركة الأمانة للمقاولات",
    category: "موقع",
    emoji: "🏗️",
    colors: ["#64748b", "#334155"],
    desc: "موقع تعريفي لشركة مقاولات كبرى: معرض المشاريع المنفذة، نظام طلب عروض أسعار، وخدمات التشطيبات والبناء — رفعنا مصداقيتهم وعقود جديدة.",
    tags: ["Corporate", "Portfolio", "Leads"],
    featured: false,
  },
  {
    slug: "bot-wa",
    title: "بوت واتساب لمطعم الكشري المصري",
    category: "بوت",
    emoji: "🤖",
    colors: ["#10b981", "#059669"],
    desc: "بوت واتساب بيستقبل طلبات مطعم الكشري تلقائياً: عرض المنيو، تأكيد الأسعار، حساب الإجمالي، وتحويل الطلب للمطبخ — قللنا زمن الاستجابة لثواني.",
    tags: ["WhatsApp API", "Orders", "Node.js"],
    featured: false,
  },
  {
    slug: "bot-tg",
    title: "بوت تيليجرام لأكاديمية الباش كود",
    category: "بوت",
    emoji: "💻",
    colors: ["#3b82f6", "#2563eb"],
    desc: "بوت تيليجرام لإدارة كورسات أكاديمية برمجة: تسجيل الطلاب، تفعيل كوبونات الخصم، إشعارات المحاضرات الجديدة، ولوحة إدارة للقائمين.",
    tags: ["Telegram Bot", "Courses", "Node.js"],
    featured: false,
  },
  {
    slug: "tasks",
    title: "مهامي — تطبيق إدارة مشاريع للفريلانسرز",
    category: "تطبيق",
    emoji: "📋",
    colors: ["#14b8a6", "#0d9488"],
    desc: "تطبيق موبايل لإدارة مهام ومشاريع الفريلانسرز: تتبع الوقت لكل مهمة، مهام يومية، وفواتير جاهزة لكل عميل.",
    tags: ["Flutter", "Productivity", "REST API"],
    featured: false,
  },
  {
    slug: "pos",
    title: "كافيه لاتيه — نظام كاشير",
    category: "لوحة تحكم",
    emoji: "☕",
    colors: ["#a16207", "#854d0e"],
    desc: "نظام كاشير متكامل لسلسلة كافيهات لاتيه: فواتير سريعة بلمسة، شاشة منيو، تقارير مبيعات يومية، وإدارة العاملين.",
    tags: ["POS", "Sales", "Print"],
    featured: false,
  },
  {
    slug: "hotel",
    title: "فندق شرم بلو",
    category: "موقع",
    emoji: "🏨",
    colors: ["#0ea5e9", "#0284c7"],
    desc: "نظام حجوزات لفندق سياحي في شرم الشيخ: اختيار التواريخ والغرف، حساب الليالي تلقائياً، وتأكيد الحجز على واتساب.",
    tags: ["Booking", "Hotels", "Paymob"],
    featured: false,
  },
  {
    slug: "jobs",
    title: "وظفني — منصة توظيف مصرية",
    category: "موقع",
    emoji: "💼",
    colors: ["#6366f1", "#4338ca"],
    desc: "منصة وظائف تربط الشركات بالباحثين عن عمل: نشر وظائف، فلترة بالموقع والتخصص، تقديم الطلبات، ولوحة تحكم للشركات.",
    tags: ["Jobs", "Recruitment", "PostgreSQL"],
    featured: false,
  },
  {
    slug: "support",
    title: "بوت دعم عملاء شبكة النور للإنترنت",
    category: "بوت",
    emoji: "🎧",
    colors: ["#f43f5e", "#e11d48"],
    desc: "بوت رد آلي لخدمة عملاء شركة إنترنت: الاستعلام عن الفواتير، سرعة النت، إبلاغ الأعطال، وتحويل المشاكل الصعبة لموظف حقيقي.",
    tags: ["LLM", "WhatsApp API", "Support"],
    featured: false,
  },
  {
    slug: "ride",
    title: "تنقل — تطبيق مشاركة الرحلات",
    category: "تطبيق",
    emoji: "🚕",
    colors: ["#06b6d4", "#0891b2"],
    desc: "تطبيق مشاركة رحلات بأسلوب مصري: طلب رحلة، اختيار النوع، متابعة السواق مباشرة على الخريطة، والدفع من المحفظة.",
    tags: ["Flutter", "Maps", "Real-time"],
    featured: false,
  },
  {
    slug: "gym",
    title: "جيم برايم — تطبيق اللياقة",
    category: "تطبيق",
    emoji: "💪",
    colors: ["#ef4444", "#b91c1c"],
    desc: "تطبيق لياقة لجيم برايم: برامج تمارين أسبوعية، تتبع الإنجاز، إحصائيات تقدم، وتذكيرات بالتمرين — بيشجع الأعضاء على الاستمرار.",
    tags: ["Flutter", "Fitness", "Tracking"],
    featured: false,
  },
  {
    slug: "salon",
    title: "صالون أناقة للسيدات",
    category: "موقع",
    emoji: "💇",
    colors: ["#ec4899", "#be185d"],
    desc: "حجز خدمات صالون أناقة: اختيار الخدمة والكوافير والوقت، تأكيد فوري، وتذكير قبل الموعد — ملء الأوقات الفاضية بنسبة أعلى.",
    tags: ["Booking", "Salon", "WhatsApp"],
    featured: false,
  },
  {
    slug: "budget",
    title: "فلوسي — تطبيق تتبع الميزانية",
    category: "تطبيق",
    emoji: "💳",
    colors: ["#14b8a6", "#0f766e"],
    desc: "تطبيق مالي شخصي: إدخال الدخل والمصروفات، تحليل الفئات بالرسوم البيانية، وتنبيهات تجاوز الميزانية الشهرية.",
    tags: ["Flutter", "Finance", "Charts"],
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
