import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hash = (pw: string) => bcrypt.hashSync(pw, 10);

async function main() {
  console.log("Seeding...");

  await prisma.user.upsert({
    where: { email: "admin@zovadri.com" },
    update: { name: "إدارة زوفادري", phone: "01000000000", role: "ADMIN", passwordHash: hash("Admin@123") },
    create: { name: "إدارة زوفادري", email: "admin@zovadri.com", phone: "01000000000", role: "ADMIN", passwordHash: hash("Admin@123") },
  });

  const settings: Record<string, string> = {
    whatsapp: "201039866876",
    phoneDisplay: "01012345678",
    facebook: "",
    tagline: "نصنع من فكرتك منتجاً رقمياً حقيقياً",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  const portfolio = [
    { title: "منصة حجوزات طيران", description: "حجز التذاكر ومقارنة الأسعار وإلغاء الحجز بسهولة.", category: "موقع", tags: ["Next.js", "Node.js", "API"], link: "/demo/flights" },
    { title: "متجر إلكتروني متكامل", description: "متجر بمنتجات مالية ومدفوعات وسلة تسوق", category: "متجر", tags: ["Next.js", "Stripe"], link: "/demo/store" },
    { title: "منصة تعليمية", description: "دورات ومحاضرات فيديو ونظام تتبع تقدم للطلاب", category: "منصة", tags: ["Next.js"], link: "/demo/edu" },
    { title: "بوت واتساب للطلبات", description: "بوت يستقبل الطلبات ويرسلها لقناة التوست", category: "بوت", tags: ["Bot", "WhatsApp"], link: "/demo/bot" },
  ];
  for (const p of portfolio) {
    await prisma.portfolioItem.create({ data: { ...p, tags: p.tags } });
  }

  console.log("Done");
}

main().finally(() => prisma.$disconnect());