import { Router } from "express";
import { prisma } from "@zovadri/db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: any, res) => {
  try {
    const rows = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: {
        Product: { select: { id: true, slug: true, title: true, price: true, images: true, rating: true, ratingCount: true, status: true } },
      },
    });
    res.json({
      items: rows.map((r: any) => ({ id: r.id, product: r.Product })),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req: any, res) => {
  try {
    const { productId } = req.body || {};
    if (!productId) return res.status(400).json({ error: "المنتج مطلوب" });
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: "المنتج غير موجود" });
    const exists = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });
    if (!exists) {
      await prisma.wishlistItem.create({ data: { userId: req.user.id, productId } });
    }
    res.status(201).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:productId", async (req: any, res) => {
  try {
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId: req.user.id, productId: req.params.productId } },
    });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;