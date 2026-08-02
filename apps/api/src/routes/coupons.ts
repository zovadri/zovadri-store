import { Router } from "express";
import { prisma } from "@zovadri/db";

const router = Router();

router.get("/validate", async (req, res) => {
  try {
    const code = String(req.query.code ?? "").toUpperCase().trim();
    if (!code) return res.status(400).json({ error: "أدخل كود الكوبون" });
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.active) return res.status(400).json({ error: "الكوبون غير صالح" });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ error: "الكوبون منتهي الصلاحية" });
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: "الكوبون تم استخدامه بالكامل" });
    }
    res.json({
      coupon: {
        ...coupon,
        value: Number(coupon.value),
        minOrder: Number(coupon.minOrder),
        maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;