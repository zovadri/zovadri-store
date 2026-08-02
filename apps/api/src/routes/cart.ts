import { Router } from "express";
import { prisma } from "@zovadri/db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: any, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        CartItem: {
          include: {
            Product: { select: { id: true, slug: true, title: true, price: true, images: true, stock: true, status: true } },
          },
        },
      },
    });
    const items = (cart?.CartItem ?? []).map((ci: any) => ({
      id: ci.id,
      quantity: ci.quantity,
      product: ci.Product,
      lineTotal: Number(ci.Product.price) * ci.quantity,
    }));
    const total = items.reduce((s, i) => s + i.lineTotal, 0);
    res.json({ items, count: items.length, total });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req: any, res) => {
  try {
    const { productId, quantity = 1 } = req.body || {};
    if (!productId) return res.status(400).json({ error: "اختر منتجاً" });
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.status !== "ACTIVE") {
      return res.status(404).json({ error: "المنتج غير متاح" });
    }

    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user.id } });
    }
    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
    }
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/:itemId", async (req: any, res) => {
  try {
    const quantity = Number(req.body?.quantity);
    if (!quantity || quantity < 1) return res.status(400).json({ error: "الكمية غير صحيحة" });
    await prisma.cartItem.update({ where: { id: req.params.itemId }, data: { quantity } });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:itemId", async (_req: any, res) => {
  try {
    await prisma.cartItem.delete({ where: { id: _req.params.itemId } });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/", async (req: any, res) => {
  try {
    await prisma.cart.delete({ where: { userId: req.user.id } });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;