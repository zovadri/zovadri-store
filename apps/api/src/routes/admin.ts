import { Router } from "express";
import { prisma } from "@zovadri/db";
import { authMiddleware, requireAdmin } from "../middleware/auth";
import { getSettings, invalidateSettingsCache } from "../settings";

const router = Router();

router.use(authMiddleware, requireAdmin);

router.get("/dashboard", async (_req: any, res) => {
  try {
    const [ordersCount, usersCount, sellersCount, productsCount, revenueAgg, pendingSellers] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.seller.count(),
      prisma.product.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.seller.count({ where: { status: "PENDING" } }),
    ]);
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { User: { select: { name: true, phone: true } } },
    });
    res.json({
      stats: {
        orders: ordersCount,
        users: usersCount,
        sellers: sellersCount,
        products: productsCount,
        pendingSellers,
        revenue: Number(revenueAgg._sum.total ?? 0),
      },
      recentOrders: recentOrders.map((o: any) => ({ ...o, total: Number(o.total), User: o.User })),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/orders", async (req: any, res) => {
  try {
    const { status, paymentStatus, search, page = 1 } = req.query;
    const pageSize = 20;
    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (search) where.OR = [{ orderNumber: { contains: String(search), mode: "insensitive" } }];

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * pageSize,
        take: pageSize,
        include: {
          User: { select: { name: true, phone: true, email: true } },
          OrderItem: { select: { title: true, quantity: true, price: true, sellerName: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / pageSize) });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/orders/:id", async (req: any, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { User: { select: { name: true, phone: true, email: true } }, OrderItem: true },
    });
    if (!order) return res.status(404).json({ error: "الطلب غير موجود" });
    res.json({ order });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/orders/:id/status", async (req: any, res) => {
  try {
    const { status } = req.body || {};
    const VALID = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
    if (!VALID.includes(status)) return res.status(400).json({ error: "حالة غير صالحة" });

    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: "الطلب غير موجود" });

    const data: any = { status };
    if (status === "SHIPPED") {
      data.trackingCode = req.body.trackingCode || `ZT-${Math.floor(100000 + Math.random() * 900000)}`;
      data.shippedAt = order.shippedAt ?? new Date();
    }
    if (status === "DELIVERED") {
      data.deliveredAt = order.deliveredAt ?? new Date();
      if (order.paymentMethod === "CASH_ON_DELIVERY" && order.paymentStatus !== "PAID") {
        data.paymentStatus = "PAID";
        data.paidAt = new Date();
      }
    }
    if (status === "CANCELLED") data.cancelledAt = new Date();

    await prisma.order.update({ where: { id: order.id }, data });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/orders/:id/payment", async (req: any, res) => {
  try {
    const { action, reason } = req.body || {};
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: "الطلب غير موجود" });
    if (order.paymentMethod !== "VODAFONE_CASH") {
      return res.status(400).json({ error: "هذا الطلب ليس بدفع فودافون كاش" });
    }
    if (action === "confirm") {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "PAID", paidAt: new Date(), paymentRejectReason: null },
      });
    } else if (action === "reject") {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "FAILED", paymentRejectReason: reason || "الدفع مرفوض" },
      });
    } else {
      return res.status(400).json({ error: "فعل غير صالح" });
    }
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/sellers", async (_req: any, res) => {
  try {
    const sellers = await prisma.seller.findMany({
      orderBy: { createdAt: "desc" },
      include: { User: { select: { name: true, email: true, phone: true } }, _count: { select: { Product: true } } },
    });
    res.json({ items: sellers });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/sellers/:id/status", async (req: any, res) => {
  try {
    const { status } = req.body || {};
    const VALID = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];
    if (!VALID.includes(status)) return res.status(400).json({ error: "حالة غير صالحة" });
    const seller = await prisma.seller.findUnique({ where: { id: req.params.id } });
    if (!seller) return res.status(404).json({ error: "المتجر غير موجود" });
    if (status === "APPROVED") {
      await prisma.$transaction([
        prisma.seller.update({ where: { id: seller.id }, data: { status } }),
        prisma.user.update({ where: { id: seller.userId }, data: { role: "SELLER" } }),
      ]);
    } else {
      await prisma.seller.update({ where: { id: seller.id }, data: { status } });
    }
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/sellers/:id/commission", async (req: any, res) => {
  try {
    const rate = Number(req.body?.rate);
    if (isNaN(rate) || rate < 0 || rate > 1) return res.status(400).json({ error: "نسبة غير صالحة" });
    const seller = await prisma.seller.update({ where: { id: req.params.id }, data: { commissionRate: rate } });
    res.json({ seller });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/products", async (_req, res) => {
  try {
    const items = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { Seller: { select: { storeName: true } }, Category: { select: { name: true } } },
    });
    res.json({ items });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/products/:id/status", async (req: any, res) => {
  try {
    const { status } = req.body || {};
    const VALID = ["DRAFT", "ACTIVE", "INACTIVE"];
    if (!VALID.includes(status)) return res.status(400).json({ error: "حالة غير صالحة" });
    const product = await prisma.product.update({ where: { id: req.params.id }, data: { status } });
    res.json({ product });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/payouts", async (_req, res) => {
  try {
    const items = await prisma.payout.findMany({
      orderBy: { createdAt: "desc" },
      include: { Seller: { select: { storeName: true } } },
    });
    res.json({ items });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/payouts/:id/pay", async (req: any, res) => {
  try {
    const payout = await prisma.payout.update({
      where: { id: req.params.id },
      data: { status: "PAID", paidAt: new Date() },
    });
    res.json({ payout });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/settings", async (_req, res) => {
  try {
    const rows = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    res.json({ settings: map, hydrated: await getSettings() });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const { settings } = req.body || {};
    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ error: "الإعدادات غير صحيحة" });
    }
    const ALLOWED = [
      "site.name",
      "site.tagline",
      "site.logo",
      "contact.whatsapp",
      "contact.phone",
      "contact.email",
      "contact.vodafoneWallet",
      "shipping.freeThreshold",
      "shipping.codFee",
      "seller.commissionRate",
      "shipping.governorates",
    ];
    const ops: any[] = [];
    for (const [key, value] of Object.entries(settings)) {
      if (!ALLOWED.includes(key)) continue;
      if (typeof value !== "string") continue;
      ops.push(
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      );
    }
    await prisma.$transaction(ops);
    invalidateSettingsCache();
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;