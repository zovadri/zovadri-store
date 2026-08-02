import { Router } from "express";
import { prisma } from "@zovadri/db";
import { optionalAuth } from "../middleware/auth";

const router = Router();

router.post("/", optionalAuth, async (req: any, res) => {
  try {
    const { productId, rating, comment } = req.body || {};
    if (!req.user) return res.status(401).json({ error: "سجل الدخول أولاً" });
    if (!productId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "التقييم يجب أن يكون من 1 إلى 5" });
    }

    const purchased = await prisma.order.findFirst({
      where: {
        userId: req.user.id,
        status: "DELIVERED",
        OrderItem: { some: { productId } },
      },
      select: { id: true },
    });
    if (!purchased) {
      return res.status(403).json({ error: "يمكنك التقييم بعد استلام المنتج" });
    }

    const review = await prisma.review.create({
      data: { productId, userId: req.user.id, orderId: purchased.id, rating: Number(rating), comment: comment || null },
    });

    const agg = await prisma.review.aggregate({ where: { productId }, _avg: { rating: true }, _count: true });
    await prisma.product.update({
      where: { id: productId },
      data: { rating: Number(agg._avg.rating ?? rating), ratingCount: agg._count },
    });

    res.status(201).json({ review });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/product/:productId", async (req: any, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.productId },
      orderBy: { createdAt: "desc" },
      include: { User: { select: { name: true } } },
    });
    res.json({
      items: reviews.map((r: any) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        userName: r.User?.name ?? "",
      })),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;