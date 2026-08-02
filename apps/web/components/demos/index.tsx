"use client";

import React from "react";

type DemoLoader = () => Promise<{ default: React.ComponentType }>;

export const DEMOS: Record<string, { title: string; component: DemoLoader }> = {
  store: { title: "متجر إلكتروني للملابس", component: () => import("./demos-web").then((m) => ({ default: m.StoreDemo })) },
  grocery: { title: "متجر سوبر ماركت أونلاين", component: () => import("./demos-web").then((m) => ({ default: m.GroceryDemo })) },
  food: { title: "تطبيق توصيل طلبات المطاعم", component: () => import("./demos-apps").then((m) => ({ default: m.FoodAppDemo })) },
  "bot-wa": { title: "بوت واتساب لاستقبال الطلبات", component: () => import("./demos-bots").then((m) => ({ default: m.BotWhatsAppDemo })) },
  booking: { title: "موقع حجز مواعيد عيادة أسنان", component: () => import("./demos-web").then((m) => ({ default: m.BookingDemo })) },
  inventory: { title: "لوحة تحكم إدارة مخازن", component: () => import("./demos-web").then((m) => ({ default: m.InventoryDemo })) },
  contractor: { title: "موقع شركة مقاولات", component: () => import("./demos-web").then((m) => ({ default: m.ContractorDemo })) },
  "bot-tg": { title: "بوت تيليجرام لإدارة الكورسات", component: () => import("./demos-bots").then((m) => ({ default: m.BotTelegramDemo })) },
  tasks: { title: "تطبيق إدارة المشاريع", component: () => import("./demos-apps").then((m) => ({ default: m.TasksAppDemo })) },
  pos: { title: "نظام كاشير لمقهى", component: () => import("./demos-web").then((m) => ({ default: m.PosDemo })) },
  lms: { title: "منصة تعليمية أونلاين", component: () => import("./demos-web").then((m) => ({ default: m.LmsDemo })) },
  hotel: { title: "نظام حجوزات فندق", component: () => import("./demos-web").then((m) => ({ default: m.HotelDemo })) },
  jobs: { title: "منصة توظيف", component: () => import("./demos-web").then((m) => ({ default: m.JobsDemo })) },
  school: { title: "نظام إدارة المدارس", component: () => import("./demos-web").then((m) => ({ default: m.SchoolDemo })) },
  support: { title: "بوت خدمة العملاء الذكي", component: () => import("./demos-bots").then((m) => ({ default: m.SupportBotDemo })) },
  ride: { title: "تطبيق مشاركة الرحلات", component: () => import("./demos-apps").then((m) => ({ default: m.RideAppDemo })) },
  gym: { title: "تطبيق الجيم", component: () => import("./demos-apps").then((m) => ({ default: m.GymAppDemo })) },
  realestate: { title: "منصة عقارات", component: () => import("./demos-web").then((m) => ({ default: m.RealestateDemo })) },
  salon: { title: "نظام حجز صالون", component: () => import("./demos-web").then((m) => ({ default: m.SalonDemo })) },
  budget: { title: "تطبيق تتبع الميزانية", component: () => import("./demos-apps").then((m) => ({ default: m.BudgetAppDemo })) },
};