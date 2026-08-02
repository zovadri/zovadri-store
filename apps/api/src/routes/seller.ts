import { Router } from "express";
import { prisma } from "@zovadri/db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.post("/apply", async (req: any, res) => {
  try {
    const { storeName, description } = req.body || {};
    if (!storeName || !description) return res.status(400).json({ error: "املأ اسم المتجر والوصف" });

    const existing = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (existing) {
      return res.status(400).json({ error: "أرسلت طلب انضمام من قبل — بنراجعه حالياً" });
    }

    if (req.user.role !== "SELLER") {
      await prisma.user.update({ where: { id: req.user.id }, data: { role: "SELLER" } });
    }

    const seller = await prisma.seller.create({
      data: {
        userId: req.user.id,
        storeName,
        description,
        commissionRate: 0.1,
        status: "PENDING",
      },
    });
    res.status(201).json({ seller });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/me", async (req: any, res) => {
  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: req.user.id },
      include: { _count: { select: { Product: true } } },
    });
    if (!seller) return res.status(404).json({ error: "لست بائعاً" });
    res.json({ seller });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/dashboard", async (req: any, res) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return res.status(404).json({ error: "لست بائعاً" });

    const [products, orders, payouts] = await Promise.all([
      prisma.product.findMany({
        where: { sellerId: seller.id },
        orderBy: { createdAt: "desc" },
        include: { Category: { select: { id: true, name: true } } },
        take: 100,
      }),
      prisma.order.findMany({
        where: { OrderItem: { some: { sellerId: seller.id } } },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          OrderItem: { where: { sellerId: seller.id }, select: { title: true, quantity: true, price: true, total: true } },
          User: { select: { name: true } },
        },
      }),
      prisma.payout.findMany({ where: { sellerId: seller.id }, orderBy: { createdAt: "desc" } }),
    ]);

    const active = orders.filter((o) => !["CANCELLED"].includes(o.status));
    const revenue = active.reduce((sum, o) => sum + o.OrderItem.reduce((s, i) => s + Number(i.total), 0), 0);
    const stats = {
      products: products.length,
      orders: active.length,
      revenue: Math.round(revenue * 100) / 100,
      balance: Number(seller.balance),
      totalSales: Number(seller.totalSales),
      pendingOrders: orders.filter((o) => ["PENDING", "CONFIRMED", "PROCESSING"].includes(o.status)).length,
    };

    res.json({
      seller,
      stats,
      products: products.map((p: any) => ({ ...p, price: Number(p.price), compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null, costPrice: p.costPrice ? Number(p.costPrice) : null })),
      orders: orders.map((o: any) => ({ ...o, total: Number(o.total), subtotal: Number(o.subtotal) })),
      payouts: payouts.map((p: any) => ({ ...p, amount: Number(p.amount) })),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/products", async (req: any, res) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return res.status(404).json({ error: "لست بائعاً" });
    const products = await prisma.product.findMany({ where: { sellerId: seller.id }, orderBy: { createdAt: "desc" } });
    res.json({ items: products });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/products", async (req: any, res) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller || seller.status !== "APPROVED") {
      return res.status(403).json({ error: "متجرك غير معتمد بعد" });
    }
    const { title, description, price, compareAtPrice, costPrice, stock, images, categoryId } = req.body || {};
    if (!title || !price || !categoryId) return res.status(400).json({ error: "أكمل بيانات المنتج" });
    const slug = title.trim().toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) + "-" + Date.now().toString(36);
    const product = await prisma.product.create({
      data: {
        slug,
        sku: `SKU-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
        title,
        description: req.body.description || "",
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        costPrice: costPrice ? Number(costPrice) : null,
        stock: Number(stock) || 0,
        images: Array.isArray(images) ? images : typeof images === "string" && images ? [images] : [],
        status: "ACTIVE",
        weight: Number(req.body.weight) || 1,
        sellerId: seller.id,
        categoryId,
      },
    });
    res.status(201).json({ product });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/products/:id", async (req: any, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ error: "المنتج غير موجود" });
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller || product.sellerId !== seller.id) return res.status(403).json({ error: "هذا المنتج ليس لك" });

    const { title, description, price, compareAtPrice, costPrice, stock, images, categoryId, weight } = req.body || {};
    const updated = await prisma.product.update({
      where: { id: product.id },
      data: {
        title: title ?? product.title,
        description: description ?? product.description,
        price: price !== undefined ? Number(price) : product.price,
        compareAtPrice: compareAtPrice !== undefined ? Number(compareAtPrice) : product.compareAtPrice,
        costPrice: costPrice !== undefined ? Number(costPrice) : product.costPrice,
        stock: stock !== undefined ? Number(stock) : product.stock,
        images: Array.isArray(images) ? images : typeof images === "string" && images ? [images] : product.images,
        categoryId: categoryId ?? product.categoryId,
        weight: weight !== undefined ? Number(weight) : product.weight,
      },
    });
    res.json({ product: updated });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/products/:id", async (req: any, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ error: "المنتج غير موجود" });
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller || product.sellerId !== seller.id) return res.status(403).json({ error: "هذا المنتج ليس لك" });
    await prisma.product.delete({ where: { id: product.id } });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/orders", async (req: any, res) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return res.status(404).json({ error: "لست بائعاً" });
    const orders = await prisma.order.findMany({
      where: { OrderItem: { some: { sellerId: seller.id } } },
      orderBy: { createdAt: "desc" },
      include: {
        OrderItem: { where: { sellerId: seller.id }, select: { title: true, quantity: true, price: true } },
        User: { select: { name: true } },
      },
    });
    res.json({
      items: orders.map((o: any) => ({ ...o, total: Number(o.total), user: o.User })),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/payouts", async (req: any, res) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return res.status(404).json({ error: "لست بائعاً" });
    const payouts = await prisma.payout.findMany({ where: { sellerId: seller.id }, orderBy: { createdAt: "desc" } });
    res.json({ items: payouts });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/request-payout", async (req: any, res) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return res.status(404).json({ error: "لست بائعاً" });
    const amount = Number(req.body?.amount || 0);
    if (amount <= 0 || amount > Number(seller.balance)) {
      return res.status(400).json({ error: "المبلغ غير صحيح" });
    }
    const [payout] = await Promise.all([
      prisma.payout.create({ data: { sellerId: seller.id, amount, status: "PENDING" } }),
      prisma.seller.update({ where: { id: seller.id }, data: { balance: { decrement: amount } } }),
    ]);
    res.status(201).json({ payout });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;