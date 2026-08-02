import { Router } from "express";
import { prisma, OrderStatus } from "@zovadri/db";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

router.get("/dashboard", async (_req, res) => {
  try {
    const [orders, portfolio, users, settings] = await Promise.all([
      prisma.projectOrder.count(),
      prisma.portfolioItem.count(),
      prisma.user.count(),
      prisma.setting.count(),
    ]);
    return res.json({ stats: { orders, portfolio, users, settings } });
  } catch (e) {
    console.error("dashboard:", e);
    return res.status(500).json({ error: "حدث خطأ" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const { status } = req.query;
    const orders = await prisma.projectOrder.findMany({
      where: status && status !== "ALL" ? { status: status as OrderStatus } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return res.json({ orders });
  } catch (e) {
    console.error("orders:", e);
    return res.status(500).json({ error: "حدث خطأ" });
  }
});

router.patch("/orders/:id", async (req, res) => {
  try {
    const { status, notes } = req.body || {};
    const data: { status?: OrderStatus; notes?: string } = {};
    if (status) {
      if (!Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ error: "حالة غير صالحة" });
      }
      data.status = status;
    }
    if (typeof notes === "string") data.notes = notes;
    const order = await prisma.projectOrder.update({ where: { id: req.params.id }, data });
    return res.json({ order });
  } catch (e) {
    console.error("update order:", e);
    return res.status(500).json({ error: "حدث خطأ في تعديل الطلب" });
  }
});

router.delete("/orders/:id", async (req, res) => {
  try {
    await prisma.projectOrder.delete({ where: { id: req.params.id } });
    return res.json({ ok: true });
  } catch (e) {
    console.error("delete order:", e);
    return res.status(500).json({ error: "حدث خطأ في حذف الطلب" });
  }
});

router.get("/portfolio", async (_req, res) => {
  try {
    const items = await prisma.portfolioItem.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "desc" }] });
    const out = items.map((it) => {
      let pages = [];
      if (it.pagesJson) {
        try {
          const arr = JSON.parse(it.pagesJson);
          if (Array.isArray(arr)) pages = arr;
        } catch { /* ignore */ }
      }
      return { ...it, pages, pagesJson: undefined };
    });
    return res.json({ items: out });
  } catch (e) {
    console.error("admin portfolio:", e);
    return res.status(500).json({ error: "حدث خطأ" });
  }
});

router.post("/portfolio", async (req, res) => {
  try {
    const { title, description, image, category, tags, link, featured, pages } = req.body || {};
    if (!title || !description) return res.status(400).json({ error: "العنوان والوصف مطلوبين" });
    const item = await prisma.portfolioItem.create({
      data: {
        title,
        description,
        image: image || null,
        category: category || "موقع",
        tags: Array.isArray(tags) ? tags : [],
        link: link || null,
        featured: Boolean(featured),
        pagesJson: Array.isArray(pages) && pages.length ? JSON.stringify(pages) : null,
      },
    });
    return res.status(201).json({ item });
  } catch (e) {
    console.error("create portfolio:", e);
    return res.status(500).json({ error: "حدث خطأ في الإضافة" });
  }
});

router.patch("/portfolio/:id", async (req, res) => {
  try {
    const { title, description, image, category, tags, link, featured, pages } = req.body || {};
    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (image !== undefined) data.image = image;
    if (category !== undefined) data.category = category;
    if (tags !== undefined) data.tags = tags;
    if (link !== undefined) data.link = link;
    if (featured !== undefined) data.featured = Boolean(featured);
    if (Array.isArray(pages)) data.pagesJson = pages.length ? JSON.stringify(pages) : null;
    const item = await prisma.portfolioItem.update({ where: { id: req.params.id }, data });
    return res.json({ item });
  } catch (e) {
    console.error("update portfolio:", e);
    return res.status(500).json({ error: "حدث خطأ في التعديل" });
  }
});

router.delete("/portfolio/:id", async (req, res) => {
  try {
    await prisma.portfolioItem.delete({ where: { id: req.params.id } });
    return res.json({ ok: true });
  } catch (e) {
    console.error("delete portfolio:", e);
    return res.status(500).json({ error: "حدث خطأ في الحذف" });
  }
});

router.get("/settings", async (_req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return res.json({ settings: map });
  } catch (e) {
    console.error("settings:", e);
    return res.status(500).json({ error: "حدث خطأ" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const entries = req.body || {};
    const allowed = ["whatsapp", "phoneDisplay", "facebook", "tagline"];
    for (const key of Object.keys(entries)) {
      if (!allowed.includes(key)) continue;
      const value = String(entries[key] ?? "");
      await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
    }
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return res.json({ settings: map });
  } catch (e) {
    console.error("update settings:", e);
    return res.status(500).json({ error: "حدث خطأ في الحفظ" });
  }
});

export { router as adminRouter };