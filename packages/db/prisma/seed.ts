import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hash = (pw: string) => bcrypt.hashSync(pw, 10);

async function main() {
  console.log("Seeding Zovadri...");

  // أسماء الأدمن/العملاء/البائعين
  const users = [
    { email: "admin@zovadri.com", phone: "01000000000", name: "إدارة زوفادري", role: "ADMIN", pw: "Admin@123" },
    { email: "customer@zovadri.com", phone: "01011111111", name: "عميل زوفادري", role: "CUSTOMER", pw: "Customer@123" },
    { email: "seller1@zovadri.com", phone: "01022222221", name: "بائع 1", role: "SELLER", pw: "Seller@123" },
    { email: "seller2@zovadri.com", phone: "01022222222", name: "بائع 2", role: "SELLER", pw: "Seller@123" },
  ];

  const createdUsers: Record<string, any> = {};
  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, phone: u.phone, role: u.role as any, passwordHash: hash(u.pw) },
      create: {
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role as any,
        passwordHash: hash(u.pw),
      },
    });
    createdUsers[u.email] = user;
  }
  console.log("Users ready:", users.map((u) => u.email).join(", "));

  // الإعدادات الافتراضية
  const defaultSettings: Record<string, string> = {
    "site.name": "Zovadri — زوفادري",
    "site.tagline": "تسوّق كل ما تحتاجه في مكان واحد",
    "site.logo": "",
    "contact.whatsapp": "201039866876",
    "contact.phone": "01012345678",
    "contact.email": "support@zovadri.com",
    "contact.vodafoneWallet": "01012345678",
    "shipping.freeThreshold": "1500",
    "shipping.codFee": "20",
    "seller.commissionRate": "0.1",
    "shipping.governorates": JSON.stringify({
      "القاهرة": 30, "الجيزة": 30, "الأسكندرية": 45, "القليوبية": 35,
      "الشرقية": 45, "الدقهلية": 45, "الغربية": 40, "المنوفية": 40,
      "كفر الشيخ": 45, "البحر الأحمر": 60, "بورسعيد": 55, "الإسماعيلية": 50,
      "السويس": 50, "دمياط": 50, "المطرية": 50, "الفيوم": 45, "بني سويف": 45,
      "المنيا": 50, "أسيوط": 55, "سوهاج": 55, "قنا": 60, "الأقصر": 65,
      "أسوان": 70, "البحيرة": 45, "شمال سيناء": 65, "جنوب سيناء": 70, "الوادي الجديد": 60,
    }),
  };
  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log("Settings ready");

  // الفئات الرئيسية
  const mainCategories = [
    { name: "إلكترونيات", slug: "electronics", icon: "📱" },
    { name: "منزل ومطبخ", slug: "home-kitchen", icon: "🏠" },
    { name: "ملابس", slug: "fashion", icon: "👕" },
    { name: "جمال وعناية", slug: "beauty", icon: "💄" },
    { name: "رياضة", slug: "sports", icon: "⚽" },
    { name: "ألعاب وجامعات", slug: "toys", icon: "🧸" },
  ];
  for (const c of mainCategories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, icon: c.icon },
      create: { id: `cat-${c.slug}`, name: c.name, slug: c.slug, icon: c.icon },
    });
  }
  console.log("Categories ready");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });